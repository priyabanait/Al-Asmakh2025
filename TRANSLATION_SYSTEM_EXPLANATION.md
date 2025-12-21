# 🔄 Bilingual Translation System - How It Works

## 📋 Overview

Your website uses a **client-side dynamic translation system** that:

1. Detects all visible text on the page
2. Sends it to Google Translate API
3. Replaces the text with Arabic translations
4. Switches layout to RTL (Right-to-Left)
5. Remembers the user's choice

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────┐
│           USER BROWSER (Client-Side)           │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │   TranslationContext.js (React Context)  │  │
│  │   - Manages language state               │  │
│  │   - Handles translation logic            │  │
│  │   - Stores translations in cache         │  │
│  └──────────────────────────────────────────┘  │
│              │                                   │
│              │ Detects text nodes                │
│              │                                   │
│  ┌──────────────────────────────────────────┐  │
│  │   translatePage() Function               │  │
│  │   - Scans DOM for text                   │  │
│  │   - Groups text into batches             │  │
│  │   - Calls translateText() for each       │  │
│  └──────────────────────────────────────────┘  │
│              │                                   │
│              │ POST Request                      │
│              ▼                                   │
└─────────────────────────────────────────────────┘
                    │
                    │ HTTP POST
                    │ { text: "Hello", target: "ar" }
                    ▼
┌─────────────────────────────────────────────────┐
│      NEXT.JS API ROUTE (/api/translate)        │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │   route.js (Server-Side API)             │  │
│  │   - Receives text and target language    │  │
│  │   - Calls Google Translate API            │  │
│  │   - Returns translated text               │  │
│  └──────────────────────────────────────────┘  │
│              │                                   │
│              │ HTTPS Request                     │
│              ▼                                   │
└─────────────────────────────────────────────────┘
                    │
                    │ API Key + Text
                    ▼
┌─────────────────────────────────────────────────┐
│        GOOGLE TRANSLATE API                     │
│   translation.googleapis.com/language/...      │
│                                                 │
│  Returns: { translatedText: "مرحبا" }         │
└─────────────────────────────────────────────────┘
```

---

## 🔄 Step-by-Step Translation Flow

### **STEP 1: User Clicks Language Toggle Button**

```javascript
// In Header.js or DashboardHeader.js
<button onClick={() => switchLanguage("ar")}>AR</button>
```

**What happens:**

- `switchLanguage('ar')` is called
- Language state changes from `'en'` to `'ar'`
- localStorage is updated: `preferred-language = 'ar'`
- Document direction changes: `dir="rtl"`
- Arabic font class is added

---

### **STEP 2: Auto-Translation Trigger**

```javascript
// In TranslationContext.js
useEffect(() => {
  if (language === "ar" && typeof window !== "undefined") {
    setTimeout(() => {
      translatePage(); // ← Automatically called
    }, 500);
  }
}, [language]);
```

**What happens:**

- Detects language change to Arabic
- Waits 500ms for DOM to be ready
- Calls `translatePage()` function

---

### **STEP 3: Scan DOM for Text Content**

```javascript
const translatePage = async () => {
  // Get ALL elements on the page (except scripts/styles)
  const elements = document.querySelectorAll(
    "body *:not(script):not(style):not(noscript)"
  );

  // Process in batches of 10 elements
  for (let i = 0; i < elements.length; i += batchSize) {
    const batch = Array.from(elements).slice(i, i + batchSize);
    await Promise.all(
      batch.map((element) => translateElement(element, originalTexts))
    );
  }
};
```

**What happens:**

- Finds all HTML elements on the page
- Excludes `<script>`, `<style>`, `<noscript>` tags
- Groups elements into batches of 10 (for performance)
- Processes each batch in parallel

---

### **STEP 4: Extract Text from Each Element**

```javascript
const translateElement = async (element, originalTexts) => {
  // Use TreeWalker to find all text nodes
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode: function (node) {
      if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
      if (parent.tagName === "SCRIPT" || parent.tagName === "STYLE") {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  // Collect all text nodes
  let textNodes = [];
  while ((node = walker.nextNode())) {
    textNodes.push(node);
  }
};
```

**Example:**

```html
<!-- Original HTML -->
<h1>Welcome to Al-Asmakh</h1>
<p>This is a description text.</p>

<!-- Text nodes found: -->
1. "Welcome to Al-Asmakh" 2. "This is a description text."
```

---

### **STEP 5: Store Original Text (for English restore)**

```javascript
// Store original text before translating
if (language === "en" && !originalTexts.has(element)) {
  const texts = textNodes.map((node) => node.textContent);
  originalTexts.set(element, texts);
  // originalTexts = Map {
  //   <h1> => ["Welcome to Al-Asmakh"],
  //   <p> => ["This is a description text."]
  // }
}
```

**Why?** To restore English text when user switches back to EN.

---

### **STEP 6: Translate Each Text Piece**

```javascript
if (language === "ar") {
  for (let i = 0; i < textNodes.length; i++) {
    const node = textNodes[i];
    const originalText = node.textContent.trim(); // "Welcome to Al-Asmakh"

    // Call translateText function
    const translatedText = await translateText(originalText, "ar");
    // translatedText = "مرحباً بك في الأسماخ"

    // Replace the text node content
    node.textContent = translatedText;
  }
}
```

---

### **STEP 7: Check Translation Cache First**

```javascript
const translateText = async (text, targetLang = "ar") => {
  // Create unique cache key
  const cacheKey = `${text}_${targetLang}`; // "Welcome to Al-Asmakh_ar"

  // Check if already translated
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey]; // Return cached translation (INSTANT!)
  }

  // If not cached, call API...
};
```

**Performance Benefit:**

- First time: "Welcome" → API call → "مرحبا" (cached)
- Second time: "Welcome" → Returns from cache (instant, no API call!)

---

### **STEP 8: Call Google Translate API**

```javascript
// Send POST request to your Next.js API route
const response = await fetch("/api/translate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    text: "Welcome to Al-Asmakh",
    target: "ar",
  }),
});

