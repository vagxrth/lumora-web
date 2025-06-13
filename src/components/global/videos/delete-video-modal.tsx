import React, { useState, useEffect } from 'react'
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
import { useDeleteVideo } from '@/hooks/useDeleteVideo'

type Props = {
  videoId: string
  videoTitle: string
}

const DeleteVideoModal = ({ videoId, videoTitle }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const { deleteVideo, isPending } = useDeleteVideo(videoId)

  const handleDelete = () => {
    deleteVideo({})
  }

  // Close modal when deletion is complete
  useEffect(() => {
    if (!isPending && isOpen) {
      // Small delay to show success before closing
      const timer = setTimeout(() => {
        setIsOpen(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isPending, isOpen])

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
          <DialogTitle className="text-white">Delete Video</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Are you sure you want to delete &quot;{videoTitle}&quot;? This action cannot be undone.
            <span className="block mt-2 text-red-400">The video will be permanently removed from your workspace.</span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4 mt-4">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete Video'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteVideoModal 