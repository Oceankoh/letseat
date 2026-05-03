# MVP Roadmap

## Phase 0: Foundation

Goal: make the product shape testable with seeded data.

Deliverables:

- Repo scaffold for app, backend, and docs.
- Seed cafe dataset for one geography.
- Basic place model.
- Basic menu item model.
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
- Place detail page with menu and review sections.
- Save places.
- Open in Google Maps.
- Basic map/list toggle.
- Auth for saved places.
- Analytics for search, save, and open-in-maps actions.

Exit criteria:

- Users can search, compare places, save them, and open directions.
- Search results can be sorted by best match, rating, review count, and distance.

## Phase 2: Menu Photo Upload And OCR

Goal: let users refresh or add menu data.

Deliverables:

- Menu photo upload/capture flow.
- OCR processing job.
- Menu item extraction.
- User review screen for extracted items.
- Admin moderation queue.
- Freshness labels.

Exit criteria:

- A submitted menu photo becomes searchable after OCR and approval.
- Low-confidence OCR is routed to review instead of silently polluting search.

## Phase 3: External Place Enrichment

Goal: improve coverage while staying compliant.

Deliverables:

- Approved place data integration.
- Place enrichment jobs.
- Deduplication tooling.
- Review display or source links depending on API permissions.
- Restaurant website menu ingestion for selected cafes.

Exit criteria:

- New cafes can be discovered and enriched without manual database edits.
- Place pages show provider attribution correctly.

## Phase 4: Food-Specific Ranking

Goal: rank places by dish quality and confidence, not only venue quality.

Deliverables:

- Food/place evidence scoring.
- Review-food mention extraction when permitted.
- Food-specific badges.
- User feedback on incorrect results.
- Ranking analytics and tuning dashboard.

Exit criteria:

- For common cafe searches, top results are meaningfully better than simple text search.
- Users can see why a place ranks highly for a specific food.

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

Exit criteria:

- The system supports multiple food-place categories without cafe-specific assumptions leaking everywhere.

## Technical Risks

- Google Maps scraping may be legally or technically unsuitable.
- Places APIs may not provide enough menu or review data.
- OCR quality may be poor for handwritten, reflective, or angled menus.
- Menus change often and can make stale results misleading.
- Food synonyms and ambiguous queries can produce noisy matches.
- Ranking may be biased toward places with more online data rather than better food.

## Product Risks

- Users may not trust results without visible evidence.
- Search may feel empty until enough menu data exists.
- Cafe-first scope must still feel useful enough to retain users.
- Saved places may need stronger organization once users save many food-specific places.

## Open Questions

- What is the first launch geography?
- Should the app use user location by default or ask users to select an area?
- Which data sources are acceptable for production?
- Should users be able to upload menu photos anonymously?
- How much moderation is needed before user-submitted menu data goes live?
- What is the minimum confidence threshold for showing a food/place match?
- Should price be a first-class filter in MVP?
- Should dietary tags be extracted automatically or only manually verified?
