"use strict";

const DATA_URL = "data/real-cafes.json";
const SAVED_KEY = "letseat.savedPlaces.v1";
const SINGAPORE_CENTER = { latitude: 1.2897, longitude: 103.8501 };

const fallbackCafes = [
  {
    id: "kampong-kopi",
    name: "Kampong Kopi Bar",
    categories: ["Cafe", "Coffee"],
    price_level: "$$",
    rating: 4.6,
    review_count: 841,
    distance_km: 0.7,
    opening_status: "Open now",
    area: "Tanjong Pagar, Singapore",
    address: "12 Keong Saik Road, Singapore",
    latitude: 1.2807,
    longitude: 103.8426,
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=Kampong%20Kopi%20Bar%20Singapore",
    google_reviews_url: "https://www.google.com/maps/search/Kampong%20Kopi%20Bar%20reviews%20Singapore",
    menu: {
      id: "menu-kampong-kopi",
      source_type: "manual",
      source_label: "Latest manual menu",
      captured_at: "2026-04-21",
      image_urls: [],
      items: [
        { name: "Iced Matcha Latte", description: "Ceremonial matcha, oat milk option, vanilla syrup", category: "Drinks", price: "S$7.50", confidence: 0.96, aliases: ["matcha", "green tea latte", "iced matcha"] },
        { name: "Kopi Cold Brew", description: "Slow steeped local coffee with gula melaka", category: "Drinks", price: "S$6.80", confidence: 0.93, aliases: ["cold brew", "kopi"] },
        { name: "Banana Walnut Bread", description: "Toasted slice with salted butter", category: "Pastries", price: "S$5.50", confidence: 0.91, aliases: ["banana bread", "banana loaf"] },
        { name: "Laksa Scrambled Eggs", description: "Soft eggs, sourdough, laksa leaf oil", category: "Brunch", price: "S$17.00", confidence: 0.88, aliases: ["scrambled eggs", "eggs"] }
      ]
    }
  },
  {
    id: "morning-fold",
    name: "Morning Fold",
    categories: ["Cafe", "Bakery"],
    price_level: "$$",
    rating: 4.8,
    review_count: 312,
    distance_km: 1.4,
    opening_status: "Open now",
    area: "Bugis, Singapore",
    address: "31 Seah Street, Singapore",
    latitude: 1.2965,
    longitude: 103.8547,
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=Morning%20Fold%20Cafe%20Singapore",
    google_reviews_url: "https://www.google.com/maps/search/Morning%20Fold%20Cafe%20reviews%20Singapore",
    menu: {
      id: "menu-morning-fold",
      source_type: "user_upload",
      source_label: "Latest user menu photo",
      captured_at: "2026-04-17",
      image_urls: [],
      items: [
        { name: "Black Sesame Banana Bread", description: "House loaf, sesame crumble, espresso mascarpone", category: "Bakes", price: "S$6.80", confidence: 0.94, aliases: ["banana bread", "black sesame cake"] },
        { name: "Strawberry Matcha Cloud", description: "Iced matcha, strawberry compote, sea salt foam", category: "Drinks", price: "S$8.20", confidence: 0.9, aliases: ["iced matcha", "matcha latte", "strawberry matcha"] },
        { name: "Mushroom Croissant Toast", description: "Creamed mushrooms, gruyere, chives", category: "Brunch", price: "S$18.50", confidence: 0.87, aliases: ["croissant", "mushroom toast"] },
        { name: "Lemon Poppyseed Cake", description: "Citrus glaze and creme fraiche", category: "Bakes", price: "S$7.00", confidence: 0.92, aliases: ["cake", "lemon cake"] }
      ]
    }
  },
  {
    id: "paper-planes",
    name: "Paper Planes Coffee",
    categories: ["Cafe", "Dessert"],
    price_level: "$$",
    rating: 4.4,
    review_count: 1190,
    distance_km: 0.4,
    opening_status: "Busy",
    area: "Chinatown, Singapore",
    address: "7 Smith Street, Singapore",
    latitude: 1.2838,
    longitude: 103.8439,
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=Paper%20Planes%20Coffee%20Singapore",
    google_reviews_url: "https://www.google.com/maps/search/Paper%20Planes%20Coffee%20reviews%20Singapore",
    menu: {
      id: "menu-paper-planes",
      source_type: "restaurant_website",
      source_label: "Latest website menu",
      captured_at: "2026-04-09",
      image_urls: [],
      items: [
        { name: "Classic Tiramisu Cup", description: "Espresso-soaked ladyfingers, mascarpone, cocoa", category: "Desserts", price: "S$9.50", confidence: 0.95, aliases: ["tiramisu", "cake"] },
        { name: "Espresso Tonic", description: "Double shot over tonic and orange peel", category: "Coffee", price: "S$7.50", confidence: 0.92, aliases: ["coffee", "espresso"] },
        { name: "Iced Hojicha Latte", description: "Roasted green tea and fresh milk", category: "Tea", price: "S$7.80", confidence: 0.9, aliases: ["hojicha", "tea latte"] },
        { name: "Burnt Cheesecake", description: "Creamy center with sea salt", category: "Desserts", price: "S$8.70", confidence: 0.91, aliases: ["cheesecake", "cake"] }
      ]
    }
  },
  {
    id: "olive-window",
    name: "Olive Window Cafe",
    categories: ["Cafe", "Brunch"],
    price_level: "$$$",
    rating: 4.7,
    review_count: 504,
    distance_km: 2.1,
    opening_status: "Open now",
    area: "River Valley, Singapore",
    address: "46 Kim Yam Road, Singapore",
    latitude: 1.2951,
    longitude: 103.8392,
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=Olive%20Window%20Cafe%20Singapore",
    google_reviews_url: "https://www.google.com/maps/search/Olive%20Window%20Cafe%20reviews%20Singapore",
    menu: {
      id: "menu-olive-window",
      source_type: "partner",
      source_label: "Latest partner menu",
      captured_at: "2026-04-28",
      image_urls: [],
      items: [
        { name: "Green Shakshuka", description: "Spinach, herbs, eggs, feta, grilled sourdough", category: "Brunch", price: "S$19.00", confidence: 0.97, aliases: ["shakshuka", "eggs"] },
        { name: "Ricotta Hotcakes", description: "Berry compote, whipped maple butter", category: "Brunch", price: "S$18.00", confidence: 0.93, aliases: ["pancakes", "hotcakes"] },
        { name: "Iced Long Black", description: "Seasonal espresso over ice", category: "Coffee", price: "S$6.50", confidence: 0.89, aliases: ["coffee", "iced coffee"] },
        { name: "Tomato Burrata Toast", description: "Basil oil, cracked pepper, sourdough", category: "Brunch", price: "S$17.50", confidence: 0.88, aliases: ["toast", "burrata"] }
      ]
    }
  },
  {
    id: "little-grain",
    name: "Little Grain",
    categories: ["Cafe", "Gluten-free"],
    price_level: "$$",
    rating: 4.5,
    review_count: 226,
    distance_km: 1.1,
    opening_status: "Closes soon",
    area: "Outram, Singapore",
    address: "88 Neil Road, Singapore",
    latitude: 1.2799,
    longitude: 103.8401,
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=Little%20Grain%20Cafe%20Singapore",
    google_reviews_url: "https://www.google.com/maps/search/Little%20Grain%20Cafe%20reviews%20Singapore",
    menu: {
      id: "menu-little-grain",
      source_type: "manual",
      source_label: "Latest manual menu",
      captured_at: "2026-04-12",
      image_urls: [],
      items: [
        { name: "Gluten Free Chocolate Cake", description: "Almond meal sponge and dark chocolate ganache", category: "Desserts", price: "S$8.50", confidence: 0.96, aliases: ["gluten free cake", "chocolate cake", "cake"] },
        { name: "Avocado Egg Toast", description: "Seeded toast, jammy egg, chili crunch", category: "Brunch", price: "S$15.00", confidence: 0.91, aliases: ["avocado toast", "eggs"] },
        { name: "Oat Milk Latte", description: "House espresso with oat milk", category: "Coffee", price: "S$7.00", confidence: 0.93, aliases: ["latte", "coffee"] },
        { name: "Blueberry Cornmeal Muffin", description: "Gluten free, baked daily", category: "Bakes", price: "S$5.80", confidence: 0.9, aliases: ["muffin", "gluten free"] }
      ]
    }
  },
  {
    id: "twelve-tables",
    name: "Twelve Tables",
    categories: ["Cafe", "All-day"],
    price_level: "$$",
    rating: 4.2,
    review_count: 1628,
    distance_km: 2.6,
    opening_status: "Open now",
    area: "Orchard, Singapore",
    address: "19 Penang Road, Singapore",
    latitude: 1.2994,
    longitude: 103.8454,
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=Twelve%20Tables%20Cafe%20Singapore",
    google_reviews_url: "https://www.google.com/maps/search/Twelve%20Tables%20Cafe%20reviews%20Singapore",
    menu: {
      id: "menu-twelve-tables",
      source_type: "approved_api",
      source_label: "Latest approved source",
      captured_at: "2026-04-15",
      image_urls: [],
      items: [
        { name: "Chicken Carbonara", description: "Cream sauce, parmesan, smoked chicken, fettuccine", category: "Mains", price: "S$18.00", confidence: 0.9, aliases: ["carbonara", "pasta"] },
        { name: "Tiramisu Pancakes", description: "Espresso cream, cocoa, maple syrup", category: "Desserts", price: "S$16.00", confidence: 0.89, aliases: ["tiramisu", "pancakes"] },
        { name: "Flat White", description: "Double ristretto and steamed milk", category: "Coffee", price: "S$6.00", confidence: 0.95, aliases: ["coffee", "latte"] },
        { name: "Truffle Fries", description: "Parmesan, parsley, truffle oil", category: "Sides", price: "S$12.00", confidence: 0.92, aliases: ["fries"] }
      ]
    }
  }
];

