import { createWorkspace } from '@/actions/workspace'
import { useMutationData } from './useMutationData'
import { workspaceSchema } from '@/components/forms/workspace-form/schema'
import useZodForm from './useZodForm'

export const useCreateWorkspace = () => {
  const { mutate, isPending } = useMutationData(
    ['create-workspace'],
    (data: { name: string }) => createWorkspace(data.name),
    'user-workspaces'
  )

  const { errors, onFormSubmit, register } = useZodForm(workspaceSchema, mutate)
  return { errors, onFormSubmit, register, isPending }
}