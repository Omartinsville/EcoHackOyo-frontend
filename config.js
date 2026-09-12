// ============================================================================
// ECOHACKOYO SITE CONFIG — the ONE file to edit when dates, the venue, or
// contact emails change. Every page pulls from this automatically; you never
// need to hunt through individual HTML files again.
//
// After editing this file: save, commit, push. Netlify redeploys
// automatically and every page picks up the new values within a minute.
// ============================================================================
window.ECOHACKOYO_CONFIG = {
  // ---- HACKATHON PROGRAM (the 4-week online track) ----
  hackathonDate: "October 6, 2026",     // start date, shown wherever the program date appears
  hackathonDateShort: "Oct 6",           // compact form for tight badges/timelines
  hackathonDuration: "4 Weeks",

  // ---- MAIN SUMMIT (the live 2-day event) ----
  summitDate: "November 27–28, 2026",   // human-readable, shown across the site
  summitDateShort: "Nov 27–28",          // compact form for tight badges/timelines
  // Drives the homepage countdown. Must be a valid ISO 8601 date-time with
  // timezone offset. +01:00 is West Africa Time (Nigeria). Keep the "T09:00:00"
  // time portion unless you also know the exact start time — update it once you do.
  summitCountdownISO: "2026-11-27T09:00:00+01:00",

  // ---- VENUE ----
  // Update the moment a venue is confirmed — e.g. "New Trybe Hub, Ibadan"
  location: "Location to be announced",

  // ---- CONTACT EMAILS ----
  emailGeneral: "ecohack@gmail.com",
  emailPartnerships: "partnershipsecohackoyo@gmail.com"
};
