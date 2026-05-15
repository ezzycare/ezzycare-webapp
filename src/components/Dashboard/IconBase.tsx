const IconBase = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-13.5 w-13.5 items-center justify-center rounded-lg bg-gray-2">
      {children}
    </div>
  );
};

export default IconBase;
