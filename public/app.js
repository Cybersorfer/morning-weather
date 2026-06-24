/**
 * My Morning Weather — kid-friendly weather + clothing guide
 * Works standalone in a browser and inside Alexa Web API for Games viewport.
 */

const ALEXA_SCRIPT =
  "https://images-na.ssl-images-amazon.com/images/G/01/alexa-html/alexa-html-1.0.0.js";

/** @type {object | null} */
let alexaClient = null;

const DAY_PARTS = [
  { id: "morning", label: "Morning", emoji: "🌅", hours: [6, 7, 8, 9, 10, 11] },
  { id: "afternoon", label: "Afternoon", emoji: "☀️", hours: [12, 13, 14, 15, 16, 17] },
  { id: "evening", label: "Evening", emoji: "🌇", hours: [18, 19, 20, 21] },
  { id: "night", label: "Night", emoji: "🌙", hours: [22, 23, 0, 1, 2, 3, 4, 5] },
];

const CLOTHING_SVGS = {
  tshirt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3l3 2 3-2 3 2 3-2v5l-3 2v11H6V10L3 8V3l3 2z"/></svg>`,
  shorts: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 4h12v6l-2 10h-3l-1-6-1 6H8L6 10V4z"/></svg>`,
  sunglasses: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/><path d="M4 12h0M10 12h4M20 12h0M4 12a3 3 0 013-3h0a3 3 0 013 3M14 12a3 3 0 013-3h0a3 3 0 013 3"/></svg>`,
  hat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="14" rx="9" ry="3"/><path d="M6 14V11a6 6 0 0112 0v3"/></svg>`,
  longSleeve: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 4h12v16H6z"/><path d="M6 7L3 10v4l3 2M18 7l3 3v3l-3 2"/></svg>`,
  jeans: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 4h8v16l-2-8-2 8-2-8-2 8V4z"/></svg>`,
  shirt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 4h8l2 3v14H6V7l2-3z"/><path d="M12 4v6"/></svg>`,
  leggings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 4h6v16l-3-6-3 6V4z"/></svg>`,
  sweater: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 5h10l2 4v12H5V9l2-4z"/><path d="M7 9h10M8 13h8M8 17h8"/></svg>`,
  pants: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 4h6v16H9z"/><path d="M9 12h6"/></svg>`,
  sneakers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 14h16l-1 4H5l-1-4z"/><path d="M6 14l2-4h8l2 4"/></svg>`,
  raincoat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 5h8l2 4v12H6V9l2-4z"/><path d="M12 5v4M9 9h6"/></svg>`,
  rainBoots: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 10h4v10H6zM14 10h4v10h-4z"/><path d="M6 14h12"/></svg>`,
  umbrella: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3a7 7 0 017 7H5a7 7 0 017-7z"/><path d="M12 10v10"/></svg>`,
  coat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 4h8l2 5v11H6V9l2-5z"/><path d="M12 4v16"/></svg>`,
  scarf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6c4 0 8 2 12 0v12c-4 2-8 2-12 0V6z"/></svg>`,
  gloves: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12V8a2 2 0 014 0v8a3 3 0 01-6 0v-4a2 2 0 014 0"/><path d="M15 12V6a2 2 0 014 0v10a3 3 0 01-6 0v-4a2 2 0 014 0"/></svg>`,
  snowBoots: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h5v8H5zM14 12h5v8h-5z"/><circle cx="8" cy="8" r="2"/><circle cx="16" cy="8" r="2"/></svg>`,
};

