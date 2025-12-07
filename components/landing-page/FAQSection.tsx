"use client";

import { Disclosure } from '@headlessui/react'
import { Minus, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const faqs = [
    {
        question: "Is my data private?",
        answer:
            "Yes, absolutely. We use industry-standard encryption to protect your photos and notes. Your data is yours alone.",
    },
    {
        question: "Can I export my progress?",
        answer:
            "Yes, you can export your entire history including photos and notes at any time.",
    },
    {
        question: "Is it really free?",
        answer:
            "Yes! Our core features are free forever. We may introduce premium features in the future, but current features will remain free.",
    },
    {
        question: "Does it work for skincare + other habits?",
        answer:
            "The app is optimized for skincare journey tracking but works perfectly for any daily habit you want to visualize.",
    }
]

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (idx: number) => {
        setOpenIndex(openIndex === idx ? null : idx);
    }

    return (
        <section id="faq" className="bg-white dark:bg-black py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl divide-y divide-gray-900/10 dark:divide-white/10">
                    <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900 dark:text-white">Frequently asked questions</h2>
                    <dl className="mt-10 space-y-6 divide-y divide-gray-900/10 dark:divide-white/10">
                        {faqs.map((faq, idx) => (
                            <div key={faq.question} className="pt-6">
                                <button onClick={() => toggle(idx)} className="flex w-full items-start justify-between text-left text-gray-900 dark:text-white">
                                    <span className="text-base font-semibold leading-7">{faq.question}</span>
                                    <span className="ml-6 flex h-7 items-center">
                                        {openIndex === idx ? (
                                            <Minus className="h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Plus className="h-6 w-6" aria-hidden="true" />
                                        )}
                                    </span>
                                </button>
                                <AnimatePresence>
                                    {openIndex === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300 pb-4">{faq.answer}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    )
}
