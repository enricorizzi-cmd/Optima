import { useSessionContext } from '@supabase/auth-helpers-react';
import { Menu, Power } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useState } from 'react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { session, supabaseClient } = useSessionContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await supabaseClient.auth.signOut();
    setIsLoading(false);
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-[#0b0f19]/80 px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-3 lg:hidden">
        <Button variant="ghost" size="sm" onClick={onToggleSidebar} aria-label="Apri menù">
          <Menu size={18} />
        </Button>
        <span className="font-display text-lg text-primary">Optima Production</span>
      </div>
      <div className="hidden lg:block">
        <h2 className="font-display text-xl text-white">Ciao, {session?.user.email}</h2>
        <p className="text-sm text-white/60">Gestisci ordini, produzione e consegne in un'unica interfaccia.</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSignOut}
        className={cn('gap-2 text-white/80 hover:text-white')}
        disabled={isLoading}
      >
        <Power size={16} /> Esci
      </Button>
    </header>
  );
}
