import { ReactNode, useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { useRouter } from 'next/router';
import { UserArea } from './UserArea';
import { Menu } from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';
import { useBreakpoint } from '@/contexts/BreakpointContext';
import { Spinner } from './Spinner';

type LayoutProps = {
  title: string;
  isLocked?: boolean;
  orgName?: string;
  children: ReactNode;
};

export function Layout({
  title,
  children,
  isLocked = false,
  orgName,
}: LayoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { greaterThan, lessThan } = useBreakpoint();
  const { onOpen, isOpen } = useSidebar();

  const router = useRouter();

  useEffect(() => {
    if (isOpen === null) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isOpen]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="w-32 h-32">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex xs:flex-col lg:flex-row xs:p-5 lg:p-0">
      {lessThan('lg') && (
        <div className="w-full flex items-center justify-between">
          <button onClick={onOpen}>
            <Menu strokeWidth={1} className="w-11 h-11 text-green-700" />
          </button>

          <UserArea />
        </div>
      )}
      <Sidebar isLocked={isLocked} orgName={orgName} />

      <main className="flex-1 lg:ml-[290px] min-h-screen xs:px-0 lg:px-8 xs:py-4 lg:py-12">
        <div className="flex w-full items-center justify-between mb-8">
          <div className="flex flex-col gap-[2px]">
            {router.pathname !== '/' && (
              <span className="text-gray-500 text-sm font-medium leading-6">
                {router.pathname}
              </span>
            )}
            <h1 className="text-green-700 xs:text-2xl lg:text-3xl font-bold xs:leading-normal lg:leading-[42px] tracking-tight">
              {title}
            </h1>
          </div>

          {greaterThan('lg') && <UserArea />}
        </div>

        {children}
      </main>
    </div>
  );
}
