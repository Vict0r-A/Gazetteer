package com.gazetteer.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
//retrieves the countrydetails data from the restcountries, and opencagedata api
@Service
public class CountryService {

  private final HttpJsonService http;
  private final ObjectMapper mapper;

  @Value("${gazetteer.opencage.key:}")
  private String opencageKey;

  @Value("${gazetteer.geonames.user:}")
  private String geonamesUser;

  public CountryService(HttpJsonService http, ObjectMapper mapper) {
    this.http = http;
    this.mapper = mapper;
  }

  public JsonNode getCountryByCodeOrLatLng(String code, Double lat, Double lng) throws Exception {
    String countryCode = (code == null ? "" : code.trim().toUpperCase(Locale.ROOT));

    if ((lat != null && lng != null) && !Double.isNaN(lat) && !Double.isNaN(lng)) {
      if (opencageKey == null || opencageKey.isBlank()) {
        throw new IllegalArgumentException("Missing OPENCAGE_KEY");
      }
      String url = String.format(Locale.ROOT,
          "https://api.opencagedata.com/geocode/v1/json?q=%s,%s&key=%s",
          lat, lng, opencageKey);
      JsonNode oc = mapper.readTree(http.get(url).block());
      countryCode = "";
      for (JsonNode r : oc.path("results")) {
        String cc = r.path("components").path("ISO_3166-1_alpha-2").asText("");
        if (!cc.isBlank()) {
          countryCode = cc.toUpperCase(Locale.ROOT);
          break;
        }
      }
      if (countryCode.isBlank()) {
        throw new IllegalArgumentException("reverse geocoding failed");
      }
    }

    if (countryCode.isBlank()) throw new IllegalArgumentException("Missing country code");

    // RestCountries
    String rc = mapper.readTree(http.get("https://restcountries.com/v3.1/alpha/" + countryCode).block()).path(0).toString();
    JsonNode country = mapper.readTree(rc);

    String currencyText = "—";
    JsonNode currencies = country.path("currencies");
    if (currencies != null && currencies.isObject()) {
      Iterator<String> it = currencies.fieldNames();
      if (it.hasNext()) {
        String ccy = it.next();
        String name = currencies.path(ccy).path("name").asText("");
        if (!name.isBlank()) currencyText = name + " (" + ccy + ")";
      }
    }

    JsonNode out = mapper.createObjectNode();
    ((com.fasterxml.jackson.databind.node.ObjectNode) out)
        .put("code", countryCode)
        .put("iso2", country.path("cca2").asText(null))
        .put("iso3", country.path("cca3").asText(null))
        .put("numericCode", country.path("ccn3").asText(null))
        .put("name", country.path("name").path("common").asText(""))
        .put("capital", country.path("capital").path(0).asText("—"))
        .put("population", country.path("population").asLong())
        .put("area_km2", country.path("area").asDouble())
        .put("region", country.path("region").asText(""))
        .put("subregion", country.path("subregion").asText(""))
        .put("flagPng", country.path("flags").path("png").asText(""))
        .put("currency", currencyText)
        .set("languages", country.path("languages"));

    ((com.fasterxml.jackson.databind.node.ObjectNode) out).put("wiki", "");
    ((com.fasterxml.jackson.databind.node.ObjectNode) out).putNull("wikiUrl");

    // Wikipedia summary via GeoNames (like PHP)
    if (geonamesUser != null && !geonamesUser.isBlank()) {
      String commonName = out.path("name").asText("");
      String officialName = country.path("name").path("official").asText("");

      JsonNode wiki = null;
      if (!officialName.isBlank()) {
        wiki = wikiSearchByTitle(officialName);
      }
      if (wiki == null && !commonName.isBlank()) {
        wiki = wikiSearchByTitle(commonName);
      }
      if (wiki == null && !commonName.isBlank()) {
        wiki = wikiSearchByQuery(commonName);
      }

      if (wiki != null) {
        String summary = wiki.path("summary").asText("");
        String url = wiki.path("wikipediaUrl").asText("");
        if (!url.isBlank() && !url.startsWith("http")) url = "https://" + url;
        ((com.fasterxml.jackson.databind.node.ObjectNode) out).put("wiki", summary);
        if (!url.isBlank()) ((com.fasterxml.jackson.databind.node.ObjectNode) out).put("wikiUrl", url);
      }
    }

    return out;
  }

  private JsonNode wikiSearchByTitle(String title) throws Exception {
    String t = URLEncoder.encode(title, StandardCharsets.UTF_8);
    String url = "http://api.geonames.org/wikipediaSearchJSON?title=" + t + "&maxRows=1&lang=en&username=" + geonamesUser;
    JsonNode decoded = mapper.readTree(http.get(url).block());
    JsonNode first = decoded.path("geonames").path(0);
    return first.isMissingNode() ? null : first;
  }

  private JsonNode wikiSearchByQuery(String query) throws Exception {
    String q = URLEncoder.encode(query, StandardCharsets.UTF_8);
    String url = "http://api.geonames.org/wikipediaSearchJSON?q=" + q + "&maxRows=1&lang=en&username=" + geonamesUser;
    JsonNode decoded = mapper.readTree(http.get(url).block());
    JsonNode first = decoded.path("geonames").path(0);
    return first.isMissingNode() ? null : first;
  }
}
