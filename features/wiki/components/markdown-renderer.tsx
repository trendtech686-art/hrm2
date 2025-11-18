import * as React from 'react';

export const MarkdownRenderer = ({ content }: { content: string }) => {
  const blocks = content.split('\n\n');

  const renderLine = (line: string, index: number) => {
    if (line.startsWith('### ')) {
      return <h3 key={index} className="text-xl font-semibold mt-6 mb-2">{line.substring(4)}</h3>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={index} className="text-2xl font-bold mt-8 mb-3 border-b pb-2">{line.substring(3)}</h2>;
    }
    if (line.startsWith('# ')) {
      return <h1 key={index} className="text-4xl font-extrabold mt-10 mb-4">{line.substring(2)}</h1>;
    }
    return <p key={index} className="leading-relaxed my-4">{line}</p>;
  };

  return (
    <div className="prose dark:prose-invert max-w-none">
      {blocks.map((block, blockIndex) => {
        const lines = block.split('\n').filter(l => l.trim() !== '');
        
        // Handle lists
        if (lines.every(line => line.trim().startsWith('- '))) {
          return (
            <ul key={blockIndex} className="list-disc pl-6 space-y-2 my-4">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{line.trim().substring(2)}</li>
              ))}
            </ul>
          );
        }

        // Handle normal text blocks
        return (
          <div key={blockIndex}>
            {lines.map(renderLine)}
          </div>
        );
      })}
    </div>
  );
};
