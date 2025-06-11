import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog'
  import React from 'react'
  
  type Props = {
    trigger: React.ReactNode
    children: React.ReactNode
    title: string
    description: string
    className?: string
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
  
  const Modal = ({ children, description, title, trigger, className, open, onOpenChange }: Props) => {
    return (
      <Dialog 
        open={open} 
        onOpenChange={onOpenChange}
      >
        <DialogTrigger
          className={className}
          asChild
        >
          {trigger}
        </DialogTrigger>
        <DialogContent className="bg-[#111111] border-neutral-800">
          <DialogHeader>
            <DialogTitle className="text-white">{title}</DialogTitle>
            <DialogDescription className="text-neutral-400">{description}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    )
  }
  
  export default Modal