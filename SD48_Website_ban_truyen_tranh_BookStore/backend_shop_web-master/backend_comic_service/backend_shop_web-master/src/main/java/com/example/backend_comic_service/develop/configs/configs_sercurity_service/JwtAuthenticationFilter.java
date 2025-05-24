package com.example.backend_comic_service.develop.configs.configs_sercurity_service;

import com.example.backend_comic_service.develop.exception.FilterResponseHandler;
import com.example.backend_comic_service.develop.exception.ResponseFactory;
import com.example.backend_comic_service.develop.utils.ErrorCodeConst;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final HandlerExceptionResolver handlerExceptionResolver;

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final ResponseFactory responseFactory;
    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserDetailsService userDetailsService,
            HandlerExceptionResolver handlerExceptionResolver,
            ResponseFactory responseFactory
    ) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.handlerExceptionResolver = handlerExceptionResolver;
        this.responseFactory = responseFactory;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        // Skip token validation for public endpoints
        if (shouldNotFilter(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            FilterResponseHandler.returnError(response, ErrorCodeConst.UNAUTHORIZED, null, null, this.responseFactory);
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring(7);
            final String userEmail = jwtService.extractUsername(jwt);

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (userEmail != null && authentication == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }

            filterChain.doFilter(request, response);
        } catch (Exception exception) {
            FilterResponseHandler.returnError(response, ErrorCodeConst.UNAUTHORIZED, null, null, this.responseFactory);
            handlerExceptionResolver.resolveException(request, response, null, exception);
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.endsWith("/login") || path.endsWith("/public")
                || path.contains("/api/product/get-list-product")
                || path.contains("/api/product/detail")
                || path.contains("/uploads")
                || path.contains("/api/rating/add-or-change")
                || path.contains("/api/product/selling-best")
                || path.contains("/api/product/running-out")
                || path.contains("/api/types/get-list-type")
                || path.contains("/api/user/forget-user")
                || path.contains("/api/category/get-category-list");
    }
}