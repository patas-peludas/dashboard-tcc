import { ReactNode } from 'react';

type NavSection = {
  title: string;
  children: ReactNode;
};

export function NavSection({ title, children }: NavSection) {
  return (
    <div className="w-full">
      <span className="text-gray-500 text-xs font-bold leading-4 tracking-widest uppercase w-full">
        {title}
      </span>

      <div className="mt-[22px] flex flex-col gap-5">{children}</div>
    </div>
  );
}
