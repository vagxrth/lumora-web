import {
    MutationFunction,
    MutationKey,
    QueryKey,
    useMutation,
    useMutationState,
    useQueryClient,
  } from '@tanstack/react-query'
  import { toast } from 'sonner'
  
  type MutationResponse = {
    status: number
    data?: any
  } | undefined
  
  export const useMutationData = <TData = any, TVariables = any>(
    mutationKey: MutationKey,
    mutationFn: MutationFunction<MutationResponse, TVariables>,
    queryKey?: string | QueryKey,
    onSuccess?: (response: MutationResponse, variables: TVariables) => Promise<void> | void,
    onError?: (error: Error, variables: TVariables) => Promise<void> | void
  ) => {
    const client = useQueryClient()
    const { mutate, isPending } = useMutation({
      mutationKey,
      mutationFn,
      onSuccess(data, variables) {
        if (onSuccess) {
          onSuccess(data, variables)
        }
  
        return toast(
          data?.status === 200 || data?.status === 201 ? 'Success' : 'Error',
          {
            description: data?.data,
          }
        )
      },
      onError(error, variables) {
        if (onError) {
          onError(error, variables)
        }

        return toast('Error', {
          description: 'An error occurred while processing your request.',
        })
      },
      onSettled: async () => {
        if (queryKey) {
          return await client.invalidateQueries({
            queryKey: typeof queryKey === 'string' ? [queryKey] : queryKey,
            exact: true,
          })
        }
      },
    })
  
    return { mutate, isPending }
  }
  
  export const useMutationDataState = (mutationKey: MutationKey) => {
    const data = useMutationState({
      filters: { mutationKey },
      select: (mutation) => {
        return {
          variables: mutation.state.variables as any,
          status: mutation.state.status,
        }
      },
    })
  
    const latestVariables = data[data.length - 1]
    return { latestVariables }
  }