import {
    Enabled,
    QueryFunction,
    QueryKey,
    useQuery,
  } from '@tanstack/react-query'
  
  export const useQueryData = <T = any>(
    queryKey: QueryKey,
    queryFn: QueryFunction<T>
  ) => {
    const { data, isPending, isFetched, refetch, isFetching } = useQuery<T>({
      queryKey,
      queryFn,
    })
    return { data, isPending, isFetched, refetch, isFetching }
  }