const state = {
  cafes: [],
  query: "iced matcha",
  sort: "relevance",
  view: "list",
  savedOnly: false,
  selectedId: null,
  userLocation: null,
  installPrompt: null
};

const els = {
  searchForm: document.querySelector("#searchForm"),
  searchInput: document.querySelector("#searchInput"),
  quickSearches: document.querySelector(".quick-searches"),
  resultCount: document.querySelector("#resultCount"),
  resultsTitle: document.querySelector("#resultsTitle"),
  resultsList: document.querySelector("#resultsList"),
  emptyState: document.querySelector("#emptyState"),
  clearButton: document.querySelector("#clearButton"),
  savedOnlyToggle: document.querySelector("#savedOnlyToggle"),
  sortButtons: Array.from(document.querySelectorAll("[data-sort]")),
  viewButtons: Array.from(document.querySelectorAll("[data-view]")),
  mapView: document.querySelector("#mapView"),
  mapCanvas: document.querySelector("#mapCanvas"),
  detailPane: document.querySelector("#detailPane"),
  detailPlaceholder: document.querySelector("#detailPlaceholder"),
  placeDetail: document.querySelector("#placeDetail"),
  resultCardTemplate: document.querySelector("#resultCardTemplate"),
  installButton: document.querySelector("#installButton"),
  locationButton: document.querySelector("#locationButton")
};

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function simpleSingular(value) {
  return normalizeText(value)
    .split(" ")
    .map((word) => word.length > 3 && word.endsWith("s") ? word.slice(0, -1) : word)
    .join(" ");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function highlight(value, query) {
  const safe = escapeHtml(value);
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return safe;
  const firstToken = normalizedQuery.split(" ")[0];
  if (!firstToken) return safe;
  const pattern = new RegExp(`(${firstToken.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
  return safe.replace(pattern, "<mark>$1</mark>");
}

function formatDate(dateString) {
  if (!dateString) return "Unknown date";
  const date = new Date(dateString.includes("T") ? dateString : `${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatPrice(value) {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "number") return `S$${value.toFixed(value % 1 ? 2 : 0)}`;
  return value;
}

function formatPriceLevel(value) {
  if (typeof value === "number") return "$".repeat(Math.max(1, Math.min(4, value)));
  return value || "$$";
}

function getSaved() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || "{}");
  } catch {
    return {};
  }
}

