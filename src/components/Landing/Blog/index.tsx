import clsx from 'clsx';
import BlogItems from './BlogItems';

const Blog = () => {
  return (
    <section
      id="blogs-section"
      className={clsx(
        'w-full max-w-300 mx-auto flex flex-col',
        'relative items-center pt-8 sm:pt-16 pb-10 sm:pb-20 px-5 lg:px-0 font-geist-sans'
      )}
    >
      <h4 className="text-primary-text text-base font-semibold tracking-widest">
        Blog & ideas
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

      <BlogItems />
    </section>
  );
};

export default Blog;
