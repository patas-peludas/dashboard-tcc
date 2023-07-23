import { ReactNode } from 'react';

type BoxProps = {
  title: string;
  children: ReactNode;
};

export function Box({ title, children }: BoxProps) {
  return (
    <div className="mb-5 bg-zinc-50 p-5 rounded-[20px] flex flex-col gap-1 w-full">
      <h4 className="text-green-800 text-xl font-bold leading-8 tracking-tight mb-6">
        {title}
      </h4>

      {children}
    </div>
  );
}
