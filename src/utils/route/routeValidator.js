// src/utils/route/routeValidator.js

import {
  getServiceConfig,
  getActionConfig,
  getPrimaryAction,
  isValidRoute,
} from "@/config/serviceRoutes";


export class RouteValidator {
  constructor(params = []) {
    this.params = params;
    this.serviceId = params[0] || null;
    this.actionId = params[1] || null;
    this.extraParams = params.slice(2);
  }

  /**
   * Validate the current route parameters
   */
  validate() {
    const result = {
      isValid: false,
      serviceId: this.serviceId,
      actionId: this.actionId,
      serviceConfig: null,
      actionConfig: null,
      redirectTo: null,
      error: null,
    };

    // Check if service ID is provided
    if (!this.serviceId) {
      result.error = "Service ID is required";
      return result;
    }

    // Get service configuration
    const serviceConfig = getServiceConfig(this.serviceId);
    if (!serviceConfig) {
      result.error = `Service '${this.serviceId}' not found`;
      return result;
    }

    result.serviceConfig = serviceConfig;

    // If no action provided, redirect to primary action
    if (!this.actionId) {
      const primaryAction = getPrimaryAction(this.serviceId);
      result.redirectTo = `/community/online-services/${this.serviceId}/${primaryAction}`;
      result.error = "Action required - redirecting to primary action";
      return result;
    }

    // Validate action
    const actionConfig = getActionConfig(this.serviceId, this.actionId);
    if (!actionConfig) {
      const primaryAction = getPrimaryAction(this.serviceId);
      result.redirectTo = `/community/online-services/${this.serviceId}/${primaryAction}`;
      result.error = `Action '${this.actionId}' not found for service '${this.serviceId}' - redirecting to primary action`;
      return result;
    }

    result.actionConfig = actionConfig;
    result.actionId = this.actionId;
    result.isValid = true;

    return result;
  }

  /**
   * Get the component name for valid routes
   */
  getComponentName() {
    const validation = this.validate();
    return validation.isValid ? validation.actionConfig.component : null;
  }

  /**
   * Check if authentication is required
   */
  requiresAuth() {
    const validation = this.validate();
    return validation.isValid ? validation.actionConfig.requiresAuth : false;
  }

  /**
   * Get page metadata
   */
  getPageMetadata() {
    const validation = this.validate();
    if (!validation.isValid) {
      return {
        title: "Service Not Found",
        description: "The requested service could not be found.",
      };
    }

    return {
      title: validation.actionConfig.title,
      description: validation.actionConfig.description,
      serviceName: validation.serviceConfig.displayName,
    };
  }

  /**
   * Static method to validate route from params array
   */
  static validateRoute(params) {
    const validator = new RouteValidator(params);
    return validator.validate();
  }

  /**
   * Static method to generate service URL
   */
  static generateServiceUrl(serviceId, actionId = null) {
    return `/community/online-services/${serviceId}/${
      actionId || getPrimaryAction(serviceId)
    }`;
  }

  /**
   * Static method to generate the login URL with a redirect parameter.
   */
  static generateLoginUrl(targetUrl) {
    return `/community/online-services/protected-route?redirect=${encodeURIComponent(
      targetUrl
    )}`;
  }

  /**
   * Static method to get all valid routes for debugging
   */
  static getAllValidRoutes() {
    const routes = [];
    const { serviceRoutes } = require("@/config/serviceRoutes");

    Object.entries(serviceRoutes).forEach(([serviceId, serviceConfig]) => {
      Object.keys(serviceConfig.actions).forEach((actionId) => {
        routes.push(`/community/${serviceId}/${actionId}`);
      });
    });

    return routes;
  }
}

export const validateServiceRoute = (serviceId, actionId) => {
  return RouteValidator.validateRoute([serviceId, actionId]);
};

export const generateServiceUrl = (serviceId, actionId = null) => {
  return RouteValidator.generateServiceUrl(serviceId, actionId);
};
export const generateLoginUrl = (targetUrl) => {
  return `/community/online-services/protected-route?redirect=${encodeURIComponent(
    targetUrl
  )}`;
};