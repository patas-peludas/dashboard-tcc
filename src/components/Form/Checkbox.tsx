import { InputHTMLAttributes } from 'react';

type CheckboxProps = {
  name: string;
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Checkbox({ name, label, ...rest }: CheckboxProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          name={name}
          id={name}
          type="checkbox"
          {...rest}
          className="rounded border-solid border-leaf w-[18px] h-[18px] text-leaf focus:ring-leaf"
        />
        <label
          htmlFor={name}
          className="text-zinc-700 text-sm font-normal leading-[15px] tracking-[0.15px]"
        >
          {label}
        </label>
      </div>
    </div>
  );
}
