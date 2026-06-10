import { calculatePayouts } from '@/lib/payouts'

describe('Payouts', () => {
  it('should calculate correct payout for $25 buy-in', () => {
    const payouts = calculatePayouts(25)
    expect(payouts.buyIn).toBe(25)
    expect(payouts.totalPot).toBe(150) // 6 * 25
    expect(payouts.firstPlacePayout).toBe(150)
    expect(payouts.secondPlacePayout).toBe(0)
    expect(payouts.thirdPlacePayout).toBe(0)
  })

  it('should calculate correct payout for $50 buy-in', () => {
    const payouts = calculatePayouts(50)
    expect(payouts.buyIn).toBe(50)
    expect(payouts.totalPot).toBe(300) // 6 * 50
    expect(payouts.firstPlacePayout).toBe(300)
  })

  it('should handle zero buy-in', () => {
    const payouts = calculatePayouts(0)
    expect(payouts.totalPot).toBe(0)
    expect(payouts.firstPlacePayout).toBe(0)
  })
})
