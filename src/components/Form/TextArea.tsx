import {
  ForwardRefRenderFunction,
  TextareaHTMLAttributes,
  forwardRef,
} from 'react';
import { FieldError } from 'react-hook-form';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Info } from 'lucide-react';

type TextAreaProps = {
  name: string;
  label: string;
  error?: FieldError;
  tooltipMessage?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextAreaBase: ForwardRefRenderFunction<
  HTMLTextAreaElement,
  TextAreaProps
> = ({ name, error = null, label, tooltipMessage, ...rest }, ref) => {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <div>
          <label
            htmlFor={name}
            className="text-zinc-700 text-xs font-medium leading-[15px] tracking-[0.15px]"
          >
            {label}
          </label>

          {!!tooltipMessage && (
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button className="IconButton">
                    <Info />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content className="TooltipContent" sideOffset={5}>
                    {tooltipMessage}
                    <Tooltip.Arrow className="TooltipArrow" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          )}
        </div>
        <textarea
          name={name}
          id={name}
          spellCheck={false}
          {...rest}
          className="w-full resize-none leading-tight h-40 p-2 text-sm text-green-600 tracking-[0.15px] rounded border-solid border border-green-500 bg-zinc-50 outline-none ring-leaf placeholder:text-zinc-400 focus:!ring-leaf focus:ring-1"
          ref={ref}
        />
      </div>
      {!!error && (
        <span className="text-xs text-zinc-700">{error.message}</span>
      )}
    </div>
  );
};

export const TextArea = forwardRef(TextAreaBase);
