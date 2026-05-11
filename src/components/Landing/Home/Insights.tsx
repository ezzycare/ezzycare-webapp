import clsx from 'clsx';
import BlogItems from '../Blog/BlogItems';
import Link from 'next/link';

const Insights = () => {
  return (
    <section
      id="blogs-section"
      className={clsx(
        'w-full max-w-300 mx-auto flex flex-col',
        'relative items-center py-10 sm:py-20 px-5 lg:px-0 font-geist-sans'
      )}
    >
      <h4 className="text-primary-text text-base font-semibold tracking-widest">
        Insights & ideas
      </h4>

      <h3
        className="text-3xl sm:text-4xl font-medium mt-3.5 mb-3 max-w-80 sm:max-w-130 mx-auto text-center"
        role="heading"
      >
        Latest blog posts
      </h3>

      <p
        className="text-[#788498] max-w-112.5 text-center mx-auto"
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
        <p className="text-primary-text text-base font-medium">
          View all posts
        </p>
      </Link>
    </section>
  );
};

export default Insights;
