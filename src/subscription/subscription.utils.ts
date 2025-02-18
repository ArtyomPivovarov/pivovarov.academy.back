import { SubscriptionLevel } from '@/subscription/subscription.enum'

export function checkSubscriptionLevel(
  currentLevel: SubscriptionLevel,
  requiredLevel: SubscriptionLevel
) {
  const levels = Object.values(SubscriptionLevel)
  return (
    levels.findIndex(el => el === currentLevel) >=
    levels.findIndex(el => el === requiredLevel)
  )
}
