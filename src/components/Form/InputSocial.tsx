import {
  ForwardRefRenderFunction,
  InputHTMLAttributes,
  forwardRef,
} from 'react';
import { FieldError } from 'react-hook-form';
import { Label } from './Label';
import { ErrorMessage } from './ErrorMessage';
import { clsx } from 'clsx';

type InputProps = {
  name: string;
  label: string;
  error?: FieldError;
  tooltipMessage?: string;
  isRequired?: boolean;
  prefix: string;
} & InputHTMLAttributes<HTMLInputElement>;

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  {
    name,
    error = null,
    label,
    tooltipMessage,
    isRequired = false,
    prefix,
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
        <div className="flex items-center gap-1">
          <span className="text-sm">{prefix}</span>
          <input
            name={name}
            id={name}
            type="text"
            {...rest}
            className={clsx(
              'w-full h-10 p-2 text-sm text-green-600 leading-5 tracking-[0.15px] rounded border-solid border outline-none ring-leaf placeholder:text-zinc-400 focus:!ring-leaf focus:ring-1',
              {
                'border-green-500': !error,
                'border-red-500': error,
                'bg-zinc-300 cursor-not-allowed': rest.disabled,
                'bg-zinc-50 cursor-auto': !rest.disabled,
              }
            )}
            ref={ref}
          />
        </div>
      </div>
      {!!error && <ErrorMessage message={error.message} />}
    </div>
  );
};

export const InputSocial = forwardRef(InputBase);
