package com.gazetteer.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;

@Configuration
public class AppConfig {

  @Value("${gazetteer.frontend.origin}")
  private String frontendOrigin;

  @Value("${gazetteer.http.timeoutMs:8000}")
  private long timeoutMs;

  @Bean
  public WebClient webClient(WebClient.Builder builder) {
    // Increases buffer a bit for large JSON payloads.
    var strategies = ExchangeStrategies.builder()
        .codecs(c -> c.defaultCodecs().maxInMemorySize(4 * 1024 * 1024))
        .build();

    return builder
        .exchangeStrategies(strategies)
        .build();
  }

  @Bean
  public CorsFilter corsFilter() {
    CorsConfiguration config = new CorsConfiguration();
    config.addAllowedOrigin(frontendOrigin);
    config.addAllowedHeader("*");
    config.addAllowedMethod("*");
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return new CorsFilter(source);
  }

  public Duration timeout() {
    return Duration.ofMillis(timeoutMs);
  }
}
