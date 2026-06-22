'use client';

import { useUploadDoctorCertificationMutation } from '@/apiQuery/doctor/profile/uploadCertification';
import Button from '@/components/Ui/Button';
import Modal from '@/components/Ui/Modal';
import { PdfIconLocal } from '@/icons/DashboardIcons';
import { toaster } from '@/lib/toaster';
import { cn } from '@/lib/utils';
import { Trash2, UploadIcon } from 'lucide-react';
import { useRef, useState } from 'react';

type DocKey = 'medical' | 'license' | 'specialist';

type DocType = {
  title: string;
  slug: DocKey;
  file: File | null;
  error: string | null;
};

const MAX_SIZE = 5 * 1024 * 1024;

interface UploadDoctorDocsProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
}

const UploadDoctorDocs = ({
  openModal,
  setOpenModal,
  onSuccess,
}: UploadDoctorDocsProps) => {
  const { mutate: uploadCertification, isPending } =
    useUploadDoctorCertificationMutation();

  const [docs, setDocs] = useState<DocType[]>([
    {
      title: 'Upload medical certificate',
      slug: 'medical',
      file: null,
      error: null,
    },
    {
      title: 'Upload current practice license',
      slug: 'license',
      file: null,
      error: null,
    },
    {
      title: 'Upload specialist training certificate',
      slug: 'specialist',
      file: null,
      error: null,
    },
  ]);

  const updateDoc = (slug: DocKey, updates: Partial<DocType>) => {
    setDocs((prev) =>
      prev.map((doc) => (doc.slug === slug ? { ...doc, ...updates } : doc))
    );
  };

  const handleFileSelect = (slug: DocKey, file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'application/pdf'];

    if (!validTypes.includes(file.type)) {
      updateDoc(slug, { error: 'Only PNG, JPG and PDF files are allowed' });
      return;
    }

    if (file.size > MAX_SIZE) {
      updateDoc(slug, { error: 'File size must be less than 5MB' });
      return;
    }

    updateDoc(slug, { file, error: null });
  };

  const removeFile = (slug: DocKey) => {
    updateDoc(slug, { file: null, error: null });
  };

  const canSubmit = docs.every((doc) => doc.file && !doc.error);

  const handleSubmit = () => {
    const medical = docs.find((d) => d.slug === 'medical')?.file;
    const license = docs.find((d) => d.slug === 'license')?.file;
    const specialist = docs.find((d) => d.slug === 'specialist')?.file;

    if (!medical || !license || !specialist) return;

    uploadCertification(
      {
        medicalCertificate: medical,
        currentPracticeLicense: license,
        specialtyTrainingCertificate: specialist,
      },
      {
        onSuccess: () => {
          toaster.success('Documents submitted successfully');
          setOpenModal(false);
          onSuccess?.();
        },
        onError: (error: unknown) => {
          const err = error as { message?: string };
          toaster.error(err?.message || 'Submission failed');
        },
      }
    );
  };

  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      title="Upload Certifications"
      description="This helps you get verified on EzzyCare"
      size="md"
    >
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
          className="mt-6 flex h-12 w-full justify-center rounded-full"
          variant="primary"
          loading={isPending}
          disabled={!canSubmit || isPending}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
};

interface UploaderProps {
  doc: DocType;
  onUpload: (slug: DocKey, file: File) => void;
  onRemove: (slug: DocKey) => void;
}

const Uploader = ({ doc, onUpload, onRemove }: UploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onUpload(doc.slug, file);
  };

  const hasFile = doc.file !== null;

  const sizeInMB = ((doc.file?.size ?? 0) / (1024 * 1024)).toFixed(2);

  return (
    <button
      type="button"
      onClick={openPicker}
      className={cn(
        'w-full rounded-xl border border-dashed border-blue-6a p-4 text-left',
        'transition hover:bg-blue-2a cursor-pointer relative'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={handleChange}
        className="hidden"
      />

      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-2a">
          {hasFile ? (
            <PdfIconLocal className="text-green-10" />
          ) : (
            <UploadIcon size={18} className="text-blue-9" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text">{doc.title}</p>

          {hasFile && (
            <p className="mt-0.5 text-xs text-text-muted truncate">
              {doc.file?.name} {` ${sizeInMB} MB`}
            </p>
          )}

          {!hasFile && !doc.error && (
            <p className="mt-0.5 text-xs text-text-muted">
              Format png, jpg, pdf (max size: 5 mb)
            </p>
          )}

          {doc.error && (
            <p className="mt-0.5 text-xs text-error">{doc.error}</p>
          )}
        </div>

        {hasFile && (
          <Trash2
            size={18}
            className="shrink-0 text-error cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(doc.slug);
            }}
          />
        )}
      </div>
    </button>
  );
};

export default UploadDoctorDocs;
