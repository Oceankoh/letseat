# Ingestion And OCR

## Overview

LetsEat needs a pipeline that turns place data, menu photos, and restaurant websites into searchable food/place evidence.

The pipeline should be source-aware. A user-uploaded menu photo, an approved API result, and a restaurant website menu have different reliability, rights, update behavior, and attribution requirements.

## Data Sources And Cost Posture

### Preferred Sources

- User-submitted menu photos.
- Restaurant-owned websites.
- Restaurant-owned social profiles where usage is permitted.
- Partner-provided menus.
- Approved Google Places APIs. These can incur API costs and require billing controls.
- Licensed third-party data providers.
- Manual admin entry for high-value places.

### Risky Or Deferred Sources

- Automated scraping of Google Maps pages or review photos.
- Bulk extraction from copyrighted review images without permission.
- Storage of Google review text or other data that source terms allow only for display or transient use.

Before production use, any scraper should go through legal, privacy, and platform review.

### Cost Controls

Seed data and manually authored fixtures do not incur external data costs. Real importers and OCR jobs may incur costs from API calls, hosted compute, proxy services, captcha services, OCR providers, or LLM extraction.

Every importer or enrichment job must support:

- `DRY_RUN=true` mode that reports planned requests without calling paid APIs.
- `MAX_REQUESTS_PER_RUN` or equivalent hard cap.
- Singapore-only bounds for MVP place discovery.
- Persistent caching by `google_place_id`, source URL, and image hash.
- Minimal Google Places field masks.
- Clear logs for requests attempted, skipped, cached, failed, and estimated billable calls.
- Manual execution by default. No scheduled scraping or enrichment until explicitly approved.
- Provider-side budgets, quotas, and alerts when available.

## Place Discovery For Cafes

MVP place discovery should support:

- Singapore as the launch geography.
- Search category: cafes.
- Singapore-wide cafe coverage through multiple bounded neighborhood search points.
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

Any approved scraper experiment or enrichment job should target Singapore cafes first.

Google Places API use requires an API key and a billing-enabled Google Cloud project. The app should avoid requesting fields it does not need.

## One-Time Agentic Menu Enrichment

For early Singapore cafe coverage, menu enrichment can be run as a one-time, manually supervised, agentic research workflow instead of a rigid scraper.

Expected workflow:

1. Select high-priority Singapore places from the database, usually by review count or product relevance.
2. Assign small independent batches to lightweight research agents.
3. Prefer restaurant-owned websites, official PDFs, or official ordering pages.
4. Use public delivery/menu pages only when official pages are unavailable or incomplete.
5. Capture representative current menu items, source URL, source type, capture date, and confidence.
6. Keep descriptions short and factual; do not copy full menu pages or long copyrighted descriptions.
7. Set price to `null` when the source does not clearly verify the price.
8. Load the batch as the latest active menu for each place, replacing older searchable items for that place.

This path is acceptable for one-time MVP population because humans/agents can adapt to varied site structures, PDFs, embedded images, delivery pages, and menu mirrors. It should remain manually triggered, source-attributed, and auditable. It should not become scheduled scraping without a separate compliance and cost review.

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

Paid OCR providers and LLMs must use the same request cap and dry-run approach as place importers.

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

## Google Reviews

The MVP should not ingest, store, or render Google review text. Place pages should show Google rating and review count when available, then hand users off to Google Maps for review reading.

Google review text extraction and review-food evidence are deferred until there is a compliant data source and a clear product need.

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
- Approve a menu replacement as the latest active menu.

## Pipeline States

Menu states:

- `uploaded`
- `preprocessing`
- `ocr_running`
- `ocr_failed`
- `parsing_running`
- `needs_review`
- `approved_active`
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
- Percentage of places with an active latest menu.
- Search queries with no results.
