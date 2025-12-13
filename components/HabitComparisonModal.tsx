'use client';

import { X } from 'lucide-react';

interface Entry {
    id: string;
    created_at: string;
    note: string | null;
    photo_url: string | null;
}

interface HabitComparisonModalProps {
    isOpen: boolean;
    entries: [Entry, Entry] | null;
    onClose: () => void;
}

export default function HabitComparisonModal({ isOpen, entries, onClose }: HabitComparisonModalProps) {
    if (!isOpen || !entries) return null;

    const [leftEntry, rightEntry] = entries;

    const getMediaUrl = (url: string | null) => {
        if (!url) return null;
        return url.startsWith('http') ? url : `${process.env.SUPABASE_URL}/storage/v1/object/public/habit-photos/${url}`;
    };

    const isVideo = (url: string | null) => {
        if (!url) return false;
        return url.endsWith('.webm') || url.endsWith('.mp4');
    };

    const renderMedia = (entry: Entry, label: string) => {
        const url = getMediaUrl(entry.photo_url);
        const isVid = isVideo(url);

        return (
            <div className="flex-1 min-h-0 flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <span className="font-semibold text-gray-700 capitalize text-sm sm:text-base">{label}</span>
                    <span className="text-xs sm:text-sm text-gray-500">
                        {new Date(entry.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                </div>
                
                <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
                   {url ? (
                       isVid ? (
                           <video 
                               src={url} 
                               controls 
                               className="max-h-full max-w-full object-contain"
                           />
                       ) : (
                           <img 
                               src={url} 
                               alt={label} 
                               className="max-h-full max-w-full object-contain"
                           />
                       )
                   ) : (
                       <div className="text-gray-500">No media</div>
                   )}
                </div>

                <div className="p-3 bg-gray-50 border-t border-gray-200 max-h-24 sm:max-h-32 overflow-y-auto">
                    <p className="text-xs sm:text-sm text-gray-600 whitespace-pre-wrap">
                        {entry.note || 'No note'}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-100 w-full max-w-6xl h-[90vh] rounded-xl flex flex-col overflow-hidden relative shadow-2xl">
                {/* Header */}
                <div className="bg-white px-4 py-3 sm:px-6 flex justify-between items-center border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900">Side-by-Side Comparison</h3>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-2 sm:p-4 gap-2 sm:gap-4 flex flex-col sm:flex-row overflow-hidden">
                    {renderMedia(leftEntry, "First Selection")}
                    {renderMedia(rightEntry, "Second Selection")}
                </div>
            </div>
        </div>
    );
}
