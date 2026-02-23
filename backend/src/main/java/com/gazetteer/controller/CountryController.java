package com.gazetteer.controller;

import com.gazetteer.service.CountryService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
//This is a REST controller that handles country lookup requests.
@RestController
@RequestMapping("/api")
public class CountryController {

  private final CountryService countryService;

  public CountryController(CountryService countryService) {
    this.countryService = countryService;
  }

  @GetMapping("/country")
  public ResponseEntity<JsonNode> country(@RequestParam(required = false) String code,
                                          @RequestParam(required = false) Double lat,
                                          @RequestParam(required = false) Double lng) throws Exception {
    return ResponseEntity.ok(countryService.getCountryByCodeOrLatLng(code, lat, lng));
  }
}
