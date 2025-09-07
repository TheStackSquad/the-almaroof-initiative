Authentication & Payment Gateway Security Overhaul
Objective
To implement a secure, robust, and industry-standard authentication and payment flow that eliminates client-side trust for sensitive operations.

Core Principles
Server-Side Authority: All validation, price calculation, and payment initiation occur on the server.

HttpOnly Cookies: JWTs are stored exclusively in secure, HttpOnly cookies to mitigate XSS attacks.

Short-Lived Access + Long-Lived Refresh: Implemented a refresh token rotation pattern for both security and user experience.

Defensive Monitoring: Added client and server-side security event logging with pattern detection.

Key Changes
Category

File

Change Description

Auth API

src/app/api/auth/refresh/route.js

(NEW) Endpoint to securely issue new access tokens using a refresh token.



src/app/api/auth/signin/route.js

Enhanced to set access and refresh tokens as HttpOnly cookies.



src/app/api/auth/validate-token/route.js

(DELETED) Removed redundant endpoint; token validation is now middleware.

Payment API

src/app/api/paystack/initiate/route.js

Secured to use server-side permit data, ignoring client-provided amount and reference.



src/app/api/paystack/verify/route.js

Enhanced with robust rate limiting and error handling.

Security API

src/app/api/security/events/route.js

(NEW) Endpoint to receive and store client-side security logs.

Client Auth

src/redux/action/authAction.js

Refactored to handle cookie-based auth, removing insecure localStorage logic.



src/utils/auth/useAuth.js

Enhanced hook with computed auth state, auto-refresh logic, and security monitoring.



src/utils/auth/authHelpers.js

(NEW) Contains RefreshManager for race-condition-proof token refresh.



src/utils/auth/tokenUtils.js

(NEW) Pure functions for token expiry calculation and validation.



src/utils/auth/authTypes.js

(NEW) Centralized configuration for security thresholds and constants.



src/utils/auth/securityLogger.js

(NEW) Client-side module for structured security event logging.

Payment Flow

src/utils/handlers/paystackHandler.js

Refactored to only send a permit_id to the secure initiate endpoint.



src/utils/supabase/createPermit.js

Cleaned up logging and aligned with server API.

Utilities

src/utils/rate-limit.js

(NEW) Shared utility for API rate limiting.



src/lib/authService/token.js

Enhanced to generate both access and refresh tokens.

Summary
The system now enforces a secure flow where the client is never trusted with token storage, price calculation, or payment parameters. All critical logic is validated and executed on the server, significantly reducing the attack surface for the payment gateway.