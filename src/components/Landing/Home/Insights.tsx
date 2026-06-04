import clsx from 'clsx';
import Link from 'next/link';
import BlogItems from '../Blog/BlogItems';

const Insights = () => {
  return (
    <section
      id="blogs-section"
      className={clsx(
        'w-full max-w-300 mx-auto flex flex-col',
        'relative items-center py-10 sm:py-20 px-5 lg:px-0 font-geist-sans'
      )}
    >
      <h4 className="text-blue-11 text-base font-semibold tracking-widest">
        Insights & ideas
      </h4>

      <h3
        className="text-3xl sm:text-4xl lg:text-[40px] font-medium mt-3.5 mb-3 max-w-80 sm:max-w-135 mx-auto text-center"
        role="heading"
      >
        Latest blog posts
      </h3>

      <p
        className="text-text-muted max-w-112.5 text-center mx-auto"
        role="description"
      >
        Everything you need to know about getting care on EzzyCare.
      </p>

      <BlogItems isHighlight />

      <Link
        href="/blog"
        className={clsx(
          'flex items-center justify-center mt-7 py-2 px-4',
          'cursor-pointer border border-primary rounded-lg'
        )}
      >
        <p className="text-primary text-base font-medium">View all posts</p>
      </Link>
    </section>
  );
};

export default Insights;
