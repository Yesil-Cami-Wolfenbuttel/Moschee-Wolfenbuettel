// =======================
// Mobile Navigation Toggle
// =======================
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}

// =======================
// Mehrschritt-Formular "Mitglied werden"
// =======================

const form = document.getElementById("mitgliedForm");
const steps = document.querySelectorAll(".form-step");

let currentStep = 0;

function showStep(index) {
  if (!steps.length) return;

  steps.forEach((step, i) => {
    step.classList.toggle("active", i === index);
  });

  currentStep = index;

  // Schritt 4 → Canvas neu aufbauen, damit Unterschrift funktioniert
  if (index === 3 && typeof resizeSignatureCanvas === "function") {
    resizeSignatureCanvas();
  }
}

// Validierung pro Schritt
function validateStep(stepIndex) {
  if (!steps.length) return true;

  const step = steps[stepIndex];
  let valid = true;
  let message = "";

  // Alte Fehler-Markierungen im aktuellen Schritt entfernen
  step.querySelectorAll(".input-error").forEach((el) =>
    el.classList.remove("input-error")
  );
  step.querySelectorAll(".group-error").forEach((el) =>
    el.classList.remove("group-error")
  );

  // 1. Alle required Inputs in diesem Schritt prüfen
  const requiredInputs = step.querySelectorAll("input[required]");
  requiredInputs.forEach((input) => {
    if (!input.value || input.value.trim() === "") {
      valid = false;
      input.classList.add("input-error");
    }
  });

  if (!valid) {
    message = "Bitte füllen Sie alle Pflichtfelder aus.";
  }

  // 2. Zusätzliche Regeln je Schritt

  // Schritt 2: mindestens eine Art der Zahlung wählen
  if (valid && stepIndex === 1) {
    const checked = step.querySelectorAll('input[name="beitragArt"]:checked');
    if (!checked.length) {
      valid = false;
      message =
        "Bitte wählen Sie mindestens eine Art der Zahlung (z.B. Mitgliedsbeitrag, Spende).";
      const group = step.querySelector(".checkbox-group");
      if (group) {
        group.classList.add("group-error");
      }
    }
  }

  // Schritt 3: IBAN genauer prüfen (deutsche IBAN: DE + 20 Ziffern)
  if (valid && stepIndex === 2) {
    const ibanInput = document.getElementById("iban");
    if (ibanInput) {
      const ibanRaw = ibanInput.value.replace(/\s+/g, "").toUpperCase();
      const ibanRegex = /^DE[0-9]{20}$/; // DE + 20 Ziffern = 22 Zeichen
      if (!ibanRegex.test(ibanRaw)) {
        valid = false;
        message =
          "Bitte geben Sie eine gültige deutsche IBAN ein (DE gefolgt von 20 Ziffern, insgesamt 22 Stellen).";
        ibanInput.classList.add("input-error");
      }
    }
  }

  // Schritt 4: Unterschrift prüfen
  if (valid && stepIndex === 3) {
    if (!hasSignature) {
      valid = false;
      message = "Bitte unterschreiben Sie digital im vorgesehenen Feld.";
      const sigWrap = step.querySelector(".signature-wrapper");
      if (sigWrap) {
        sigWrap.classList.add("group-error");
      }
    }
  }

  if (!valid) {
    alert(message || "Bitte prüfen Sie Ihre Eingaben.");
  }

  return valid;
}

function nextStep() {
  if (!validateStep(currentStep)) return;
  if (currentStep < steps.length - 1) {
    showStep(currentStep + 1);
  }
}

function prevStep() {
  if (currentStep > 0) {
    showStep(currentStep - 1);
  }
}

if (steps.length) {
  // ersten Schritt anzeigen
  showStep(0);

  document.querySelectorAll(".btn-next").forEach((btn) => {
    btn.addEventListener("click", nextStep);
  });

  document.querySelectorAll(".btn-prev").forEach((btn) => {
    btn.addEventListener("click", prevStep);
  });
}

// =======================
// Signaturfeld (Canvas) – Maus & Touch
// =======================

let isDrawing = false;
let hasSignature = false; // wird true, sobald gezeichnet wurde
const canvas = document.getElementById("signaturePad");
const clearSignatureBtn = document.getElementById("clearSignature");
let ctx = null;

