# Feature Specs

## 1. Food Search

### Goal

Let users search for a food, drink, ingredient, or dish and see places in the selected category that likely sell it.

### Requirements

- Accept free-text food queries such as `latte`, `banana bread`, `carbonara`, `gluten free cake`.
- Provide category tabs so users can choose the type of place they want to search within:
  - All.
  - Cafes.
  - Restaurants.
  - Bakeries.
  - Dessert shops.
  - Hawker stalls or food courts where relevant.
- The selected category tab scopes the food search. For example, under the Cafes tab, a search for `tiramisu` should return cafes whose latest menu evidence includes tiramisu or a related match.
- Normalize common variants, spelling differences, plurals, and synonyms.
- Support partial matching for menu item names.
- Return a ranked list of places with:
  - Place name.
  - Primary photo when available.
  - Rating and review count.
  - Distance or area.
  - Opening status if available.
  - Matched menu item or OCR phrase.
  - Evidence source: latest menu, user photo, business website, or external API.
  - Confidence indicator.
- Allow switching between list and map views.
- Allow filters:
  - Place category.
  - Open now.
  - Distance.
  - Rating threshold.
  - Evidence type.
  - Price level if available.
  - Saved only.

### Sort Options

Food search should not use one blended ranking model in the MVP. Users should be able to choose independent sort modes:

- Relevance: exact and partial food matches in the latest menu, with stronger matches first.
- Google review quality: Google rating and review count, with higher-rated and better-supported places first.
- Distance: nearest places first when location or map area is available.

### Category Tabs

Category tabs are a primary search control, not only a filter drawer option. Tabs should remain visible near the search field so users can quickly switch between place types without re-entering the food query.

Requirements:

- Preserve the current food query when switching tabs.
- Re-run the same query against the newly selected category.
- Show result counts per tab when inexpensive enough to compute.
- Keep Cafes as the strongest initial category for MVP data quality.
- Support an All tab that searches across every available place category.
- If a category has no matching results, show category-aware empty states and suggest nearby tabs or related foods.

### Empty State

If no exact matches exist, show nearby or related suggestions:

- Similar foods.
- Broader categories.
- Places with weak menu matches.
- Prompt to upload a menu photo for a known place.

## 2. Search Results

### Goal

Help users compare places quickly and decide where to go.

### Requirements

- Results should be place cards optimized around the searched food.
- Results should reflect the active category tab.
- Each card must show the strongest evidence for the query.
- Cards should expose quick actions:
  - Save.
  - Open in Google Maps.
  - View menu evidence.
  - Open Google Maps reviews.
- Users can sort by:
  - Relevance.
  - Google review quality.
  - Distance.
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
  - Button or link to open the place reviews in Google Maps.
  - No in-app storage or rendering of Google review text for MVP.
- Photos section:
  - Menu photos.
  - Food photos that include matching OCR or user tags.
- Corrections:
  - Users can report that an item is unavailable.
  - Users can submit a new menu photo.

## 4. Google Maps Reviews Handoff

### Goal

Let users inspect Google Maps review context through Google Maps instead of storing or rendering reviews in LetsEat.

### Requirements

- Show Google rating and review count on place cards and place detail pages when available.
- Provide a clear action to open reviews in Google Maps.
- Use the Google place URL or place ID when available.
- Do not store Google review text in the MVP.
- Do not render Google review author names, review bodies, or review snippets in-app.
- Preserve attribution and provider requirements for Google place data.

### Notes

Review text extraction and review-food evidence are deferred. The MVP can still use Google rating and review count as a sort option.

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
- Each place has one latest active menu. New approved menu submissions replace the active menu.

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
- Submission creates a pending menu replacement.
- Admin or automated moderation can approve, reject, or edit the replacement.
- Approved submissions become the latest active menu for the place.

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

- Save and unsave places from search results and place detail pages without signing in.
- Store saved places locally on the device/browser for MVP.
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
- Cross-device sync is deferred until an account system exists.

## 8. Open In Maps

### Goal

Move users from discovery to navigation.

### Requirements

- Provide a prominent "Open in Google Maps" action.
- Use a stable Google Maps place URL or place ID when available.
- Fallback to address query if place ID is missing.
- Track outbound clicks for product analytics.
- Preserve attribution and provider requirements.

## 9. Food Search Sorting

### Goal

Let users choose whether food results are ordered by menu relevance or Google review quality.

### Requirements

- Relevance sort:
  - Prioritize exact menu item matches.
  - Then partial menu item matches.
  - Then alias/synonym matches.
  - Use OCR/extraction confidence as a tiebreaker.
- Google review quality sort:
  - Prioritize places with stronger Google rating and review count.
  - Use menu relevance as a minimum inclusion filter, not the primary ordering.
  - Do not imply this is an official Google Maps ranking unless the data source explicitly provides such a rank.
- Distance sort:
  - Prioritize nearest matching places.
  - Require user location permission or a selected map area.

### MVP Status

Keep sort options independent. Do not build a blended food-specific ranking model for MVP.
