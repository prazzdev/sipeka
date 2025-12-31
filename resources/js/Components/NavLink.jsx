import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center px-4 py-2 text-sm font-bold transition-all duration-300 rounded-xl ' +
                (active
                    ? 'bg-blue-900 text-white shadow-lg shadow-blue-200 translate-y-[-1px]'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-blue-900 hover:translate-y-[-1px]') +
                ' ' + className
            }
        >
            {children}
        </Link>
    );
}