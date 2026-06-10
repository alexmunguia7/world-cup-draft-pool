# Version 2 Roadmap

Version 1 is a complete MVP with manual scoring and core functionality. Version 2 will add automatic World Cup tracking.

## Version 2 Features

### 1. Automatic Match Tracking

Connect to a football data API to automatically pull:
- Fixtures and match schedules
- Live scores during matches
- Final match results
- World Cup standings
- Team advancement/elimination

**Recommended APIs:**
- API-FOOTBALL (https://api-football.com) - Most comprehensive
- Sportmonks (https://sportmonks.com) - Good free tier
- Football-Data.org (https://football-data.org) - Free with limits

### 2. Match Center Page

```
/match-center

Display:
- Date and time of match
- Venue/stadium
- Competition stage (group, knockout, etc.)
- Team 1 vs Team 2 with flags
- Live score (if in progress)
- Final score (if completed)
- Match status (scheduled, live, final)
- Which players own each team
```

### 3. Automatic Score Sync

- Fetch match data every 5 minutes during live matches
- Fetch every 30-60 minutes when no matches are live
- Update team records (wins/draws/losses)
- Track advancement automatically
- Auto-recalculate standings

### 4. Team Alias Matching

Handle API naming differences:
```
Draft name → API name mapping
"USA" → "United States"
"South Korea" → "Korea Republic"
"Iran" → "IR Iran"
```

Create `team_aliases` table to store mappings.

### 5. Live Leaderboard

Real-time updates:
- Live score updates
- Point calculations as matches complete
- Auto-refresh every 30 seconds during tournaments
- Highlight teams currently playing

### 6. Admin Enhancements

- Sync/resync matches from API
- Manual override for API data (in case of errors)
- Retry failed syncs
- View API sync logs

## Implementation Plan

### Phase 1: API Integration (Week 1)
```bash
# Create API service
src/lib/api-football.ts - Connect to football API
src/lib/team-matching.ts - Match drafted teams to API teams
src/app/api/matches/sync/route.ts - Sync match data
src/app/api/scores/sync/route.ts - Auto-update scores
```

### Phase 2: Match Center (Week 2)
```bash
src/app/match-center/page.tsx - Display all matches
src/components/MatchCard.tsx - Individual match display
src/components/LiveScore.tsx - Live score ticker
```

### Phase 3: Real-time Updates (Week 3)
```bash
# Use server-sent events or polling
src/hooks/useMatchUpdates.ts - Client hook for updates
src/components/LiveLeaderboard.tsx - Auto-updating standings
Refactor leaderboard to use real-time data
```

### Phase 4: Testing & Polish (Week 4)
- Unit tests for API integration
- E2E tests for score sync
- Error handling and retry logic
- Performance optimization

## Database Schema Additions

### matches table updates
```sql
ALTER TABLE matches ADD COLUMN (
  api_id TEXT UNIQUE,
  last_synced_at TIMESTAMP,
  sync_error TEXT,
  sync_retry_count INT DEFAULT 0
);
```

### New tables
```sql
CREATE TABLE api_sync_logs (
  id UUID PRIMARY KEY,
  action TEXT,
  status TEXT,
  error_message TEXT,
  synced_count INT,
  created_at TIMESTAMP
);

CREATE TABLE team_aliases (
  id UUID PRIMARY KEY,
  team_id UUID REFERENCES teams(id),
  api_provider TEXT,
  api_team_id TEXT,
  api_team_name TEXT,
  created_at TIMESTAMP
);
```

## API Choice Recommendation

### API-FOOTBALL
- Pros: Most complete, good free tier, excellent documentation
- Cons: Rate limits on free tier
- Cost: Free - $99/month
- Status Codes:
  - Free: 100 requests/day
  - Premium: Unlimited

### Setup
```bash
# Install client
npm install api-football

# Add to .env
FOOTBALL_API_KEY=your-key-here
FOOTBALL_API_BASE=https://api-football-beta.p.rapidapi.com
```

## V2 Code Example

```typescript
// src/lib/api-football.ts
import axios from 'axios'

export async function syncMatches() {
  const response = await axios.get(
    `${process.env.FOOTBALL_API_BASE}/fixtures`,
    {
      params: {
        league: 1, // World Cup league ID
        season: 2022,
      },
      headers: {
        'x-rapidapi-key': process.env.FOOTBALL_API_KEY,
      },
    }
  )

  return response.data.response
}

export async function matchTeamToApi(
  draftedTeamName: string,
  apiTeams: any[]
) {
  // Fuzzy match drafted team to API team
  // Store mapping in team_aliases table
}
```

## Rollback Plan

If API sync fails:
1. Manual scoring still works (Version 1)
2. Admin can override API data
3. Can disable API sync and continue with manual scoring
4. Fallback to last known good state from audit log

## Success Criteria for V2

- [ ] All 48 World Cup matches automatically tracked
- [ ] Scores update within 5 minutes of match completion
- [ ] Leaderboard updates automatically
- [ ] No manual intervention needed after draft
- [ ] API errors handled gracefully
- [ ] 99% accuracy in team matching
- [ ] <1 second response time for leaderboard

## Future Enhancements (V3+)

- Push notifications for match results
- Draft timer and auto-picks
- Mobile app
- Multi-league support
- Draft trading between players
- Player comparison stats
- Historical league archives
- ELO ratings
- Subscription model for premium features
