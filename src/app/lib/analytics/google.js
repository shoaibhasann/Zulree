export const loadGoogleAnalytics = () => {
  if (window.GA_INITIALIZED) return;

  const script1 = document.createElement("script");
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
  script1.async = true;

  const script2 = document.createElement("script");
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
  `;

  document.head.appendChild(script1);
  document.head.appendChild(script2);

  window.GA_INITIALIZED = true;
};
