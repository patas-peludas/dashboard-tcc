import { NavLink } from './NavLink';
import { NavSection } from './NavSection';
import {
  Dog,
  HeartHandshake,
  LayoutDashboard,
  Lock,
  ShieldQuestion,
  Users,
} from 'lucide-react';

type SidebarNavProps = {
  isLocked?: boolean;
};

const menuItems = [
  {
    Icon: LayoutDashboard,
    name: 'Dashboard',
    link: '/',
  },
  {
    Icon: Dog,
    name: 'Pets',
    link: '/pets',
  },
  {
    Icon: HeartHandshake,
    name: 'Contribuições',
    link: '/contribuicoes',
  },
];

const teamItem = {
  Icon: Users,
  name: 'Patas Peludas Org',
  link: '/organizacao',
};

const platformItem = [
  {
    Icon: ShieldQuestion,
    name: 'Suporte',
    link: '/plataforma',
  },
];

export function SidebarNav({ isLocked }: SidebarNavProps) {
  return (
    <div className="mt-8 pl-8 w-full flex flex-col items-start justify-start gap-8">
      {!isLocked && (
        <>
          <NavSection title="MENU">
            {menuItems.map((item) => (
              <NavLink key={item.link} link={item.link} Icon={item.Icon}>
                {item.name}
              </NavLink>
            ))}
          </NavSection>

          <NavSection title="Organização">
            <NavLink {...teamItem}>{teamItem.name}</NavLink>
          </NavSection>
        </>
      )}

      {isLocked && (
        <div className="flex-1 flex flex-col items-start justify-center gap-2 ">
          <Lock strokeWidth={2} className="w-6 h-6 text-green-700" />
          <span className="text-base text-green-600 leading-5">
            Complete seu cadastro para acessar as funcionalidades.
          </span>
        </div>
      )}

      <NavSection title="Plataforma">
        {platformItem.map((item) => (
          <NavLink key={item.link} {...item}>
            {item.name}
          </NavLink>
        ))}
      </NavSection>
    </div>
  );
}
