package com.gazetteer.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Locale;
//retrieves data for the cities, earthquakes and wikipediea information via the geonames api
@Service
public class GeoNamesService {

  private final HttpJsonService http;
  private final ObjectMapper mapper;

  @Value("${gazetteer.geonames.user:}")
  private String user;

  public GeoNamesService(HttpJsonService http, ObjectMapper mapper) {
    this.http = http;
    this.mapper = mapper;
  }

  private void ensureUser() {
    if (user == null || user.isBlank()) throw new IllegalArgumentException("missing geonames username");
  }

  public JsonNode cities(String country, String lang) throws Exception {
    ensureUser();
    String cc = (country == null ? "" : country.trim().toUpperCase(Locale.ROOT));
    if (cc.isBlank()) throw new IllegalArgumentException("Missing country");
    String l = (lang == null || lang.isBlank()) ? "en" : lang;
    String url = "http://api.geonames.org/searchJSON?country=" + cc + "&featureClass=P&maxRows=200&orderby=population&username=" + user + "&lang=" + l;
    return mapper.readTree(http.get(url).block());
  }

  public JsonNode wikipedia(double north, double south, double east, double west, String lang) throws Exception {
    ensureUser();
    String l = (lang == null || lang.isBlank()) ? "en" : lang;
    String url = String.format(Locale.ROOT,
        "http://api.geonames.org/wikipediaBoundingBoxJSON?north=%s&south=%s&east=%s&west=%s&maxRows=200&username=%s&lang=%s",
        north, south, east, west, user, l);
    return mapper.readTree(http.get(url).block());
  }

  public JsonNode earthquakes(double north, double south, double east, double west) throws Exception {
    ensureUser();
    String url = String.format(Locale.ROOT,
        "http://api.geonames.org/earthquakesJSON?north=%s&south=%s&east=%s&west=%s&username=%s",
        north, south, east, west, user);
    return mapper.readTree(http.get(url).block());
  }
}
