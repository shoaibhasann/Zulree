// utils/localStorage.js
export function setStorage(key, value) {
  if (typeof window === "undefined") return;
  console.log("Setting storage", {
    key,
    value
  });
  localStorage.setItem(key, JSON.stringify(value));
}

export function getStorage(key, defaultValue = null) {
  if (typeof window === "undefined") return defaultValue;
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : defaultValue;
}

export function removeStorage(key) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}
