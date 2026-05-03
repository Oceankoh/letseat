# LetsEat Seed Data

This folder contains practical data for the Singapore cafe-first MVP. It includes fictional seed fixtures for frontend development, ignored Google Places imports for local database population, and auditable menu research batches for real Singapore places.

## Files

- `seed-cafes.json`: seed cafes, latest active menus, menu images, food terms, and food-place evidence.
- `imports/`: generated Google Places import artifacts. The generated JSON and SQL files are ignored because they may be large or environment-specific.
- `menu-research/`: manually or agentically researched menu batches. These are source-attributed snapshots used to populate latest active menus in the local database.

## How The JSON Maps To The Schema

Top-level `food_terms` maps to `food_terms`.

Top-level `places` maps to `places`. Each place includes rating and review count seed values so the app can support the independent "Google review quality" sort without storing Google review text.

Each place's `latest_menu` maps to `menus` with `is_active: true`. The schema enforces one active menu per place through `menus_one_active_per_place_idx`.

`latest_menu.images` maps to `menu_images`. The image URLs are placeholders under `/seed-images/...`; the frontend can render fallbacks until real files or object storage are added.

`latest_menu.items` maps to `menu_items`. Items include `normalized_name`, category, price, dietary tags, and OCR/extraction confidence values so relevance sort can be developed against exact, alias, token, and partial matches.

Top-level `food_place_evidence` maps to `food_place_evidence`. Evidence links a canonical food term to a place through a specific menu item from the active menu.

Saved places are not represented in the seed data or database. The MVP stores saves locally in browser/device state because there is no auth system.

## MVP Search Decisions Reflected Here

- Search inclusion is evidence-based: a place should appear for a food query when a current menu item or alias supports that match.
- Sort modes are independent:
  - Relevance uses `match_kind`, `confidence`, and menu item match quality.
  - Google review quality uses `places.rating` and `places.review_count`.
  - Distance uses `places.latitude` and `places.longitude`.
- Google reviews open externally through `places.google_reviews_url`; review bodies, authors, and snippets are not stored.
- Menus are latest-active only. Replacing a menu should deactivate or remove old searchable items before inserting the new active menu.
- Future place discovery, enrichment, or approved scraper experiments should target Singapore cafes first before expanding to other food places or regions.
- Seed data has no external cost. Real Google Places, OCR, proxy, hosted browser, or LLM-based importers must use dry-run mode, request caps, caching, and explicit approval before bulk or scheduled runs.

## Loading Strategy

A loader can insert in this order:

1. `food_terms`
2. `places`
3. `menus`
4. `menu_images`
5. `menu_items`
6. `food_place_evidence`

The JSON is nested for frontend convenience, but the schema is normalized for backend search and future ingestion jobs.

## Agentic Menu Research

Menu research batches should stay small enough to review. Each batch entry should include:

- `place_id` or exact `place_name`
- `source_url`
- `source_type`
- `captured_at`
- `confidence`
- short `notes`
- representative `items`

Items may use either decimal `price` or integer `price_cents`; `scripts/load-menu-batch.mjs` normalizes both into the database `price` column. Prices should be `null` when not clearly verified by the cited source.
