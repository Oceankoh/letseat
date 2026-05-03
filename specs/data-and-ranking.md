# Data And Ranking

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

### MenuSource

Represents where menu evidence came from.

Fields:

- `id`
- `place_id`
- `source_type`: `user_upload`, `approved_api`, `restaurant_website`, `partner`, `manual`, `admin`
- `source_url`
- `captured_at`
- `submitted_by_user_id`
- `license_status`
- `processing_status`
- `created_at`

### MenuImage

Stores or references an image used for OCR.

Fields:

- `id`
- `menu_source_id`
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
- `menu_source_id`
- `name`
- `description`
- `category`
- `price`
- `currency`
- `dietary_tags`
- `ocr_confidence`
- `extraction_confidence`
- `first_seen_at`
- `last_seen_at`
- `verified_at`

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

Connects a food query or food term to a place.

Fields:

- `id`
- `place_id`
- `food_term_id`
- `menu_item_id`
- `evidence_type`: `menu_item`, `review_text`, `photo_ocr`, `user_report`, `website`
- `evidence_text`
- `source_id`
- `confidence`
- `seen_at`
- `created_at`

### Review

Represents review data when permitted.

Fields:

- `id`
- `place_id`
- `source`
- `source_review_id`
- `rating`
- `text`
- `language`
- `author_display_name`
- `reviewed_at`
- `source_url`
- `created_at`

### SavedPlace

Represents a user's saved place.

Fields:

- `id`
- `user_id`
- `place_id`
- `food_query`
- `note`
- `list_name`
- `created_at`

## Search Indexes

Recommended indexes:

- Full-text index on `MenuItem.name`, `MenuItem.description`.
- Full-text index on permitted `Review.text`.
- Vector index on menu item embeddings.
- Geospatial index on place coordinates.
- Composite index on `place_id`, `food_term_id`, `confidence`.
- Composite index on `food_term_id`, `seen_at`.

## Food Matching

Food matching should combine lexical and semantic signals.

Lexical:

- Exact phrase match.
- Token match.
- Singular/plural normalization.
- Common spelling variants.
- Alias table.

Semantic:

- Embedding similarity between query and menu item.
- Food taxonomy relationships.
- Ingredient relationships.
- LLM-assisted extraction for ambiguous menus.

Examples:

- `iced matcha` should match `iced matcha latte`.
- `flat white` should not be swallowed by generic `coffee` unless fallback mode is active.
- `cake` can match `black sesame chiffon cake`, but exact cake types should rank higher for specific queries.

## Place Ranking

Default food search score:

```text
score =
  food_match_score * 0.40 +
  evidence_confidence * 0.20 +
  freshness_score * 0.15 +
  google_quality_score * 0.15 +
  distance_score * 0.10
```

Where:

- `food_match_score`: exact and semantic match quality.
- `evidence_confidence`: reliability of the underlying source.
- `freshness_score`: recent menu evidence ranks higher.
- `google_quality_score`: rating, review count, and optional ranking signal.
- `distance_score`: proximity to user or selected map area.

## Google Quality Score

For MVP:

```text
google_quality_score = normalized_rating * 0.65 + normalized_review_count * 0.35
```

If an approved API provides prominence or ranking order, include it as an additional ranking signal. Do not invent or imply an official Google Maps rank if the product only has rating and review count.

## Freshness

Suggested freshness windows:

- Cafe menus: strong freshness for 0-90 days.
- Acceptable freshness: 90-180 days.
- Stale evidence: older than 180 days.
- Seasonal items: stale after 45 days unless reconfirmed.

Stale evidence should still be searchable but labeled clearly.

## Confidence Labels

- High: direct menu item match from recent menu source or verified user submission.
- Medium: older menu evidence, restaurant website, or multiple review mentions.
- Low: single review mention, uncertain OCR, or weak semantic match.

## Data Quality Rules

- Deduplicate places by Google Place ID first, then name/address/geolocation similarity.
- Deduplicate menu items by normalized name, source, and price.
- Preserve original OCR text for auditability.
- Keep all evidence tied to source metadata.
- Never overwrite old menu data without retaining history.
- Track user reports that mark menu items as unavailable.
