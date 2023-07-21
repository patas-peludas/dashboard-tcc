import { RichText } from './RichText';

export function DescriptionForm() {
  return (
    <div className="mb-5 bg-zinc-50 p-5 rounded-[20px] flex flex-col gap-1 w-full">
      <h4 className="text-green-800 text-[18px] font-bold leading-8 tracking-tight mb-5">
        Descrição da Organização
      </h4>

      <RichText />
    </div>
  );
}
