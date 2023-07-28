import { NavLink } from './NavLink';
import { NavSection } from './NavSection';
import { CheckCircle2, ShieldQuestion, Users } from 'lucide-react';

type SidebarNavProps = {
  isLocked?: boolean;
  orgName?: string;
};

// const menuItems = [
//   {
//     Icon: LayoutDashboard,
//     name: 'Dashboard',
//     link: '/',
//   },
//   {
//     Icon: Dog,
//     name: 'Pets',
//     link: '/pets',
//   },
//   {
//     Icon: HeartHandshake,
//     name: 'Contribuições',
//     link: '/contribuicoes',
//   },
// ];

const platformItem = [
  {
    Icon: ShieldQuestion,
    name: 'Suporte',
    link: '/plataforma',
  },
];

export function SidebarNav({ isLocked, orgName }: SidebarNavProps) {
  return (
    <div className="mt-8 pl-8 w-full flex flex-col items-start justify-start gap-8">
      {/* {!isLocked && (
        <NavSection title="MENU">
          {menuItems.map((item) => (
            <NavLink key={item.link} link={item.link} Icon={item.Icon}>
              {item.name}
            </NavLink>
          ))}
        </NavSection>
      )} */}

      <NavSection title="Organização">
        {!isLocked && (
          <>
            {orgName && (
              <NavLink Icon={Users} link="/organizacao">
                {orgName}
              </NavLink>
            )}
          </>
        )}
        {isLocked && (
          <NavLink Icon={CheckCircle2} link="/organizacao/criar-ou-entrar">
            Criar ou Entrar
          </NavLink>
        )}
      </NavSection>

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
