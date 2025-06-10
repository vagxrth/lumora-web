'use client'

import { deleteWorkspace } from '@/actions/workspace'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface DeleteWorkspaceModalProps {
  workspaceId: string
  workspaceName: string
}

const DeleteWorkspaceModal = ({ workspaceId, workspaceName }: DeleteWorkspaceModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const queryClient = useQueryClient()

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter, usePathname } from 'next/navigation'

const DeleteWorkspaceModal = ({ workspaceId, workspaceName }: DeleteWorkspaceModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()
  const pathname = usePathname()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await deleteWorkspace(workspaceId)
      
      if (response.status === 200) {
        toast.success(response.message)
        setIsOpen(false)
        queryClient.invalidateQueries({ queryKey: ['user-workspaces'] })
        
        // Navigate away if deleting the currently active workspace
        if (pathname.includes(workspaceId)) {
          router.push('/dashboard')
        }
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error('Failed to delete workspace')
    } finally {
      setIsDeleting(false)
    }
  }
}

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-6 w-6 p-0 hover:bg-red-500/10 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#111111] border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-white">Delete Workspace</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{workspaceName}&quot;? This action cannot be undone.
            All content within this workspace including videos and folders will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4 mt-4">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Workspace'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteWorkspaceModal 