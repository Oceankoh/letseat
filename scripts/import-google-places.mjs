#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const IMPORT_DIR = path.join(ROOT, "data", "imports");
const API_URL = "https://places.googleapis.com/v1/places:searchNearby";
const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.googleMapsUri",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
  "places.businessStatus",
  "places.primaryType",
  "places.types"
].join(",");

const SINGAPORE_WIDE_SEARCH_POINTS = [
  { label: "Marina Bay", latitude: 1.2834, longitude: 103.8607 },
  { label: "Raffles Place", latitude: 1.2840, longitude: 103.8513 },
  { label: "Telok Ayer", latitude: 1.2815, longitude: 103.8489 },
  { label: "Tanjong Pagar", latitude: 1.2764, longitude: 103.8458 },
  { label: "Chinatown", latitude: 1.2838, longitude: 103.8440 },
  { label: "Tiong Bahru", latitude: 1.2849, longitude: 103.8331 },
  { label: "Bukit Merah", latitude: 1.2819, longitude: 103.8239 },
  { label: "HarbourFront", latitude: 1.2653, longitude: 103.8218 },
  { label: "Sentosa", latitude: 1.2494, longitude: 103.8303 },
  { label: "River Valley", latitude: 1.2950, longitude: 103.8392 },
  { label: "Orchard", latitude: 1.3048, longitude: 103.8318 },
  { label: "Dhoby Ghaut", latitude: 1.2990, longitude: 103.8457 },
  { label: "Bugis", latitude: 1.3008, longitude: 103.8565 },
  { label: "Kampong Glam", latitude: 1.3026, longitude: 103.8597 },
  { label: "Little India", latitude: 1.3067, longitude: 103.8495 },
  { label: "Kallang", latitude: 1.3106, longitude: 103.8667 },
  { label: "Geylang", latitude: 1.3182, longitude: 103.8871 },
  { label: "Paya Lebar", latitude: 1.3181, longitude: 103.8931 },
  { label: "MacPherson", latitude: 1.3267, longitude: 103.8895 },
  { label: "Ubi", latitude: 1.3295, longitude: 103.8991 },
  { label: "Tai Seng", latitude: 1.3376, longitude: 103.8881 },
  { label: "Katong", latitude: 1.3065, longitude: 103.9052 },
  { label: "Marine Parade", latitude: 1.3021, longitude: 103.9065 },
  { label: "Siglap", latitude: 1.3120, longitude: 103.9230 },
  { label: "Bedok", latitude: 1.3236, longitude: 103.9273 },
  { label: "Tampines", latitude: 1.3521, longitude: 103.9448 },
  { label: "Pasir Ris", latitude: 1.3730, longitude: 103.9493 },
  { label: "Changi Village", latitude: 1.3892, longitude: 103.9874 },
  { label: "Changi Business Park", latitude: 1.3349, longitude: 103.9627 },
  { label: "Expo", latitude: 1.3340, longitude: 103.9615 },
  { label: "Novena", latitude: 1.3205, longitude: 103.8439 },
  { label: "Toa Payoh", latitude: 1.3343, longitude: 103.8563 },
  { label: "Holland Village", latitude: 1.3111, longitude: 103.7964 },
  { label: "Queenstown", latitude: 1.2942, longitude: 103.7861 },
  { label: "Alexandra", latitude: 1.2871, longitude: 103.8055 },
  { label: "Bukit Timah", latitude: 1.3294, longitude: 103.8021 },
  { label: "Clementi", latitude: 1.3151, longitude: 103.7650 },
  { label: "West Coast", latitude: 1.3039, longitude: 103.7660 },
  { label: "Pasir Panjang", latitude: 1.2762, longitude: 103.7916 },
  { label: "Jurong East", latitude: 1.3331, longitude: 103.7423 },
  { label: "Jurong West", latitude: 1.3404, longitude: 103.7068 },
  { label: "Boon Lay", latitude: 1.3386, longitude: 103.7058 },
  { label: "Tuas", latitude: 1.3290, longitude: 103.6487 },
  { label: "Bukit Batok", latitude: 1.3496, longitude: 103.7490 },
  { label: "Bukit Panjang", latitude: 1.3774, longitude: 103.7719 },
  { label: "Choa Chu Kang", latitude: 1.3854, longitude: 103.7442 },
  { label: "Woodlands", latitude: 1.4360, longitude: 103.7864 },
  { label: "Marsiling", latitude: 1.4326, longitude: 103.7741 },
  { label: "Sembawang", latitude: 1.4491, longitude: 103.8201 },
  { label: "Yishun", latitude: 1.4294, longitude: 103.8354 },
  { label: "Seletar", latitude: 1.4106, longitude: 103.8666 },
  { label: "Mandai", latitude: 1.4043, longitude: 103.7896 },
  { label: "Bishan", latitude: 1.3508, longitude: 103.8485 },
  { label: "Ang Mo Kio", latitude: 1.3691, longitude: 103.8454 },
  { label: "Yio Chu Kang", latitude: 1.3818, longitude: 103.8449 },
  { label: "Upper Thomson", latitude: 1.3546, longitude: 103.8325 },
  { label: "Serangoon", latitude: 1.3526, longitude: 103.8724 },
  { label: "Hougang", latitude: 1.3713, longitude: 103.8926 },
  { label: "Sengkang", latitude: 1.3917, longitude: 103.8950 },
  { label: "Punggol", latitude: 1.4043, longitude: 103.9023 }
];

