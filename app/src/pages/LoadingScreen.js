import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function LoadingScreen({ message = 'Caricamento in corso...' }) {
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-[#0b0f19] text-white", children: _jsxs("div", { className: "flex flex-col items-center gap-3", children: [_jsx("div", { className: "h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" }), _jsx("p", { className: "text-sm text-white/60", children: message })] }) }));
}
