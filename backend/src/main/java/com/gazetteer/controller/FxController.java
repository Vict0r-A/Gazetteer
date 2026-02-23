package com.gazetteer.controller;

import com.gazetteer.service.FxService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
//rest controller for currency changes which will depend on the country chosen
@RestController
@RequestMapping("/api/fx")
public class FxController {

  private final FxService service;

  public FxController(FxService service) {
    this.service = service;
  }

  @GetMapping
  public ResponseEntity<JsonNode> fx(@RequestParam String ccy) throws Exception {
    return ResponseEntity.ok(service.rate(ccy));
  }
}
