export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="bg-gray-50 py-24 sm:py-32 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-indigo-600">Process</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        How k Works
                    </p>
                </div>

                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {[
                            {
                                step: "01",
                                title: "Add Your Habits",
                                desc: "Pick from predefined skincare & lifestyle habits or create your own custom routines."
                            },
                            {
                                step: "02",
                                title: "Log Each Day",
                                desc: "Check off habits, write quick notes, and snap a daily photo to track your skin's condition."
                            },
                            {
                                step: "03",
                                title: "Compare Your Progress",
                                desc: "See your improvement with consistency graphs and side-by-side before & after image comparisons."
                            }
                        ].map((item, i) => (
                            <div key={i} className="relative pl-10 md:pl-0 md:text-center group">
                                <div className="text-6xl font-black text-gray-200 dark:text-gray-800 absolute -top-4 -left-4 md:static md:mb-4 md:text-8xl select-none group-hover:text-indigo-100 dark:group-hover:text-indigo-900/20 transition-colors">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white relative z-10">{item.title}</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-300 relative z-10">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-16 flex justify-center">
                        <a href="#" className="rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all">
                            Start tracking your changes today
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
