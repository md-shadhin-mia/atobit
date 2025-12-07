"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, LineChart, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-white dark:bg-black pt-16 pb-24 lg:pt-32 lg:pb-40">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 translate-y-[-20%] rounded-full bg-indigo-500/10 blur-[100px]" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl"
                    >
                        Track Your Habits. <br />
                        <span className="text-indigo-600">Improve Your Skin.</span> <br />
                        See Real Progress.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300"
                    >
                        Log daily routines with notes & photos — compare your progress over weeks, months, and years. The simplest way to build consistency and see results.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-10 flex items-center justify-center gap-x-6"
                    >
                        <Link
                            href="#"
                            className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all flex items-center"
                        >
                            Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                        <Link
                            href="#how-it-works"
                            className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                            See How It Works <span aria-hidden="true">→</span>
                        </Link>
                    </motion.div>
                </div>

                {/* Dashboard Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mt-16 flow-root sm:mt-24"
                >
                    <div className="relative rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 dark:bg-white/5 dark:ring-white/10 max-w-5xl mx-auto">
                        <div className="rounded-md bg-white shadow-2xl ring-1 ring-gray-900/10 dark:bg-gray-900 dark:ring-white/10 overflow-hidden">
                            {/* Mockup Header */}
                            <div className="flex items-center border-b border-gray-200 dark:border-gray-800 px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
                                <div className="flex gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                                </div>
                            </div>

                            {/* Mockup Body */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 h-[400px]">
                                {/* Sidebar / Habit List */}
                                <div className="p-6 border-r border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                                    <h3 className="text-xs font-semibold uppercase text-gray-400 mb-4">My Habits</h3>
                                    <div className="space-y-3">
                                        {[
                                            "Morning Cleanser",
                                            "Vitamin C Serum",
                                            "Moisturizer",
                                            "Drink 2L Water",
                                            "Read 20 Mins"
                                        ].map((habit, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{habit}</span>
                                                <CheckCircle2 className={`h-5 w-5 ${i < 3 ? "text-green-500" : "text-gray-300 dark:text-gray-600"}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Main Content / Progress */}
                                <div className="col-span-2 p-6 bg-white dark:bg-gray-900">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Skin Progress - Oct 2025</h3>
                                        <div className="flex gap-2">
                                            <button className="p-2 text-gray-400 hover:text-indigo-600"><LineChart className="h-5 w-5" /></button>
                                            <button className="p-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 rounded-md"><ImageIcon className="h-5 w-5" /></button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="aspect-[4/5] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden group">
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Oct 1</div>
                                            {/* Placeholder for "Before" photo */}
                                        </div>
                                        <div className="aspect-[4/5] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden group">
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Oct 28</div>
                                            {/* Placeholder for "After" photo */}
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-between text-sm text-gray-500">
                                        <span>Started: Acne treatment</span>
                                        <span className="text-green-600 font-medium">Visible reduction in redness</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
