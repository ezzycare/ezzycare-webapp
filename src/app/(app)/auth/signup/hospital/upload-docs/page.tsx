'use client';

import Card from '@/components/Ui/Card';
import FancyButton from '@/components/Ui/FancyButton';
import { toaster } from '@/lib/toaster';
import { cn } from '@/lib/utils';
import { ProgressBar } from '@heroui/react';
import { CheckCircle2, Trash2, UploadIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

type DocKey = 'cac' | 'license' | 'permit' | 'address';

type DocType = {
  title: string;
  slug: DocKey;
  file: File | null;
  progress: number;
  uploaded: boolean;
  uploading: boolean;
  error: string | null;
};

const MAX_SIZE = 5 * 1024 * 1024;

const UploadHospitalDocs = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [docs, setDocs] = useState<DocType[]>([
    {
      title: 'Upload CAC',
      slug: 'cac',
      file: null,
      progress: 0,
      uploaded: false,
      uploading: false,
      error: null,
    },
    {
      title: 'Upload License',
      slug: 'license',
      file: null,
      progress: 0,
      uploaded: false,
      uploading: false,
      error: null,
    },
    {
      title: 'Upload Operational Permit',
      slug: 'permit',
      file: null,
      progress: 0,
      uploaded: false,
      uploading: false,
      error: null,
    },
    {
      title: 'Upload Proof of Address',
      slug: 'address',
      file: null,
      progress: 0,
      uploaded: false,
      uploading: false,
      error: null,
    },
  ]);

  const updateDoc = (slug: DocKey, updates: Partial<DocType>) => {
    setDocs((prev) =>
      prev.map((doc) =>
        doc.slug === slug
          ? {
              ...doc,
              ...updates,
            }
          : doc
      )
    );
  };

  const handleFileUpload = async (slug: DocKey, file: File) => {
    // validate type
    const validTypes = ['image/png', 'image/jpeg', 'application/pdf'];

    if (!validTypes.includes(file.type)) {
      updateDoc(slug, {
        error: 'Only PNG, JPG and PDF files are allowed',
      });

      return;
    }

    // validate size
    if (file.size > MAX_SIZE) {
      updateDoc(slug, {
        error: 'File size must be less than 5MB',
      });

      return;
    }

    updateDoc(slug, {
      file,
      uploading: true,
      uploaded: false,
      progress: 0,
      error: null,
    });

    try {
      // fake upload progress
      let progress = 0;

      const interval = setInterval(() => {
        progress += 10;

        updateDoc(slug, {
          progress,
        });

        if (progress >= 100) {
          clearInterval(interval);

          updateDoc(slug, {
            uploading: false,
            uploaded: true,
            progress: 100,
          });
        }
      }, 200);
    } catch (error) {
      updateDoc(slug, {
        uploading: false,
        uploaded: false,
        error: 'Upload failed',
      });

      toaster.error('Upload failed');
    }
  };

  const removeFile = (slug: DocKey) => {
    updateDoc(slug, {
      file: null,
      uploaded: false,
      uploading: false,
      progress: 0,
      error: null,
    });
  };

  const canSubmit = docs.every((doc) => doc.uploaded);

  return (
    <Card onCancel={() => router.back()}>
      <div className="flex flex-col">
        <h1 className="text-2xl font-medium text-text">
          Hospital Registration
        </h1>

        <p className="mt-1.5 max-w-75 text-sm text-text-alt">
          Upload proof of documents to complete your registration
        </p>

        <div className="mt-5 flex flex-col space-y-3">
          {docs.map((doc) => (
            <Uploader
              key={doc.slug}
              doc={doc}
              onUpload={handleFileUpload}
              onRemove={removeFile}
            />
          ))}

          <FancyButton
            className="mt-7 flex h-12 w-full justify-center"
            variant="primary"
            loading={loading}
            disabled={!canSubmit || loading}
            onClick={() => {
              toaster.success('Documents submitted successfully');
              router.push('/auth/signup/hospital/account-created');
            }}
          >
            Submit
          </FancyButton>
        </div>
      </div>
    </Card>
  );
};

interface UploaderProps {
  doc: DocType;
  onUpload: (slug: DocKey, file: File) => void;
  onRemove: (slug: DocKey) => void;
}

const Uploader = ({ doc, onUpload, onRemove }: UploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const formatText = 'Format png, jpg, pdf (max size: 5 mb)';

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    onUpload(doc.slug, file);
  };

  return (
    <button
      type="button"
      onClick={openPicker}
      className={cn(
        `w-full rounded-[12px] border border-dashed border-blue-6a p-4 text-left transition hover:bg-blue-1a
        cursor-pointer relative`
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.pdf"
        onChange={handleChange}
        className="hidden"
      />

      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-2a">
          {doc.uploaded ? (
            <CheckCircle2 size={18} className="text-green-10" />
          ) : (
            <UploadIcon size={18} className="text-blue-9" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            {doc.file ? (
              <span className="max-w-30 truncate text-xs text-text-muted">
                {doc.file.name}
              </span>
            ) : (
              <p className="text-sm font-medium text-text-alt">{doc.title}</p>
            )}
          </div>

          {doc.uploading && (
            <ProgressBar
              aria-label="Upload Progress"
              className="mt-2 w-full"
              value={doc.progress}
            >
              <div className="flex w-full items-center gap-3">
                <ProgressBar.Track className="flex-1">
                  <ProgressBar.Fill className="bg-primary" />
                </ProgressBar.Track>

                <ProgressBar.Output />
              </div>
            </ProgressBar>
          )}

          <p
            className={`mt-1.5 text-xs ${doc.error ? 'text-error' : 'text-text-alt'} `}
          >
            {doc.uploaded && doc.file
              ? `${(doc.file.size / (1024 * 1024)).toFixed(2)} MB`
              : doc.error || formatText}
          </p>

          {doc.uploaded && (
            <Trash2
              size={18}
              className="absolute right-5.5 top-1/2 -translate-y-1/2 text-error cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(doc.slug);
              }}
            />
          )}
        </div>
      </div>
    </button>
  );
};

export default UploadHospitalDocs;
