# My Morning Weather

Kid-friendly daily weather and **what to wear** guide for your daughter's **Amazon Fire HD 10 Kids** tablet.

She says **"Alexa, open My Morning Weather"** and a full-screen visual app opens: auto-detects location (home or travel), shows today's vibe in plain language, clothing pictures, and a **morning → night** timeline.

## What Gemini got right (and the one caveat)

| Goal | How it works |
|------|----------------|
| Voice trigger | Custom Alexa skill — **not** hijacking built-in "Alexa, what's the weather?" |
| Full-screen on tablet | [Alexa Web API for Games](https://developer.amazon.com/en-US/docs/alexa/alexa-web-api-for-games/what-is-the-alexa-web-api-for-games.html) opens your hosted HTTPS page |
| Auto location | Browser `navigator.geolocation` inside Amazon's web viewport |
| Kid visuals | This repo — bold UI, outfit icons, day timeline |
| "Real app" feel | Full-screen Alexa experience; optional home-screen shortcut (below) |

Amazon does **not** let third-party apps replace the default weather answer. Your skill name is the magic phrase: **"Alexa, open My Morning Weather"**.

## Quick local preview (PC browser)

```powershell
cd C:\Users\cyber\ai-tools-tracker\morning-weather
npm start
```

Open http://127.0.0.1:8794/ — allow location when prompted. Tap **Hear it** to test spoken summary (browser TTS; on Fire tablet Alexa reads aloud).

## Deploy the visual app (required for Alexa)

Alexa needs a public **HTTPS** URL. Easiest options:

### Option A — GitHub Pages

1. Create a repo (e.g. `morning-weather`).
2. Copy contents of `public/` to the repo root (or enable Pages from `/docs`).
3. Settings → Pages → deploy from `main`.
4. URL becomes `https://YOUR-USERNAME.github.io/morning-weather/`

### Option B — Vercel / Netlify

Drag the `public/` folder into a new project; use the assigned `https://…` URL.

## Create the Alexa skill

1. [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask) → **Create Skill**.
2. Name: **My Morning Weather** · Model: **Custom** · Hosting: **Alexa-hosted** (easiest).
3. **Build** → **Interfaces** → enable **Alexa Web API for Games**.
4. **Build** → **Invocation** → invocation name: `my morning weather`.
5. **Build** → **Intents** — add samples from `alexa-skill/interaction-model.json` (or import JSON if your console supports it).
6. **Code** → replace default `index.js` with `alexa-skill/index.js`.
7. Set `WEB_APP_URL` at the top of that file to your deployed HTTPS URL (must end with `/` or full path to `index.html`).
8. **Deploy** → **Development** mode.
9. On the Fire tablet: Alexa app → **Skills & Games** → **Your Skills** → **Dev** → enable **My Morning Weather** for that device/account.

Test: **"Alexa, open My Morning Weather"**

## Link skill to your daughter's Kids profile

On Fire Kids, the skill must be enabled for the child profile (or the whole household, depending on your Amazon Kids settings). In the Alexa app:

- **Devices** → select the Fire HD 10 → **Amazon Kids** / content settings  
- Allow **skills you enable in Dev** (or publish to the store later for simpler kid access)

## Weather logic (kid labels)

| Conditions | Label | Outfit hints |
|------------|-------|----------------|
| Clear & > 78°F | Sunny & Hot! | T-shirt, shorts, sunglasses, hat |
| Clear & 60–77°F | Sunny but Fresh | Light long sleeve, jeans |
| Cloudy & ≥ 68°F | Cloudy but Warm | Comfy shirt, leggings |
| Cloudy & < 68°F | Cloudy & Chilly | Sweater, warm pants |
| Rain / drizzle | Rainy Day! | Raincoat, boots, umbrella |
| Snow | Snowy Day! | Coat, scarf, gloves, snow boots |
| Thunderstorm | Stormy Day! | Rain gear + stay inside if you can |

Data: [Open-Meteo](https://open-meteo.com/) (free, no API key).

## Optional: icon on Fire home screen

The Alexa path is the main experience. For a tap-without-Alexa shortcut, sideload a simple WebView APK that loads the same HTTPS URL — same UI, no voice trigger. Say if you want that added as `android-app/` in this folder.

## Files

```
morning-weather/
  public/           ← host this folder on HTTPS
    index.html
    app.js
    styles.css
  alexa-skill/      ← paste into Developer Console
    index.js
    interaction-model.json
  server.mjs        ← local dev only
  package.json
```

## Troubleshooting

- **Blank screen on tablet** — URL must be HTTPS; check Developer Console skill logs.
- **Location fails** — Fire Settings → Location on; re-open skill; at home Wi‑Fi helps first fix.
- **Skill not found** — Confirm Dev skill enabled on the same Amazon account as the tablet.
- **Geolocation in browser works but not on Fire** — Normal for Alexa viewport; ensure Kids profile allows location for Alexa/device.
