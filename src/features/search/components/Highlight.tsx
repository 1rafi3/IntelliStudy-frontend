import React from 'react';

interface HighlightProps {
  text: string;
  query: string;
}

export const Highlight: React.FC<HighlightProps> = ({ text, query }) => {
  if (!query.trim() || !text) {
    return <>{text}</>;
  }
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200/70 text-neutral-900 rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
};
