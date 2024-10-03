import { getStrategy } from '@/server/db/queries'
import { queryOptions } from '@tanstack/react-query'

export const stratOptions = queryOptions({
  queryKey: ['strats'],
  queryFn: async () => {
    const strats = await getStrategy();

    return strats.data;
  },
})
