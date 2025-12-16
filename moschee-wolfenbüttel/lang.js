// Übersetzungen
const translations = {
  de: {
    title: "Yeşil Cami Wolfenbüttel",
    "site-name": "Yeşil Cami Wolfenbüttel",

    "nav-start": "Startseite",
    "nav-vorstand": "Vorstand",
    "nav-ramazan": "Ramazan Kalender",
    "nav-bilder": "Bilder",
    "nav-kontakt": "Kontakt",
    "nav-mitglied": "Mitglied werden",

    "hero-subtitle": "Aus Schwierigkeiten entsteht ein neuer Anfang",
    "hero-title": "Moschee- und Külliye-Projekt<br><span>WOLFENBÜTTEL</span>",
    "hero-text":
      "Wir realisieren unser Moschee- und Külliye-Projekt in Wolfenbüttel mit eurer Unterstützung. Unser Ziel ist es, einen Ort zu schaffen, an dem der Glaube an die Einheit Allahs gelebt wird, das Gebet Geborgenheit schenkt und Wissen sowie Bildung wachsen. Für unsere Kinder, Jugendlichen und Familien soll ein sicherer Treffpunkt entstehen. Es soll eine dauerhafte Wohltat sein, die kommenden Generationen Glaube, Geschwisterlichkeit und Wissen hinterlässt.",
    "hero-signature": "Türkisch-Islamische Gemeinde zu Wolfenbüttel e.V."
  },

  tr: {
    title: "Yeşil Cami Wolfenbüttel",
    "site-name": "Yeşil Cami Wolfenbüttel",

    "nav-start": "Ana Sayfa",
    "nav-vorstand": "Yönetim Kurulu",
    "nav-ramazan": "Ramazan Takvimi",
    "nav-bilder": "Fotoğraf Galerisi",
    "nav-kontakt": "İletişim",
    "nav-mitglied": "Üye Ol",

    "hero-subtitle": "Zorluklardan Doğan Yeni Bir Başlangıç",
    "hero-title": "Cami ve Külliye Projemiz<br><span>WOLFENBÜTTEL</span>",
    "hero-text":
      "Wolfenbüttel'de inşa edeceğimiz Cami ve Külliye projemizi sizlerin desteği ile hayata geçiriyoruz. Amacımız, tevhid ve vahdetin yaşandığı, ibadetin huzur bulduğu, ilim ve irfanın geliştiği; gençlerimiz ve ailelerimiz için güvenli bir buluşma merkezi oluşturmaktır. Gelecek nesillere iman, kardeşlik ve ilim mirası sunacak kalıcı bir sadaka-i cariye olacaktır.",
    "hero-signature": "Türkisch-Islamische Gemeinde zu Wolfenbüttel e.V."
  },

  ar: {
    title: "مسجد يشيل فيلفنبوتل",
    "site-name": "Yeşil Cami Wolfenbüttel",

    "nav-start": "الصفحة الرئيسية",
    "nav-vorstand": "مجلس الإدارة",
    "nav-ramazan": "تقويم رمضان",
    "nav-bilder": "الصور",
    "nav-kontakt": "اتصال",
    "nav-mitglied": "الانضمام كعضو",

    "hero-subtitle": "بداية جديدة تولد من الصعوبات",
    "hero-title":
      "مشروع المسجد والمجمع الديني<br><span>فولفنبوتل</span>",
    "hero-text":
      "نقيم مشروع بناء المسجد والمجمع في مدينة فولفنبوتل بدعمكم. هدفنا أن يكون هذا المكان موضعًا يتجسد فيه توحيد الله ووحدة المسلمين، ومكانًا يجد فيه المصلون السكينة، وينمو فيه العلم والإيمان. نريد أن يكون مركزًا آمنًا لشبابنا وعائلاتنا، وصدقة جارية تخلّف للأجيال القادمة الإيمان والأخوّة والعلم.",
    "hero-signature": "الجالية الإسلامية التركية في فولفنبوتل"
  }
};

const langButtons = document.querySelectorAll("[data-lang-btn]");
const languageElements = document.querySelectorAll("[data-lang]");

function changeLanguage(lang) {
  const dict = translations[lang];
  if (!dict) return;

  document.documentElement.lang = lang;

  languageElements.forEach((el) => {
    const key = el.getAttribute("data-lang");
    const text = dict[key];
    if (text !== undefined) {
      el.innerHTML = text;
    }
  });

  localStorage.setItem("lang", lang);
}

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const lang = btn.getAttribute("data-lang-btn");
    changeLanguage(lang);
  });
});

const savedLang = localStorage.getItem("lang") || "de";
changeLanguage(savedLang);

document.addEventListener("DOMContentLoaded", () => {
  const switcher = document.querySelector(".language-switcher");
  if (!switcher) return;

  const flags = Array.from(switcher.querySelectorAll(".flag[data-lang-btn]"));
  if (!flags.length) return;

  const getCurrentLang = () => {
    return (
      localStorage.getItem("lang") ||
      localStorage.getItem("siteLang") ||
      document.documentElement.lang ||
      "de"
    );
  };

  const setActive = (lang) => {
    flags.forEach((f) => {
      f.classList.toggle("is-active", f.getAttribute("data-lang-btn") === lang);
    });
  };

  // initial aktiv setzen
  setActive(getCurrentLang());

  const close = () => switcher.classList.remove("is-open");
  const toggle = () => switcher.classList.toggle("is-open");

  // Klick-Verhalten:
  // - Klick auf aktive Flagge: Dropdown öffnen/schließen
  // - Klick auf andere Flagge: Sprache wechseln (dein lang.js Handler macht das), Dropdown schließen
  switcher.addEventListener("click", (e) => {
    const flag = e.target.closest(".flag[data-lang-btn]");
    if (!flag) return;

    const isActive = flag.classList.contains("is-active");

    if (isActive) {
      e.stopPropagation();
      toggle();
      return;
    }

    // andere Sprache gewählt -> Dropdown zu
    close();

    // nach dem Wechsel (dein bestehender Code) aktive Flagge neu setzen
    setTimeout(() => setActive(getCurrentLang()), 0);
  });

  // Klick außerhalb schließt Dropdown
  document.addEventListener("click", (e) => {
    if (!switcher.contains(e.target)) close();
  });

  // ESC schließt Dropdown
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
});
