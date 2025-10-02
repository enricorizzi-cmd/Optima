import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { Menu, Power } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useState } from 'react';
export function Header({ onToggleSidebar }) {
    const { session, supabaseClient } = useSessionContext();
    const [isLoading, setIsLoading] = useState(false);
    const handleSignOut = async () => {
        setIsLoading(true);
        await supabaseClient.auth.signOut();
        setIsLoading(false);
    };
    return (_jsxs("header", { className: "sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white/80 px-6 py-4 backdrop-blur", children: [_jsxs("div", { className: "flex items-center gap-3 lg:hidden", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: onToggleSidebar, "aria-label": "Apri men\u00F9", children: _jsx(Menu, { size: 18 }) }), _jsx("span", { className: "font-display text-lg text-primary", children: "Optima Production" })] }), _jsxs("div", { className: "hidden lg:block", children: [_jsxs("h2", { className: "font-display text-xl text-gray-900", children: ["Ciao, ", session?.user.email] }), _jsx("p", { className: "text-sm text-gray-600", children: "Gestisci ordini, produzione e consegne in un'unica interfaccia." })] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: handleSignOut, className: cn('gap-2 text-gray-700 hover:text-gray-900'), disabled: isLoading, children: [_jsx(Power, { size: 16 }), " Esci"] })] }));
}
