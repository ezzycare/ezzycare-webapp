'use client';

import Pagination from '@/components/Base/Pagination';
import { paginatePosts } from '@/data/blog';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const BlogItems = ({ isHighlight = false }: { isHighlight?: boolean }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { items, meta } = paginatePosts(currentPage, isHighlight ? 3 : 9);

  return (
    <div className="w-full flex flex-col">
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-10">
        {items.map((post, index) => (
          <Link
            href={`/blog/${post.id}`}
            key={index}
            className="bg-[#F7F9FE] rounded-lg overflow-hidden"
          >
            <Image
              src={post.image}
              alt={post.title}
              className="w-full max-w-94.5 rounded-xl h-auto mx-auto"
            />

            <div className="p-5 max-w-94.5 mx-auto">
              <h5 className="font-medium text-[20px] mb-2">{post.title}</h5>

              <div className="flex items-center gap-2">
                <Image
                  src={post.avatar}
                  alt={post.author}
                  className="w-5 h-5 rounded-full"
                />
                <p className="text-xs text-[#788498]">{post.author}</p>

                <span className="w-1 h-1 bg-gray-400 rounded-full" />

                <p className="text-xs text-[#788498]">{post.createdAt}</p>
              </div>

              <p className="text-[#5B6575] mt-5">{post.highlight}</p>
            </div>
          </Link>
        ))}
      </div>

      {!isHighlight && (
        <div className="mt-10 w-full">
          <Pagination
            pages={meta.totalPages}
            page={currentPage}
            setPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default BlogItems;
