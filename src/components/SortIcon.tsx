import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface SortIconProps {
  field: string;
  currentSortBy?: string;
  currentSortOrder?: 'asc' | 'desc';
}

export const SortIcon: React.FC<SortIconProps> = ({
  field,
  currentSortBy,
  currentSortOrder,
}) => {
  if (currentSortBy !== field) {
    return <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 opacity-60 inline ml-1" />;
  }

  if (currentSortOrder === 'asc') {
    return <ArrowUp className="w-3.5 h-3.5 text-indigo-400 inline ml-1" />;
  }

  return <ArrowDown className="w-3.5 h-3.5 text-indigo-400 inline ml-1" />;
};
