package com.gazetteer.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Service
public class HttpJsonService {

  private final WebClient webClient;
  private final Duration timeout;

  public HttpJsonService(WebClient webClient,
                         @Value("${gazetteer.http.timeoutMs:8000}") long timeoutMs) {
    this.webClient = webClient;
    this.timeout = Duration.ofMillis(timeoutMs);
  }

  public Mono<String> get(String url) {
    return webClient.get()
        .uri(url)
        .retrieve()
        .onStatus(HttpStatusCode::isError, res -> res.bodyToMono(String.class)
            .defaultIfEmpty("")
            .flatMap(body -> Mono.error(new RuntimeException("Upstream error: " + res.statusCode()))))
        .bodyToMono(String.class)
        .timeout(timeout);
  }
}