function setSaved(saved) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
}

function isSaved(placeId) {
  return Boolean(getSaved()[placeId]);
}

function toggleSaved(placeId, query) {
  const saved = getSaved();
  if (saved[placeId]) {
    delete saved[placeId];
  } else {
    saved[placeId] = {
      place_id: placeId,
      food_query: query || "",
      created_at: new Date().toISOString()
    };
  }
  setSaved(saved);
}

function bestMenuMatch(place, query) {
  const normalizedQuery = simpleSingular(query);
  const queryTokens = normalizedQuery.split(" ").filter(Boolean);

  if (!normalizedQuery) {
    const first = place.menu.items[0];
    return {
      item: first,
      score: 1,
      confidenceLabel: "Browse",
      reason: "Latest menu item",
      evidence: place.menu.source_label
    };
  }

  let best = null;
  for (const item of place.menu.items) {
    const aliases = Array.isArray(item.aliases) ? item.aliases : [];
    const searchableValues = [item.name, item.description, item.category, ...aliases];
    const normalizedName = simpleSingular(item.name);
    const normalizedAliases = aliases.map(simpleSingular);
    const haystack = simpleSingular(searchableValues.join(" "));
    let score = 0;
    let reason = "Weak menu match";

    if (normalizedName === normalizedQuery) {
      score = 100;
      reason = "Exact menu item match";
    } else if (normalizedAliases.includes(normalizedQuery)) {
      score = 92;
      reason = "Exact alias match";
    } else if (normalizedName.startsWith(normalizedQuery)) {
      score = 84;
      reason = "Prefix menu item match";
    } else if (queryTokens.length && queryTokens.every((token) => haystack.split(" ").includes(token))) {
      score = 76;
      reason = "Token menu match";
    } else if (haystack.includes(normalizedQuery)) {
      score = 68;
      reason = "Partial menu match";
    } else {
      const overlap = queryTokens.filter((token) => token.length > 2 && haystack.includes(token)).length;
      if (overlap) {
        score = 38 + overlap * 6;
        reason = "Related menu text";
      }
    }

    if (score > 0) {
      score += Math.round((item.confidence || 0.75) * 8);
      if (!best || score > best.score) {
        best = {
          item,
          score,
          confidenceLabel: score >= 84 ? "High" : score >= 58 ? "Medium" : "Low",
          reason,
          evidence: place.menu.source_label
        };
      }
    }
  }

  return best;
}

