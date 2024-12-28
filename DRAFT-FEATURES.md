# Draft Features Implementation Plan

## Current Feature: Squad Information

### Overview

Display detailed squad information for draft FPL teams including player positions, status, and relevant statistics.

### Implementation Plan

#### 1. API Integration

- [x] Required endpoints:
  - `/api/draft/{league_id}/details` - League and team info
  - `/api/draft/entry/{team_id}/squad` - Squad details
  - `/api/bootstrap-static/` - Player status and metadata
- [x] Error handling for API authentication and rate limits

#### 2. Data Structure

```typescript
interface SquadPlayer {
  id: number;
  webName: string;
  position: "GKP" | "DEF" | "MID" | "FWD";
  team: string;
  status: "available" | "injured" | "doubtful" | "suspended";
  statusInfo?: string;
  nextFixture?: string;
  points: number;
  form: string;
}

interface TeamSquad {
  manager: string;
  teamName: string;
  players: {
    starting: SquadPlayer[];
    bench: SquadPlayer[];
  };
}
```

#### 3. Implementation Phases

##### Phase 1: Backend Setup ✅

- [x] Create new API endpoint `/api/draft/squad`
- [x] Implement data fetching and transformation
- [x] Add error handling and validation

##### Phase 2: UI Components ✅

- [x] Create `SquadView` component
- [x] Implement player card design
- [x] Add loading states and skeletons
- [x] Include basic layout structure

##### Phase 3: Integration ✅

- [x] Connect to existing draft league view
- [x] Add loading states
- [x] Implement error handling UI
- [x] Add refresh functionality

#### 4. UI/UX Design (In Progress)

- [ ] Squad layout improvements:
  - [ ] Formation-based view (4-4-2, 3-5-2, etc.)
  - [ ] Enhanced list view with position grouping
  - [ ] Responsive design for mobile
- [ ] Enhanced player cards with:
  - [ ] Improved player name and team display
  - [ ] Position indicator with color coding
  - [ ] Status badge (injured/doubtful)
  - [ ] Next fixture information
  - [ ] Form/Points visualization

### Progress Tracking

#### Current Status

- Basic implementation completed ✅
- API integration working correctly ✅
- Core UI components in place ✅
- Loading states and error handling implemented ✅

#### Next Steps

1. Implement formation-based view
2. Add enhanced player cards with status badges
3. Include next fixture information
4. Add form/points visualization

#### Notes

- API integration is working well
- Error handling is in place
- Need to focus on UI/UX improvements
- Consider adding player statistics tooltips
