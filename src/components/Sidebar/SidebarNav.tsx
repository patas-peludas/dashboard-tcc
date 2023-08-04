import { NavLink } from './NavLink';
import { NavSection } from './NavSection';
import { CheckCircle2, Dog, ShieldQuestion, Users } from 'lucide-react';

type SidebarNavProps = {
  isLocked?: boolean;
  orgName?: string;
};

const menuItems = [
  // {
  //   Icon: LayoutDashboard,
  //   name: 'Dashboard',
  //   link: '/',
  // },
  {
    Icon: Dog,
    name: 'Pets',
    href: '/pets',
  },
  // {
  //   Icon: HeartHandshake,
  //   name: 'Contribuições',
  //   link: '/contribuicoes',
  // },
];

const platformItem = [
  {
    name: 'Suporte',
    href: 'https://api.whatsapp.com/send?1=pt_BR&phone=5522988714717&text=Ol%C3%A1,%20poderia%20me%20ajudar%3F',
  },
];

export function SidebarNav({ isLocked, orgName }: SidebarNavProps) {
  return (
    <div className="mt-8 pl-8 w-full flex flex-col items-start justify-start gap-8">
      {!isLocked && (
        <NavSection title="MENU">
          {menuItems.map((item) => (
            <NavLink key={item.href} href={item.href} Icon={item.Icon}>
              {item.name}
            </NavLink>
          ))}
        </NavSection>
      )}

      <NavSection title="Organização">
        {!isLocked && (
          <>
            {orgName && (
              <NavLink Icon={Users} href="/organizacao">
                {orgName}
              </NavLink>
            )}
          </>
        )}
        {isLocked && (
          <NavLink Icon={CheckCircle2} href="/organizacao/criar-ou-entrar">
            Criar ou Entrar
          </NavLink>
        )}
      </NavSection>

      <NavSection title="Plataforma">
        {platformItem.map((item) => (
          <a
            key={item.href}
            {...item}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-gray-400 text-base font-medium leading-6 tracking-wider w-full h-[36px] pr-4"
          >
            <div>
              <ShieldQuestion
                strokeWidth={1}
                className={'w-6 h-6 text-green-700'}
              />
            </div>
            {item.name}
          </a>
        ))}
      </NavSection>
    </div>
  );
}
