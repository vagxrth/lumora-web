'use client'

import { createWorkspace } from '@/actions/workspace'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const CreateWorkspaceModal = () => {
  const [name, setName] = useState('')
  const [type, setType] = useState<'PERSONAL' | 'PUBLIC'>('PERSONAL')
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const handleCreateWorkspace = async () => {
    if (!name.trim()) {
      toast.error('Please enter a workspace name')
      return
    }

    const response = await createWorkspace(name.trim(), type)
    if (response.status === 201) {
      toast.success('Workspace created successfully')
      setIsOpen(false)
      setName('')
      queryClient.invalidateQueries({ queryKey: ['user-workspaces'] })
    } else {
      toast.error(response.data)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <span className="text-sm cursor-pointer flex items-center justify-center bg-neutral-800/90 hover:bg-neutral-800/60 w-full rounded-sm p-[5px] gap-2">
          <PlusCircle size={15} className="text-neutral-800/90 fill-neutral-500" />
          <span className="text-neutral-400 font-semibold text-xs">
            Create Workspace
          </span>
        </span>
      </DialogTrigger>
      <DialogContent className="bg-[#111111] border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to organize your content
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Workspace Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-neutral-900 border-neutral-800"
          />
          <Select value={type} onValueChange={(value: 'PERSONAL' | 'PUBLIC') => setType(value)}>
            <SelectTrigger className="bg-neutral-900 border-neutral-800">
              <SelectValue placeholder="Select workspace type" />
            </SelectTrigger>
            <SelectContent className="bg-[#111111] border-neutral-800">
              <SelectItem value="PERSONAL">Personal</SelectItem>
              <SelectItem value="PUBLIC">Public</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleCreateWorkspace}>
            Create Workspace
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateWorkspaceModal 