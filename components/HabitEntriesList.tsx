'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Trash2, Edit2, Save, X as XIcon, Loader2, GitCompare, CheckSquare, Square } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import MediaLightbox, { MediaItem } from './MediaLightbox';
import HabitComparisonModal from './HabitComparisonModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { toast } from 'react-hot-toast';

interface Entry {
    id: string;
    created_at: string;
    note: string | null;
    photo_url: string | null;
}

interface HabitEntriesListProps {
    entries: Entry[];
    habitId: string;
}

export default function HabitEntriesList({ entries: initialEntries, habitId }: HabitEntriesListProps) {
    const router = useRouter();
    const supabase = createClient();

    // Data State (Optimistic UI)
    const [entries, setEntries] = useState(initialEntries);

    useEffect(() => {
        setEntries(initialEntries);
    }, [initialEntries]);

    // UI State
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    
    // Comparison State
    const [isCompareMode, setIsCompareMode] = useState(false);
    const [selectedForCompare, setSelectedForCompare] = useState<Entry[]>([]);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

    // Edit/Delete State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editNote, setEditNote] = useState('');
    const [loadingId, setLoadingId] = useState<string | null>(null); // For delete/save loading

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState<Entry | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleMediaClick = (url: string) => {
        if (isCompareMode) return; // Disable lightbox in compare mode

        const isVideo = url.endsWith('.webm') || url.endsWith('.mp4');
        const fullUrl = url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/habit-photos/${url}`;

        setSelectedMedia({
            type: isVideo ? 'video' : 'image',
            url: fullUrl,
            alt: 'Habit entry media'
        });
        setIsLightboxOpen(true);
    };

    const toggleCompareSelection = (entry: Entry, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        
        if (selectedForCompare.find(item => item.id === entry.id)) {
            setSelectedForCompare(prev => prev.filter(item => item.id !== entry.id));
        } else {
            if (selectedForCompare.length >= 2) {
                // Replace the first one or alert? 
                // Let's just limit to 2 for simplicity
                return;
            }
            setSelectedForCompare(prev => [...prev, entry]);
        }
    };

    const startComparison = () => {
        if (selectedForCompare.length === 2) {
            setIsCompareModalOpen(true);
        }
    };

    const handleDeleteClick = (entry: Entry) => {
        setEntryToDelete(entry);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!entryToDelete) return;

        setIsDeleting(true);
        const originalEntries = [...entries];

        // Optimistic update
        setEntries(prev => prev.filter(e => e.id !== entryToDelete.id));
        setDeleteModalOpen(false); // Close immediately for better UX

        try {
            // 1. Delete file from storage if it exists
            if (entryToDelete.photo_url && !entryToDelete.photo_url.startsWith('http')) {
                const { error: storageError } = await supabase
                    .storage
                    .from('habit-photos')
                    .remove([entryToDelete.photo_url]);
                
                if (storageError) {
                    console.error('Error deleting file from storage:', storageError);
                    alert(`Storage Delete Error: ${storageError.message}`);
                    // return; // Uncomment to stop if storage fails, but usually we want to persist.
                }
            }

            // 2. Delete entry from database
            const { error, data } = await supabase
                .from('habit_entries')
                .delete()
                .eq('id', entryToDelete.id)
                .select(); // Return deleted rows

            if (error) {
                throw error;
            }

            if (!data || data.length === 0) {
                throw new Error('Deletion failed: No rows deleted. Check RLS policies or if item exists.');
            }
            
            toast.success('Entry deleted successfully');
            router.refresh();
        } catch (err: any) {
            console.error('Error deleting entry:', err);
            // Revert optimistic update
            setEntries(originalEntries);
            toast.error(`Failed to delete entry: ${err.message}`);
        } finally {
            setIsDeleting(false);
            setEntryToDelete(null);
        }
    };

    const startEditing = (entry: Entry) => {
        setEditingId(entry.id);
        setEditNote(entry.note || '');
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditNote('');
    };

    const saveEdit = async (entryId: string) => {
        setLoadingId(entryId);
        try {
            const { error } = await supabase
                .from('habit_entries')
                .update({ note: editNote })
                .eq('id', entryId);

            if (error) throw error;

            setEditingId(null);
            router.refresh();
        } catch (err) {
            console.error('Error updating entry:', err);
            alert('Failed to update entry');
        } finally {
            setLoadingId(null);
        }
    };

    if (!entries || entries.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 mb-4">No entries yet.</p>
                <Link
                    href={`/habit/${habitId}/log`}
                    className="text-indigo-600 hover:underline"
                >
                    Log your first entry
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="flex justify-end mb-4">
               {isCompareMode ? (
                   <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                       <span className="text-sm font-medium text-gray-700">
                           {selectedForCompare.length} selected
                       </span>
                       <button
                           onClick={startComparison}
                           disabled={selectedForCompare.length !== 2}
                           className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                       >
                           Compare
                       </button>
                       <button
                           onClick={() => {
                               setIsCompareMode(false);
                               setSelectedForCompare([]);
                           }}
                           className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                       >
                           Cancel
                       </button>
                   </div>
               ) : (
                   <button
                       onClick={() => setIsCompareMode(true)}
                       className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                   >
                       <GitCompare size={16} />
                       Compare Entries
                   </button>
               )}
            </div>

            <div className="space-y-4">
                {entries.map((entry) => {
                    const mediaUrl = entry.photo_url
                        ? (entry.photo_url.startsWith('http') ? entry.photo_url : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/habit-photos/${entry.photo_url}`)
                        : null;

                    const isVideo = mediaUrl && (mediaUrl.endsWith('.webm') || mediaUrl.endsWith('.mp4'));
                    const isEditing = editingId === entry.id;
                    const isLoading = loadingId === entry.id;
                    
                    const isSelected = selectedForCompare.some(item => item.id === entry.id);

                    return (
                        <div 
                            key={entry.id} 
                            className={`bg-white px-4 py-5 border sm:px-6 rounded-lg shadow-sm flex items-start gap-4 group transition-all duration-200
                                ${isCompareMode ? 'cursor-pointer hover:border-indigo-300' : 'border-gray-200'}
                                ${isSelected ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/30' : ''}
                            `}
                            onClick={() => isCompareMode && toggleCompareSelection(entry)}
                        >
                            {isCompareMode && (
                                <div className="self-center">
                                    {isSelected ? (
                                        <CheckSquare className="text-indigo-600 fill-indigo-100" size={24} />
                                    ) : (
                                        <Square className={`text-gray-300 group-hover:text-indigo-400 ${selectedForCompare.length >= 2 ? 'opacity-50' : ''}`} size={24} />
                                    )}
                                </div>
                            )}

                            {mediaUrl && (
                                <div
                                    className="flex-shrink-0 h-24 w-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative cursor-pointer hover:shadow-md transition-all"
                                    onClick={(e) => {
                                        if (isCompareMode) {
                                            // Let the parent div handle the click for selection
                                            return;
                                        }
                                        handleMediaClick(entry.photo_url!);
                                        e.stopPropagation();
                                    }}
                                >
                                    {isVideo ? (
                                        <>
                                            <video
                                                src={mediaUrl}
                                                className="h-full w-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors">
                                                <div className="bg-white/90 rounded-full p-2 shadow-sm">
                                                    <Play size={16} className="text-indigo-600 fill-indigo-600 ml-0.5" />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <img
                                            src={mediaUrl}
                                            alt="Entry"
                                            className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    )}
                                </div>
                            )}
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-baseline gap-2">
                                            <p className="text-sm font-medium text-indigo-600">
                                                {new Date(entry.created_at).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                            </p>
                                            <span className="text-xs text-gray-400">
                                                {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        {isEditing ? (
                                            <div className="mt-2 space-y-2" onClick={e => e.stopPropagation()}>
                                                <textarea
                                                    value={editNote}
                                                    onChange={(e) => setEditNote(e.target.value)}
                                                    className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[80px]"
                                                    placeholder="Edit your note..."
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => saveEdit(entry.id)}
                                                        disabled={isLoading}
                                                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    >
                                                        {isLoading ? <Loader2 size={12} className="animate-spin mr-1" /> : <Save size={12} className="mr-1" />}
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEditing}
                                                        disabled={isLoading}
                                                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                                    >
                                                        <XIcon size={12} className="mr-1" />
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="mt-2 text-sm text-gray-900 whitespace-pre-wrap">{entry.note || 'No note'}</p>
                                        )}
                                    </div>

                                    {!isEditing && !isCompareMode && (
                                        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); startEditing(entry); }}
                                                className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
                                                title="Edit"
                                                disabled={isLoading}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteClick(entry); }}
                                                className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                                                title="Delete"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <MediaLightbox
                isOpen={isLightboxOpen}
                media={selectedMedia}
                onClose={() => setIsLightboxOpen(false)}
            />
            
            <HabitComparisonModal 
                isOpen={isCompareModalOpen}
                entries={selectedForCompare.length === 2 ? [selectedForCompare[0], selectedForCompare[1]] : null}
                onClose={() => setIsCompareModalOpen(false)}
            />

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
                itemType="Entry"
            />
        </>
    );
}