const data = await response.json();
// Returns: { translatedText: "مرحباً بك في الأسماخ" }
```

---

### **STEP 9: Server-Side API Route Processes Request**

```javascript
// In /api/translate/route.js
export async function POST(request) {
  const { text, target } = await request.json();

  // Call Google Translate API
  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
    {
      method: "POST",
      body: JSON.stringify({
        q: text, // "Welcome to Al-Asmakh"
        target: target, // "ar"
        format: "text",
      }),
    }
  );

  const data = await response.json();
  // Google returns: { data: { translations: [{ translatedText: "مرحباً..." }] } }

  return NextResponse.json({
    translatedText: data.data.translations[0].translatedText,
  });
}
```

---

### **STEP 10: Update DOM with Translated Text**

```javascript
// Back in translateElement function
const translatedText = await translateText(originalText, "ar");
node.textContent = translatedText; // DOM is updated instantly!
```

**Result:**

```html
<!-- Before -->
<h1>Welcome to Al-Asmakh</h1>

<!-- After -->
<h1>مرحباً بك في الأسماخ</h1>
```

---

## 💾 localStorage Persistence

### **When User Selects Language:**

```javascript
useEffect(() => {
  localStorage.setItem("preferred-language", language); // Save to browser storage
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
}, [language]);
```

### **On Page Load/Refresh:**

```javascript
useEffect(() => {
  const savedLanguage = localStorage.getItem("preferred-language");
  if (savedLanguage === "ar") {
    setLanguage("ar"); // Restore saved language
    // ... apply RTL, fonts, etc.
    setTimeout(() => translatePage(), 500); // Auto-translate!
  }
}, []);
```

**Flow:**

1. User clicks AR → Saved to localStorage
2. User refreshes page → Loads 'ar' from localStorage
3. Automatically applies Arabic settings
4. Auto-translates all content

---

## 🎨 RTL Layout Changes

### **When Arabic is Selected:**

```javascript
document.documentElement.dir = "rtl"; // Changes entire page direction
document.documentElement.lang = "ar";
document.documentElement.classList.add("arabic-font");
```

### **CSS Automatically Adjusts:**

```css
/* RTL specific styles */
[dir="rtl"] {
  text-align: right;
}

[dir="rtl"] .flex {
  flex-direction: row-reverse; /* Flips horizontal layout */
}

[dir="rtl"] .ml-4 {
  margin-left: 0;
  margin-right: 1rem; /* Swaps left/right margins */
}
```

**Result:**

- All text aligns to the right
- Flexbox layouts flip horizontally
- Margins and padding swap sides
- Navigation menus reverse order

---

## 🚀 Performance Optimizations

### **1. Translation Caching**

- Once "Hello" is translated to "مرحبا", it's cached
- Next time it appears on the page → Instant (no API call)
- Cache persists during the session

### **2. Batch Processing**

- Processes 10 elements at a time
- Prevents UI freezing
- Small 10ms delay between batches for responsiveness

### **3. Parallel Translation**

```javascript
await Promise.all(
  batch.map((element) => translateElement(element, originalTexts))
);
```

- All 10 elements translate simultaneously
- Much faster than one-by-one

---

## 📊 Complete Translation Flow Diagram

```
User Clicks "AR" Button
         │
         ▼
switchLanguage('ar')
         │
         ▼
Save to localStorage: 'ar'
         │
         ▼
Update document.dir = 'rtl'
Update document.lang = 'ar'
Add 'arabic-font' class
         │
         ▼
useEffect detects language = 'ar'
         │
         ▼
translatePage() called
         │
         ▼
Scan all DOM elements
         │
         ▼
Extract text nodes from each element
         │
         ▼
Store original text (for EN restore)
         │
         ▼
For each text piece:
    Check cache → If found: Return cached
                  If not: Call API → Cache result
         │
         ▼
Replace DOM node textContent
         │
         ▼
All text translated ✓
RTL layout applied ✓
Arabic font applied ✓
```

---

## 🔑 Key Components Summary

| Component              | Purpose                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| **TranslationContext** | Manages language state, translation logic, caching               |
| **translatePage()**    | Scans DOM, finds all text, translates each piece                 |
| **translateElement()** | Extracts text from one HTML element                              |
| **translateText()**    | Checks cache, calls API if needed                                |
| **/api/translate**     | Server-side API route that calls Google Translate                |
| **localStorage**       | Persists user's language preference                              |
| **useEffect hooks**    | Auto-apply settings on load, auto-translate when Arabic selected |

---

## ✅ Final Result

**User Experience:**

1. ✅ Clicks AR → Page immediately switches to RTL
2. ✅ All text starts translating (with loading indicator)
3. ✅ Arabic font is applied
4. ✅ Language preference saved
5. ✅ Refreshing page maintains Arabic
6. ✅ Navigating to other pages keeps Arabic
7. ✅ Clicking EN → Restores original English text instantly

**Technical Achievement:**

- Client-side dynamic translation (no page reload needed)
- Works on static Next.js pages
- Handles all routes (home, dashboard, partner-dashboard)
- Performance optimized with caching and batching
- Proper RTL layout with CSS adjustments
