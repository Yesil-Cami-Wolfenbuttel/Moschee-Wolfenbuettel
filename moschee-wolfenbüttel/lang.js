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
