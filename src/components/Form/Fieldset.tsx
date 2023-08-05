import { ReactNode } from 'react';

export type FieldsetProps = {
  title: string;
  children: ReactNode;
};

export function Fieldset({ title, children }: FieldsetProps) {
  return (
    <fieldset className="border border-green-500 p-5 rounded flex flex-col gap-4">
      <legend className="text-base text-white px-3 py-2 bg-green-600 rounded mb-2">
        {title}
      </legend>

      {children}
    </fieldset>
  );
}
