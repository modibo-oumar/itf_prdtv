package com.lapredictive.backend.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.lapredictive.backend.utilisateurs.service.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
public class CustomConfiguration {

    private CustomUserDetailsService userDetailsService;
    private CustomAuthenticationSuccessHandler successHandler;

    public CustomConfiguration(CustomUserDetailsService userDetailsService,
            CustomAuthenticationSuccessHandler successHandler) {
        this.successHandler = successHandler;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(registry -> {
                    registry.requestMatchers("/admin").hasRole("ADMIN");
                    registry.requestMatchers("/admin/utilisateur/creer").permitAll();
                    registry.requestMatchers(HttpMethod.PUT,"/admin/utilisateur/**").permitAll();
                    registry.requestMatchers("/").hasRole("USER");
                    registry.requestMatchers("/api/auth/**").permitAll();
                    registry.requestMatchers(HttpMethod.GET,"/utilisateur").permitAll();
                    registry.requestMatchers("/utilisateurs").permitAll();
                    registry.requestMatchers("/zones").permitAll();
                    registry.requestMatchers("/admin/zone").permitAll();
                    registry.requestMatchers("/mesures/**").permitAll();
                    registry.anyRequest().permitAll();
                })
                .formLogin(httpSecurityFormLoginConfigurer -> {
                    httpSecurityFormLoginConfigurer
                            .permitAll()
                            .successHandler(successHandler);
                })
                .logout(logoutConfigurer -> {
                    logoutConfigurer
                            .logoutUrl("/logout")
                            .logoutSuccessUrl("/login")
                            .invalidateHttpSession(true)
                            .deleteCookies("JSESSIONID");
                })
                .build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return userDetailsService;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
