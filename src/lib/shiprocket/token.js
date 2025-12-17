import axios from "axios";

let cachedToken = null;
let tokenExpiresAt = null; // timestamp (ms)

const TOKEN_BUFFER_MS = 60 * 60 * 1000; // 1 hour safety buffer

export async function getShiprocketToken(force = false) {
  const now = Date.now();

  // ✅ reuse token if valid
  if (!force && cachedToken && tokenExpiresAt && now < tokenExpiresAt) {
    return cachedToken;
  }

  // 🔐 login to Shiprocket
  const response = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    },
    {
      timeout: 10000,
    }
  );

  const data = response.data;

  if (!data?.token) {
    throw new Error("Failed to obtain Shiprocket token");
  }

  cachedToken = data.token;

  // Shiprocket token ≈ 24h → we refresh earlier
  tokenExpiresAt =
    now + (data.expires_in || 24 * 60 * 60) * 1000 - TOKEN_BUFFER_MS;

  return cachedToken;
}
