import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCTASection() {
    return (
        <div className="bg-indigo-700">
            <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Start tracking your progress today.
                        <br />
                        Take control of your routine.
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-200">
                        Join thousands of users who have transformed their habits and skin health provided by HabitSkin.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            href="#"
                            className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white flex items-center transition-all"
                        >
                            Create an Account <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                        <Link href="#" className="text-sm font-semibold leading-6 text-white hover:text-indigo-100">
                            Log In <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
