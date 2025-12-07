'use client';

import { useState, ChangeEvent, FormEvent, use, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { ArrowLeft, Camera, Loader2, Save, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CameraCapture from '@/components/CameraCapture';

export default function LogEntryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const supabase = createClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [note, setNote] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Camera state
    const [showCamera, setShowCamera] = useState(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            processFile(selectedFile);
        }
    };

    const processFile = (selectedFile: File) => {
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
    };

    const handleCameraCapture = (capturedFile: File) => {
        processFile(capturedFile);
        setShowCamera(false);
    };

    const clearImage = () => {
        setFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            let photoPath = null;

            if (file) {
                const fileExt = file.name.split('.').pop() || 'jpg';
                const fileName = `${user.id}/${Date.now()}.${fileExt}`;
                const { error: uploadError, data } = await supabase.storage
                    .from('habit-photos')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;
                photoPath = data.path;
            }

            const { error: insertError } = await supabase
                .from('habit_entries')
                .insert({
                    user_id: user.id,
                    habit_id: id,
                    note,
                    photo_url: photoPath,
                });

            if (insertError) throw insertError;

            router.push(`/habit/${id}`);
            router.refresh();
        } catch (err: any) {
            console.error('Error logging entry:', err);
            setError(err.message || 'Failed to log entry');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header / Navigation */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                    <Link href={`/habit/${id}`} className="p-2 -ml-2 mr-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-lg font-semibold text-gray-900">New Entry</h1>
                </div>
            </div>

            <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <AnimatePresence>
                    {showCamera && (
                        <CameraCapture
                            onCapture={handleCameraCapture}
                            onClose={() => setShowCamera(false)}
                        />
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Photo Section */}
                        <section className="space-y-4">
                            <label className="block text-sm font-semibold text-gray-900">
                                Photo Proof
                            </label>

                            {!previewUrl ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCamera(true)}
                                        className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-2xl bg-white hover:bg-gray-50 hover:border-indigo-300 transition-all group"
                                    >
                                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full group-hover:scale-110 transition-transform">
                                            <Camera size={24} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600">Take Photo</span>
                                    </button>

                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-2xl bg-white hover:bg-gray-50 hover:border-indigo-300 cursor-pointer transition-all group"
                                    >
                                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full group-hover:scale-110 transition-transform">
                                            <ImageIcon size={24} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600">Upload File</span>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            accept="image/*,video/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 group"
                                >
                                    {file?.type.startsWith('video/') ? (
                                        <video
                                            src={previewUrl || ''}
                                            controls
                                            className="w-full h-64 object-cover"
                                        />
                                    ) : (
                                        <img
                                            src={previewUrl || ''}
                                            alt="Preview"
                                            className="w-full h-64 object-cover"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowCamera(true)}
                                            className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-colors"
                                            title="Retake Photo"
                                        >
                                            <Camera size={20} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={clearImage}
                                            className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 hover:text-white transition-colors"
                                            title="Remove Photo"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                            <p className="text-xs text-gray-500 px-1">
                                Add a photo or short video to track your progress visually.
                            </p>
                        </section>

                        {/* Note Section */}
                        <section className="space-y-4">
                            <label htmlFor="note" className="block text-sm font-semibold text-gray-900">
                                How did it go?
                            </label>
                            <div className="relative">
                                <textarea
                                    id="note"
                                    rows={4}
                                    className="block w-full rounded-2xl border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-4 text-gray-900 placeholder-gray-400 resize-none transition-shadow"
                                    placeholder="Write a brief note about your habit today..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                                <div className="absolute bottom-3 right-3 text-xs text-gray-400 pointer-events-none">
                                    {note.length} chars
                                </div>
                            </div>
                        </section>

                        {/* Actions */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-200 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:shadow-none transition-all active:scale-[0.98]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                        Saving Entry...
                                    </>
                                ) : (
                                    <>
                                        <Save className="-ml-1 mr-2 h-5 w-5" />
                                        Save Progress
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}