function reviewQuality(place) {
  const ratingScore = Math.max(0, Math.min(1, Number(place.rating || 0) / 5));
  const reviewScore = Math.max(0, Math.min(1, Math.log10(Number(place.review_count || 0) + 1) / 4));
  return ratingScore * 0.7 + reviewScore * 0.3;
}

function distanceFor(place) {
  if (!state.userLocation || typeof place.latitude !== "number" || typeof place.longitude !== "number") {
    return Number(place.distance_km || 999);
  }
  return haversineKm(state.userLocation.latitude, state.userLocation.longitude, place.latitude, place.longitude);
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const radius = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getResultRows() {
  const saved = getSaved();
  const rows = state.cafes
    .map((place) => ({
      place,
      match: bestMenuMatch(place, state.query),
      distance: distanceFor(place),
      quality: reviewQuality(place)
    }))
    .filter((row) => row.match)
    .filter((row) => !state.savedOnly || saved[row.place.id]);

  rows.sort((a, b) => {
    if (state.sort === "reviews") {
      return b.quality - a.quality || b.match.score - a.match.score || a.distance - b.distance;
    }
    if (state.sort === "distance") {
      return a.distance - b.distance || b.match.score - a.match.score || b.quality - a.quality;
    }
    return b.match.score - a.match.score || b.quality - a.quality || a.distance - b.distance;
  });

  return rows;
}

function sourceLabel(sourceType) {
  const labels = {
    user_upload: "User photo",
    approved_api: "Approved source",
    restaurant_website: "Website menu",
    partner: "Partner menu",
    manual: "Manual menu",
    admin: "Admin menu"
  };
  return labels[sourceType] || "Latest menu";
}

function normalizeCafeData(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.cafes)) return data.cafes;
  if (!Array.isArray(data?.places)) return fallbackCafes;

  const foodTermsById = new Map((data.food_terms || []).map((term) => [term.id, term]));
  const evidenceByItemId = new Map();

  for (const evidence of data.food_place_evidence || []) {
    if (!evidence.menu_item_id) continue;
    const term = foodTermsById.get(evidence.food_term_id);
    if (!term) continue;
    const aliases = evidenceByItemId.get(evidence.menu_item_id) || new Set();
    aliases.add(term.canonical_name);
    for (const alias of term.aliases || []) aliases.add(alias);
    evidenceByItemId.set(evidence.menu_item_id, aliases);
  }

  return data.places.map((place) => {
    const latestMenu = place.latest_menu || place.menu || { items: [] };
    return {
      id: place.id,
      name: place.name,
      categories: (place.categories || ["Cafe"]).map((category) => category.replace(/\b\w/g, (char) => char.toUpperCase())),
      price_level: formatPriceLevel(place.price_level),
      rating: Number(place.rating || 0),
      review_count: Number(place.review_count || 0),
      distance_km: haversineKm(SINGAPORE_CENTER.latitude, SINGAPORE_CENTER.longitude, place.latitude, place.longitude),
      opening_status: "Hours listed",
      area: `${place.neighborhood || "Singapore"}, Singapore`,
      address: place.address,
      latitude: Number(place.latitude),
      longitude: Number(place.longitude),
      google_maps_url: place.google_maps_url,
      google_reviews_url: place.google_reviews_url,
      primary_photo_url: place.primary_photo_url,
      menu: {
        id: latestMenu.id,
        source_type: latestMenu.source_type || "manual",
        source_label: `${sourceLabel(latestMenu.source_type || "manual")}`,
        captured_at: latestMenu.captured_at,
        image_urls: (latestMenu.images || []).map((image) => image.image_url),
        items: (latestMenu.items || []).map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          category: item.category || "Menu",
          price: formatPrice(item.price),
          confidence: Number(item.extraction_confidence || item.ocr_confidence || 0.75),
          aliases: Array.from(evidenceByItemId.get(item.id) || [])
        }))
      }
    };
  });
}

