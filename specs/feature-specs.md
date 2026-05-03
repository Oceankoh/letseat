# Feature Specs

## 1. Food Search

### Goal

Let users search for a food, drink, ingredient, or dish and see cafes that likely sell it.

### Requirements

- Accept free-text food queries such as `latte`, `banana bread`, `carbonara`, `gluten free cake`.
- Normalize common variants, spelling differences, plurals, and synonyms.
- Support partial matching for menu item names.
- Return a ranked list of places with:
  - Place name.
  - Primary photo when available.
  - Rating and review count.
  - Distance or area.
  - Opening status if available.
  - Matched menu item or review phrase.
  - Evidence source: menu, review, user photo, business website, or external API.
  - Confidence indicator.
- Allow switching between list and map views.
- Allow filters:
  - Open now.
  - Distance.
  - Rating threshold.
  - Evidence type.
  - Price level if available.
  - Saved only.

### Ranking Inputs

- Exact food match in menu item name.
- Semantic similarity between query and menu item.
- Frequency and recency of review mentions.
- Google Maps rating and review count.
- Distance from user or selected area.
- Evidence freshness.
- Source reliability.

### Empty State

If no exact matches exist, show nearby or related suggestions:

- Similar foods.
- Broader categories.
- Places with weak review mentions.
- Prompt to upload a menu photo for a known place.

## 2. Search Results

### Goal

Help users compare places quickly and decide where to go.

### Requirements

- Results should be place cards optimized around the searched food.
- Each card must show the strongest evidence for the query.
- Cards should expose quick actions:
  - Save.
  - Open in Google Maps.
  - View menu evidence.
  - View reviews.
- Users can sort by:
  - Best match.
  - Google Maps rank signal.
  - Rating.
  - Review count.
  - Distance.
  - Recently verified.
- Users can tap a card to open the place detail page.

## 3. Place Detail Page

### Goal

Show everything needed to verify that a place sells the searched food and decide whether to visit.

### Requirements

- Header:
  - Place name.
  - Category, rating, review count, price level, opening status.
  - Address and map preview.
  - Save and open in maps actions.
- Food match section:
  - Matched food or menu item.
  - Confidence score.
  - Evidence snippets and source links.
  - Last seen or last verified date.
- Menu section:
  - Extracted menu items grouped by category where possible.
  - Original menu images.
  - OCR text view for debugging or transparency.
  - Search within menu.
- Reviews section:
  - Google Maps reviews if available through permitted APIs or user-visible links.
  - Highlighted review mentions of the searched food.
  - Review date, rating, author display name if permitted by data source.
- Photos section:
  - Menu photos.
  - Food photos that include matching OCR or user tags.
- Corrections:
  - Users can report that an item is unavailable.
  - Users can submit a new menu photo.

## 4. Google Maps Reviews

### Goal

Let users inspect review context without manually jumping between apps.

### Requirements

- Show reviews associated with a place when data access is permitted.
- Highlight mentions of the searched food or related terms.
- Preserve attribution required by the data provider.
- Link back to the source review/place when required.
- Do not store or display personal data beyond what the data source permits.

### Notes

Google Places APIs may provide limited review data. If full Google Maps review access is not legally or technically available, the MVP can show:

- A link to open reviews in Google Maps.
- Permitted review excerpts from approved APIs.
- User-submitted notes and corrections.
- Review evidence from licensed or first-party data.

## 5. Menu Viewer

### Goal

Show extracted menus and original menu evidence in a way users can trust.

### Requirements

- Support menu sources:
  - User-uploaded photo.
  - Place photo from an approved source.
  - Restaurant website menu.
  - Partner-uploaded menu.
  - Manually entered menu.
- Display original images alongside extracted text.
- Group items into sections such as coffee, pastries, brunch, desserts when detected.
- Show prices when OCR confidence is high.
- Mark uncertain OCR text.
- Show last updated date and source.
- Allow users to search within a menu.

## 6. Take Picture Of Menu

### Goal

Let users add or refresh menu data for a specified place.

### Requirements

- User selects an existing place or creates a suggested place.
- User captures or uploads one or more menu photos.
- App asks for optional context:
  - Menu type: main menu, drinks, specials, dessert, seasonal.
  - Date seen.
  - Whether prices are visible.
- App runs OCR and extraction.
- User can review extracted items before submission.
- Submission creates a menu evidence record.
- Admin or automated moderation can approve, reject, or merge the record.

### Edge Cases

- Blurry photo.
- Multi-page menus.
- Non-English menus.
- Handwritten boards.
- Reflections, shadows, or angled photos.
- Menu item split across lines.

## 7. Saved Places

### Goal

Let users keep track of places they want to visit or revisit.

### Requirements

- Save and unsave places from search results and place detail pages.
- Saved list should show:
  - Place name.
  - Saved food query or reason if applicable.
  - Rating.
  - Area.
  - Opening status if available.
  - Last matched food evidence.
- Support folders or tags after MVP:
  - Want to try.
  - Favorites.
  - Date ideas.
  - Work cafes.
- Saved places should be filterable by food query.

## 8. Open In Maps

### Goal

Move users from discovery to navigation.

### Requirements

- Provide a prominent "Open in Google Maps" action.
- Use a stable Google Maps place URL or place ID when available.
- Fallback to address query if place ID is missing.
- Track outbound clicks for product analytics.
- Preserve attribution and provider requirements.

## 9. Restaurant Ranking By Food

### Goal

Rank places specifically for a dish, not just overall venue quality.

### Requirements

- For a selected food, compute a food-specific rank.
- Inputs may include:
  - Menu match confidence.
  - Review sentiment around that food.
  - Number of unique review mentions.
  - Recency of mentions.
  - User saves and clicks for that food.
  - Overall place rating and review count.
- Show food-specific badges such as:
  - Strong menu match.
  - Popular in reviews.
  - Recently verified.
  - User favorite.

### MVP Status

Use a simple score for MVP. More sophisticated food-specific ranking can come after enough usage and review evidence exists.
