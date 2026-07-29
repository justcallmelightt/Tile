# Changelog

All notable Tile web releases are documented in this file.

## [2.0.0-alpha.1] - 2026-07-29

### Added

- Three-step school setup with timetable preview before applying changes
- Tile settings for meal alerts, data export/import, and one-step undo
- Per-subject and bulk subject editing with scoped NEIS restoration
- TypeScript NEIS client and automated build/type-check workflow

### Changed

- Refined modal hierarchy, responsive layouts, and settings navigation
- Updated the school subtitle and status bar from synchronized NEIS data
- Made Vercel the canonical web deployment while keeping GitHub Pages as a mirror

### Fixed

- Prevented subject restoration from clearing unrelated local edits and memos
- Restored both saved data and the visible timetable after failed school synchronization
- Prevented stale undo notifications from reverting the wrong change
- Validated imported backup data and rolled back partial imports safely
- Preserved 6th and 7th period timetable cells during NEIS synchronization

[2.0.0-alpha.1]: https://github.com/justcallmelightt/Tile/releases/tag/v2.0.0-alpha.1
