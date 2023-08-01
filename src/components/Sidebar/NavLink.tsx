import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { ElementType, ReactNode } from 'react';

export type NavLinkProps = {
  Icon: ElementType;
  children: ReactNode;
} & LinkProps;

export function NavLink({ Icon, children, ...rest }: NavLinkProps) {
  const { asPath } = useRouter();

  let isActive = false;

  if (asPath === rest.href) {
    isActive = true;
  }

  return (
    <Link
      {...rest}
      passHref
      className={clsx(
        'flex items-center gap-3 text-gray-400 text-base font-medium leading-6 tracking-wider w-full h-[36px] pr-4',
        {
          'text-green-700 border-r-4 border-green-700 rounded-sm': isActive,
          'text-gray-400': !isActive,
        }
      )}
    >
      <div>
        <Icon
          strokeWidth={isActive ? 2 : 1}
          className={clsx('w-6 h-6', {
            'text-green-700': isActive,
            'text-gray-400': !isActive,
          })}
        />
      </div>
      <p className="truncate">{children}</p>
    </Link>
  );
}
