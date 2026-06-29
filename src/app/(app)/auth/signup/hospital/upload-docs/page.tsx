'use client';

import { useUploadHospitalCertificationMutation } from '@/apiQuery/hospital/post/uploadCertification';
import Button from '@/components/Ui/Button';
import Card from '@/components/Ui/Card';
import { toaster } from '@/lib/toaster';
import { cn } from '@/lib/utils';
import { CheckCircle2, Trash2, UploadIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

type DocKey = 'cac' | 'license' | 'permit' | 'address';

type DocType = {
  title: string;
  slug: DocKey;
  file: File | null;
  error: string | null;
};

const MAX_SIZE = 5 * 1024 * 1024;

const UploadHospitalDocs = () => {
  const router = useRouter();

  const { mutate: uploadCertification, isPending } =
    useUploadHospitalCertificationMutation();

  const [docs, setDocs] = useState<DocType[]>([
    {
      title: 'Upload CAC',
      slug: 'cac',
      file: null,
      error: null,
    },
    {
      title: 'Upload License',
      slug: 'license',
      file: null,
      error: null,
    },
    {
      title: 'Upload Operational Permit',
      slug: 'permit',
      file: null,
      error: null,
    },
    {
      title: 'Upload Proof of Address',
      slug: 'address',
      file: null,
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

  const handleFileSelect = (slug: DocKey, file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'application/pdf'];

    if (!validTypes.includes(file.type)) {
      updateDoc(slug, {
        error: 'Only PNG, JPG and PDF files are allowed',
      });

      return;
    }

    if (file.size > MAX_SIZE) {
      updateDoc(slug, {
        error: 'File size must be less than 5MB',
      });

      return;
    }

    updateDoc(slug, {
      file,
      error: null,
    });
  };

  const removeFile = (slug: DocKey) => {
    updateDoc(slug, {
      file: null,
      error: null,
    });
  };

  const canSubmit = docs.every((doc) => doc.file && !doc.error);

  const handleSubmit = () => {
    const cac = docs.find((d) => d.slug === 'cac')?.file;
    const license = docs.find((d) => d.slug === 'license')?.file;
    const permit = docs.find((d) => d.slug === 'permit')?.file;
    const proofOfAddress = docs.find((d) => d.slug === 'address')?.file;

    if (!cac || !license || !permit || !proofOfAddress) return;

    uploadCertification(
      {
        cac,
        license,
        permit,
        proofOfAddress,
      },
      {
        onSuccess: () => {
          toaster.success('Documents submitted successfully');
          router.push('/auth/signup/hospital/account-created');
        },
        onError: (error: unknown) => {
          const err = error as { message?: string };
          toaster.error(err?.message || 'Submission failed');
        },
      }
    );
  };

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
              onUpload={handleFileSelect}
              onRemove={removeFile}
            />
          ))}

          <Button
            className="mt-7 flex h-12 w-full justify-center"
            variant="primary"
            loading={isPending}
            disabled={!canSubmit || isPending}
            onClick={handleSubmit}
          >
            Submit
          </Button>
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

  const hasFile = doc.file !== null;

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
          {hasFile ? (
            <CheckCircle2 size={18} className="text-green-10" />
          ) : (
            <UploadIcon size={18} className="text-blue-9" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            {hasFile ? (
              <span className="max-w-30 truncate text-xs text-text-muted">
                {doc.file?.name}
              </span>
            ) : (
              <p className="text-sm font-medium text-text-alt">{doc.title}</p>
            )}
          </div>

          <p
            className={`mt-1.5 text-xs ${doc.error ? 'text-error' : 'text-text-alt'} `}
          >
            {hasFile
              ? `${(doc.file!.size / (1024 * 1024)).toFixed(2)} MB`
              : doc.error || formatText}
          </p>

          {hasFile && (
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
