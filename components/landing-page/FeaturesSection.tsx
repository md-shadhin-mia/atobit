import { Zap, Camera, Lock, Cloud, Calendar, BarChart3 } from "lucide-react";

const features = [
    {
        name: 'Predefined Habits',
        description: 'Get started instantly with popular skincare and lifestyle habit templates.',
        icon: Zap,
    },
    {
        name: 'Daily Notes & Photos',
        description: 'Context matters. Keep a detailed log of your skin condition every day.',
        icon: Camera,
    },
    {
        name: 'Visual Charts',
        description: 'Track your streaks and consistency on weekly, monthly, and yearly scales.',
        icon: BarChart3,
    },
    {
        name: 'Cloud Sync',
        description: 'Your data is safe and synced across all your devices using PostgreSQL.',
        icon: Cloud,
    },
    {
        name: 'Secure & Private',
        description: 'Your photos and data are encrypted and private. Only you can see them.',
        icon: Lock,
    },
    {
        name: 'Timeline History',
        description: 'Scroll through your history to see how far you have come since day one.',
        icon: Calendar,
    },
]

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 sm:py-32 bg-white dark:bg-black">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything You Need</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        Stay Consistent, Every Day
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                        We built the features that actually help you stick to your routine, without the fluff.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        {features.map((feature) => (
                            <div key={feature.name} className="flex flex-col">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                    <feature.icon className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
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
    )
}
