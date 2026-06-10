// Seed script for initial setup
// Usage: npm run db:seed

const { createClient } = require('@supabase/supabase-js')
const WORLD_CUP_TEAMS = require('./teams')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY
const leagueId = process.env.NEXT_PUBLIC_LEAGUE_ID || 'default'

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedDatabase() {
  console.log('🌱 Seeding World Cup Draft Pool database...')

  try {
    // 1. Create players
    console.log('\n📝 Creating 6 players...')
    const players = [
      { name: 'Player 1', order: 1, buy_in: 25 },
      { name: 'Player 2', order: 2, buy_in: 25 },
      { name: 'Player 3', order: 3, buy_in: 25 },
      { name: 'Player 4', order: 4, buy_in: 25 },
      { name: 'Player 5', order: 5, buy_in: 25 },
      { name: 'Player 6', order: 6, buy_in: 25 },
    ]

    const { data: playersData, error: playersError } = await supabase
      .from('players')
      .insert(players.map((p) => ({ ...p, league_id: leagueId })))
      .select()

    if (playersError) throw playersError
    console.log(`✅ Created ${playersData.length} players`)

    // 2. Create teams
    console.log('\n🌍 Creating 48 World Cup teams...')
    const { data: teamsData, error: teamsError } = await supabase
      .from('teams')
      .insert(
        WORLD_CUP_TEAMS.map((team) => ({
          league_id: leagueId,
          country: team.country,
          fifa_code: team.fifa_code,
          iso_code: team.iso_code,
          flag_emoji: team.flag_emoji,
          aliases: team.aliases,
          status: 'available',
        }))
      )
      .select()

    if (teamsError) throw teamsError
    console.log(`✅ Created ${teamsData.length} teams`)

    // 3. Initialize settings
    console.log('\n⚙️ Initializing settings...')
    const settings = [
      { key: 'draft_started', value: 'false' },
      { key: 'draft_completed', value: 'false' },
      { key: 'draft_locked', value: 'false' },
      { key: 'current_round', value: '0' },
      { key: 'current_pick', value: '0' },
      { key: 'buy_in', value: '25' },
      { key: 'total_pot', value: '150' },
    ]

    const { error: settingsError } = await supabase
      .from('settings')
      .insert(settings.map((s) => ({ ...s, league_id: leagueId })))

    if (settingsError) throw settingsError
    console.log(`✅ Initialized ${settings.length} settings`)

    // 4. Initialize team scores
    console.log('\n📊 Initializing team scores...')
    const { error: scoresError } = await supabase
      .from('scores')
      .insert(
        teamsData.map((team) => ({
          league_id: leagueId,
          team_id: team.id,
          group_wins: 0,
          group_draws: 0,
          group_losses: 0,
          advancement_stage: 'group',
          advancement_points: 0,
          total_points: 0,
        }))
      )

    if (scoresError) throw scoresError
    console.log(`✅ Initialized ${teamsData.length} team scores`)

    console.log('\n✅ Database seeding complete!')
    console.log(`\n📋 Ready to start draft with ${playersData.length} players and ${teamsData.length} teams`)
    console.log('💰 Total pot: $150 (6 x $25 buy-in)')
    console.log('🏆 Winner takes all!')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seedDatabase()
