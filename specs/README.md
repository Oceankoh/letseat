# LetsEat Specs

LetsEat is a food-first discovery app. Instead of asking "where should I eat?", users ask "where can I get this food?" and the app returns nearby places that appear to sell it, with evidence from latest menus, OCR, restaurant websites, and user-submitted menu images.

This spec package is split by concern:

- [Product Vision](./product-vision.md): target users, core promise, principles, and scope.
- [Feature Specs](./feature-specs.md): user-facing requirements for search, place pages, menus, reviews, saved places, maps, and ranking.
- [Data And Ranking](./data-and-ranking.md): Postgres entities, latest-menu model, food search, and sort options.
- [Ingestion And OCR](./ingestion-and-ocr.md): menu/photo capture, OCR, parsing, food extraction, and external data considerations.
- [MVP Roadmap](./mvp-roadmap.md): build phases, milestones, risks, and open questions.

## MVP Focus

The first version should focus on cafes in one target geography while establishing category tabs for place types such as cafes, restaurants, bakeries, dessert shops, and hawker stalls. A narrow launch area makes crawling, ranking, deduplication, and manual QA tractable while still proving the core food-first workflow.

## Core User Flow

1. User chooses a place-category tab, such as Cafes or Restaurants.
2. User searches for a food or drink, for example `matcha latte`, `croissant`, or `eggs benedict`.
3. LetsEat finds matching menu items and evidence within the active category.
4. User sees a ranked list or map of places in that category selling the item.
5. User can switch tabs without losing the query to compare cafes, restaurants, bakeries, or other supported categories.
6. User opens a place detail page to inspect menu evidence, photos, price hints, opening status, and Google rating/review count.
7. User saves the place or opens it in Google Maps.

## Current Technical Direction

- Platform: Progressive Web App.
- Database: Postgres.
- Auth: no account system for MVP.
- Menus: keep only the latest active menu per place.
- Reviews: open Google Maps reviews externally instead of storing or rendering reviews in-app.
- Search categories: expose category tabs that scope the active food query.
- Sorting: offer independent sort modes for relevance, Google review quality, and distance.

## Important Constraint

Google Maps data access must be designed carefully. Direct scraping may violate Google Maps terms and can be unreliable. The product should prefer approved APIs, user-submitted photos, partner menus, public business websites, and explicitly licensed data. Any scraper or enrichment job should be reviewed for legal, platform, and privacy risk before production use.
