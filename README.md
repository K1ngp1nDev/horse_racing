# Horse Racing Game Trial Day

## Overview

This is a lightweight Vue 3 single-page application built as the front-end case study for an interactive horse racing game. The goal of the project is to demonstrate clean component-based architecture, state management with Vuex, animation, and progressive feature structure. Users can generate a race programme, start sequential races, watch animated horse movement, and inspect results.

## Core Features

- **Horse Generation**: 20 horses are generated with unique colors and random condition scores (1–100). Each has an ID and a display name.
- **Race Schedule**: Six rounds are created upon user request, each with a distinct distance: 1200, 1400, 1600, 1800, 2000, and 2200 meters. Each round selects 10 random horses from the pool.
- **Sequential Race Execution**: Rounds run one at a time. Race times are simulated based on horse condition plus randomness, normalized to a consistent range, and displayed progressively.
- **Animated Horse Movement**: Horse progress is animated in real time during a round according to their computed race time.
- **Live & Final Results**: Live finishes are shown as the race progresses; once a round completes, its results are recorded. An overall leaderboard aggregates top performers across all rounds.
- **Scoring**: Top 3 per round contribute to overall points (3, 2, 1) and the leading horses are highlighted.

## Tech Stack

- **Frontend**: Vue 3
- **State Management**: Vuex
- **UI Components**: Element Plus
- **Build Tooling**: Vite
- **Language**: JavaScript (ES Modules)

## Installation & Development

```bash
# clone repo
# install dependencies
npm install

# start development server (hot reload)
npm run dev  # assuming vite is configured in package.json
# build for production
npm run build
```
