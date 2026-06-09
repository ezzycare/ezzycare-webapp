export default function SpiralLoader() {
  return (
    <div className="relative h-24 w-24">
      <div className="absolute inset-0 rounded-full border-2 border-blue-3 animate-pulse" />

      <div className="absolute inset-2 rounded-full border-t-2 border-primary animate-spin" />

      <div
        className="absolute inset-4 rounded-full border-t-2 border-primary animate-spin"
        style={{
          animationDirection: 'reverse',
          animationDuration: '1.6s',
        }}
      />

      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_20px_var(--primary)]" />
    </div>
  );
}
