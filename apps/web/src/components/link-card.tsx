import * as React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from '@/types/links';

interface LinkCardProps {
  link: Link;
  onClick: (link: Link) => void;
}

export const LinkCard = React.forwardRef<HTMLDivElement, LinkCardProps>(
  ({ link, onClick }, ref) => {
    return (
      <Card
        ref={ref}
        onClick={() => onClick(link)}
        className={cn(
          'group relative overflow-hidden transition-all duration-300 cursor-pointer',
          'hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]',
          'bg-white/80 backdrop-blur-sm border-gray-200',
          !link.enabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <div className="flex items-center gap-4 p-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl shadow-md">
            {link.icon || '🔗'}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {link.title}
            </h3>
            {link.description && (
              <p className="text-sm text-gray-500 truncate mt-0.5">
                {link.description}
              </p>
            )}
          </div>

          {/* Arrow Icon */}
          <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </div>
      </Card>
    );
  }
);

LinkCard.displayName = 'LinkCard';
