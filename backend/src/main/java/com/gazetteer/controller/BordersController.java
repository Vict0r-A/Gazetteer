package com.gazetteer.controller;

import com.gazetteer.util.CountryBordersStore;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
//it’s a REST controller that handles GET requests to /api/borders, and it routes them based on the action query parameter to either:
// return the list of countries that have border data (action=list), or
// return the GeoJSON border for a specific country (action=border&code=...)
@RestController
@RequestMapping("/api/borders")
public class BordersController {

  private final CountryBordersStore store;

  public BordersController(CountryBordersStore store) {
    this.store = store;
  }

  @GetMapping
  public ResponseEntity<?> borders(@RequestParam(defaultValue = "list") String action,
                                  @RequestParam(required = false) String code) {
    if ("list".equalsIgnoreCase(action)) {
      return ResponseEntity.ok(Map.of("countries", store.listCountries()));
    }
    if ("border".equalsIgnoreCase(action) && code != null && !code.isBlank()) {
      return store.findFeatureByCode(code)
          .<ResponseEntity<?>>map(ResponseEntity::ok)
          .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Country not found")));
    }
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Bad request"));
  }
}