const WEATHER_ICONS = {
  sunny: `<svg viewBox="0 0 64 64" class="w-full h-full"><circle cx="32" cy="32" r="14" fill="#FCD34D"/><g stroke="#F59E0B" stroke-width="3" stroke-linecap="round"><line x1="32" y1="6" x2="32" y2="14"/><line x1="32" y1="50" x2="32" y2="58"/><line x1="6" y1="32" x2="14" y2="32"/><line x1="50" y1="32" x2="58" y2="32"/><line x1="13.5" y1="13.5" x2="19.5" y2="19.5"/><line x1="44.5" y1="44.5" x2="50.5" y2="50.5"/><line x1="13.5" y1="50.5" x2="19.5" y2="44.5"/><line x1="44.5" y1="19.5" x2="50.5" y2="13.5"/></g></svg>`,
  sunnyFresh: `<svg viewBox="0 0 64 64" class="w-full h-full"><circle cx="28" cy="28" r="12" fill="#FDE68A"/><path d="M12 44 Q32 36 52 44" fill="#BFDBFE" opacity="0.6"/></svg>`,
  cloudyWarm: `<svg viewBox="0 0 64 64" class="w-full h-full"><ellipse cx="32" cy="38" rx="22" ry="12" fill="#E5E7EB"/><ellipse cx="24" cy="34" rx="14" ry="10" fill="#F3F4F6"/><circle cx="44" cy="30" r="8" fill="#FCD34D" opacity="0.8"/></svg>`,
  cloudyChilly: `<svg viewBox="0 0 64 64" class="w-full h-full"><ellipse cx="32" cy="36" rx="24" ry="14" fill="#94A3B8"/><ellipse cx="22" cy="32" rx="14" ry="10" fill="#CBD5E1"/></svg>`,
  rainy: `<svg viewBox="0 0 64 64" class="w-full h-full"><ellipse cx="32" cy="28" rx="22" ry="12" fill="#64748B"/><g stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round"><line x1="20" y1="44" x2="18" y2="52"/><line x1="32" y1="44" x2="30" y2="54"/><line x1="44" y1="44" x2="42" y2="52"/></g></svg>`,
  snowy: `<svg viewBox="0 0 64 64" class="w-full h-full"><ellipse cx="32" cy="28" rx="22" ry="12" fill="#94A3B8"/><circle cx="22" cy="46" r="3" fill="#fff"/><circle cx="32" cy="50" r="3" fill="#fff"/><circle cx="42" cy="46" r="3" fill="#fff"/></svg>`,
  stormy: `<svg viewBox="0 0 64 64" class="w-full h-full"><ellipse cx="32" cy="26" rx="24" ry="13" fill="#475569"/><polygon points="28,36 24,48 30,48 26,58 38,44 32,44 36,36" fill="#FACC15"/></svg>`,
};

function isRainCode(code) {
  return [51, 52, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code);
}

function isSnowCode(code) {
  return [71, 73, 75, 77, 85, 86].includes(code);
}

function isStormCode(code) {
  return [95, 96, 99].includes(code);
}

function isCloudCode(code) {
  return [2, 3, 45, 48].includes(code) || code === 1;
}

function isClearCode(code) {
  return code === 0;
}

/**
 * @param {number} tempF
 * @param {number} weatherCode
 */
