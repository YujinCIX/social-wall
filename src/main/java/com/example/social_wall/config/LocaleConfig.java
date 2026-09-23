package com.example.social_wall.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;

import java.util.List;
import java.util.Locale;

@Configuration
public class LocaleConfig {

    @Bean
    public AcceptHeaderLocaleResolver localeResolver() {

        AcceptHeaderLocaleResolver resolver =
                new AcceptHeaderLocaleResolver();

        resolver.setDefaultLocale(Locale.ENGLISH);

        resolver.setSupportedLocales(
                List.of(
                        Locale.ENGLISH,
                        Locale.forLanguageTag("ru")
                )
        );

        return resolver;
    }
}