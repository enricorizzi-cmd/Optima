import * as React from 'react';
import { cn } from '../../lib/utils';

export const Table = ({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
  <table className={cn('w-full border-collapse text-sm text-white/90', className)} {...props} />
);

export const Thead = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn('bg-white/5 text-left uppercase text-xs text-white/60', className)} {...props} />
);

export const Tbody = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn('divide-y divide-white/5', className)} {...props} />
);

export const Tr = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn('hover:bg-white/5 transition-colors', className)} {...props} />
);

export const Th = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={cn('px-4 py-3 font-medium tracking-wide', className)} {...props} />
);

export const Td = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn('px-4 py-3 align-top', className)} {...props} />
);