function classifyWeather(tempF, weatherCode) {
  if (isStormCode(weatherCode)) {
    return {
      id: "stormy",
      title: "Stormy Day!",
      subtitle: "Stay inside if you can!",
      bg: "from-slate-700 via-indigo-800 to-slate-900",
      text: "text-white",
      icon: "stormy",
      clothing: [
        { key: "raincoat", label: "Raincoat" },
        { key: "rainBoots", label: "Boots" },
        { key: "umbrella", label: "Umbrella" },
      ],
      speak: "There might be storms today. Let's wear a raincoat and boots, and play inside if we can.",
    };
  }

  if (isSnowCode(weatherCode)) {
    return {
      id: "snowy",
      title: "Snowy Day!",
      subtitle: "Brrr — bundle up warm!",
      bg: "from-sky-200 via-blue-100 to-indigo-200",
      text: "text-slate-800",
      icon: "snowy",
      clothing: [
        { key: "coat", label: "Warm coat" },
        { key: "scarf", label: "Scarf" },
        { key: "gloves", label: "Gloves" },
        { key: "snowBoots", label: "Snow boots" },
      ],
      speak: "It's snowy and cozy! Grab your warm coat, scarf, gloves, and snow boots.",
    };
  }

  if (isRainCode(weatherCode)) {
    return {
      id: "rainy",
      title: "Rainy Day!",
      subtitle: "Splash-proof outfit time!",
      bg: "from-blue-700 via-blue-600 to-indigo-700",
      text: "text-white",
      icon: "rainy",
      clothing: [
        { key: "raincoat", label: "Raincoat" },
        { key: "rainBoots", label: "Rain boots" },
        { key: "umbrella", label: "Umbrella" },
      ],
      speak: "It's rainy today! Remember your raincoat, rain boots, and your umbrella.",
    };
  }

  if (isClearCode(weatherCode) && tempF > 78) {
    return {
      id: "sunnyHot",
      title: "Sunny & Hot!",
      subtitle: "Sunshine all day!",
      bg: "from-amber-400 via-orange-400 to-yellow-300",
      text: "text-amber-950",
      icon: "sunny",
      clothing: [
        { key: "tshirt", label: "T-shirt" },
        { key: "shorts", label: "Shorts" },
        { key: "sunglasses", label: "Sunglasses" },
        { key: "hat", label: "Sun hat" },
      ],
      speak: "It's sunny and hot! A t-shirt, shorts, sunglasses, and a sun hat would be perfect.",
    };
  }

  if (isClearCode(weatherCode) && tempF >= 60) {
    return {
      id: "sunnyFresh",
      title: "Sunny but Fresh",
      subtitle: "Nice sun, cool breeze!",
      bg: "from-sky-300 via-sky-200 to-cyan-100",
      text: "text-sky-950",
      icon: "sunnyFresh",
      clothing: [
        { key: "longSleeve", label: "Light long sleeve" },
        { key: "jeans", label: "Jeans" },
        { key: "sneakers", label: "Sneakers" },
      ],
      speak: "It's sunny but fresh! A light long sleeve and jeans should feel just right.",
    };
  }

  if (isCloudCode(weatherCode) && tempF >= 68) {
    return {
      id: "cloudyWarm",
      title: "Cloudy but Warm",
      subtitle: "Soft clouds, comfy day!",
      bg: "from-orange-100 via-rose-100 to-amber-100",
      text: "text-stone-800",
      icon: "cloudyWarm",
      clothing: [
        { key: "shirt", label: "Comfy shirt" },
        { key: "leggings", label: "Leggings" },
        { key: "sneakers", label: "Sneakers" },
      ],
      speak: "It's cloudy but warm! A comfy shirt and leggings will be great today.",
    };
  }

  if (isCloudCode(weatherCode) || tempF < 68) {
    return {
      id: "cloudyChilly",
      title: "Cloudy & Chilly",
      subtitle: "Cozy layers today!",
      bg: "from-slate-400 via-slate-500 to-slate-600",
      text: "text-white",
      icon: "cloudyChilly",
      clothing: [
        { key: "sweater", label: "Sweater" },
        { key: "pants", label: "Warm pants" },
        { key: "sneakers", label: "Sneakers" },
      ],
      speak: "It's cloudy and chilly! A cozy sweater and warm pants will keep you comfy.",
    };
  }

  return {
    id: "ok",
    title: "Looks OK!",
    subtitle: "Comfortable day ahead",
    bg: "from-teal-200 via-emerald-100 to-green-200",
    text: "text-emerald-950",
    icon: "sunnyFresh",
    clothing: [
      { key: "shirt", label: "Shirt" },
      { key: "jeans", label: "Pants" },
      { key: "sneakers", label: "Sneakers" },
    ],
    speak: "The weather looks pretty nice! A regular shirt and pants should work great.",
  };
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
}

function formatHourLabel(hour24, index, times) {
  const d = new Date(times[index]);
  return d.toLocaleTimeString([], { hour: "numeric" });
}

