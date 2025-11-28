'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function HeroSlideshow() {
    const [images, setImages] = useState<string[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        // Fetch images from API
        fetch('/api/images/hero')
            .then(res => res.json())
            .then(data => {
                if (data.images && data.images.length > 0) {
                    setImages(data.images)
                    setLoaded(true)
                }
            })
            .catch(err => console.error('Failed to load hero images:', err))
    }, [])

    useEffect(() => {
        if (images.length <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % images.length)
        }, 60000) // Rotate every 60 seconds

        return () => clearInterval(interval)
    }, [images])

    if (!loaded || images.length === 0) return null

    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/40 z-10" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={images[currentIndex]}
                        alt="Hero background"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
