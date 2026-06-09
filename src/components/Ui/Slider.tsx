'use client';

type SliderProps = {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  onChange?: (value: number) => void;
};

export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  suffix = 'km',
  onChange,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-2.5 flex-1">
        {/* Track */}
        <div className="absolute inset-0 rounded-full bg-blue-3" />

        {/* Filled Track */}
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-blue-11"
          style={{ width: `${percentage}%` }}
        />

        {/* Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="
            absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none bg-transparent

            [&::-webkit-slider-thumb]:h-5.25
            [&::-webkit-slider-thumb]:w-5.25
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:border
            [&::-webkit-slider-thumb]:border-surface-card
            [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:shadow-md

            [&::-moz-range-thumb]:h-5.25
            [&::-moz-range-thumb]:w-5.25
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:border
            [&::-moz-range-thumb]:border-surface-card
            [&::-moz-range-thumb]:bg-primary
            [&::-moz-range-thumb]:shadow-md
          "
        />
      </div>

      {/* Value */}
      <span className="min-w-14 text-sm font-medium text-cyan-700">
        {value}
        {suffix}
      </span>
    </div>
  );
}
