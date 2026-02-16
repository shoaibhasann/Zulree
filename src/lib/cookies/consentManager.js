const KEY = "zulree_cookie_consent";

export const getConsent = () => {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
};

export const setConsent = (data) => {
  localStorage.setItem(
    KEY,
    JSON.stringify({
      ...data,
      essential: true,
      timestamp: Date.now(),
    }),
  );
};

export const hasConsent = () => {
  return !!getConsent();
};

// const consent = getConsent();

// if (consent?.analytics) {
//   loadAnalytics();
// }

// if (consent?.marketing) {
//   loadFacebookPixel();
// }
