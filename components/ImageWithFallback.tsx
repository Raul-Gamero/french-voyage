'use client'

import Image from 'next/image'
import { useState } from 'react'

export function ImageWithFallback({
  src,
  alt,
  title,
}: {
  src: string
  alt: string
  title?: string
}) {
  const [error, setError] = useState(false)

  return (
    <Image
      src={error ? '/placeholder.svg' : src}
      alt={alt}
      title={title}
      fill
      className="object-cover"
      onError={() => setError(true)}
    />
  )
}
