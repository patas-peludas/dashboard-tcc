import {
  ForwardRefRenderFunction,
  ReactNode,
  SelectHTMLAttributes,
  forwardRef,
} from 'react';
import { FieldError } from 'react-hook-form';
import { Label } from './Label';
import { ErrorMessage } from './ErrorMessage';
import { clsx } from 'clsx';

type SelectProps = {
  name: string;
  label: string;
  error?: FieldError;
  tooltipMessage?: string;
  children: ReactNode;
  isRequired?: boolean;
} & SelectHTMLAttributes<HTMLSelectElement>;

const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, SelectProps> = (
  {
    name,
    error = null,
    label,
    tooltipMessage,
    children,
    isRequired = false,
    ...rest
  },
  ref
) => {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <Label
          name={name}
          label={label}
          tooltipMessage={tooltipMessage}
          isRequired={isRequired}
        />

        <select
          name={name}
          id={name}
          {...rest}
          className={clsx(
            'w-full h-10 p-2 text-sm text-green-600 leading-5 tracking-[0.15px] rounded border-solid border  bg-zinc-50 outline-none ring-leaf placeholder:text-zinc-400 focus:!ring-leaf focus:ring-1',
            {
              'border-green-500': !error,
              'border-red-500': error,
            }
          )}
          ref={ref}
        >
          {children}
        </select>
      </div>
      {!!error && <ErrorMessage message={error.message} />}
    </div>
  );
};

export const Select = forwardRef(SelectBase);
