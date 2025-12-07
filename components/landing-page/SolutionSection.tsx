"use client";

import { motion } from "framer-motion";
import { ListTodo, TrendingUp, ImagePlus } from "lucide-react";

const features = [
    {
        name: 'Daily Logging',
        description: 'Add a note or upload a photo with one-click habit selection. Logging your day takes seconds, not minutes.',
        icon: ListTodo,
    },
    {
        name: 'Progress Over Time',
        description: 'Visualize your consistency with beautiful weekly, monthly, and yearly charts. See where you can improve.',
        icon: TrendingUp,
    },
    {
        name: 'Photo Comparison',
        description: 'The truth is in the photos. Use our before/after slider and timeline gallery to see real changes in your skin.',
        icon: ImagePlus,
    },
]

export function SolutionSection() {
    return (
        <section className="py-24 sm:py-32 bg-white dark:bg-black">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-indigo-600">The Solution</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        A Simple Tool to Log, Track, and Visualize Your Daily Habits
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                        Everything you need to build better habits and see the results, without the clutter of generic tools.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
                        {features.map((feature) => (
                            <div key={feature.name} className="flex flex-col">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
                                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                                    <p className="flex-auto">{feature.description}</p>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
}
