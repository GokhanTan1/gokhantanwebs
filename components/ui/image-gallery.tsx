'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface ImageGalleryProps {
  images: string[]
  className?: string
}

export function ImageGallery({ images, className = "" }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  const handleNext = () => {
    setSelectedImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    )
  }

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  if (!images.length) return null

  return (
    <>
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 ${className}`}>
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg"
            onClick={() => handleImageClick(index)}
          >
            <Image
              src={image}
              alt={`Proje Görseli ${index + 1}`}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-screen-lg w-[95vw] p-0 bg-transparent border-0">
          <div className="relative aspect-[4/3] md:aspect-[16/9] w-full">
            <Image
              src={images[selectedImageIndex]}
              alt={`Proje Görseli ${selectedImageIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}