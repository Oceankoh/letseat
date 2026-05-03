-- LetsEat MVP Postgres schema.
-- Scope: Singapore cafe-first food search with latest active menus, no auth, and local-only saved places.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE places (
  id text PRIMARY KEY,
  name text NOT NULL,
  google_place_id text UNIQUE,
  address text NOT NULL,
  neighborhood text,
  latitude numeric(9,6) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude numeric(9,6) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  categories text[] NOT NULL DEFAULT '{}',
  price_level smallint CHECK (price_level BETWEEN 1 AND 4),
  rating numeric(2,1) CHECK (rating BETWEEN 0 AND 5),
  review_count integer CHECK (review_count >= 0),
  opening_hours jsonb NOT NULL DEFAULT '{}'::jsonb,
  google_maps_url text NOT NULL,
  google_reviews_url text NOT NULL,
  primary_photo_url text,
  source text NOT NULL DEFAULT 'manual_seed' CHECK (
    source IN ('manual_seed', 'google_places_api', 'admin_import', 'partner', 'restaurant_website')
  ),
  source_updated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE menus (
  id text PRIMARY KEY,
  place_id text NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  source_type text NOT NULL CHECK (
    source_type IN ('user_upload', 'approved_api', 'restaurant_website', 'partner', 'manual', 'admin')
  ),
  source_url text,
  captured_at timestamptz NOT NULL,
  license_status text NOT NULL DEFAULT 'internal_seed' CHECK (
    license_status IN ('internal_seed', 'user_submitted', 'restaurant_owned', 'partner_licensed', 'api_permitted', 'unknown')
  ),
  processing_status text NOT NULL CHECK (
    processing_status IN (
      'uploaded',
      'preprocessing',
      'ocr_running',
      'ocr_failed',
      'parsing_running',
      'needs_review',
      'approved_active',
      'rejected'
    )
  ),
  is_active boolean NOT NULL DEFAULT false,
  raw_ocr_text text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, place_id)
);

CREATE UNIQUE INDEX menus_one_active_per_place_idx
  ON menus(place_id)
  WHERE is_active;

CREATE TABLE menu_images (
  id text PRIMARY KEY,
  menu_id text NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  image_hash text,
  width integer CHECK (width > 0),
  height integer CHECK (height > 0),
  ocr_status text NOT NULL DEFAULT 'not_started' CHECK (
    ocr_status IN ('not_started', 'queued', 'running', 'succeeded', 'failed', 'skipped')
  ),
  quality_score numeric(3,2) CHECK (quality_score BETWEEN 0 AND 1),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE menu_items (
  id text PRIMARY KEY,
  place_id text NOT NULL,
  menu_id text NOT NULL,
  name text NOT NULL,
  normalized_name text NOT NULL,
  description text,
  category text,
  price numeric(8,2) CHECK (price >= 0),
  currency char(3) NOT NULL DEFAULT 'SGD',
  dietary_tags text[] NOT NULL DEFAULT '{}',
  ocr_confidence numeric(3,2) CHECK (ocr_confidence BETWEEN 0 AND 1),
  extraction_confidence numeric(3,2) CHECK (extraction_confidence BETWEEN 0 AND 1),
  source_text text,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (menu_id, place_id) REFERENCES menus(id, place_id) ON DELETE CASCADE
);

CREATE TABLE food_terms (
  id text PRIMARY KEY,
  canonical_name text NOT NULL UNIQUE,
  aliases text[] NOT NULL DEFAULT '{}',
  category text,
  ingredients text[] NOT NULL DEFAULT '{}',
  cuisine_tags text[] NOT NULL DEFAULT '{}',
  embedding jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE food_place_evidence (
  id text PRIMARY KEY,
  place_id text NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  food_term_id text NOT NULL REFERENCES food_terms(id) ON DELETE CASCADE,
  menu_item_id text NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  evidence_type text NOT NULL CHECK (
    evidence_type IN ('menu_item', 'photo_ocr', 'website', 'manual')
  ),
  evidence_text text NOT NULL,
  source_id text,
  match_kind text NOT NULL CHECK (
    match_kind IN ('exact_menu_item', 'exact_alias', 'prefix_or_token', 'partial_substring', 'manual')
  ),
  confidence numeric(3,2) NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  seen_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (food_term_id, menu_item_id, evidence_type)
);

CREATE INDEX places_lat_lng_idx ON places(latitude, longitude);
CREATE INDEX places_categories_idx ON places USING gin(categories);
CREATE INDEX places_google_review_quality_idx ON places(rating DESC, review_count DESC);

CREATE INDEX menus_place_active_idx ON menus(place_id, is_active);
CREATE INDEX menu_images_menu_idx ON menu_images(menu_id, sort_order);
CREATE INDEX menu_items_menu_idx ON menu_items(menu_id, category, name);
CREATE INDEX menu_items_place_idx ON menu_items(place_id);
CREATE INDEX menu_items_search_idx ON menu_items USING gin(
  to_tsvector('simple', normalized_name || ' ' || coalesce(description, '') || ' ' || coalesce(category, ''))
);

CREATE INDEX food_terms_aliases_idx ON food_terms USING gin(aliases);
CREATE INDEX food_place_evidence_term_idx ON food_place_evidence(food_term_id, confidence DESC, seen_at DESC);
CREATE INDEX food_place_evidence_place_term_idx ON food_place_evidence(place_id, food_term_id, confidence DESC);
CREATE INDEX food_place_evidence_item_idx ON food_place_evidence(menu_item_id);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER places_set_updated_at
  BEFORE UPDATE ON places
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER menus_set_updated_at
  BEFORE UPDATE ON menus
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER menu_items_set_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER food_terms_set_updated_at
  BEFORE UPDATE ON food_terms
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE places IS 'Cafe and food place catalog. Google reviews are linked externally; review text is not stored.';
COMMENT ON TABLE menus IS 'Latest-menu-first storage. Partial unique index enforces one active menu per place.';
COMMENT ON TABLE menu_images IS 'Menu image references used for OCR and evidence display.';
COMMENT ON TABLE menu_items IS 'Searchable extracted or manually entered items from the latest active menu.';
COMMENT ON TABLE food_terms IS 'Canonical food concepts and aliases used by food-first search.';
COMMENT ON TABLE food_place_evidence IS 'Evidence connecting a food term to a place through a latest active menu item.';
