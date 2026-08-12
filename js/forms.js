(() => {
  "use strict";

  // This file powers every registration form on the site (hackathon, main
  // summit, sponsor). Each <form> needs:
  //   - id="reg-form"
  //   - action="https://api.ecohackoyo.org/api/register/<hackathon|summit|sponsor>"
  //   - data-success-title / data-success-text (optional overrides)
  // Submissions are sent as JSON to the custom Postgres-backed API (see
  // backend/README.md) — field names in each HTML form must match what
  // server.js expects (full_name, organization_name, etc).

  const forms = document.querySelectorAll("form[data-ecohackoyo-form]");

  async function submitForm(form) {
    const payload = Object.fromEntries(new FormData(form).entries());

    // checkbox comes through as "on"/undefined — normalize to a real boolean
    payload.consent = form.querySelector('[name="consent"]')?.checked === true;

    const response = await fetch(form.getAttribute("action"), {
      method: "POST",
      headers: { "Content-Type": "application/json", 
      Accept: "application/json",
      "ngrok-skip-browser-warning": "true"},
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // server.js returns { error, details: [...] } on 400, { error } on 409/500
      const message = Array.isArray(data.details) && data.details.length
        ? data.details.join(", ")
        : (data.error || "Submission failed. Please try again.");
      throw new Error(message);
    }

    return data;
  }

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

    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (statusEl) {
        statusEl.textContent = "";
        statusEl.className = "form-status";
      }

      if (!validate()) return;

      const action = form.getAttribute("action") || "";
      const notConfigured = !action || action.includes("REPLACE_WITH");

      if (notConfigured) {
        if (statusEl) {
          statusEl.textContent =
            "Form isn't connected yet — the site owner needs to set the API endpoint (see backend/README.md).";
          statusEl.className = "form-status error-status";
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting…";
      }

      try {
        await submitForm(form);
        showSuccess(form, cardEl);
      } catch (err) {
        if (statusEl) {
          statusEl.textContent =
            err.message ||
            "Something went wrong sending your registration. Please try again, or reach us directly using the contact details in the footer.";
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

  function showSuccess(form, cardEl) {
    const title = form.dataset.successTitle || "You're in!";
    const text =
      form.dataset.successText ||
      "Thanks for registering for EcoHackOyo. Check your email (and WhatsApp) for confirmation and next steps.";

    if (!cardEl) {
      form.reset();
      return;
    }

    const panel = document.createElement("div");
    panel.className = "success-panel";
    panel.innerHTML = `
      <div class="icon">✓</div>
      <h3>${title}</h3>
      <p>${text}</p>
      <a class="btn btn-primary" href="index.html">Back to Home</a>
    `;
    form.replaceWith(panel);
  }
})();