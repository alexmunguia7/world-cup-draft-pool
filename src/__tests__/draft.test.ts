import { getPickInfo, getNextPickNumber, getCurrentPlayerOrder, getPlayerPickNumbers, TOTAL_TEAMS, TOTAL_PLAYERS } from '@/lib/draft'

describe('Draft Logic', () => {
  it('should calculate correct pick info for pick 1', () => {
    const pick = getPickInfo(1)
    expect(pick.round).toBe(1)
    expect(pick.position).toBe(1)
    expect(pick.playerOrder).toBe(1)
    expect(pick.pickNumber).toBe(1)
  })

  it('should calculate correct pick info for pick 6 (last of round 1)', () => {
    const pick = getPickInfo(6)
    expect(pick.round).toBe(1)
    expect(pick.position).toBe(6)
    expect(pick.playerOrder).toBe(6)
  })

  it('should reverse order in round 2', () => {
    const pick = getPickInfo(7)
    expect(pick.round).toBe(2)
    expect(pick.position).toBe(1)
    expect(pick.playerOrder).toBe(6) // Reversed
  })

  it('should get correct next pick number', () => {
    expect(getNextPickNumber(1)).toBe(2)
    expect(getNextPickNumber(6)).toBe(7)
    expect(getNextPickNumber(48)).toBe(48) // Draft complete
  })

  it('should get correct player order', () => {
    expect(getCurrentPlayerOrder(1)).toBe(1)
    expect(getCurrentPlayerOrder(7)).toBe(6)
    expect(getCurrentPlayerOrder(12)).toBe(1)
  })

  it('should get all player picks', () => {
    const player1Picks = getPlayerPickNumbers(1)
    expect(player1Picks).toEqual([1, 12, 13, 24, 25, 36, 37, 48])
    expect(player1Picks.length).toBe(8)

    const player6Picks = getPlayerPickNumbers(6)
    expect(player6Picks).toEqual([6, 7, 18, 19, 30, 31, 42, 43])
    expect(player6Picks.length).toBe(8)
  })

  it('should have 48 total picks', () => {
    let pickCount = 0
    for (let i = 1; i <= TOTAL_TEAMS; i++) {
      const pick = getPickInfo(i)
      if (pick.pickNumber === i) {
        pickCount++
      }
    }
    expect(pickCount).toBe(TOTAL_TEAMS)
  })
})
