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

The product must show why it believes a place sells the searched food. Evidence matters: menu OCR snippets, menu photos, review mentions, review images, user uploads, and confidence scores should be visible enough that users can trust the result.

## Product Principles

- Food-first: search, ranking, and place pages should prioritize dishes and menu items over venue marketing.
- Evidence-backed: every food/place match should have at least one source or confidence explanation.
- Freshness-aware: menus change; stale evidence must be labeled and ranked lower.
- Map-native: users should be able to move from discovery to directions quickly.
- Narrow but deep: the MVP should be strong for cafes before expanding to all food places.
- Respect data rights: use compliant APIs, licensed sources, user submissions, and public data responsibly.

## MVP Scope

Included:

- Cafe place catalog for a selected launch area.
- Food search with place results.
- Place detail page.
- Menu extraction from images and available menu sources.
- Review viewing and review-food evidence.
- Save places.
- Open in Google Maps.
- Sort by relevance, Google Maps rank/rating signals, distance, and confidence.

Deferred:

- Full restaurant category expansion.
- Personalized recommendations.
- Social feeds.
- In-app ordering.
- Automated crawling at large geographic scale.
- Creator/restaurant owner dashboards.

## Success Metrics

- Search success rate: percentage of food searches with at least one useful place result.
- Evidence coverage: percentage of returned places with menu or review evidence.
- Click-through to maps: percentage of searches that lead to "open in maps".
- Save rate: percentage of result views that are saved.
- Freshness: percentage of menu evidence updated within the target freshness window.
- User correction rate: number of incorrect food/place matches reported per 100 result views.
