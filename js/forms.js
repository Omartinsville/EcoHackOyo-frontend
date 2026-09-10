(() => {
  "use strict";

  // This file powers every registration form on the site (hackathon, main
  // summit, sponsor). Each <form> needs:
  //   - id="reg-form"
  //   - data-ecohackoyo-form
  //   - data-endpoint="hackathon" | "summit" | "sponsor"
  //   - data-success-title / data-success-text (fallback copy — used only if
  //     the API response doesn't include its own message)
  //
  // ---------------------------------------------------------------------
  // ONE PLACE TO CONFIGURE: set this to your deployed API's base URL once
  // (see backend/README.md), and it applies to all three registration
  // pages automatically — you don't need to edit each HTML file's <form
  // action="...">.
  // ---------------------------------------------------------------------
  const API_BASE = "https://ecohackoyo-api.onrender.com"; // e.g. "https://api.ecohackoyo.org"

  const forms = document.querySelectorAll("form[data-ecohackoyo-form]");

  forms.forEach(form => {
    const submitBtn = form.querySelector('[type="submit"]');
    const statusEl = form.querySelector(".form-status");
    const cardEl = form.closest(".form-card");
    const defaultBtnText = submitBtn ? submitBtn.textContent : "";

    const showError = (field, message) => {
      const el = form.querySelector(`[data-error-for="${field}"]`);
      if (el) el.textContent = message;
    };

    const clearErrors = () => {
      form.querySelectorAll(".error").forEach(el => (el.textContent = ""));
    };

    const validate = () => {
      let valid = true;
      clearErrors();

      form.querySelectorAll("[required]").forEach(field => {
        if (field.type === "checkbox" || field.type === "radio") return; // handled via groups below
        const value = String(field.value || "").trim();
        if (!value) {
          showError(field.name, "This field is required.");
          valid = false;
          return;
        }
        if (field.type === "email") {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(value)) {
            showError(field.name, "Please enter a valid email address.");
            valid = false;
          }
        }
        if (field.type === "tel") {
          const digits = value.replace(/\D/g, "");
          if (digits.length < 10) {
            showError(field.name, "Please enter a valid phone number.");
            valid = false;
          }
        }
      });

      // Radio pill groups marked required via the group wrapper
      form.querySelectorAll("[data-radio-required]").forEach(group => {
        const name = group.dataset.radioRequired;
        const checked = group.querySelector(`input[name="${name}"]:checked`);
        if (!checked) {
          showError(name, "Please choose one option.");
          valid = false;
        }
      });

      // Checkbox pill groups needing at least one selection
      form.querySelectorAll("[data-checkbox-min]").forEach(group => {
        const name = group.dataset.checkboxMin;
        const min = Number(group.dataset.checkboxMin) || 1;
        const checkedCount = group.querySelectorAll('input[type="checkbox"]:checked').length;
        if (checkedCount < min) {
          showError(name, `Please select at least ${min} option${min > 1 ? "s" : ""}.`);
          valid = false;
        }
      });

      const consent = form.querySelector('input[name="consent"]');
      if (consent && !consent.checked) {
        if (statusEl) {
          statusEl.textContent = "Please confirm the consent checkbox before submitting.";
          statusEl.className = "form-status error-status";
        }
        valid = false;
      }

      return valid;
    };

    // Build a plain JSON payload from the form. The honeypot field is sent
    // too — the API silently no-ops when it's filled in (bots only), and
    // ignores it otherwise.
    const buildPayload = () => {
      const payload = {};
      new FormData(form).forEach((value, key) => {
        payload[key] = value;
      });
      payload.consent = form.querySelector('input[name="consent"]')?.checked === true;
      return payload;
    };

    const resolveAction = () => {
      const endpoint = form.dataset.endpoint;
      const usingApi = API_BASE && !API_BASE.includes("REPLACE_WITH") && endpoint;
      if (usingApi) return `${API_BASE.replace(/\/$/, "")}/api/register/${endpoint}`;
      // Fall back to whatever's on the action attribute (e.g. Formspree),
      // for anyone who hasn't migrated to the Postgres API yet.
      return form.getAttribute("action") || "";
    };

    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (statusEl) {
        statusEl.textContent = "";
        statusEl.className = "form-status";
      }

      if (!validate()) return;

      const action = resolveAction();
      const notConfigured = !action || action.includes("REPLACE_WITH");

      if (notConfigured) {
        if (statusEl) {
          statusEl.textContent =
            "Form isn't connected yet — the site owner needs to set API_BASE in js/forms.js (see backend/README.md).";
          statusEl.className = "form-status error-status";
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting…";
      }

      try {
        const response = await fetch(action, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(buildPayload())
        });

        let data = {};
        try {
          data = await response.json();
        } catch {
          /* non-JSON response (e.g. Formspree fallback) — proceed with an empty object */
        }

        if (response.ok) {
          showSuccess(form, cardEl, data);
        } else {
          if (statusEl) {
            statusEl.textContent =
              data.error || "Something went wrong sending your registration. Please try again.";
            statusEl.className = "form-status error-status";
          }
        }
      } catch (err) {
        if (statusEl) {
          statusEl.textContent = "Something went wrong sending your registration. Please try again, or reach us directly using the contact details in the footer.";
          statusEl.className = "form-status error-status";
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = defaultBtnText;
        }
      }
    });
  });

  function showSuccess(form, cardEl, data = {}) {
    const title = data.participant_code
      ? `You're in! Your ID: ${data.participant_code}`
      : form.dataset.successTitle || "You're in!";
    const text =
      form.dataset.successText ||
      "Thanks for registering for EcoHackOyo. Check your email for confirmation and next steps.";
    const whatsappLink = data.whatsapp_link;

    if (!cardEl) {
      form.reset();
      if (whatsappLink) window.location.href = whatsappLink;
      return;
    }

    const panel = document.createElement("div");
    panel.className = "success-panel";
    panel.innerHTML = `
      <div class="icon">✓</div>
      <h3>${title}</h3>
      <p>${text}</p>
      ${
        data.participant_no
          ? `<p class="participant-code">Save your participant ID: <strong>${data.participant_code}</strong></p>`
          : ""
      }
      ${
        whatsappLink
          ? `<p class="redirect-note" id="redirect-note">Redirecting you to the WhatsApp group…</p>
             <a class="btn btn-primary" href="${whatsappLink}" target="_blank" rel="noopener">Join WhatsApp Group Now <span>→</span></a>`
          : `<a class="btn btn-primary" href="index.html">Back to Home</a>`
      }
    `;
    form.replaceWith(panel);

    // Give the success message a beat to register before sending them off
    // to WhatsApp. The manual button above is the fallback if a browser
    // blocks the automatic navigation.
    if (whatsappLink) {
      window.setTimeout(() => {
        window.location.href = whatsappLink;
      }, 1800);
    }
  }
})();
