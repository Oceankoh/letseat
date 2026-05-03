# Product Vision

## Problem

Restaurant discovery usually starts with places: users search for a restaurant, inspect ratings, then dig through photos and menus to figure out whether the restaurant sells the specific food they want. This is slow, especially for cravings, dietary needs, cafe hopping, and food-specific recommendations.

LetsEat flips the search model. Users start with the food, and the app finds places that sell it.

## Target Users

- People with a specific craving: "I want tiramisu", "I want shakshuka", "I want iced hojicha".
- Cafe explorers who care about exact items, ambience, opening hours, and distance.
- Travelers who know what they want to eat but do not know local restaurant names.
- Users with dietary or preference constraints who need evidence before visiting.

## Initial Market

Start with cafes in one city or neighborhood cluster. Cafes are a good first segment because menus are often photo-heavy, item names are repeated across many places, and users frequently search for specific drinks, pastries, brunch dishes, and desserts.

## Core Promise

"Search any food. See where to eat it."

The product must show why it believes a place sells the searched food. Evidence matters: menu OCR snippets, menu photos, user uploads, and confidence scores should be visible enough that users can trust the result.

## Product Principles

- Food-first: search, ranking, and place pages should prioritize dishes and menu items over venue marketing.
- Evidence-backed: every food/place match should have at least one source or confidence explanation.
- Latest-menu-first: each place should expose one current active menu for search and display.
- Map-native: users should be able to move from discovery to directions quickly.
- Narrow but deep: the MVP should be strong for cafes before expanding to all food places.
- Respect data rights: use compliant APIs, licensed sources, user submissions, and public data responsibly.

## MVP Scope

Included:

- Cafe place catalog for a selected launch area.
- Progressive Web App experience.
- Postgres-backed place and menu database.
- Food search with place results.
- Place detail page.
- Menu extraction from images and available menu sources.
- Open Google Maps reviews externally.
- Save places locally without a user account.
- Open places in Google Maps.
- Sort independently by relevance or Google review quality.

Deferred:

- Full restaurant category expansion.
- Account system and cross-device saved places.
- Personalized recommendations.
- Social feeds.
- In-app ordering.
- Automated crawling at large geographic scale.
- Creator/restaurant owner dashboards.
- In-app Google Maps review display.

## Success Metrics

- Search success rate: percentage of food searches with at least one useful place result.
- Evidence coverage: percentage of returned places with menu evidence.
- Click-through to maps: percentage of searches that lead to "open in maps".
- Save rate: percentage of result views that are saved.
- Menu update coverage: percentage of active places with a latest menu.
- User correction rate: number of incorrect food/place matches reported per 100 result views.
