import { env } from "../config/env";

async function demoLogin({ whatsapp }) {
  const cleanWhatsapp = whatsapp.replace(/\D/g, "");
  return {
    token: `demo-jwt-${cleanWhatsapp}-${Date.now()}`,
    user: { id: `member-${cleanWhatsapp.slice(-6)}`, whatsapp: cleanWhatsapp }
  };
}

export async function loginWithJwt(credentials) {
  if (!env.apiBaseUrl) return demoLogin(credentials);

  const response = await fetch(`${env.apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  if (!response.ok) throw new Error("Login failed. Please check your details.");
  const payload = await response.json();
  if (!payload.token) throw new Error("Login response did not include a JWT token.");
  return payload;
}
