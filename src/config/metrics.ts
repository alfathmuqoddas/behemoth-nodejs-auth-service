import {
  Counter,
  Histogram,
  register,
  collectDefaultMetrics,
} from "prom-client";

collectDefaultMetrics({ register, prefix: "auth_service_" });

export const requestCounter = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

export const requestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 1.5, 2, 5],
});

export const userRegistrations = new Counter({
  name: "user_registrations_total",
  help: "Total number of user registrations",
});

export const userLogins = new Counter({
  name: "user_logins_total",
  help: "Total number of user logins",
  labelNames: ["result"],
});

export { register };
