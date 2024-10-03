import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { userSubscriptions, subscriptionTiers } from '@/server/db/schema';

export async function checkFeatureAccess(userId: string, featureName: string): Promise<boolean> {
  const userSubscription = await db.query.userSubscriptions.findFirst({
    where: eq(userSubscriptions.userId, userId),
    with: {
      tier: true,
    },
  });

  if (!userSubscription ?? !userSubscription?.isActive) {
    return false;
  }

  const tierFeatures = userSubscription.tier.features as Record<string, boolean>;
  return !!tierFeatures[featureName];
}
