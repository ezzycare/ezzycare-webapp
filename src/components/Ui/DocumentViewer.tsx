'use client';

import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs, Thumbnail } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const DocumentViewer = ({
  pdf,
  width,
  height,
  thumbnail = false,
}: {
  pdf: string;
  width?: number;
  height?: number;
  thumbnail?: boolean;
}) => {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div ref={containerRef} className="w-full">
      {containerWidth > 0 && (
        <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
          {thumbnail ? (
            <Thumbnail
              width={width ?? containerWidth}
              height={height}
              pageNumber={pageNumber}
            />
          ) : (
            <Page
              width={width ?? containerWidth}
              height={height}
              pageNumber={pageNumber}
            />
          )}
        </Document>
      )}
    </div>
  );
};

export default DocumentViewer;
