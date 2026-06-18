'use client';

import Button from '@/components/Ui/Button';
import Modal from '@/components/Ui/Modal';
import { toaster } from '@/lib/toaster';
import { cn } from '@/lib/utils';
import { CheckCircle2, Trash2, UploadIcon } from 'lucide-react';
import { useRef, useState } from 'react';

type DocKey = 'medical' | 'license' | 'specialist';

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
  const [loading, setLoading] = useState(false);

  const [docs, setDocs] = useState<DocType[]>([
    {
      title: 'Upload medical certificate',
      slug: 'medical',
      file: null,
      progress: 0,
      uploaded: false,
      uploading: false,
      error: null,
    },
    {
      title: 'Upload current practice license',
      slug: 'license',
      file: null,
      progress: 0,
      uploaded: false,
      uploading: false,
      error: null,
    },
    {
      title: 'Upload specialist training certificate',
      slug: 'specialist',
      file: null,
      progress: 0,
      uploaded: false,
      uploading: false,
      error: null,
    },
  ]);

  const updateDoc = (slug: DocKey, updates: Partial<DocType>) => {
    setDocs((prev) =>
      prev.map((doc) => (doc.slug === slug ? { ...doc, ...updates } : doc))
    );
  };

  const handleFileUpload = async (slug: DocKey, file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'application/pdf'];

    if (!validTypes.includes(file.type)) {
      updateDoc(slug, { error: 'Only PNG, JPG and PDF files are allowed' });
      return;
    }

    if (file.size > MAX_SIZE) {
      updateDoc(slug, { error: 'File size must be less than 5MB' });
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
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        updateDoc(slug, { progress });

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

  const handleSubmit = () => {
    setLoading(true);
    // simulate submit
    setTimeout(() => {
      setLoading(false);
      toaster.success('Documents submitted successfully');
      setOpenModal(false);
      onSuccess?.();
    }, 600);
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
            onUpload={handleFileUpload}
            onRemove={removeFile}
          />
        ))}

        <Button
          className="mt-6 flex h-12 w-full justify-center rounded-full"
          variant="primary"
          loading={loading}
          disabled={!canSubmit || loading}
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

  // Show progress next to the title (inline) when uploading or uploaded
  const showInlineProgress = doc.uploading || doc.uploaded;

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
        accept=".png,.jpg,.jpeg,.pdf"
        onChange={handleChange}
        className="hidden"
      />

      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-2a">
          {doc.uploaded ? (
            <CheckCircle2 size={18} className="text-green-10" />
          ) : (
            <UploadIcon size={18} className="text-blue-9" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text">{doc.title}</p>

          {showInlineProgress && (
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-blue-2a overflow-hidden">
                <div
                  className="h-full bg-blue-10 transition-all duration-200"
                  style={{ width: `${doc.progress}%` }}
                />
              </div>
              <span className="text-xs text-text-muted shrink-0 min-w-[36px] text-right">
                {doc.progress}%
              </span>
            </div>
          )}

          {!showInlineProgress && !doc.error && (
            <p className="mt-0.5 text-xs text-text-muted">
              Format png, jpg, pdf (max size: 5 mb)
            </p>
          )}

          {doc.error && (
            <p className="mt-0.5 text-xs text-error">{doc.error}</p>
          )}
        </div>

        {doc.uploaded && (
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
