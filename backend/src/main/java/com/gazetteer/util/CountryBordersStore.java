package com.gazetteer.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;

@Component
public class CountryBordersStore {

  private final JsonNode root;
  private final List<Map<String, String>> countries;

  public CountryBordersStore(ObjectMapper mapper) throws IOException {
    var res = new ClassPathResource("data/countryBorders.geo.json");
    this.root = mapper.readTree(res.getInputStream());

    List<Map<String, String>> out = new ArrayList<>();
    for (JsonNode feature : root.path("features")) {
      JsonNode props = feature.path("properties");
      String name = firstNonEmpty(
          props.path("name").asText(null),
          props.path("NAME").asText(null),
          "Unknown");
      String iso2 = upperOrNull(firstNonEmpty(props.path("iso_a2").asText(null), props.path("ISO2").asText(null), null));
      String iso3 = upperOrNull(firstNonEmpty(props.path("iso_a3").asText(null), props.path("ISO3").asText(null), null));
      Map<String, String> row = new HashMap<>();
      row.put("name", name);
      row.put("iso2", iso2);
      row.put("iso3", iso3);
      out.add(row);
    }

  
    Map<String, Map<String, String>> unique = new HashMap<>();
    for (var c : out) {
      String key = (c.get("iso3") != null ? c.get("iso3") : c.get("name"));
      unique.putIfAbsent(key, c);
    }
    List<Map<String, String>> list = new ArrayList<>(unique.values());
    list.sort(Comparator.comparing(m -> m.getOrDefault("name", ""), String.CASE_INSENSITIVE_ORDER));
    this.countries = Collections.unmodifiableList(list);
  }

  public List<Map<String, String>> listCountries() {
    return countries;
  }

  public Optional<JsonNode> findFeatureByCode(String code) {
    if (code == null || code.isBlank()) return Optional.empty();
    String target = code.trim().toUpperCase(Locale.ROOT);
    for (JsonNode feature : root.path("features")) {
      JsonNode props = feature.path("properties");
      String iso2 = upperOrNull(firstNonEmpty(props.path("iso_a2").asText(null), props.path("ISO2").asText(null), ""));
      String iso3 = upperOrNull(firstNonEmpty(props.path("iso_a3").asText(null), props.path("ISO3").asText(null), ""));
      if (target.equals(iso2) || target.equals(iso3)) {
        return Optional.of(feature);
      }
    }
    return Optional.empty();
  }

  private static String upperOrNull(String s) {
    return s == null ? null : s.toUpperCase(Locale.ROOT);
  }

  private static String firstNonEmpty(String... values) {
    for (String v : values) {
      if (v != null && !v.isBlank()) return v;
    }
    return null;
  }
}
