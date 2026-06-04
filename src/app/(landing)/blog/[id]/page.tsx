import MarkdownViewer from '@/components/Base/MarkdownViewer';
import { getPost } from '@/lib/getPost';
import clsx from 'clsx';
import type { Metadata } from 'next';
import Image from 'next/image';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const numId = Number(id);

  const post = getPost(numId);

  return {
    title: `Ezzycare - ${post.title}`,
    description: post.highlight,
    openGraph: {
      title: post.title,
      description: post.highlight,
      images: [
        {
          url: String(post.image),
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);

  const post = getPost(numId);
  const content = post.content;

  return (
    <section
      id="blogs-section"
      className={clsx(
        'w-full max-w-300 mx-auto flex flex-col',
        'relative items-center py-10 sm:py-16 px-5 lg:px-0 font-geist-sans'
      )}
    >
      <h4 className="text-primary text-base font-semibold tracking-widest uppercase">
        Insights & ideas
      </h4>

      <h3
        className="text-3xl sm:text-4xl font-medium mt-3.5 mb-3 max-w-80 sm:max-w-130 mx-auto text-center"
        role="heading"
      >
        {post.title}
      </h3>

      <p
        className="text-[#788498] max-w-174.25 text-center mx-auto"
        role="description"
      >
        {post.highlight}
      </p>

      <div className="flex items-center gap-2 mt-5.5">
        <Image
          src={post.avatar}
          alt={post.author}
          className="w-5 h-5 rounded-full"
        />
        <p className="text-[#788498]">{post.author}</p>

        <span className="w-1 h-1 bg-gray-400 rounded-full" />

        <p className="text-[#788498]">{post.createdAt}</p>
      </div>

      <div className="relative w-full max-w-300 max-h-150 aspect-video mx-auto mt-10 sm:mt-21 rounded-[20px] overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="max-w-200 mx-auto mt-10 sm:mt-20">
        <MarkdownViewer content={content} />
      </div>
    </section>
  );
}
