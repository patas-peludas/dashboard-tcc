import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { useRouter } from 'next/router';
import { Bell, Moon } from 'lucide-react';

type LayoutProps = {
  title: string;
  children: ReactNode;
};

export function Layout({ title, children }: LayoutProps) {
  const router = useRouter();

  return (
    <div className="relative flex">
      <Sidebar />
      <main className="flex-1 ml-[290px] min-h-screen px-8 py-12">
        <div className="flex w-full items-center justify-between mb-8">
          <div className="flex flex-col gap-[2px]">
            {router.pathname !== '/' && (
              <span className="text-gray-500 text-sm font-medium leading-6">
                {router.pathname}
              </span>
            )}
            <h1 className="text-green-700 text-3xl font-bold leading-[42px] tracking-tight">
              {title}
            </h1>
          </div>

          <div className="py-3 pr-3 pl-6 rounded-[30px] bg-white flex items-center gap-3">
            <button>
              <Bell strokeWidth={1} className="w-6 h-6 text-green-700" />
            </button>

            <button>
              <Moon strokeWidth={1} className="w-6 h-6 text-green-700" />
            </button>

            <button className="bg-zinc-300 w-[42px] h-[42px] rounded-full"></button>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