function render() {
  const rows = getResultRows();
  if (!state.selectedId || !rows.some((row) => row.place.id === state.selectedId)) {
    state.selectedId = rows[0]?.place.id || null;
  }

  const queryText = state.query ? `"${state.query}"` : "all latest menus";
  els.resultCount.textContent = `${rows.length} Singapore ${rows.length === 1 ? "place" : "places"} found`;
  els.resultsTitle.textContent = state.savedOnly ? `Saved Singapore matches for ${queryText}` : `Singapore matches for ${queryText}`;
  els.emptyState.hidden = rows.length > 0;

  renderResultList(rows);
  renderMap(rows);
  renderDetail(rows);

  els.resultsList.hidden = state.view !== "list";
  els.mapView.hidden = state.view !== "map";
  els.sortButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.sort === state.sort)));
  els.viewButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.view === state.view)));
  els.savedOnlyToggle.checked = state.savedOnly;
}

function renderResultList(rows) {
  els.resultsList.replaceChildren();
  const fragment = document.createDocumentFragment();

  rows.forEach((row, index) => {
    const card = els.resultCardTemplate.content.firstElementChild.cloneNode(true);
    card.classList.toggle("is-selected", row.place.id === state.selectedId);
    card.querySelector(".photo-tile").dataset.accent = ["teal", "mustard", "blue", "tomato"][index % 4];
    card.querySelector(".place-name").textContent = row.place.name;
    card.querySelector(".confidence-pill").textContent = row.match.confidenceLabel;
    card.querySelector(".place-meta").textContent = `${row.place.rating.toFixed(1)} (${row.place.review_count.toLocaleString()} reviews) - ${row.distance.toFixed(1)} km - ${row.place.area}`;
    card.querySelector(".match-line").textContent = row.match.item ? row.match.item.name : "Latest menu";
    card.querySelector(".evidence-line").textContent = `${row.match.reason} - ${row.match.evidence} - ${formatDate(row.place.menu.captured_at)}`;

    const saveButton = card.querySelector(".save-action");
    saveButton.textContent = isSaved(row.place.id) ? "Saved" : "Save";
    saveButton.classList.toggle("is-saved", isSaved(row.place.id));
    saveButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleSaved(row.place.id, state.query);
      render();
    });

    const mapsLink = card.querySelector(".maps-action");
    mapsLink.href = row.place.google_maps_url || mapsSearchUrl(row.place);
    mapsLink.setAttribute("aria-label", `Open ${row.place.name} in Google Maps`);

    const reviewsLink = card.querySelector(".reviews-action");
    reviewsLink.href = row.place.google_reviews_url || `${mapsSearchUrl(row.place)}%20reviews`;
    reviewsLink.setAttribute("aria-label", `Open ${row.place.name} Google Maps reviews`);

    card.querySelector(".card-main").addEventListener("click", () => {
      state.selectedId = row.place.id;
      render();
      els.detailPane.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    fragment.append(card);
  });

  els.resultsList.append(fragment);
}

