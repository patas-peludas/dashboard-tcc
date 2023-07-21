import {
  ForwardRefRenderFunction,
  InputHTMLAttributes,
  forwardRef,
} from 'react';
import { FieldError } from 'react-hook-form';

type InputProps = {
  name: string;
  label: string;
  error?: FieldError;
} & InputHTMLAttributes<HTMLInputElement>;

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, error = null, label, ...rest },
  ref
) => {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor={name}
          className="text-zinc-700 text-xs font-medium leading-[15px] tracking-[0.15px]"
        >
          {label}
        </label>
        <input
          name={name}
          id={name}
          type="text"
          {...rest}
          className="w-full h-10 p-2 text-sm leading-5 tracking-[0.15px] rounded border-solid border border-dew bg-zinc-50 outline-none ring-leaf placeholder:text-dew focus:!ring-leaf focus:ring-1"
          ref={ref}
        />
      </div>
      {!!error && (
        <span className="text-xs text-zinc-700">{error.message}</span>
      )}
    </div>
  );
};

export const Input = forwardRef(InputBase);
