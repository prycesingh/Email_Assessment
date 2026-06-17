import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Security headers ─────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent the page from being embedded in an iframe (clickjacking protection)
          { key: "X-Frame-Options", value: "DENY" },
          // Block MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Only send the origin in the Referer header for same-origin requests
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disable browser features not needed by this app
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()"
          },
          // Basic Content Security Policy — tightened for production
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js requires 'unsafe-inline' for its inline scripts + styles
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self'",
              "connect-src 'self'",
              "frame-ancestors 'none'"
            ].join("; ")
          },
          // HSTS — tells browsers to always use HTTPS (1 year)
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains"
          }
        ]
      }
    ];
  },

  // ── Production hardening ─────────────────────────────────────────────────
  // Remove the X-Powered-By header
  poweredByHeader: false,

  // Compress responses
  compress: true
};

export default nextConfig;
