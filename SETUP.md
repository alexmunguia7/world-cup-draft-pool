# Setup Instructions

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/alexmunguia7/world-cup-draft-pool.git
cd world-cup-draft-pool
npm install
```

### 2. Create Supabase Project
- Go to https://supabase.com
- Create new project
- Save Project URL and Anon Key

### 3. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 4. Setup Database
```bash
# Run migrations
npm run db:push

# Seed with 48 teams and 6 players
npm run db:seed
```

### 5. Start Development
```bash
npm run dev
# Open http://localhost:3000
```

## Admin Login

Default admin password: whatever you set in `.env.local` for `ADMIN_PASSWORD`

Access admin panel at: http://localhost:3000/admin

## Features

### Public Pages (No Login Required)
- Home dashboard
- Draft board history
- Teams list with flags
- Player rosters
- Leaderboard
- Rules page
- Payouts page

### Admin Pages (Login Required)
- Draft management
- Manual scoring
- Team editing
- Player management
- Audit log
- League reset
- Data export

## Database Schema

### Tables
- `players` - 6 league players
- `teams` - 48 World Cup teams
- `draft_picks` - Draft history
- `matches` - World Cup fixtures
- `scores` - Team performance scores
- `standings` - Player rankings
- `settings` - League configuration
- `audit_log` - All admin actions

## Scoring System

### Group Stage
- Win: 3 points
- Draw: 1 point
- Loss: 0 points

### Advancement
- Round of 32: 5 points
- Round of 16: 15 total
- Quarterfinal: 30 total
- Semifinal: 50 total
- Final: 75 total
- Champion: 110 total

## API Endpoints

### Admin
- `POST /api/admin` - Login
- `GET /api/admin` - Get status
- `POST /api/admin/export` - Export data
- `POST /api/admin/reset` - Reset league

### Draft
- `POST /api/draft/pick` - Record pick
- `GET /api/draft/pick` - Get draft status
- `POST /api/draft/undo` - Undo last pick
- `POST /api/draft/lock` - Lock draft

### Scoring
- `POST /api/scoring/manual` - Record manual score
- `POST /api/scoring/recalculate` - Recalculate standings
- `GET /api/scoring/recalculate` - Get standings

## Testing

```bash
# Run tests
npm test

# Run type check
npm run type-check

# Lint
npm run lint
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel deployment instructions.

## Support

For issues or questions, contact the admin or check the Rules page for league information.
