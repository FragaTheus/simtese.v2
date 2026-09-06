package br.com.matheusfragadev.api.infra.security.ratelimit;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Resolve o IP real do cliente, considerando o header X-Forwarded-For
 * quando a API está atrás de um proxy/load balancer.
 */
public final class ClientIpResolver {

    private ClientIpResolver() {
    }

    public static String resolve(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp.trim();
        }
        return request.getRemoteAddr();
    }

    public static String resolveOrUnknown(HttpServletRequest request) {
        if (request == null) {
            return "unknown";
        }
        try {
            return resolve(request);
        } catch (Exception e) {
            return "unknown";
        }
    }
}
