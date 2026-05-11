'use client';

import React, { useEffect, useRef, useState } from 'react';

interface OtpInputProps {
  length?: number;
  timeout?: number;
  resendOtpFunction?: () => void;
  onChange?: (otp: string) => void;
  responsive?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  timeout,
  resendOtpFunction,
  onChange,
  responsive = false,
}: OtpInputProps) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const [countdownTimer, setCountdownTimer] = useState(0);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    onChange?.(otp.join(''));
  }, [otp]);

  useEffect(() => {
    if (countdownTimer === 0) return;

    const interval = setInterval(() => {
      setCountdownTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdownTimer]);

  const handleResendOtp = async () => {
    setCountdownTimer(timeout || 60);
    resendOtpFunction && (await resendOtpFunction());
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pastedData = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, length);
    const newOtp = pastedData.split('');
    while (newOtp.length < length) newOtp.push('');
    setOtp(newOtp);
    inputsRef.current[Math.min(pastedData.length, length - 1)]?.focus();
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${length}, 1fr)`,
    gap: '10px',
  };

  const flexStyle = {
    display: 'flex',
    gap: '10px',
  };

  return (
    <div>
      <div style={responsive ? gridStyle : flexStyle} onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            data-cy={`otp-input-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            // @ts-expect-error - This is safe because we ensure the ref array is always the correct length
            ref={(el) => (inputsRef.current[index] = el)}
            className={`${responsive ? 'min-w-8' : 'w-8'} h-10 text-sm text-center bg-border focus:outline-primary`}
          />
        ))}
      </div>
      <p className="opacity-45 mt-4 text-sm text-center">
        Didn’t get code?{' '}
        {countdownTimer === 0 && (
          <span className="text-text cursor-pointer" onClick={handleResendOtp}>
            RESEND
          </span>
        )}{' '}
        {countdownTimer > 0 && `RESEND IN 0:${countdownTimer}`}
      </p>
    </div>
  );
};

export default OtpInput;
