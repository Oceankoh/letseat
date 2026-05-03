# Ingestion And OCR

## Overview

LetsEat needs a pipeline that turns place data, menu photos, review text, and restaurant websites into searchable food/place evidence.

The pipeline should be source-aware. A user-uploaded menu photo, an approved API result, and a restaurant website menu have different reliability, rights, freshness, and attribution requirements.

## Data Sources

### Preferred Sources

- User-submitted menu photos.
- Restaurant-owned websites.
- Restaurant-owned social profiles where usage is permitted.
- Partner-provided menus.
- Approved Google Places APIs.
- Licensed third-party data providers.
- Manual admin entry for high-value places.

### Risky Or Deferred Sources

- Automated scraping of Google Maps pages or review photos.
- Bulk extraction from copyrighted review images without permission.
- Storage of data that source terms allow only for display or transient use.

Before production use, any scraper should go through legal, privacy, and platform review.

## Place Discovery For Cafes

MVP place discovery should support:

- A target city or neighborhood.
- Search category: cafes.
- Deduplication by Google Place ID when available.
- Basic place attributes:
  - Name.
  - Coordinates.
  - Address.
  - Rating.
  - Review count.
  - Price level.
  - Opening hours.
  - Google Maps URL.

Possible compliant implementations:

- Google Places API Nearby Search and Place Details.
- Manual seed lists plus Places API enrichment.
- Restaurant website discovery from approved search APIs.
- Admin CSV import for early testing.

## Menu Image Intake

### Capture Flow

1. User selects a place.
2. User captures or uploads one or more menu images.
3. Client runs basic image checks:
   - Blur detection.
   - Low-light detection.
   - Perspective skew.
   - Text density.
4. User can retake low-quality images.
5. Images upload to storage.
6. OCR job starts asynchronously.

### Image Preprocessing

- Normalize orientation.
- Crop to menu area when possible.
- Deskew perspective.
- Increase contrast.
- Split multi-panel menus.
- Detect language.

## OCR

OCR provider options:

- Google Cloud Vision.
- AWS Textract.
- Azure AI Vision.
- Tesseract for local development and low-cost prototypes.
- Multimodal LLM for difficult menus and post-processing.

OCR output should include:

- Raw text.
- Text blocks.
- Bounding boxes.
- Confidence scores.
- Language hints.

## Menu Parsing

Parsing should convert OCR text into structured menu items.

### Extraction Targets

- Item name.
- Description.
- Price.
- Currency.
- Section/category.
- Modifiers.
- Dietary labels.
- Confidence.

### Parsing Techniques

- Rule-based price extraction.
- Section header detection.
- Layout-aware grouping using OCR bounding boxes.
- LLM-assisted parsing for ambiguous layouts.
- Menu taxonomy classification.

### Example

OCR text:

```text
BRUNCH
Eggs Benedict 18
Smoked Salmon Bagel 16

DRINKS
Iced Matcha Latte 7
Flat White 6
```

Parsed items:

```json
[
  { "category": "BRUNCH", "name": "Eggs Benedict", "price": 18 },
  { "category": "BRUNCH", "name": "Smoked Salmon Bagel", "price": 16 },
  { "category": "DRINKS", "name": "Iced Matcha Latte", "price": 7 },
  { "category": "DRINKS", "name": "Flat White", "price": 6 }
]
```

## Food Extraction From Reviews

If review text is available through permitted sources:

- Run food entity extraction on review text.
- Link mentions to canonical food terms.
- Track sentiment only when enough context exists.
- Avoid over-weighting single mentions.
- Store review evidence with source and date.

Examples:

- "The tiramisu was excellent" creates positive tiramisu evidence.
- "They no longer serve waffles" should create an unavailable or negative freshness signal.
- "Coffee was okay" should not strongly rank the place for every coffee drink.

## Human Review And Corrections

The app should support a moderation queue for:

- Low-confidence OCR.
- New place submissions.
- Conflicting menu data.
- User reports that an item is unavailable.
- Suspected duplicate places.

Admin actions:

- Approve extracted item.
- Edit extracted item.
- Merge duplicate item.
- Mark unavailable.
- Reject source.

## Pipeline States

Menu source states:

- `uploaded`
- `preprocessing`
- `ocr_running`
- `ocr_failed`
- `parsing_running`
- `needs_review`
- `approved`
- `rejected`

Place ingestion states:

- `discovered`
- `enriched`
- `needs_dedupe`
- `active`
- `inactive`

## Observability

Track:

- OCR success rate.
- OCR average confidence.
- Parsing success rate.
- Manual correction rate.
- Time from upload to searchable.
- Percentage of places with fresh menu evidence.
- Search queries with no results.
