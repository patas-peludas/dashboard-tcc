import Image from 'next/image';
import logoImg from '@/assets/logo.svg';
import { SidebarNav } from './SidebarNav';

type SidebarProps = {
  isLocked?: boolean;
};

export function Sidebar({ isLocked = false }: SidebarProps) {
  return (
    <aside className="h-screen w-[290px] bg-white fixed top-0 flex flex-col items-center pt-8">
      <Image src={logoImg} alt="Logo Patas Peludas" />

      <SidebarNav isLocked={isLocked} />
    </aside>
  );
}
