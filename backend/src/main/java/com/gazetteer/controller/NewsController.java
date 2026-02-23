package com.gazetteer.controller;

import com.gazetteer.service.NewsService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
//rest controller for handling requests for news for the chosen country
@RestController
@RequestMapping("/api/news")
public class NewsController {

  private final NewsService service;

  public NewsController(NewsService service) {
    this.service = service;
  }

  @GetMapping
  public ResponseEntity<JsonNode> news(@RequestParam String code,
                                       @RequestParam(required = false) Integer page,
                                       @RequestParam(required = false) String q,
                                       @RequestParam(defaultValue = "en") String lang,
                                       @RequestParam(required = false) String category) throws Exception {
    return ResponseEntity.ok(service.news(code, page, q, lang, category));
  }
}
