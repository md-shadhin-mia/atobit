"use client";

import { motion } from "framer-motion";

export function ProductScreenshotSection() {
    return (
        <section className="bg-white dark:bg-black py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl sm:text-center">
                    <h2 className="text-base font-semibold leading-7 text-indigo-600">Interface</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        Designed for Simplicity
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                        A clean, clutter-free interface that puts your progress first. No distractions.
                    </p>
                </div>

                <div className="mt-16 flow-root sm:mt-24">
                    <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 dark:bg-white/5 dark:ring-white/10">
                        <div className="rounded-md bg-gray-50 dark:bg-gray-900 shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10 overflow-hidden relative aspect-[16/9] flex items-center justify-center">
                            {/* Placeholder content for screenshots */}
                            <div className="text-gray-400 dark:text-gray-600 font-medium">
                                App Screenshot / Demo Video Placeholder
                            </div>
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white dark:from-black to-transparent pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
