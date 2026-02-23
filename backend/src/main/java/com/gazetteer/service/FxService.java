package com.gazetteer.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Locale;
//Currency data from the openexchangerates api
@Service
public class FxService {

  private final HttpJsonService http;
  private final ObjectMapper mapper;

  @Value("${gazetteer.oer.key:}")
  private String oerKey;

  public FxService(HttpJsonService http, ObjectMapper mapper) {
    this.http = http;
    this.mapper = mapper;
  }

  public JsonNode rate(String ccy) throws Exception {
    if (ccy == null || ccy.isBlank()) throw new IllegalArgumentException("Missing ccy");
    if (oerKey == null || oerKey.isBlank()) throw new IllegalArgumentException("Missing OPENEXCHANGERATES_KEY");

    String code = ccy.trim().toUpperCase(Locale.ROOT);
    String base = "USD";

    String url = "https://openexchangerates.org/api/latest.json?app_id=" + oerKey + "&base=" + base;
    JsonNode fx = mapper.readTree(http.get(url).block());
    JsonNode r = fx.path("rates").path(code);
    if (r.isMissingNode() || r.isNull()) throw new IllegalArgumentException("Unknown currency code");

    var out = mapper.createObjectNode();
    out.put("pair", code + "/" + base);
    out.put("rate", r.asDouble());
    return out;
  }
}