function renderMap(rows) {
  els.mapCanvas.replaceChildren();
  if (!rows.length) return;

  const lats = rows.map((row) => row.place.latitude).filter(Number.isFinite);
  const lngs = rows.map((row) => row.place.longitude).filter(Number.isFinite);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latSpan = Math.max(0.001, maxLat - minLat);
  const lngSpan = Math.max(0.001, maxLng - minLng);

  rows.forEach((row, index) => {
    const x = 10 + ((row.place.longitude - minLng) / lngSpan) * 80;
    const y = 88 - ((row.place.latitude - minLat) / latSpan) * 76;
    const marker = document.createElement("button");
    marker.className = "map-marker";
    marker.classList.toggle("is-selected", row.place.id === state.selectedId);
    marker.type = "button";
    marker.style.left = `${x}%`;
    marker.style.top = `${y}%`;
    marker.setAttribute("aria-label", `Select ${row.place.name}`);
    marker.innerHTML = `<span>${index + 1}</span>`;
    marker.addEventListener("click", () => {
      state.selectedId = row.place.id;
      render();
    });

    const label = document.createElement("div");
    label.className = "map-label";
    label.style.left = `${x}%`;
    label.style.top = `${y}%`;
    label.textContent = `${row.place.name} - ${row.place.area} - ${row.match.item.name}`;

    els.mapCanvas.append(marker, label);
  });
}

function renderDetail(rows) {
  const row = rows.find((candidate) => candidate.place.id === state.selectedId);
  els.detailPlaceholder.hidden = Boolean(row);
  els.placeDetail.hidden = !row;
  if (!row) {
    els.placeDetail.replaceChildren();
    return;
  }

  const { place, match } = row;
  const saved = isSaved(place.id);
  const grouped = groupMenuItems(place.menu.items);
  const menuHtml = Object.entries(grouped).map(([category, items]) => `
    <div class="menu-group" data-menu-group>
      <h4>${escapeHtml(category)}</h4>
      <ul class="menu-list">
        ${items.map((item) => `
          <li class="menu-item" data-menu-item="${escapeHtml(normalizeText(`${item.name} ${item.description} ${item.category}`))}">
            <span>
              <strong>${highlight(item.name, state.query)}</strong>
              <span>${highlight(item.description || "", state.query)}</span>
            </span>
            <strong class="price">${escapeHtml(item.price || "")}</strong>
          </li>
        `).join("")}
      </ul>
    </div>
  `).join("");

  els.placeDetail.innerHTML = `
    <div class="detail-hero" aria-hidden="true"></div>
    <p class="eyebrow">${escapeHtml(place.categories.join(" - "))} - Singapore</p>
    <h2>${escapeHtml(place.name)}</h2>
    <div class="detail-meta">
      <span class="status-pill">${place.rating.toFixed(1)} Google rating</span>
      <span class="status-pill">${place.review_count.toLocaleString()} reviews</span>
      <span class="status-pill">${place.price_level}</span>
      <span class="status-pill">${escapeHtml(place.opening_status)}</span>
      <span class="status-pill">${row.distance.toFixed(1)} km</span>
    </div>
    <p class="detail-address">${escapeHtml(place.address)}</p>

    <div class="detail-actions">
      <button class="ghost-button" type="button" data-detail-save>${saved ? "Saved" : "Save"}</button>
      <a class="primary-button" href="${escapeHtml(place.google_maps_url || mapsSearchUrl(place))}" target="_blank" rel="noreferrer">Open Maps</a>
      <a class="ghost-button" href="${escapeHtml(place.google_reviews_url || `${mapsSearchUrl(place)}%20reviews`)}" target="_blank" rel="noreferrer">Reviews</a>
    </div>

    <section class="section-block">
      <h3>Food evidence</h3>
      <div class="match-box">
        <strong>${escapeHtml(match.item.name)}</strong>
        <span>${escapeHtml(match.reason)} from ${escapeHtml(match.evidence)}. Confidence: ${escapeHtml(match.confidenceLabel)}.</span>
        <span>Latest active menu captured ${formatDate(place.menu.captured_at)}.</span>
      </div>
    </section>

    <section class="section-block">
      <h3>Latest menu</h3>
      <div class="detail-meta">
        <span class="source-pill">${escapeHtml(sourceLabel(place.menu.source_type))}</span>
        <span class="source-pill">${formatDate(place.menu.captured_at)}</span>
      </div>
      <input class="menu-search" type="search" placeholder="Search within this menu" aria-label="Search within ${escapeHtml(place.name)} menu">
      <div data-menu-list>${menuHtml}</div>
    </section>

    <section class="section-block">
      <h3>Take a menu photo</h3>
      <div class="upload-box">
        <input type="file" accept="image/*" capture="environment" aria-label="Upload a menu photo for ${escapeHtml(place.name)}">
        <p class="upload-note">This MVP accepts a photo locally for the selected place. OCR and approval can be connected to the backend later.</p>
      </div>
    </section>
  `;

  const saveButton = els.placeDetail.querySelector("[data-detail-save]");
  saveButton.classList.toggle("is-saved", saved);
  saveButton.addEventListener("click", () => {
    toggleSaved(place.id, state.query);
    render();
  });

  const menuSearch = els.placeDetail.querySelector(".menu-search");
  menuSearch.addEventListener("input", () => {
    const needle = normalizeText(menuSearch.value);
    els.placeDetail.querySelectorAll("[data-menu-item]").forEach((item) => {
      item.hidden = needle && !item.dataset.menuItem.includes(needle);
    });
    els.placeDetail.querySelectorAll("[data-menu-group]").forEach((group) => {
      const visibleItems = Array.from(group.querySelectorAll("[data-menu-item]")).some((item) => !item.hidden);
      group.hidden = !visibleItems;
    });
  });
}

