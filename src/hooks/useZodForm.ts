import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, DefaultValues } from 'react-hook-form'
import { z } from 'zod'
import { UseMutateFunction } from '@tanstack/react-query'

export default function useZodForm<T extends z.ZodType<any, any>, TData = any>(
  schema: T,
  mutate: UseMutateFunction<TData, Error, z.infer<T>, unknown>,
  defaultValues?: DefaultValues<z.infer<T>>
) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const onFormSubmit = handleSubmit((data) => {
    mutate(data)
  })

  return {
    register,
    errors,
    onFormSubmit,
    watch,
    reset,
  }
}