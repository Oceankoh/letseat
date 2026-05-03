# MVP Roadmap

## Phase 0: Foundation

Goal: make the product shape testable with seeded data.

Deliverables:

- Repo scaffold for PWA, backend, and docs.
- Postgres database setup.
- Seed cafe dataset for one geography.
- Basic place model.
- Basic latest-menu and menu item models.
- Manual CSV or admin import for menus.
- Food search endpoint.
- List results page.
- Place detail page.

Exit criteria:

- A user can search for a food and see seeded cafes that sell it.
- Each result shows at least one menu item as evidence.

## Phase 1: User-Facing MVP

Goal: make the core food-first experience usable.

Deliverables:

- Food search UI with filters and sorting.
- Place detail page with latest menu and Google Maps review handoff.
- Local saved places without auth.
- Open in Google Maps.
- Basic map/list toggle.
- Analytics for search, save, and open-in-maps actions.

Exit criteria:

- Users can search, compare places, save them, and open directions.
- Search results can be sorted by relevance, Google review quality, and distance.

## Phase 2: Menu Photo Upload And OCR

Goal: let users refresh or add menu data.

Deliverables:

- Menu photo upload/capture flow.
- OCR processing job.
- Menu item extraction.
- User review screen for extracted items.
- Admin moderation queue.
- Latest menu replacement flow.

Exit criteria:

- An approved submitted menu photo replaces the latest active menu and becomes searchable.
- Low-confidence OCR is routed to review instead of silently polluting search.

## Phase 3: External Place Enrichment

Goal: improve coverage while staying compliant.

Deliverables:

- Approved place data integration.
- Place enrichment jobs.
- Deduplication tooling.
- Google Maps review links.
- Restaurant website menu ingestion for selected cafes.

Exit criteria:

- New cafes can be discovered and enriched without manual database edits.
- Place pages show provider attribution correctly.

## Phase 4: Search Quality

Goal: make relevance and Google review quality sorts feel trustworthy.

Deliverables:

- Better food alias tables.
- Relevance tuning.
- Google review quality sort tuning.
- User feedback on incorrect results.
- Search analytics and tuning dashboard.

Exit criteria:

- For common cafe searches, top results are meaningfully better than simple text search.
- Users can choose whether they want the most relevant menu match or the strongest Google-reviewed place.

## Phase 5: Expansion

Goal: expand beyond cafes.

Deliverables:

- Additional place categories:
  - Bakeries.
  - Dessert shops.
  - Restaurants.
  - Hawker stalls or food courts where relevant.
- Cuisine and dietary filters.
- Multi-language OCR and search.
- Partner or owner menu submission flow.
- Account system and synced saved places if needed.

Exit criteria:

- The system supports multiple food-place categories without cafe-specific assumptions leaking everywhere.

## Technical Risks

- Google Maps scraping may be legally or technically unsuitable.
- Places APIs may not provide enough menu or review data.
- OCR quality may be poor for handwritten, reflective, or angled menus.
- Replacing menus can accidentally remove still-valid items if OCR or moderation misses them.
- Food synonyms and ambiguous queries can produce noisy matches.
- Google review quality sort may favor popular places over the most relevant food match.

## Product Risks

- Users may not trust results without visible evidence.
- Search may feel empty until enough menu data exists.
- Cafe-first scope must still feel useful enough to retain users.
- Local saved places will not sync across devices until auth exists.

## Open Questions

- What is the first launch geography?
- Should the app use user location by default or ask users to select an area?
- Which data sources are acceptable for production?
- Should users be able to upload menu photos anonymously?
- How much moderation is needed before user-submitted menu data goes live?
- What is the minimum confidence threshold for showing a food/place match?
- Should price be a first-class filter in MVP?
- Should dietary tags be extracted automatically or only manually verified?
