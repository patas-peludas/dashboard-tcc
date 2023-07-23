import { clsx } from 'clsx';
import { ElementType, HTMLAttributes } from 'react';

type SelectButtonProps = {
  Icon: ElementType;
  title: string;
  isActive: boolean;
} & HTMLAttributes<HTMLButtonElement>;

export function SelectButton({
  Icon,
  title,
  isActive,
  ...rest
}: SelectButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'w-44 h-44 p-3 border hover:bg-green-300 hover:text-zinc-50 hover:border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 text-lg uppercase tracking-wider font-medium  shadow',
        {
          'bg-green-600 text-zinc-50 border-gray-600': isActive,
          'border-gray-400 text-zinc-600': !isActive,
        }
      )}
    >
      <Icon strokeWidth={1} className="w-32 h-32" />
      {title}
    </button>
  );
}
