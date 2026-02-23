package com.gazetteer.controller;

import com.gazetteer.service.WeatherService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
//rest controller handling requests for weather for any country
@RestController
@RequestMapping("/api/weather")
public class WeatherController {

  private final WeatherService service;

  public WeatherController(WeatherService service) {
    this.service = service;
  }

  @GetMapping
  public ResponseEntity<JsonNode> current(@RequestParam Double lat, @RequestParam Double lng) throws Exception {
    return ResponseEntity.ok(service.current(lat, lng));
  }

  @GetMapping("/forecast")
  public ResponseEntity<JsonNode> forecast(@RequestParam Double lat,
                                           @RequestParam Double lng,
                                           @RequestParam(defaultValue = "5") int days) throws Exception {
    return ResponseEntity.ok(service.forecast(lat, lng, days));
  }
}
