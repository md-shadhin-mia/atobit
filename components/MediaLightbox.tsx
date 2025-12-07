'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export interface MediaItem {
    type: 'image' | 'video';
    url: string;
    alt?: string;
}

interface MediaLightboxProps {
    isOpen: boolean;
    media: MediaItem | null;
    onClose: () => void;
}

export default function MediaLightbox({ isOpen, media, onClose }: MediaLightboxProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !media) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-white/75 hover:text-white transition-colors z-50 bg-black/20 rounded-full hover:bg-black/40"
                    >
                        <X size={32} />
                    </button>

                    <div onClick={(e) => e.stopPropagation()} className="relative max-w-5xl max-h-screen w-full flex items-center justify-center">
                        {media.type === 'video' ? (
                            <video
                                src={media.url}
                                controls
                                autoPlay
                                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl outline-none"
                            />
                        ) : (
                            <img
                                src={media.url}
                                alt={media.alt || 'Full screen media'}
                                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            />
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
