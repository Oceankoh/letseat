#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const outputPath = process.argv[2] || "data/real-cafes.json";

const query = `
WITH active_menus AS (
  SELECT
    m.*,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', mi.id,
            'name', mi.name,
            'normalized_name', mi.normalized_name,
            'description', mi.description,
            'category', mi.category,
            'price', mi.price,
            'currency', mi.currency,
            'dietary_tags', mi.dietary_tags,
            'ocr_confidence', mi.ocr_confidence,
            'extraction_confidence', mi.extraction_confidence
          )
          ORDER BY mi.category NULLS LAST, mi.name
        )
        FROM menu_items mi
        WHERE mi.menu_id = m.id
          AND mi.place_id = m.place_id
          AND mi.is_available
      ),
      '[]'::jsonb
    ) AS items,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', img.id,
            'image_url', img.image_url,
            'image_hash', img.image_hash,
            'width', img.width,
            'height', img.height,
            'ocr_status', img.ocr_status,
            'quality_score', img.quality_score,
            'sort_order', img.sort_order
          )
          ORDER BY img.sort_order, img.id
        )
        FROM menu_images img
        WHERE img.menu_id = m.id
      ),
      '[]'::jsonb
    ) AS images
  FROM menus m
  WHERE m.is_active
),
place_rows AS (
  SELECT jsonb_build_object(
    'id', p.id,
    'name', p.name,
    'google_place_id', p.google_place_id,
    'address', p.address,
    'neighborhood', p.neighborhood,
    'latitude', p.latitude,
    'longitude', p.longitude,
    'categories', p.categories,
    'price_level', p.price_level,
    'rating', p.rating,
    'review_count', p.review_count,
    'opening_hours', p.opening_hours,
    'google_maps_url', p.google_maps_url,
    'google_reviews_url', p.google_reviews_url,
    'primary_photo_url', p.primary_photo_url,
    'source', p.source,
    'source_updated_at', p.source_updated_at,
    'latest_menu', jsonb_build_object(
      'id', am.id,
      'source_type', am.source_type,
      'source_url', am.source_url,
      'captured_at', am.captured_at,
      'license_status', am.license_status,
      'processing_status', am.processing_status,
      'is_active', am.is_active,
      'images', am.images,
      'items', am.items
    )
  ) AS place_json,
  COALESCE(p.review_count, 0) AS review_count,
  COALESCE(p.rating, 0) AS rating,
  p.name
  FROM places p
  JOIN active_menus am ON am.place_id = p.id
  WHERE jsonb_array_length(am.items) > 0
)
SELECT jsonb_build_object(
  'version', 2,
  'generated_for', 'LetsEat MVP',
  'generated_at', now(),
  'currency', 'SGD',
  'notes', jsonb_build_object(
    'scope', 'Real Singapore Google Places data with source-attributed latest menu snapshots exported from local Postgres.',
    'place_source', 'Google Places API import plus manually/agentically researched menu sources.',
    'review_policy', 'Google review bodies are not stored; review links open in Google Maps.'
  ),
  'food_terms', '[]'::jsonb,
  'food_place_evidence', '[]'::jsonb,
  'places', COALESCE(
    (
      SELECT jsonb_agg(place_json ORDER BY review_count DESC, rating DESC, name)
      FROM place_rows
    ),
    '[]'::jsonb
  )
)::text;
`;

function main() {
  const stdout = execFileSync(
    "docker",
    ["compose", "exec", "-T", "db", "psql", "-U", "letseat", "-d", "letseat", "-t", "-A", "-c", query],
    {
      cwd: process.cwd(),
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024
    }
  );

  const parsed = JSON.parse(stdout.trim());
  const absoluteOutput = path.resolve(process.cwd(), outputPath);
  mkdirSync(path.dirname(absoluteOutput), { recursive: true });
  writeFileSync(absoluteOutput, `${JSON.stringify(parsed, null, 2)}\n`);

  const itemCount = parsed.places.reduce((count, place) => count + (place.latest_menu?.items?.length || 0), 0);
  console.log(`Exported ${parsed.places.length} places and ${itemCount} menu items to ${outputPath}`);
}

main();
