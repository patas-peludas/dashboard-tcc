import { NavLink } from './NavLink';
import { NavSection } from './NavSection';
import {
  Dog,
  HeartHandshake,
  LayoutDashboard,
  Send,
  Users,
} from 'lucide-react';

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
  link: '/equipe',
};

const feedbackItem = {
  Icon: Send,
  name: 'Dar Feedback',
  link: '/feedback',
};

export function SidebarNav() {
  return (
    <div className="mt-8 pl-8 w-full flex flex-col items-start justify-start gap-8">
      <NavSection title="MENU">
        {menuItems.map((item) => (
          <NavLink key={item.link} link={item.link} Icon={item.Icon}>
            {item.name}
          </NavLink>
        ))}
      </NavSection>

      <NavSection title="EQUIPE">
        <NavLink {...teamItem}>{teamItem.name}</NavLink>
      </NavSection>

      <NavSection title="Feedback">
        <NavLink {...feedbackItem}>{feedbackItem.name}</NavLink>
      </NavSection>
    </div>
  );
}
