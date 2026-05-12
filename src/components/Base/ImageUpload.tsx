'use client';

import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type ImageValue = {
  file: File | null;
  url: string | null;
};

type Props = {
  label?: string;
  placeholder?: string;
  defaultValue?: string | null;
  value?: ImageValue | null;
  onChange: (value: ImageValue | null) => void;
};

export default function ImageUpload({
  label,
  placeholder = 'Upload image',
  defaultValue = null,
  value,
  onChange,
}: Props) {
  const [preview, setPreview] = useState<string | null>(
    value?.url || defaultValue
  );

  useEffect(() => {
    if (value?.url) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreview(value.url);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (!file) return;

    const url = URL.createObjectURL(file);

    setPreview(url);

    onChange({
      file,
      url,
    });
  };

  const handleRemove = () => {
    if (preview?.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);
    onChange(null);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium">{label}</label>}

      {!preview ? (
        <label
          className={cn(
            `flex cursor-pointer flex-col items-center justify-center rounded-xl 
            border border-border py-2 px-4 font-medium text-neutral-12 w-fit
            hover:border-gray-400`
          )}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex items-center gap-2">
            <Upload size={18} className="text-neutral-12" />
            <p>{placeholder}</p>
          </div>
        </label>
      ) : (
        <div className="relative w-fit">
          <Image
            src={preview}
            alt="upload preview"
            width={0}
            height={0}
            className="h-32 w-32 rounded-xl object-cover border"
          />

          <button
            type="button"
            onClick={handleRemove}
            className={cn(
              ` cursor-pointer absolute -top-2 -right-2 rounded-full 
              bg-red-500 px-2 py-1 text-xs text-white`
            )}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
