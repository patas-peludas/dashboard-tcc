/* eslint-disable react-hooks/exhaustive-deps */
import Image from 'next/image';
import logoImg from '@/assets/logo.svg';
import { SidebarNav } from './SidebarNav';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { XCircle } from 'lucide-react';
import { useBreakpoint } from '@/contexts/BreakpointContext';
import { useSidebar } from '@/contexts/SidebarContext';

type SidebarProps = {
  isLocked?: boolean;
  orgName?: string;
};

export function Sidebar({ isLocked = false, orgName }: SidebarProps) {
  const { lessThan } = useBreakpoint();
  const { isOpen, onClose } = useSidebar();

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lessThan('lg')) {
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  function handleClickOutside(event: MouseEvent) {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
  }

  return (
    <>
      {isOpen && lessThan('lg') && (
        <div className="fixed inset-0 bg-black opacity-50 z-40" />
      )}
      <aside
        ref={sidebarRef}
        className={clsx(
          'h-screen w-[290px] bg-white fixed left-0 top-0 flex flex-col items-center pt-8 z-50 transform transition-transform ease-in-out',
          {
            'translate-x-0 opacity-100': isOpen,
            '-translate-x-full opacity-0': !isOpen,
          }
        )}
      >
        {lessThan('lg') && (
          <button className="self-end pr-3 mb-4" onClick={onClose}>
            <XCircle strokeWidth={2} className="w-6 h-6 text-green-700" />
          </button>
        )}
        <Image src={logoImg} alt="Logo Patas Peludas" />

        <SidebarNav isLocked={isLocked} orgName={orgName} />
      </aside>
    </>
  );
}
