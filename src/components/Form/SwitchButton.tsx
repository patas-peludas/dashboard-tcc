import * as Switch from '@radix-ui/react-switch';
import { Label } from './Label';
import { ForwardRefRenderFunction, forwardRef } from 'react';

type SwitchButtonProps = {
  name: string;
  label: string;
  tooltipMessage?: string;
  isRequired?: boolean;
} & Switch.SwitchProps;

const SwitchBase: ForwardRefRenderFunction<
  HTMLButtonElement,
  SwitchButtonProps
> = ({ name, label, tooltipMessage, isRequired = false, ...rest }, ref) => {
  return (
    <div className="flex items-center gap-4 w-full">
      <Label
        name={name}
        label={label}
        tooltipMessage={tooltipMessage}
        isRequired={isRequired}
      />
      <Switch.Root
        name={name}
        id={name}
        ref={ref}
        {...rest}
        className="w-10 h-5 bg-zinc-300 rounded-full relative shadow-[0_2px_10px] shadow-blackA7 focus:shadow-[0_0_0_1px] focus:shadow-green-700 data-[state=checked]:bg-green-600 outline-none cursor-default"
      >
        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-[0_2px_2px] shadow-blackA7 transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
      </Switch.Root>
    </div>
  );
};

export const SwitchButton = forwardRef(SwitchBase);
