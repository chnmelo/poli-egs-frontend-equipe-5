import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`text-sm text-gray-600 ${className || ''}`}>
      <ol className="flex items-center space-x-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center">
            {idx !== 0 && (
              <span className="text-gray-400 mx-2">/</span>
            )}
            {item.href ? (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a href={item.href} className="text-sm text-gray-500 hover:underline">
                {item.label}
              </a>
            ) : (
              <span className="text-sm font-medium text-gray-800">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
