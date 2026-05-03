# LetsEat

LetsEat is a food-first cafe discovery PWA. Search for the food or drink you want, then see cafes that appear to sell it based on the latest menu data.

## MVP Direction

- Platform: dependency-free Progressive Web App.
- Data: static real-data export from local Postgres for the current prototype.
- Database target: Postgres schema in `db/schema.sql`.
- Auth: none for MVP.
- Saved places: local browser storage.
- Reviews: Google rating/review count in-app, review reading opens in Google Maps.
- Menus: one latest active menu per place.
- Sorting: independent modes for relevance, Google review quality, and distance.

## Run Locally With Docker

The prototype runs in Docker. Do not run a host web server.

Copy environment defaults if you want to customize them:

```sh
cp .env.example .env
```

```sh
docker compose up --build
```

Then open `http://localhost:8080`.

To stop it:

```sh
docker compose down
```

Postgres also runs in Docker. The schema in `db/schema.sql` is mounted into the Postgres init directory and applied when the database volume is first created.

The PWA reads `data/real-cafes.json`, a static export generated from the local Postgres data. After importing or changing menu data, refresh the export:

```sh
node scripts/export-static-data.mjs
```

## Import Real Singapore Cafes

The importer uses Google Places API from `.env` and writes generated artifacts under ignored `data/imports/`.

Dry run, no API calls:

```sh
node scripts/import-google-places.mjs --dry-run
```

Fetch real Singapore cafe data with a request cap. The current Singapore-wide cafe scan uses 60 capped Places API requests across the island:

```sh
PLACES_IMPORT_DRY_RUN=false node scripts/import-google-places.mjs --execute --max-requests 60 --radius 2500 --result-count 20
```

Apply the generated SQL to Docker Postgres:

```sh
./scripts/apply-google-places-import.sh
```

Generated Google data is intentionally ignored by git until the data policy is reviewed.

## Specs

Product and technical specs live in [`specs/`](./specs/README.md).
