interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Caricamento in corso...' }: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0f19] text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-white/60">{message}</p>
      </div>
    </div>
  );
}
