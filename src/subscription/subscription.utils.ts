import { SubscriptionPeriod } from '@/subscription/subscription.enum'

export function checkSubscriptionLevel(
  currentLevel: number,
  requiredLevel: number
) {
  return currentLevel >= requiredLevel
}

export function getDurationByPeriod(period: SubscriptionPeriod) {
  switch (period) {
    case SubscriptionPeriod.Month:
      return 30 * 24 * 60 * 60 * 1000
    case SubscriptionPeriod.Year:
      return 365 * 24 * 60 * 60 * 1000
    default:
      throw new Error('Unknown period')
  }
}
