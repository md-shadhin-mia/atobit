import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">H</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            HabitSkin
                        </span>
                    </div>

                    <div className="flex gap-8">
                        <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Privacy</Link>
                        <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Terms</Link>
                        <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Twitter</Link>
                    </div>
                </div>
                <div className="mt-8 md:text-center text-sm text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} HabitSkin. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