function groupMenuItems(items) {
  return items.reduce((groups, item) => {
    const key = item.category || "Menu";
    groups[key] = groups[key] || [];
    groups[key].push(item);
    return groups;
  }, {});
}

function mapsSearchUrl(place) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.address || ""}`)}`;
}

async function loadCafes() {
  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`Unable to load ${DATA_URL}`);
    const data = await response.json();
    return normalizeCafeData(data);
  } catch {
    return fallbackCafes;
  }
}

function bindEvents() {
  els.searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.query = els.searchInput.value.trim();
    render();
  });

  els.quickSearches.addEventListener("click", (event) => {
    const button = event.target.closest("[data-query]");
    if (!button) return;
    state.query = button.dataset.query;
    els.searchInput.value = state.query;
    render();
  });

  els.sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.sort = button.dataset.sort;
      render();
    });
  });

  els.viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      render();
    });
  });

  els.savedOnlyToggle.addEventListener("change", () => {
    state.savedOnly = els.savedOnlyToggle.checked;
    render();
  });

  els.clearButton.addEventListener("click", () => {
    state.query = "";
    els.searchInput.value = "";
    state.savedOnly = false;
    render();
  });

  els.locationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
      els.locationButton.textContent = "Location unavailable";
      return;
    }
    els.locationButton.textContent = "Locating...";
    navigator.geolocation.getCurrentPosition(
      (position) => {
        state.userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        state.sort = "distance";
        els.locationButton.textContent = "Using location";
        render();
      },
      () => {
        els.locationButton.textContent = "Location blocked";
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    state.installPrompt = event;
    els.installButton.hidden = false;
  });

  els.installButton.addEventListener("click", async () => {
    if (!state.installPrompt) return;
    state.installPrompt.prompt();
    await state.installPrompt.userChoice;
    state.installPrompt = null;
    els.installButton.hidden = true;
  });
}

async function init() {
  bindEvents();
  els.searchInput.value = state.query;
  state.cafes = await loadCafes();
  render();

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  }
}

init();
