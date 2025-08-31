// src/utils/auth/securityLogger.js

class SecurityLogger {
  constructor() {
    this.events = [];
    this.maxEvents = 1000; // Keep last 1000 events in memory
  }

  log(eventType, details = {}) {
    const event = {
      id: this.generateEventId(),
      type: eventType,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== "undefined" ? navigator.userAgent : null,
      sessionId: this.getSessionId(),
      ipHash: this.getIpHash(), // In production, hash the IP
      ...details,
    };

    // Store in memory (limited buffer)
    this.events.push(event);
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === "production") {
      this.sendToMonitoring(event);
    } else {
      console.log("[DEV SECURITY EVENT]", event);
    }

    // Check for patterns that require immediate action
    this.analyzeSecurityPatterns(event);
  }

  generateEventId() {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getSessionId() {
    // Get session ID from Redux store or generate temporary one
    return typeof window !== "undefined"
      ? window.sessionStorage?.getItem("temp_session_id") || "unknown"
      : "server";
  }

  getIpHash() {
    // In production, this would be provided by your backend
    return "client_side_unknown";
  }

  async sendToMonitoring(event) {
    try {
      // Send to your security monitoring endpoint
      await fetch("/api/security/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error("Failed to send security event:", error);
    }
  }

  analyzeSecurityPatterns(event) {
    const recentEvents = this.events.filter(
      (e) => Date.now() - new Date(e.timestamp).getTime() < 5 * 60 * 1000 // Last 5 minutes
    );

    // Pattern detection
    const patterns = {
      rapidFailures: recentEvents.filter((e) => e.type.includes("failed"))
        .length,
      suspiciousIPs: new Set(recentEvents.map((e) => e.ipHash)).size > 5,
      rateLimitHits: recentEvents.filter(
        (e) => e.type === "refresh_rate_limit_hit"
      ).length,
    };

    // Trigger alerts for suspicious patterns
    if (
      patterns.rapidFailures > 10 ||
      patterns.suspiciousIPs ||
      patterns.rateLimitHits > 20
    ) {
      this.log("security_pattern_detected", {
        patterns,
        triggerEvent: event.type,
      });
    }
  }

  getRecentEvents(minutes = 30) {
    const cutoff = Date.now() - minutes * 60 * 1000;
    return this.events.filter((e) => new Date(e.timestamp).getTime() > cutoff);
  }

  getEventsByType(eventType, hours = 24) {
    const cutoff = Date.now() - hours * 60 * 60 * 1000;
    return this.events.filter(
      (e) => e.type === eventType && new Date(e.timestamp).getTime() > cutoff
    );
  }
}

// Singleton instance
export const securityLogger = new SecurityLogger();

export const logSecurityEvent = (eventType, details = {}) => {
  securityLogger.log(eventType, details);
};