function average(nums) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function pickRepresentativeHour(dayPart, hourly) {
  const matches = dayPart.hours
    .map((h) => hourly.time.findIndex((t) => new Date(t).getHours() === h))
    .filter((i) => i >= 0);

  if (!matches.length) return null;

  const temps = matches.map((i) => hourly.temperature_2m[i]);
  const avgTemp = average(temps);
  let bestIdx = matches[0];
  let bestDiff = Infinity;
  for (const i of matches) {
    const diff = Math.abs(hourly.temperature_2m[i] - avgTemp);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }
  return bestIdx;
}

function buildTimeline(hourly) {
  return DAY_PARTS.map((part) => {
    const idx = pickRepresentativeHour(part, hourly);
    if (idx == null) {
      return { ...part, temp: null, weatherCode: null, state: null, timeLabel: "—" };
    }
    const temp = Math.round(hourly.temperature_2m[idx]);
    const code = hourly.weather_code[idx];
    const state = classifyWeather(temp, code);
    return {
      ...part,
      temp,
      weatherCode: code,
      state,
      timeLabel: formatHourLabel(new Date(hourly.time[idx]).getHours(), idx, hourly.time),
    };
  });
}

function buildSpeechLine(greetingText, state) {
  return `${greetingText}, friend! Today looks like ${state.title.toLowerCase()}. ${state.speak}`;
}

function escapeForSsml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function toKidSsml(text) {
  return `<speak><amazon:domain name="conversational"><prosody rate="94%" pitch="+10%" volume="medium">${escapeForSsml(text)}</prosody></amazon:domain></speak>`;
}

/** @type {SpeechSynthesisVoice | null} */
let cachedVoice = null;

function scoreVoice(voice) {
  const name = voice.name.toLowerCase();
  let score = 0;
  if (!voice.lang.toLowerCase().startsWith("en")) return -100;
  if (/female|woman|girl/.test(name)) score += 40;
  if (/jenny|aria|samantha|zira|hazel|susan|linda|victoria|emma|joanna|ivy|kendra|kimberly|salli/.test(name)) score += 50;
  if (/neural|natural|online|premium/.test(name)) score += 35;
  if (/google/.test(name) && /female|f/.test(name)) score += 30;
  if (/microsoft/.test(name) && !/david|mark|guy|ryan|male/.test(name)) score += 15;
  if (/male|david|mark|guy|ryan|george|james|brian/.test(name)) score -= 80;
  if (voice.default && score < 20) score += 5;
  if (voice.localService) score += 5;
  return score;
}

function pickKidFriendlyVoice() {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  if (cachedVoice && voices.some((v) => v.name === cachedVoice.name)) return cachedVoice;
  const ranked = [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a));
  cachedVoice = ranked.find((v) => scoreVoice(v) > 0) || ranked.find((v) => v.lang.startsWith("en")) || voices[0];
  return cachedVoice;
}

function loadVoices() {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) {
      pickKidFriendlyVoice();
      resolve(voices);
      return;
    }
    window.speechSynthesis.onvoiceschanged = () => {
      pickKidFriendlyVoice();
      resolve(window.speechSynthesis.getVoices());
    };
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 500);
  });
}

function speak(text) {
  if (alexaClient?.interface?.textToSpeech?.speak) {
    alexaClient.interface.textToSpeech.speak(toKidSsml(text));
    return;
  }

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voice = pickKidFriendlyVoice();
    if (voice) utter.voice = voice;
    utter.rate = 0.9;
    utter.pitch = 1.14;
    utter.volume = 1;
    window.speechSynthesis.speak(utter);
  }
}

function setLoading(message) {
  document.getElementById("status-line").textContent = message;
  document.getElementById("loading-block").classList.remove("hidden");
  document.getElementById("main-content").classList.add("hidden");
}

