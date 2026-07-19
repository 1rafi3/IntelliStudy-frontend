import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

/**
 * Parses inline elements: bold, italic, inline code, links, and plain URLs.
 */
const parseInline = (text: string): React.ReactNode => {
  if (!text) return null;

  // Regex to split by inline code, bold, italic, markdown links, and raw URLs
  const tokenRegex = /(\`[^\`]+\`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s]+)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    // Inline code
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs text-indigo-600 dark:text-indigo-400 font-semibold break-all"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    // Bold
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-bold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>;
    }
    // Italic
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={idx} className="italic text-gray-850 dark:text-gray-150">{part.slice(1, -1)}</em>;
    }
    // Markdown link
    if (part.startsWith('[') && part.includes('](')) {
      const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        const [, label, url] = match;
        return (
          <a
            key={idx}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 hover:underline break-all"
          >
            {label}
          </a>
        );
      }
    }
    // Raw URL
    if (/^https?:\/\/[^\s]+$/.test(part)) {
      return (
        <a
          key={idx}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 dark:text-indigo-400 hover:underline break-all"
        >
          {part}
        </a>
      );
    }

    return part;
  });
};

/**
 * Premium CodeBlock component with scroll containment and a Copy button.
 */
const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden bg-gray-950 border border-gray-800 shadow-lg">
      <div className="bg-gray-900 text-gray-400 text-xs px-4 py-2 flex justify-between items-center border-b border-gray-800">
        <span className="font-mono font-medium">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:text-white transition-colors py-0.5 px-2 rounded hover:bg-gray-800"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-500" />
              <span className="text-green-500 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        <pre className="text-sm font-mono text-gray-100 m-0 leading-relaxed whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

/**
 * Renders block elements of Markdown (Headers, Quotes, Lists, Tables, Paragraphs)
 */
const MarkdownBlocks: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  const blocks: any[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let currentTable: { headers: string[]; rows: string[][] } | null = null;
  let currentBlockquote: string[] | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check if we should close the active grouped block
    if (
      currentList &&
      !trimmed.startsWith('- ') &&
      !trimmed.startsWith('* ') &&
      !/^\d+\.\s/.test(trimmed)
    ) {
      blocks.push({ type: currentList.type, items: currentList.items });
      currentList = null;
    }
    if (currentTable && !trimmed.startsWith('|')) {
      blocks.push({ type: 'table', headers: currentTable.headers, rows: currentTable.rows });
      currentTable = null;
    }
    if (currentBlockquote && !trimmed.startsWith('>')) {
      blocks.push({ type: 'blockquote', lines: currentBlockquote });
      currentBlockquote = null;
    }

    // 1. Table Row
    if (trimmed.startsWith('|')) {
      const isSeparator = /^\|[\s-.:|]+\|$/.test(trimmed);
      const cells = trimmed
        .split('|')
        .map((c) => c.trim())
        .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      if (isSeparator) {
        continue;
      }

      if (!currentTable) {
        currentTable = { headers: cells, rows: [] };
      } else {
        currentTable.rows.push(cells);
      }
      continue;
    }

    // 2. Blockquote
    if (trimmed.startsWith('>')) {
      const content = trimmed.slice(1).trim();
      if (!currentBlockquote) {
        currentBlockquote = [content];
      } else {
        currentBlockquote.push(content);
      }
      continue;
    }

    // 3. Unordered List Item
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const content = trimmed.slice(2).trim();
      if (!currentList) {
        currentList = { type: 'ul', items: [content] };
      } else {
        if (currentList.type === 'ol') {
          blocks.push({ type: 'ol', items: currentList.items });
          currentList = { type: 'ul', items: [content] };
        } else {
          currentList.items.push(content);
        }
      }
      continue;
    }

    // 4. Ordered List Item
    if (/^\d+\.\s/.test(trimmed)) {
      const spaceIndex = trimmed.indexOf(' ');
      const content = trimmed.slice(spaceIndex + 1).trim();
      if (!currentList) {
        currentList = { type: 'ol', items: [content] };
      } else {
        if (currentList.type === 'ul') {
          blocks.push({ type: 'ul', items: currentList.items });
          currentList = { type: 'ol', items: [content] };
        } else {
          currentList.items.push(content);
        }
      }
      continue;
    }

    // 5. Headings
    if (trimmed.startsWith('# ')) {
      blocks.push({ type: 'h1', content: trimmed.slice(2).trim() });
      continue;
    }
    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'h2', content: trimmed.slice(3).trim() });
      continue;
    }
    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'h3', content: trimmed.slice(4).trim() });
      continue;
    }
    if (trimmed.startsWith('#### ')) {
      blocks.push({ type: 'h4', content: trimmed.slice(5).trim() });
      continue;
    }

    // 6. Blank line
    if (trimmed === '') {
      continue;
    }

    // 7. Plain Paragraph Line
    blocks.push({ type: 'p', content: line });
  }

  // Push remaining open blocks
  if (currentList) {
    blocks.push({ type: currentList.type, items: currentList.items });
  }
  if (currentTable) {
    blocks.push({ type: 'table', headers: currentTable.headers, rows: currentTable.rows });
  }
  if (currentBlockquote) {
    blocks.push({ type: 'blockquote', lines: currentBlockquote });
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'h1':
            return (
              <h1
                key={idx}
                className="text-2xl font-bold text-gray-900 dark:text-white mt-5 mb-2 border-b pb-1 border-gray-200 dark:border-gray-800"
              >
                {parseInline(block.content)}
              </h1>
            );
          case 'h2':
            return (
              <h2 key={idx} className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2">
                {parseInline(block.content)}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={idx} className="text-lg font-semibold text-gray-900 dark:text-white mt-3 mb-1">
                {parseInline(block.content)}
              </h3>
            );
          case 'h4':
            return (
              <h4 key={idx} className="text-base font-semibold text-gray-900 dark:text-white mt-2 mb-1">
                {parseInline(block.content)}
              </h4>
            );
          case 'blockquote':
            return (
              <blockquote
                key={idx}
                className="border-l-4 border-indigo-500 pl-4 py-1.5 my-3 bg-gray-50 dark:bg-gray-900/40 rounded-r-lg text-gray-600 dark:text-gray-400 italic"
              >
                {block.lines.map((l: string, lIdx: number) => (
                  <p key={lIdx}>{parseInline(l)}</p>
                ))}
              </blockquote>
            );
          case 'ul':
            return (
              <ul key={idx} className="list-disc pl-6 my-2 space-y-1.5 text-gray-800 dark:text-gray-200">
                {block.items.map((item: string, iIdx: number) => (
                  <li key={iIdx}>{parseInline(item)}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={idx} className="list-decimal pl-6 my-2 space-y-1.5 text-gray-800 dark:text-gray-200">
                {block.items.map((item: string, iIdx: number) => (
                  <li key={iIdx}>{parseInline(item)}</li>
                ))}
              </ol>
            );
          case 'table':
            return (
              <div
                key={idx}
                className="overflow-x-auto my-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm"
              >
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-semibold">
                    <tr>
                      {block.headers.map((h: string, hIdx: number) => (
                        <th key={hIdx} className="px-4 py-2 text-left font-semibold">
                          {parseInline(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                    {block.rows.map((row: string[], rIdx: number) => (
                      <tr
                        key={rIdx}
                        className={
                          rIdx % 2 === 0
                            ? 'bg-white dark:bg-transparent'
                            : 'bg-gray-50/50 dark:bg-gray-900/30'
                        }
                      >
                        {row.map((cell: string, cIdx: number) => (
                          <td key={cIdx} className="px-4 py-2 font-normal">
                            {parseInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'p':
          default:
            return (
              <p
                key={idx}
                className="leading-relaxed text-gray-800 dark:text-gray-200 text-sm sm:text-base break-words text-left"
              >
                {parseInline(block.content)}
              </p>
            );
        }
      })}
    </div>
  );
};

/**
 * Main formatter function.
 */
export const formatMessage = (text: string): React.ReactNode => {
  if (!text) return null;

  // Split by code blocks first
  const blocks = text.split(/(```[\s\S]*?```)/g);

  return blocks.map((block, index) => {
    if (block.startsWith('```') && block.endsWith('```')) {
      const content = block.slice(3, -3);
      const firstNewline = content.indexOf('\n');

      let language = '';
      let code = content;

      if (firstNewline !== -1) {
        language = content.slice(0, firstNewline).trim();
        code = content.slice(firstNewline + 1);
      }

      return <CodeBlock key={index} language={language} code={code} />;
    }

    return <MarkdownBlocks key={index} text={block} />;
  });
};
