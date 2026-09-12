# SIH - PM-AJAY AI-Powered Beneficiary Skill & Entitlement Portal

A comprehensive, multilingual, voice-first platform empowering beneficiaries under the Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY) with NSQF-aligned course recommendations, DBT stipends, toolkits, and scheme entitlements.

---

## 🌐 Free Self-Hosted Multilingual Translation System (LibreTranslate)

### What is LibreTranslate?
[LibreTranslate](https://libretranslate.com/) is a completely free, open-source, self-hosted machine translation API powered by the Argos Translate neural machine translation engine. It does not depend on proprietary third-party translation providers (such as Google Cloud Translation or DeepL), requires no external API subscriptions, and runs completely within your own infrastructure.

### Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                       React Frontend                        │
│ (LanguageContext -> useTranslation() -> client-side cache)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ POST /api/v1/translate (JSON)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Python Backend                   │
│   (App Gateway: app/services/libretranslate.py on :8000)    │
│   - Validates language codes and request payload            │
│   - Keeps server config & endpoints private                 │
│   - Graceful timeout fallback (prevents UI failure)         │
└──────────────────────────────┬──────────────────────────────┘
                               │ Internal HTTP request
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              Self-Hosted LibreTranslate Service             │
│                    (Running on :5000)                       │
│    - Docker Container: libretranslate/libretranslate        │
│    - Offline Local AI Models (e.g. en <-> hi)               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart Guide

### 1. Start Self-Hosted LibreTranslate

#### Option A: Using Docker (Recommended)
You can launch LibreTranslate using the included Docker Compose configuration:
```bash
docker compose up libretranslate
```
Or run the official Docker container directly:
```bash
docker run -d -p 5000:5000 --name libretranslate libretranslate/libretranslate --load-only en,hi
```

#### Option B: Standalone Python (Local Installation)
If Docker Desktop is not running, install and run LibreTranslate with Python:
```bash
pip install libretranslate
libretranslate --port 5000 --load-only en,hi
```
Verify the service is live by visiting: `http://localhost:5000/`

---

### 2. Configure Environment Variables

Create or update your `backend/.env` file:
```env
# Backend Configuration
PORT=8000
HOST=0.0.0.0

# LibreTranslate Gateway URL (Default: http://localhost:5000)
LIBRETRANSLATE_URL=http://localhost:5000
LIBRETRANSLATE_API_KEY=
```
> **Security Note**: Never expose translation backend URLs or secret keys in the frontend (`VITE_*` or client-side JavaScript). The React app only communicates with your backend via `http://localhost:8000/api/v1/translate`.

---

### 3. Start the Backend Service

```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Test the translation endpoint:
```bash
curl -X POST http://localhost:8000/api/v1/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "Welcome to the application", "source": "en", "target": "hi"}'
```

---

### 4. Start the Frontend Application

```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173/`.

---

## 🔄 End-to-End Translation Flow

1. **User Selects Language**: Beneficiary clicks the language dropdown in the top header and chooses **हिन्दी (Hindi)**.
2. **Context & Persistence**: `LanguageContext` updates `selectedLang` and persists the choice to `localStorage` (`pmajay_selected_lang`).
3. **Multi-Tier Resolution**:
   - **Tier 1 (Instant Local Dictionary)**: Verified key-phrase dictionary resolves common UI terms instantaneously.
   - **Tier 2 (Client Cache)**: Previously translated dynamic strings cached in `localStorage` (`pmajay_translations_cache`) are returned without network latency.
   - **Tier 3 (Backend LibreTranslate Gateway)**: Asynchronously forwards text via `POST /api/v1/translate` to self-hosted LibreTranslate, caches the response, and re-renders smoothly.
   - **Tier 4 (Graceful Fallback)**: If LibreTranslate is offline or times out, the original English text is displayed without blank screens or console exceptions.

---

## ➕ How to Add Another Language

1. **Enable Language in LibreTranslate**:
   In `docker-compose.yml` or CLI, add the target ISO-639-1 language code (e.g. `bn`, `ta`, `te`):
   ```bash
   libretranslate --port 5000 --load-only en,hi,bn,te,ta
   ```

2. **Add to Frontend Supported Languages**:
   In `frontend/src/data/mockProfiles.js`:
   ```javascript
   export const SUPPORTED_LANGUAGES = [
     { code: "hi", name: "हिन्दी", short: "HI" },
     { code: "en", name: "English", short: "EN" },
     { code: "bn", name: "বাংলা", short: "BN" },
     { code: "te", name: "తెలుగు", short: "TE" },
     // Add new language here
   ];
   ```

3. **(Optional) Add Static Dictionary Keys**:
   In `frontend/src/utils/translations.js`, add pre-configured translations for common nav/sidebar/button terms to ensure zero network lag.

---

## ⚠️ Limitations of LibreTranslate for Indian Languages

1. **Grammar & Technical Terminology**: As an open-source neural machine translation engine, LibreTranslate excels with general sentences and conversational phrases. Domain-specific government acronyms (e.g. *NSQF, DBT, PM-AJAY, QP-NOS*) are best handled through the hybrid dictionary fallback system configured in this project.
2. **Low-Resource Indic Models**: While Hindi (`hi`), Bengali (`bn`), and Tamil (`ta`) models perform well, smaller regional dialects may require larger training corpora or pre-warmed models.
3. **Initial Model Download**: Upon first run, LibreTranslate automatically downloads model weights (~100–300 MB per language pair) to local storage.