function showError(message, hint) {
  setLoading(message);
  document.getElementById("loading-block").innerHTML = `
    <div class="text-center px-8 max-w-lg">
      <p class="text-2xl font-bold mb-3">${message}</p>
      <p class="text-lg opacity-80 mb-6">${hint || ""}</p>
      <button id="retry-btn" class="px-8 py-4 rounded-2xl bg-white/25 text-xl font-bold backdrop-blur">
        Try again
      </button>
    </div>`;
  document.getElementById("retry-btn")?.addEventListener("click", () => location.reload());
}

function renderClothing(clothing) {
  const grid = document.getElementById("clothing-grid");
  grid.innerHTML = clothing
    .map(
      (item) => `
    <div class="clothing-card flex flex-col items-center gap-2 bg-white/25 backdrop-blur rounded-3xl p-4 min-w-[88px]">
      <div class="w-14 h-14 text-current">${CLOTHING_SVGS[item.key] || ""}</div>
      <span class="text-sm font-bold text-center leading-tight">${item.label}</span>
    </div>`
    )
    .join("");
}

function renderTimeline(timeline) {
  const row = document.getElementById("timeline-row");
  row.innerHTML = timeline
    .map((slot) => {
      if (!slot.state) {
        return `
        <article class="timeline-card w-44 rounded-3xl bg-white/20 p-4">
          <div class="text-3xl mb-2">${slot.emoji}</div>
          <h3 class="font-bold text-lg">${slot.label}</h3>
          <p class="opacity-70 text-sm">No data</p>
        </article>`;
      }
      return `
      <article class="timeline-card w-44 rounded-3xl bg-white/25 backdrop-blur p-4 border border-white/20">
        <div class="flex items-center justify-between mb-2">
          <span class="text-2xl">${slot.emoji}</span>
          <span class="text-xl font-black">${slot.temp}°</span>
        </div>
        <h3 class="font-bold text-base leading-tight">${slot.label}</h3>
        <p class="text-sm font-semibold opacity-90 leading-snug mt-1">${slot.state.title}</p>
        <div class="w-12 h-12 mx-auto mt-3 opacity-95">${WEATHER_ICONS[slot.state.icon] || ""}</div>
      </article>`;
    })
    .join("");
}

function renderWeather(data, placeName) {
  const currentTemp = Math.round(data.current.temperature_2m);
  const currentState = classifyWeather(currentTemp, data.current.weather_code);
  const timeline = buildTimeline(data.hourly);

  const shell = document.getElementById("app-shell");
  shell.className = `app-bg min-h-full bg-gradient-to-br ${currentState.bg} ${currentState.text} transition-colors duration-700`;

  document.getElementById("loading-block").classList.add("hidden");
  document.getElementById("main-content").classList.remove("hidden");

  document.getElementById("greeting").textContent = greeting();
  document.getElementById("place-name").textContent = placeName || "Your location";
  document.getElementById("weather-title").textContent = currentState.title;
  document.getElementById("weather-subtitle").textContent = currentState.subtitle;
  document.getElementById("current-temp").textContent = `${currentTemp}°`;
  document.getElementById("hero-icon").innerHTML = WEATHER_ICONS[currentState.icon] || "";

  renderClothing(currentState.clothing);
  renderTimeline(timeline);

  const speech = buildSpeechLine(greeting(), currentState);
  document.getElementById("speak-btn").onclick = () => speak(speech);
  speak(speech);
}

async function reverseGeocode(lat, lon) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/reverse");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("language", "en");
  url.searchParams.set("count", "1");
  const res = await fetch(url);
  if (!res.ok) throw new Error("Could not look up place name");
  const json = await res.json();
  const row = json.results?.[0];
  if (!row) return "Near you";
  return row.name + (row.admin1 ? `, ${row.admin1}` : "");
}

async function fetchWeather(lat, lon) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("current", "temperature_2m,weather_code");
  url.searchParams.set("hourly", "temperature_2m,weather_code");
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "1");

  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather service unavailable");
  return res.json();
}

function getPosition(options, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    const timer = setTimeout(() => reject(new Error("Geolocation timeout")), timeoutMs);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        resolve(pos);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
      options
    );
  });
}

