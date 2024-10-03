import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '@/utils/api';

export function useFeatureAccess(featureName: string) {
  const { data: session } = useSession();
  const [hasAccess, setHasAccess] = useState(false);

  const featureAccess = api.subscription.checkFeatureAccess.useQuery(
    { featureName },
    { enabled: !!session?.user?.id }
  );

  useEffect(() => {
    if (featureAccess.data !== undefined) {
      setHasAccess(featureAccess.data);
    }
  }, [featureAccess.data]);

  return hasAccess;
}