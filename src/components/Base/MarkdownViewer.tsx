'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = {
  content: string;
};

export default function MarkdownViewer({ content }: Props) {
  const clean = content.replace(/;\s*$/, '');

  const components = {
    h1: ({ ...props }) => (
      <h1 className="text-3xl font-semibold text-black mt-6 mb-4" {...props} />
    ),

    h2: ({ ...props }) => (
      <h2 className="text-2xl font-semibold text-black mt-8 mb-3" {...props} />
    ),

    h3: ({ ...props }) => (
      <h3 className="text-xl font-semibold text-black mt-6 mb-2" {...props} />
    ),

    p: ({ ...props }) => (
      <p className="text-[#5B6575] leading-7 mb-4" {...props} />
    ),

    a: ({ ...props }) => (
      <a
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      />
    ),

    ul: ({ ...props }) => (
      <ul className="list-disc pl-6 text-[#5B6575] mb-4 space-y-2" {...props} />
    ),

    ol: ({ ...props }) => (
      <ol
        className="list-decimal pl-6 text-[#5B6575] mb-4 space-y-2"
        {...props}
      />
    ),

    li: ({ ...props }) => <li className="leading-7" {...props} />,

    strong: ({ ...props }) => (
      <strong className="font-semibold text-black" {...props} />
    ),
  };

  return (
    <div className="max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {clean}
      </ReactMarkdown>
    </div>
  );
}