async function fetchWithTimeout(url, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function resolveLocationFromNative() {
  if (window.MorningWeatherNative?.getLocationJson) {
    try {
      const raw = window.MorningWeatherNative.getLocationJson();
      if (raw && raw !== "null") {
        const parsed = JSON.parse(raw);
        if (parsed.lat && parsed.lon) {
          return { lat: parsed.lat, lon: parsed.lon, source: "native" };
        }
      }
    } catch {
      /* fall through */
    }
  }
  if (window.__nativeLoc?.lat && window.__nativeLoc?.lon) {
    return {
      lat: window.__nativeLoc.lat,
      lon: window.__nativeLoc.lon,
      source: "native",
    };
  }
  return null;
}

async function resolveLocationByIp() {
  const providers = [
    async () => {
      const res = await fetchWithTimeout("https://ipwho.is/");
      const json = await res.json();
      if (!json.success) throw new Error("ipwho failed");
      return {
        lat: json.latitude,
        lon: json.longitude,
        placeName: [json.city, json.region].filter(Boolean).join(", ") || "Near you",
      };
    },
    async () => {
      const res = await fetchWithTimeout("https://ipapi.co/json/");
      const json = await res.json();
      if (json.error) throw new Error("ipapi failed");
      return {
        lat: json.latitude,
        lon: json.longitude,
        placeName: [json.city, json.region].filter(Boolean).join(", ") || "Near you",
      };
    },
  ];

  for (const provider of providers) {
    try {
      const result = await provider();
      return { ...result, source: "ip" };
    } catch {
      /* try next */
    }
  }
  throw new Error("IP lookup failed");
}

async function resolveLocation() {
  setLoading("Finding where you are…");

  const native = await resolveLocationFromNative();
  if (native) return native;

  try {
    const pos = await getPosition({ enableHighAccuracy: true, maximumAge: 120000 }, 6000);
    return { lat: pos.coords.latitude, lon: pos.coords.longitude, source: "gps" };
  } catch {
    setLoading("Trying network location…");
  }

  try {
    const pos = await getPosition({ enableHighAccuracy: false, maximumAge: 600000 }, 5000);
    return { lat: pos.coords.latitude, lon: pos.coords.longitude, source: "network" };
  } catch {
    setLoading("Using your area from Wi‑Fi…");
  }

  return resolveLocationByIp();
}

async function initApp() {
  const watchdog = setTimeout(() => {
    if (!document.getElementById("main-content").classList.contains("hidden")) return;
    showError(
      "This is taking too long",
      "Check Wi‑Fi is on, then tap Try again. Location permission helps too."
    );
  }, 22000);

  try {
    const loc = await resolveLocation();
    setLoading("Checking today's weather…");
    const weather = await fetchWeather(loc.lat, loc.lon);
    const placeName =
      loc.placeName || (await reverseGeocode(loc.lat, loc.lon).catch(() => "Near you"));
    renderWeather(weather, placeName);
  } catch (err) {
    console.error(err);
    showError(
      "We couldn't find your weather",
      "Turn on Wi‑Fi and location, then tap Try again."
    );
  } finally {
    clearTimeout(watchdog);
  }
}

window.setNativeLocation = (lat, lon) => {
  window.__nativeLoc = { lat, lon };
  if (document.getElementById("main-content")?.classList.contains("hidden")) {
    initApp();
  }
};

function initAlexa() {
  if (typeof Alexa === "undefined") return;
  try {
    alexaClient = Alexa.create({ version: "1.1" });
    alexaClient.skill.onMessage((message) => {
      if (message?.type === "RefreshWeather") initApp();
    });
  } catch (err) {
    console.warn("Alexa client init failed", err);
  }
}

function loadAlexaScript() {
  return new Promise((resolve) => {
    if (typeof Alexa !== "undefined") {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = ALEXA_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadAlexaScript();
  await loadVoices();
  initAlexa();
  initApp();
});