function parseArgs(argv) {
  const args = {
    execute: false,
    maxRequests: Number(process.env.PLACES_IMPORT_MAX_REQUESTS || 3),
    radiusMeters: Number(process.env.PLACES_IMPORT_RADIUS_METERS || 2500),
    resultCount: 20,
    includedTypes: (process.env.PLACES_IMPORT_TYPES || "cafe").split(",").map((type) => type.trim()).filter(Boolean)
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--execute") args.execute = true;
    if (arg === "--dry-run") args.execute = false;
    if (arg === "--max-requests") args.maxRequests = Number(argv[++index]);
    if (arg === "--radius") args.radiusMeters = Number(argv[++index]);
    if (arg === "--result-count") args.resultCount = Number(argv[++index]);
    if (arg === "--included-types") args.includedTypes = argv[++index].split(",").map((type) => type.trim()).filter(Boolean);
  }

  if (!Number.isFinite(args.maxRequests) || args.maxRequests < 1) args.maxRequests = 1;
  if (!Number.isFinite(args.radiusMeters) || args.radiusMeters < 100) args.radiusMeters = 1200;
  if (!Number.isFinite(args.resultCount) || args.resultCount < 1) args.resultCount = 20;
  args.maxRequests = Math.min(Math.floor(args.maxRequests), SINGAPORE_WIDE_SEARCH_POINTS.length);
  args.resultCount = Math.min(Math.floor(args.resultCount), 20);
  if (!args.includedTypes.length) args.includedTypes = ["cafe"];
  return args;
}

async function loadEnv() {
  try {
    const envText = await readFile(path.join(ROOT, ".env"), "utf8");
    for (const line of envText.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const equalsIndex = trimmed.indexOf("=");
      if (equalsIndex === -1) continue;
      const key = trimmed.slice(0, equalsIndex).trim();
      const value = trimmed.slice(equalsIndex + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env is optional when env vars are provided by the shell or Docker.
  }
}

function slugify(value) {
  return String(value || "place")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48) || "place";
}

function shortHash(value) {
  return createHash("sha256").update(String(value)).digest("hex").slice(0, 10);
}

function sqlString(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlJson(value) {
  return `${sqlString(JSON.stringify(value || {}))}::jsonb`;
}

function sqlTextArray(values) {
  if (!Array.isArray(values) || !values.length) return "'{}'::text[]";
  return `ARRAY[${values.map(sqlString).join(", ")}]::text[]`;
}

function mapPriceLevel(value) {
  const levels = {
    PRICE_LEVEL_INEXPENSIVE: 1,
    PRICE_LEVEL_MODERATE: 2,
    PRICE_LEVEL_EXPENSIVE: 3,
    PRICE_LEVEL_VERY_EXPENSIVE: 4
  };
  return levels[value] || null;
}

function normalizePlace(place, searchPoint) {
  const name = place.displayName?.text || "Unnamed cafe";
  const googlePlaceId = place.id;
  const id = `google_${slugify(name)}_${shortHash(googlePlaceId)}`;
  const types = Array.isArray(place.types) ? place.types : [];
  return {
    id,
    name,
    google_place_id: googlePlaceId,
    address: place.formattedAddress || "Singapore",
    neighborhood: searchPoint.label,
    latitude: place.location?.latitude,
    longitude: place.location?.longitude,
    categories: types.length ? types : ["cafe"],
    price_level: mapPriceLevel(place.priceLevel),
    rating: place.rating ?? null,
    review_count: place.userRatingCount ?? null,
    opening_hours: {},
    google_maps_url: place.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} Singapore`)}`,
    google_reviews_url: place.googleMapsUri || `https://www.google.com/maps/search/${encodeURIComponent(`${name} Singapore reviews`)}`,
    primary_photo_url: null,
    source: "google_places_api",
    source_updated_at: new Date().toISOString(),
    business_status: place.businessStatus || null,
    primary_type: place.primaryType || null,
    imported_from: searchPoint.label
  };
}

function buildSql(places) {
  const lines = [
    "-- Generated by scripts/import-google-places.mjs",
    "-- Real Google Places data. Do not commit generated import files unless data policy is reviewed.",
    "BEGIN;"
  ];

  for (const place of places) {
    lines.push(`
INSERT INTO places (
  id,
  name,
  google_place_id,
  address,
  neighborhood,
  latitude,
  longitude,
  categories,
  price_level,
  rating,
  review_count,
  opening_hours,
  google_maps_url,
  google_reviews_url,
  primary_photo_url,
  source,
  source_updated_at
) VALUES (
  ${sqlString(place.id)},
  ${sqlString(place.name)},
  ${sqlString(place.google_place_id)},
  ${sqlString(place.address)},
  ${sqlString(place.neighborhood)},
  ${place.latitude},
  ${place.longitude},
  ${sqlTextArray(place.categories)},
  ${place.price_level === null ? "NULL" : place.price_level},
  ${place.rating === null ? "NULL" : place.rating},
  ${place.review_count === null ? "NULL" : place.review_count},
  ${sqlJson(place.opening_hours)},
  ${sqlString(place.google_maps_url)},
  ${sqlString(place.google_reviews_url)},
  ${sqlString(place.primary_photo_url)},
  ${sqlString(place.source)},
  ${sqlString(place.source_updated_at)}
)
ON CONFLICT (google_place_id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  neighborhood = EXCLUDED.neighborhood,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  categories = EXCLUDED.categories,
  price_level = EXCLUDED.price_level,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  google_maps_url = EXCLUDED.google_maps_url,
  google_reviews_url = EXCLUDED.google_reviews_url,
  source = EXCLUDED.source,
  source_updated_at = EXCLUDED.source_updated_at,
  updated_at = now();`);
  }

  lines.push("COMMIT;");
  return `${lines.join("\n")}\n`;
}

async function searchNearby({ apiKey, point, radiusMeters, resultCount, includedTypes }) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK
    },
    body: JSON.stringify({
      includedTypes,
      maxResultCount: resultCount,
      rankPreference: "POPULARITY",
      locationRestriction: {
        circle: {
          center: {
            latitude: point.latitude,
            longitude: point.longitude
          },
          radius: radiusMeters
        }
      }
    })
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body.error?.message || response.statusText;
    throw new Error(`Places API failed for ${point.label}: ${response.status} ${message}`);
  }
  return body.places || [];
}

