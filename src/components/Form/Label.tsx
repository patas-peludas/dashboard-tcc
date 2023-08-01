import { Asterisk, Info } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

export type LabelProps = {
  name: string;
  label: string;
  tooltipMessage?: string;
  isRequired?: boolean;
};

export function Label({
  name,
  label,
  tooltipMessage,
  isRequired = false,
}: LabelProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-zinc-700 text-xs font-medium leading-[15px] tracking-[0.15px] flex items-center gap-1"
      >
        {label}

        {isRequired && <Asterisk className="w-4 h-4 text-zinc-700" />}
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
  );
}
