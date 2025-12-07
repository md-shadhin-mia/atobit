
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

// We'll use a simple prop for user to keep it flexible for server/client usage
// For now, we assume the parent layout passes the user or we handle it here if it was a server component fetching data directly.
// But making it a pure presentation component that takes `user` is often easier for composition.
interface HeaderProps {
    user: User | null;
}

export default function Header({ user }: HeaderProps) {
    return (
        <nav className="bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href={user ? "/dashboard" : "/"} className="flex items-center group">
                            <div className="bg-indigo-600 text-white p-1.5 rounded-lg mr-2 group-hover:bg-indigo-700 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2v20M2 12h20" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Atbits</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-sm text-gray-500 hidden sm:block">{user.email}</span>
                                <form action="/auth/signout" method="post">
                                    <button type="submit" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                                        Sign Out
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/signin" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                                    Sign In
                                </Link>
                                <Link href="/signup" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