// Wird aus showStep() aufgerufen
function resizeSignatureCanvas() {
  if (!canvas || !ctx) return;
  const rect = canvas.getBoundingClientRect();
  const width = rect.width || 400;
  canvas.width = width;
  canvas.height = 180;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  hasSignature = false; // nach Reset ist keine Unterschrift mehr vorhanden
}

if (canvas) {
  ctx = canvas.getContext("2d");

  window.addEventListener("load", resizeSignatureCanvas);
  window.addEventListener("resize", resizeSignatureCanvas);

  function getPos(evt) {
    const rect = canvas.getBoundingClientRect();
    const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function startDraw(evt) {
    isDrawing = true;
    const pos = getPos(evt);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(evt) {
    if (!isDrawing) return;
    evt.preventDefault();
    const pos = getPos(evt);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.stroke();
    hasSignature = true; // es wurde gezeichnet
  }

  function endDraw() {
    isDrawing = false;
  }

  // Maus-Events
  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", endDraw);
  canvas.addEventListener("mouseleave", endDraw);

  // Touch-Events
  canvas.addEventListener("touchstart", startDraw, { passive: false });
  canvas.addEventListener("touchmove", draw, { passive: false });
  canvas.addEventListener("touchend", endDraw);

  if (clearSignatureBtn) {
    clearSignatureBtn.addEventListener("click", () => {
      resizeSignatureCanvas();
    });
  }
}

// =======================
// Formular "Mitglied werden" absenden → E-Mail vorbereiten
// =======================

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Letzter Schritt nochmal prüfen
    if (!validateStep(3)) {
      return;
    }

    const formData = new FormData(form);

    const staatsangehoerigkeit = formData.get("staatsangehoerigkeit") || "";
    const staatsSonstige = formData.get("staatsSonstige") || "";
    const zahlintervall = formData.get("zahlintervall") || "";
    const zahlungstyp = formData.get("zahlungstyp") || "";

    const beitragArtList = [];
    form.querySelectorAll('input[name="beitragArt"]:checked').forEach((el) => {
      beitragArtList.push(el.value);
    });

    const familien = [
      formData.get("familienmitglied1"),
      formData.get("familienmitglied2"),
      formData.get("familienmitglied3"),
      formData.get("familienmitglied4"),
      formData.get("familienmitglied5"),
    ].filter((v) => v && v.trim() !== "");

    const bodyLines = [
      "ANTRAG AUF MITGLIEDSCHAFT (Online)",
      "",
      "---- Persönliche Angaben ----",
      `Name, Nachname: ${formData.get("name") || ""}`,
      `Geburtsdatum und -ort: ${formData.get("geburtsdaten") || ""}`,
      `Staatsangehörigkeit: ${staatsangehoerigkeit}${
        staatsangehoerigkeit === "sonstige" && staatsSonstige
          ? " (" + staatsSonstige + ")"
          : ""
      }`,
      `Anschrift: ${formData.get("anschrift") || ""}`,
      `PLZ / Ort: ${formData.get("plz") || ""} ${formData.get("ort") || ""}`,
      `Telefonnummer: ${formData.get("telefon") || ""}`,
      `E-Mail: ${formData.get("email") || ""}`,
      "",
      "---- Mitgliedsbeitrag & Zahlungsart ----",
      `Mitgliedsbeitrag / Betrag: ${formData.get("mitgliedsbeitrag") || ""} €`,
      `Zahlungsintervall: ${zahlintervall}`,
      `Art der Zahlung: ${beitragArtList.join(", ") || "-"}`,
      `Familienangehörige: ${familien.join("; ") || "-"}`,
      "",
      "---- Einzugsermächtigung & SEPA ----",
      `Zahlungstyp: ${zahlungstyp}`,
      `Kontoinhaber: ${formData.get("kontoinhaber") || ""}`,
      `IBAN: ${formData.get("iban") || ""}`,
      `Verwendungszweck: ${formData.get("verwendungszweck") || ""}`,
      "",
      "---- Bestätigung ----",
      `Ort, Datum: ${formData.get("ortDatum") || ""}`,
      "Digitale Unterschrift: Online unterzeichnet",
      "",
      "Hinweis: Die digitale Unterschrift wurde im Browser erfasst. Ein echter PDF-/Bild-Anhang kann mit dieser Lösung nicht automatisch erzeugt und versendet werden.",
    ];

    const body = bodyLines.join("\n");
    const mailto = `mailto:info@ditib-wf.de?subject=${encodeURIComponent(
      "Online-Mitgliedsantrag"
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  });
}

// =======================
// LIGHTBOX – Bilder vergrößern + Navigation + Zoom
// =======================

const galleryImages = document.querySelectorAll(".gallery-item img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

const btnPrev = document.getElementById("lightbox-prev");
const btnNext = document.getElementById("lightbox-next");

let currentIndex = 0;

// Zoom-Variablen
let currentScale = 1;
let startScale = 1;
let startDistance = 0;

// Lightbox öffnen
function openLightbox(index) {
  if (!galleryImages.length || !lightbox || !lightboxImg) return;
  currentIndex = index;
  lightboxImg.src = galleryImages[currentIndex].src;
  currentScale = 1;
  lightboxImg.style.transform = "scale(1)";
  lightbox.style.display = "flex";
}

// Lightbox schließen
function closeLightbox() {
  if (!lightbox || !lightboxImg) return;
  lightbox.style.display = "none";
  lightboxImg.src = "";
  currentScale = 1;
  lightboxImg.style.transform = "scale(1)";
}

// Voriges Bild
function showPrev() {
  if (!galleryImages.length) return;
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  lightboxImg.src = galleryImages[currentIndex].src;
  currentScale = 1;
  lightboxImg.style.transform = "scale(1)";
}

// Nächstes Bild
function showNext() {
  if (!galleryImages.length) return;
  currentIndex = (currentIndex + 1) % galleryImages.length;
  lightboxImg.src = galleryImages[currentIndex].src;
  currentScale = 1;
  lightboxImg.style.transform = "scale(1)";
}

// Klick auf Bilder → Öffnen
galleryImages.forEach((img, index) => {
  img.addEventListener("click", () => openLightbox(index));
});

// Klick auf Hintergrund → Schließen
if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

// Navigation Buttons
if (btnPrev) {
  btnPrev.addEventListener("click", (e) => {
    e.stopPropagation(); // verhindert das Schließen der Lightbox
    showPrev();
  });
}

if (btnNext) {
  btnNext.addEventListener("click", (e) => {
    e.stopPropagation();
    showNext();
  });
}

// Keyboard-Navigation
document.addEventListener("keydown", (e) => {
  if (!lightbox || lightbox.style.display !== "flex") return;
  if (e.key === "ArrowLeft") showPrev();
  if (e.key === "ArrowRight") showNext();
  if (e.key === "Escape") closeLightbox();
});

// =======================
// Pinch-to-Zoom auf Handy (für lightboxImg)
// =======================

if (lightboxImg) {
  lightboxImg.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        startDistance = Math.hypot(dx, dy);
        startScale = currentScale || 1;
      }
    },
    { passive: false }
  );

  lightboxImg.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length === 2 && startDistance > 0) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.hypot(dx, dy);
        let scale = (distance / startDistance) * startScale;

        // Zoom-Grenzen (min/max)
        if (scale < 1) scale = 1;
        if (scale > 4) scale = 4;

        currentScale = scale;
        lightboxImg.style.transform = `scale(${currentScale})`;
      }
    },
    { passive: false }
  );

  lightboxImg.addEventListener("touchend", () => {
    if (currentScale < 1.02) {
      currentScale = 1;
      lightboxImg.style.transform = "scale(1)";
    }
  });
}

// =======================
// Kontaktformular → E-Mail vorbereiten
// =======================

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Fehler-Markierungen entfernen
    contactForm
      .querySelectorAll(".input-error")
      .forEach((el) => el.classList.remove("input-error"));

    const nameInput = document.getElementById("cf-name");
    const emailInput = document.getElementById("cf-email");
    const subjectInput = document.getElementById("cf-subject");
    const messageInput = document.getElementById("cf-message");

    let valid = true;

    [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
      if (!input.value || input.value.trim() === "") {
        valid = false;
        input.classList.add("input-error");
      }
    });

    if (!valid) {
      alert("Bitte füllen Sie alle Pflichtfelder im Kontaktformular aus.");
      return;
    }

    const bodyLines = [
      "KONTAKTANFRAGE ÜBER DIE WEBSEITE",
      "",
      `Name: ${nameInput.value}`,
      `E-Mail: ${emailInput.value}`,
      `Betreff: ${subjectInput.value}`,
      "",
      "Nachricht:",
      messageInput.value,
    ];

    const body = bodyLines.join("\n");

    const mailto = `mailto:info@ditib-wf.de?subject=${encodeURIComponent(
      "Kontaktanfrage über die Webseite: " + subjectInput.value
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  });
}
