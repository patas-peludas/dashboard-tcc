import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { useRouter } from 'next/router';
// import { Bell, Moon } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

type LayoutProps = {
  title: string;
  isLocked?: boolean;
  children: ReactNode;
};

export function Layout({ title, children, isLocked = false }: LayoutProps) {
  const router = useRouter();

  return (
    <div className="relative flex">
      <Sidebar isLocked={isLocked} />
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

          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'w-10 h-10',
              },
            }}
          />

          {/* <div className="py-3 pr-3 pl-6 rounded-[30px] bg-white flex items-center gap-3">
            <button>
              <Bell strokeWidth={1} className="w-6 h-6 text-green-700" />
            </button>

            <button>
              <Moon strokeWidth={1} className="w-6 h-6 text-green-700" />
            </button>

            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10',
                },
              }}
            />
          </div> */}
        </div>

        {children}
      </main>
    </div>
  );
}
