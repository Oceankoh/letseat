# Data And Ranking

## Database

Use Postgres for the MVP. PostGIS should be enabled if the app needs radius search, map bounds search, or distance sorting. Full-text search can be handled with native Postgres indexes before adding a dedicated search service.

## Core Entities

### Place

Represents a cafe or food business.

Fields:

- `id`
- `name`
- `google_place_id`
- `address`
- `latitude`
- `longitude`
- `categories`
- `price_level`
- `rating`
- `review_count`
- `opening_hours`
- `google_maps_url`
- `primary_photo_url`
- `source`
- `created_at`
- `updated_at`

### Menu

Represents the latest active menu for a place. Each place should have at most one active menu in the MVP.

Fields:

- `id`
- `place_id`
- `source_type`: `user_upload`, `approved_api`, `restaurant_website`, `partner`, `manual`, `admin`
- `source_url`
- `captured_at`
- `license_status`
- `processing_status`
- `is_active`
- `created_at`
- `updated_at`

### MenuImage

Stores or references an image used for OCR.

Fields:

- `id`
- `menu_id`
- `image_url`
- `image_hash`
- `width`
- `height`
- `ocr_status`
- `quality_score`
- `created_at`

### MenuItem

Represents an extracted or manually confirmed item.

Fields:

- `id`
- `place_id`
- `menu_id`
- `name`
- `description`
- `category`
- `price`
- `currency`
- `dietary_tags`
- `ocr_confidence`
- `extraction_confidence`
- `created_at`
- `updated_at`

### FoodTerm

Canonical food concept used for search and matching.

Fields:

- `id`
- `canonical_name`
- `aliases`
- `category`
- `ingredients`
- `cuisine_tags`
- `embedding`

### FoodPlaceEvidence

Connects a food query or food term to a place using the latest active menu.

Fields:

- `id`
- `place_id`
- `food_term_id`
- `menu_item_id`
- `evidence_type`: `menu_item`, `photo_ocr`, `website`, `manual`
- `evidence_text`
- `source_id`
- `confidence`
- `seen_at`
- `created_at`

### SavedPlace

Represents a place saved locally by a browser/device. The MVP does not have user accounts or cross-device sync.

Fields:

- `id`
- `place_id`
- `food_query`
- `note`
- `list_name`
- `created_at`

## Search Indexes

Recommended indexes:

- Full-text index on `MenuItem.name`, `MenuItem.description`.
- Geospatial index on place coordinates.
- Composite index on `place_id`, `food_term_id`, `confidence`.
- Composite index on `food_term_id`, `seen_at`.
- Optional future vector index on menu item embeddings.

## Food Matching

Food matching should start with lexical signals from the latest active menu.

Lexical:

- Exact phrase match.
- Token match.
- Singular/plural normalization.
- Common spelling variants.
- Alias table.

Deferred semantic signals:

- Embedding similarity between query and menu item.
- Food taxonomy relationships.
- Ingredient relationships.
- LLM-assisted extraction for ambiguous menus.

Examples:

- `iced matcha` should match `iced matcha latte`.
- `flat white` should not be swallowed by generic `coffee` unless fallback mode is active.
- `cake` can match `black sesame chiffon cake`, but exact cake types should rank higher for specific queries.

## Sort Modes

The MVP should not use a blended ranking score. Food search returns matching places, then applies one selected sort mode.

### Relevance Sort

Order by menu match quality:

1. Exact normalized menu item match.
2. Exact alias match.
3. Prefix or token match.
4. Partial substring match.
5. OCR/extraction confidence as a tiebreaker.

### Google Review Quality Sort

Order by Google review quality using rating and review count:

```text
google_review_quality = normalized_rating * 0.70 + normalized_review_count * 0.30
```

Use menu relevance as an inclusion filter before applying this sort. Do not imply this is an official Google Maps ranking unless the data source explicitly provides such a rank.

### Distance Sort

Order by distance from the user's location or selected map area. If the user has not granted location permission, use the selected map bounds or neighborhood.

## Latest Menu Policy

- Each place has one latest active menu.
- New approved menu submissions replace the active menu.
- Replaced menu items should be removed from the searchable index.
- The app should show the active menu's `updated_at` or `captured_at` date.
- Historical menu storage is deferred.

## Confidence Labels

- High: direct menu item match with high OCR or manual confidence.
- Medium: partial menu item match or moderate OCR confidence.
- Low: uncertain OCR or weak alias match.

## Data Quality Rules

- Deduplicate places by Google Place ID first, then name/address/geolocation similarity.
- Deduplicate menu items by normalized name, source, and price.
- Preserve original OCR text for auditability.
- Keep active menu evidence tied to source metadata.
- Replace the active menu when a newer submission is approved.
- Track user reports that mark menu items as unavailable.
