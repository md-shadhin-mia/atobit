'use client';

import { X, AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
    title?: string;
    description?: string;
    itemType?: string;
}

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    isDeleting,
    title = 'Delete Entry',
    description = 'Are you sure you want to delete this entry? This action cannot be undone.',
    itemType = 'entry'
}: DeleteConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 text-red-600 bg-red-50 px-3 py-1.5 rounded-full w-fit">
                            <AlertTriangle size={20} />
                            <span className="text-sm font-semibold uppercase tracking-wide">Warning</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                            disabled={isDeleting}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                        {description}
                    </p>

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 shadow-lg shadow-red-200 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:shadow-none"
                        >
                            {isDeleting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Deleting...</span>
                                </>
                            ) : (
                                <>
                                    <Trash2 size={18} />
                                    <span>Delete {itemType}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
