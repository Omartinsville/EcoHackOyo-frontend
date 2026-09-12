(() => {
  "use strict";
  // Reads window.ECOHACKOYO_CONFIG (set in js/config.js, which must load
  // BEFORE this file) and fills in every element that references it. Must
  // also run BEFORE js/site.js, since site.js reads the countdown's
  // data-date attribute the moment it runs.

  const cfg = window.ECOHACKOYO_CONFIG;
  if (!cfg) return; // config.js missing or failed to load — leave static fallback text as-is

  // Plain text slots: <span data-cfg="hackathonDate"></span>
  document.querySelectorAll("[data-cfg]").forEach(el => {
    const value = cfg[el.dataset.cfg];
    if (value != null) el.textContent = value;
  });

  // mailto links: <a data-cfg-mailto="emailGeneral"></a>
  document.querySelectorAll("[data-cfg-mailto]").forEach(el => {
    const email = cfg[el.dataset.cfgMailto];
    if (!email) return;
    el.href = `mailto:${email}`;
    el.textContent = email;
  });

  // Homepage countdown target
  const countdown = document.getElementById("countdown");
  if (countdown && cfg.summitCountdownISO) {
    countdown.dataset.date = cfg.summitCountdownISO;
  }
})();
