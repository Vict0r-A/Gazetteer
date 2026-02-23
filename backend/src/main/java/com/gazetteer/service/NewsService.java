package com.gazetteer.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
//Provides News data for the Gazetteer app the via worldnewsapi api:
@Service
public class NewsService {

  private final HttpJsonService http;
  private final ObjectMapper mapper;

  @Value("${gazetteer.worldnews.key:}")
  private String worldNewsKey;

  public NewsService(HttpJsonService http, ObjectMapper mapper) {
    this.http = http;
    this.mapper = mapper;
  }

  public JsonNode news(String code, Integer page, String q, String lang, String category) throws Exception {
    if (code == null || code.isBlank()) throw new IllegalArgumentException("Missing country code");
    if (worldNewsKey == null || worldNewsKey.isBlank()) throw new IllegalArgumentException("Missing WORLDNEWS_KEY");

    String cc = code.trim().toUpperCase(Locale.ROOT);
    String iso2 = cc;

    if (cc.length() == 3) {
      JsonNode rc = mapper.readTree(http.get("https://restcountries.com/v3.1/alpha/" + cc + "?fields=cca2").block());
      iso2 = rc.path(0).path("cca2").asText("").toUpperCase(Locale.ROOT);
      if (iso2.isBlank()) throw new IllegalArgumentException("Could not resolve ISO3 to ISO2");
    } else if (cc.length() != 2) {
      throw new IllegalArgumentException("Invalid country code");
    }

    int pageSize = 20;
    int current = (page == null || page < 1) ? 1 : page;
    int offset = (current - 1) * pageSize;

    String language = (lang == null || lang.isBlank()) ? "en" : lang.toLowerCase(Locale.ROOT);

    StringBuilder sb = new StringBuilder("https://api.worldnewsapi.com/search-news?");
    sb.append("api-key=").append(url(worldNewsKey));
    sb.append("&source-country=").append(url(iso2.toLowerCase(Locale.ROOT)));
    sb.append("&language=").append(url(language));
    sb.append("&sort=publish-time&sort-direction=desc");
    sb.append("&number=").append(pageSize);
    sb.append("&offset=").append(offset);

    if (q != null && !q.isBlank()) sb.append("&text=").append(url(q));
    if (category != null && !category.isBlank()) sb.append("&categories=").append(url(category));

    JsonNode data = mapper.readTree(http.get(sb.toString()).block());

    var out = mapper.createObjectNode();
    out.put("provider", "worldnewsapi");
    out.put("country", iso2.toLowerCase(Locale.ROOT));

    int available = data.path("available").asInt(0);
    if (available > 0) out.put("total", available); else out.putNull("total");

    var articlesArr = mapper.createArrayNode();
    for (JsonNode a : data.path("news")) {
      var row = mapper.createObjectNode();
      row.put("title", a.path("title").asText("(no title)"));
      row.put("summary", a.path("summary").asText(""));
      String urlStr = a.path("url").asText("");
      row.put("url", urlStr);
      row.put("image_url", a.path("image").asText(""));
      row.put("pubDate", a.path("publish_date").asText(""));

      String host = "";
      try {
        if (!urlStr.isBlank()) {
          host = URI.create(urlStr).getHost();
          if (host == null) host = "";
          host = host.replaceFirst("(?i)^www\\.", "");
        }
      } catch (Exception ignored) {}
      row.put("source", host);

      articlesArr.add(row);
    }

    out.set("articles", articlesArr);

    boolean hasMore = available > (offset + pageSize);
    if (hasMore) out.put("next_page", current + 1); else out.putNull("next_page");

    return out;
  }

  private static String url(String s) {
    return URLEncoder.encode(s, StandardCharsets.UTF_8);
  }
}
