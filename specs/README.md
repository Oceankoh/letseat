# LetsEat Specs

LetsEat is a food-first discovery app. Instead of asking "where should I eat?", users ask "where can I get this food?" and the app returns nearby places that appear to sell it, with evidence from menus, review photos, review text, and user-submitted menu images.

This spec package is split by concern:

- [Product Vision](./product-vision.md): target users, core promise, principles, and scope.
- [Feature Specs](./feature-specs.md): user-facing requirements for search, place pages, menus, reviews, saved places, maps, and ranking.
- [Data And Ranking](./data-and-ranking.md): entities, evidence model, food/place ranking, and freshness rules.
- [Ingestion And OCR](./ingestion-and-ocr.md): menu/photo capture, OCR, parsing, food extraction, and external data considerations.
- [MVP Roadmap](./mvp-roadmap.md): build phases, milestones, risks, and open questions.

## MVP Focus

The first version should focus on cafes in one target geography. A narrow launch area makes crawling, ranking, deduplication, and manual QA tractable while still proving the core food-first workflow.

## Core User Flow

1. User searches for a food or drink, for example `matcha latte`, `croissant`, or `eggs benedict`.
2. LetsEat finds matching menu items and review evidence across cafe places.
3. User sees a ranked list or map of cafes selling that item.
4. User opens a cafe detail page to inspect menu evidence, Google Maps review context, photos, price hints, and opening status.
5. User saves the place or opens it in Google Maps.

## Important Constraint

Google Maps data access must be designed carefully. Direct scraping may violate Google Maps terms and can be unreliable. The product should prefer approved APIs, user-submitted photos, partner menus, public business websites, and explicitly licensed data. Any scraper or enrichment job should be reviewed for legal, platform, and privacy risk before production use.
