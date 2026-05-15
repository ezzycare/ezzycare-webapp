'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import ArrowLeft from '@/icons/ArrowLeft';
import clsx from 'clsx';
import { useMemo } from 'react';
import FancyButton from '../Ui/FancyButton';

const Pagination = ({
  pages,
  page,
  setPage,
}: {
  pages: number;
  page: number;
  setPage: (page: number) => void;
}) => {
  const isMobile = useIsMobile();
  const totalVisible = isMobile ? 3 : 4;
  const pagesArray = Array.from({ length: pages }, (_, i) => i + 1);
  const showPageNumber = useMemo(() => {
    const threshold = Math.floor(totalVisible / 2);

    const show: Record<number, number | string> = {};
    let ellipsis: string | null = null;

    pagesArray.forEach((pageItem) => {
      if (
        pageItem <= threshold ||
        pageItem > pages - threshold ||
        pageItem === page ||
        pageItem === page - 1 ||
        pageItem === page + 1
      ) {
        show[pageItem] = pageItem;
      } else {
        if (ellipsis) return;
        ellipsis = '...';
        show[pageItem] = ellipsis;
      }
    });

    return show;
  }, [pagesArray, page, pages, totalVisible]);

  const onChangePage = (item: number | string) => {
    if (item === '...') return;
    setPage(Number(item));
  };

  return (
    <div className="w-full flex items-center justify-between px-0 md:px-5">
      <FancyButton
        variant="outline"
        onClick={() => setPage(page - 1 > 0 ? page - 1 : 1)}
      >
        <div className="flex items-center gap-2">
          <ArrowLeft className="" />
          <p className="text-sm hidden md:block">Previous</p>
        </div>
      </FancyButton>
      <div className="flex items-center justify-center gap-0.5">
        {pagesArray.map((pageItem) =>
          showPageNumber[pageItem] ? (
            <button
              key={pageItem}
              className={clsx(
                'w-8 md:w-10 h-8 md:h-10 flex justify-center items-center',
                'text-sm text-[#788498] cursor-pointer',
                page === pageItem && 'bg-[#F1FBFD] text-black'
              )}
              onClick={() => onChangePage(pageItem)}
            >
              {showPageNumber[pageItem]}
            </button>
          ) : null
        )}
      </div>
      <FancyButton
        variant="outline"
        onClick={() => setPage(page + 1 < pages ? page + 1 : pages)}
      >
        <div className="flex items-center gap-2">
          <p className="text-sm hidden md:block">Next</p>
          <ArrowLeft className="rotate-180" />
        </div>
      </FancyButton>
    </div>
  );
};

export default Pagination;