async function main() {
  await loadEnv();
  const args = parseArgs(process.argv.slice(2));
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const searchPoints = SINGAPORE_WIDE_SEARCH_POINTS.slice(0, args.maxRequests);

  console.log(`Singapore cafe importer`);
  console.log(`Mode: ${args.execute ? "EXECUTE" : "DRY RUN"}`);
  console.log(`Planned API requests: ${searchPoints.length}`);
  console.log(`Radius: ${args.radiusMeters}m`);
  console.log(`Max results per request: ${args.resultCount}`);
  console.log(`Included types: ${args.includedTypes.join(",")}`);
  console.log(`Field mask: ${FIELD_MASK}`);

  if (!args.execute || process.env.PLACES_IMPORT_DRY_RUN === "true") {
    console.log("No API calls made. Pass --execute and set PLACES_IMPORT_DRY_RUN=false to fetch real data.");
    return;
  }

  if (!apiKey) {
    throw new Error("Missing GOOGLE_MAPS_API_KEY. Add it to .env or the environment.");
  }

  const placesByGoogleId = new Map();
  const responses = [];

  for (const point of searchPoints) {
    console.log(`Fetching cafes near ${point.label}...`);
    const places = await searchNearby({
      apiKey,
      point,
      radiusMeters: args.radiusMeters,
      resultCount: args.resultCount,
      includedTypes: args.includedTypes
    });
    responses.push({ point, count: places.length });
    for (const place of places) {
      if (!place.id || placesByGoogleId.has(place.id)) continue;
      const normalized = normalizePlace(place, point);
      if (Number.isFinite(normalized.latitude) && Number.isFinite(normalized.longitude)) {
        placesByGoogleId.set(place.id, normalized);
      }
    }
  }

  const places = Array.from(placesByGoogleId.values()).sort((a, b) => a.name.localeCompare(b.name));
  await mkdir(IMPORT_DIR, { recursive: true });
  await writeFile(path.join(IMPORT_DIR, "google-places-latest.json"), JSON.stringify({
    generated_at: new Date().toISOString(),
    source: "google_places_api",
    request_count: searchPoints.length,
    included_types: args.includedTypes,
    radius_meters: args.radiusMeters,
    responses,
    places
  }, null, 2));
  await writeFile(path.join(IMPORT_DIR, "google-places-import.sql"), buildSql(places));

  console.log(`Fetched ${places.length} unique real places.`);
  console.log("Wrote data/imports/google-places-latest.json");
  console.log("Wrote data/imports/google-places-import.sql");
  console.log("To apply when Docker Postgres is running:");
  console.log("  ./scripts/apply-google-places-import.sh");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
