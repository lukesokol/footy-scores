# FootyScores — Olympic Endpoint Generator

A QA tool that generates expected FootyScores API endpoints for every Paris 2024 Olympic football match.

Built as a web application that retrieves match data from the [official Olympic Games competition schedule](https://stacy.olympics.com/en/paris-2024/competition-schedule), processes only football (soccer) matches, and generates API endpoint payloads matching the FootyScores schema.

## Solution Type

**Web Application** — React + TypeScript SPA served via Vite.

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (tested on 23.x)
- [pnpm](https://pnpm.io/) 10+

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd footy-scores

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The app will be available at `http://localhost:5173`.

### Commands

| Command              | Description                      |
| -------------------- | -------------------------------- |
| `pnpm dev`           | Start dev server with hot reload |
| `pnpm build`         | Type-check + production build    |
| `pnpm preview`       | Preview production build locally |
| `pnpm test`          | Run unit tests                   |
| `pnpm test:watch`    | Run tests in watch mode          |
| `pnpm test:coverage` | Run tests with coverage report   |
| `pnpm test:e2e`      | Run Playwright E2E tests         |
| `pnpm lint`          | ESLint check                     |
| `pnpm lint:fix`      | ESLint auto-fix                  |
| `pnpm format`        | Prettier format                  |
| `pnpm format:check`  | Prettier check (CI)              |
| `pnpm typecheck`     | TypeScript type checking         |

## Architecture

```
src/
├── types/              # TypeScript interfaces (match, endpoint, API)
├── services/           # Olympics data fetching + endpoint generation
├── hooks/              # React hooks (schedule, generator, export)
├── components/
│   ├── layout/         # Header, Footer, Layout
│   ├── matches/        # MatchList, MatchCard, EndpointPreview, MatchFilters
│   ├── controls/       # LoadDataButton, ExportButton, StatusIndicator
│   └── detail/         # MatchDetail
├── data/               # Static fallback dataset
├── lib/                # Shared utilities
└── test/               # Test setup and factories
```

### Data Flow

1. **Fetch** — User clicks "Load Data" → app fetches football schedule from the Olympics API (or loads static fallback)
2. **Parse** — Raw schedule data is filtered to football-only matches and validated
3. **Generate** — Each match is mapped to a FootyScores API endpoint following the `example.json` schema
4. **Display** — Matches and their generated endpoints are shown in a list with filtering
5. **Export** — User exports all endpoints as a JSON file for automated testing

## Data Retrieval

### Primary Source

The app fetches match data from the Olympics schedule API:

- Endpoint: `sph-s-api.olympics.com/summer/schedules/api/ENG/schedule/sport/FBL`
- Proxied through Vite dev server at `/api/olympics` to handle CORS
- Only football (discipline code `FBL`) matches are processed

### Static Fallback

A pre-fetched dataset is included at `src/data/paris2024-schedule.json` for:

- Offline development
- Demo/presentation mode
- Cases where the Olympics API is unavailable

### CORS Handling

- **Development**: Vite dev proxy handles CORS (configured in `vite.config.ts`)
- **Production**: Use the static fallback dataset, or deploy behind a reverse proxy

## Endpoint Structure

Each generated endpoint follows the exact structure defined in [`references/example.json`](references/example.json):

```json
{
  "competition": { "name": "...", "season": "Paris 2024", "round": "..." },
  "venue": { "name": "...", "city": "..." },
  "kickoff": "2024-07-24T15:00:00+02:00",
  "status": "FT",
  "teams": { "home": "...", "away": "..." },
  "score": { "home": 0, "away": 0, "halfTime": { "home": 0, "away": 0 } },
  "scorers": [],
  "lineups": null
}
```

### Field Mapping

| Field                | Source               | Notes                                   |
| -------------------- | -------------------- | --------------------------------------- |
| `competition.name`   | Schedule event name  | "Olympic Football Tournament Men/Women" |
| `competition.season` | Fixed                | "Paris 2024"                            |
| `competition.round`  | Schedule phase       | Group stage, Quarterfinal, etc.         |
| `venue`              | Schedule location    | Stadium name and city                   |
| `kickoff`            | Schedule start time  | ISO 8601 with timezone                  |
| `status`             | Inferred             | "FT" for completed matches              |
| `teams`              | Schedule competitors | Home/away assignment                    |
| `score`              | Schedule result      | `null` if not available                 |
| `scorers`            | Not in schedule      | Empty array `[]`                        |
| `lineups`            | Not in schedule      | `null`                                  |

## Endpoint Ordering

The default output is sorted deterministically:

1. **Kickoff date/time** — ascending (earliest first)
2. **Gender** — Men's matches before Women's for the same kickoff time
3. **Match unit** — By schedule unit code for remaining ties

This ensures identical output for identical input data.

## Assumptions

1. **Data completeness**: The Olympics schedule does not include detailed match data (scorers, lineups, halftime scores). These fields are generated with correct types but contain empty/null values.
2. **Team assignment**: Home/away designation follows the schedule order. Where the schedule doesn't specify, the first-listed team is treated as home.
3. **Match count**: Paris 2024 football consisted of 32 men's matches (16 teams) and 24 women's matches (12 teams) = 56 total.
4. **Timezone**: All kickoff times use the timezone provided by the schedule source (Paris local time, UTC+2).
5. **Match status**: All Paris 2024 matches are completed, so status is "FT" for all.

## Deployment

### Static Hosting (Vercel / Netlify / GitHub Pages)

```bash
pnpm build
# Upload dist/ folder to your hosting provider
```

### Docker

```bash
docker build -t footy-scores .
docker run -p 8080:80 footy-scores
# App available at http://localhost:8080
```

### Podman

The Dockerfile is OCI-compliant and works with Podman out of the box:

```bash
podman build -t footy-scores .
podman run -p 8080:80 footy-scores
# App available at http://localhost:8080
```

### Manual

```bash
pnpm build
pnpm preview
# App available at http://localhost:4173
```

## Tech Stack

- **React 19** + **TypeScript** (strict mode) on **Vite 8**
- **Tailwind CSS v4** for styling
- **Vitest** + **React Testing Library** for unit tests
- **Playwright** for E2E tests
- **pnpm** as package manager
- **ESLint** + **Prettier** for code quality

## License

MIT
