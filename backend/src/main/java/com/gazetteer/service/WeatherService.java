package com.gazetteer.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Locale;
//Provides weather data for the Gazetteer app via openweather and open-meteo apis:

@Service
public class WeatherService {

  private final HttpJsonService http;
  private final ObjectMapper mapper;

  @Value("${gazetteer.openweather.key:}")
  private String openWeatherKey;

  public WeatherService(HttpJsonService http, ObjectMapper mapper) {
    this.http = http;
    this.mapper = mapper;
  }

  public JsonNode current(Double lat, Double lng) throws Exception {
    if (openWeatherKey == null || openWeatherKey.isBlank()) {
      throw new IllegalArgumentException("Missing OPENWEATHER_KEY");
    }
    if (lat == null || lng == null) throw new IllegalArgumentException("Missing lat/lng");

    String url = String.format(Locale.ROOT,
        "https://api.openweathermap.org/data/2.5/weather?lat=%s&lon=%s&appid=%s&units=metric",
        lat, lng, openWeatherKey);

    JsonNode w = mapper.readTree(http.get(url).block());

    var out = mapper.createObjectNode();
    out.put("provider", "openweather");
    out.put("temp", w.path("main").path("temp").asDouble());
    out.put("feels_like", w.path("main").path("feels_like").asDouble());
    out.put("humidity", w.path("main").path("humidity").asInt());
    out.put("pressure", w.path("main").path("pressure").asInt());
    out.put("wind_speed", w.path("wind").path("speed").asDouble());
    out.put("clouds", w.path("clouds").path("all").asInt());
    out.put("visibility", w.path("visibility").asInt());
    out.put("desc", w.path("weather").path(0).path("description").asText(""));
    out.put("icon", w.path("weather").path(0).path("icon").asText(""));
    out.put("name", w.path("name").asText(""));

    return out;
  }

  public JsonNode forecast(Double lat, Double lng, int days) throws Exception {
    if (lat == null || lng == null) throw new IllegalArgumentException("Missing lat/lng");
    if (days <= 0 || days > 16) days = 5;

    String url = String.format(Locale.ROOT,
        "https://api.open-meteo.com/v1/forecast?latitude=%s&longitude=%s&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=%d",
        lat, lng, days);

    JsonNode f = mapper.readTree(http.get(url).block());

    var out = mapper.createObjectNode();
    out.put("provider", "open-meteo");
    out.put("lat", lat);
    out.put("lng", lng);
    out.put("days", days);

    var arr = mapper.createArrayNode();
    JsonNode daily = f.path("daily");
    JsonNode dates = daily.path("time");
    JsonNode tmax = daily.path("temperature_2m_max");
    JsonNode tmin = daily.path("temperature_2m_min");
    JsonNode precip = daily.path("precipitation_probability_max");

    for (int i = 0; i < dates.size(); i++) {
      var row = mapper.createObjectNode();
      row.put("date", dates.path(i).asText(""));
      row.put("min", tmin.path(i).asDouble());
      row.put("max", tmax.path(i).asDouble());
      row.put("precip", precip.path(i).asDouble());
      arr.add(row);
    }
    out.set("forecast", arr);

    return out;
  }
}
