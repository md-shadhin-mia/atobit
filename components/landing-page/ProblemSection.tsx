"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

export function ProblemSection() {
    return (
        <section className="bg-gray-50 py-24 sm:py-32 dark:bg-black/50 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-base font-semibold leading-7 text-indigo-600">The Struggle</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        Why Your Routine Isn’t Working
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                        Relying on memory or scattered notes leads to inconsistency and quitting. It's time for a better way.
                    </p>
                </div>

                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                    {/* The Old Way */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative rounded-3xl p-8 ring-1 ring-gray-900/10 dark:ring-white/10 sm:p-10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-x-4 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                                <X className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                            </div>
                            <h3 className="text-lg font-bold leading-8 tracking-tight text-gray-900 dark:text-white">The Old Way</h3>
                        </div>
                        <ul role="list" className="space-y-4 text-sm leading-6 text-gray-600 dark:text-gray-400">
                            {[
                                "Trying to remember what you used last week",
                                "No way to see if your skin is actually improving",
                                "Scattered notes in your phone",
                                "Zero accountability or streak tracking",
                                "Giving up because you don't see progress"
                            ].map((feature, i) => (
                                <li key={i} className="flex gap-x-3 items-start">
                                    <X className="h-5 w-5 flex-none text-red-500" aria-hidden="true" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* The HabitSkin Way */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative rounded-3xl p-8 ring-1 ring-indigo-600 bg-white dark:bg-zinc-900 sm:p-10 shadow-2xl shadow-indigo-500/10"
                    >
                        <div className="absolute -top-4 -right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            RECOMMENDED
                        </div>
                        <div className="flex items-center gap-x-4 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                <Check className="h-6 w-6 text-white" aria-hidden="true" />
                            </div>
                            <h3 className="text-lg font-bold leading-8 tracking-tight text-gray-900 dark:text-white">The HabitSkin Way</h3>
                        </div>
                        <ul role="list" className="space-y-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
                            {[
                                "Complete history of products and habits",
                                "Side-by-side photo comparisons",
                                "Beautiful, organized dashboard",
                                "Visual streaks and consistency charts",
                                "Motivation through visible progress"
                            ].map((feature, i) => (
                                <li key={i} className="flex gap-x-3 items-start">
                                    <Check className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
