package com.gazetteer.controller;

import com.gazetteer.service.GeoNamesService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
//handles requests for data for earthquakes, cities, wikipedia
@RestController
@RequestMapping("/api/geonames")
public class GeoNamesController {

  private final GeoNamesService service;

  public GeoNamesController(GeoNamesService service) {
    this.service = service;
  }

  @GetMapping("/cities")
  public ResponseEntity<JsonNode> cities(@RequestParam String country,
                                         @RequestParam(defaultValue = "en") String lang) throws Exception {
    return ResponseEntity.ok(service.cities(country, lang));
  }

  @GetMapping("/wikipedia")
  public ResponseEntity<JsonNode> wikipedia(@RequestParam double north,
                                            @RequestParam double south,
                                            @RequestParam double east,
                                            @RequestParam double west,
                                            @RequestParam(defaultValue = "en") String lang) throws Exception {
    return ResponseEntity.ok(service.wikipedia(north, south, east, west, lang));
  }

  @GetMapping("/earthquakes")
  public ResponseEntity<JsonNode> earthquakes(@RequestParam double north,
                                              @RequestParam double south,
                                              @RequestParam double east,
                                              @RequestParam double west) throws Exception {
    return ResponseEntity.ok(service.earthquakes(north, south, east, west));
  }
}
