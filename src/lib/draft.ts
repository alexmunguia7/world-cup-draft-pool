/**
 * Snake Draft Calculations
 * 6 players, 8 rounds, 48 teams total
 */

export const TOTAL_PLAYERS = 6
export const TEAMS_PER_PLAYER = 8
export const TOTAL_ROUNDS = 8
export const TOTAL_TEAMS = TOTAL_PLAYERS * TEAMS_PER_PLAYER

export type PickInfo = {
  round: number
  position: number
  pickNumber: number
  playerOrder: number
}

/**
 * Get pick order for a specific pick number
 * Snake draft: rounds 1,3,5,7 go 1->6, rounds 2,4,6,8 go 6->1
 */
export function getPickInfo(pickNumber: number): PickInfo {
  const round = Math.ceil(pickNumber / TOTAL_PLAYERS)
  const position = ((pickNumber - 1) % TOTAL_PLAYERS) + 1

  // Snake draft logic
  const isReversedRound = round % 2 === 0
  const playerOrder = isReversedRound
    ? TOTAL_PLAYERS - position + 1
    : position

  return {
    round,
    position,
    pickNumber,
    playerOrder,
  }
}

/**
 * Get next pick number in draft sequence
 */
export function getNextPickNumber(currentPickNumber: number): number {
  const nextPick = currentPickNumber + 1
  if (nextPick > TOTAL_TEAMS) {
    return TOTAL_TEAMS // Draft complete
  }
  return nextPick
}

/**
 * Get player order for current pick (1-6)
 */
export function getCurrentPlayerOrder(pickNumber: number): number {
  const { playerOrder } = getPickInfo(pickNumber)
  return playerOrder
}

/**
 * Get round and position from player order and round
 * Used for displaying draft board grid
 */
export function getPlayerPosition(
  playerOrder: number,
  round: number
): number {
  const isReversedRound = round % 2 === 0
  return isReversedRound
    ? TOTAL_PLAYERS - playerOrder + 1
    : playerOrder
}

/**
 * Get all picks for a player across all rounds
 */
export function getPlayerPickNumbers(playerOrder: number): number[] {
  const picks: number[] = []
  for (let round = 1; round <= TOTAL_ROUNDS; round++) {
    const isReversedRound = round % 2 === 0
    const position = isReversedRound
      ? TOTAL_PLAYERS - playerOrder + 1
      : playerOrder
    const pickNumber = (round - 1) * TOTAL_PLAYERS + position
    picks.push(pickNumber)
  }
  return picks
}

/**
 * Validate pick number is valid
 */
export function isValidPickNumber(pickNumber: number): boolean {
  return pickNumber >= 1 && pickNumber <= TOTAL_TEAMS
}

/**
 * Get draft board grid (8 rounds x 6 players)
 */
export function getDraftBoardGrid(): PickInfo[][] {
  const grid: PickInfo[][] = []
  for (let round = 1; round <= TOTAL_ROUNDS; round++) {
    const roundPicks: PickInfo[] = []
    for (let position = 1; position <= TOTAL_PLAYERS; position++) {
      const pickNumber = (round - 1) * TOTAL_PLAYERS + position
      roundPicks.push(getPickInfo(pickNumber))
    }
    grid.push(roundPicks)
  }
  return grid
}

/**
 * Example usage and tests
 */
export function testDraftLogic() {
  console.log('=== DRAFT LOGIC TEST ===')
  console.log('Total: ', TOTAL_TEAMS, 'teams')
  console.log('Players:', TOTAL_PLAYERS, 'Teams per player:', TEAMS_PER_PLAYER)
  console.log('')

  // Test Round 1 (forward: 1->6)
  console.log('Round 1 (Forward 1->6):')
  for (let pos = 1; pos <= TOTAL_PLAYERS; pos++) {
    const pick = getPickInfo(pos)
    console.log(
      `  Pick ${pick.pickNumber}: Player ${pick.playerOrder}, Position ${pick.position}`
    )
  }

  console.log('')

  // Test Round 2 (reverse: 6->1)
  console.log('Round 2 (Reverse 6->1):')
  for (let pos = 1; pos <= TOTAL_PLAYERS; pos++) {
    const pick = getPickInfo(TOTAL_PLAYERS + pos)
    console.log(
      `  Pick ${pick.pickNumber}: Player ${pick.playerOrder}, Position ${pick.position}`
    )
  }

  console.log('')

  // Test player 1 all picks
  console.log('Player 1 picks (picks 1, 12, 13, 24, 25, 36, 37, 48):')
  const player1Picks = getPlayerPickNumbers(1)
  console.log(player1Picks)

  console.log('')

  // Test player 6 all picks
  console.log('Player 6 picks (picks 6, 7, 18, 19, 30, 31, 42, 43):')
  const player6Picks = getPlayerPickNumbers(6)
  console.log(player6Picks)
}
