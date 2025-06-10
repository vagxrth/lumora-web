'use client'

import { deleteFolder } from '@/actions/workspace'
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
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface DeleteFolderModalProps {
  folderId: string
  folderName: string
}

const DeleteFolderModal = ({ folderId, folderName }: DeleteFolderModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await deleteFolder(folderId)
      
      if (response.status === 200) {
        toast({
          title: response.data.message
        })
        setIsOpen(false)
        queryClient.invalidateQueries({ queryKey: ['workspace-folders'] })
        // Redirect to workspace page
        if ('workspaceId' in response.data) {
          router.push(`/dashboard/${response.data.workspaceId}`)
        }
      } else {
        toast({
          variant: "destructive",
          title: response.data.message
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete folder"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-full"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#111111] border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-white">Delete Folder</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Are you sure you want to delete &quot;{folderName}&quot;? This action cannot be undone.
            <span className="block mt-2 text-red-400">Warning: All videos within this folder will be permanently deleted.</span>
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
            {isDeleting ? 'Deleting...' : 'Delete Folder and Videos'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteFolderModal 