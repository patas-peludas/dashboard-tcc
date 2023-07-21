import { FileEdit, HelpingHand, MinusCircle, Plus, Search } from 'lucide-react';

type PetsTableProps = {
  pets: {
    id: string;
    avatarURL: string;
    name: string;
    type: string;
    age: string;
    size: string;
    gender: string;
  }[];
};

export function PetsTable({ pets }: PetsTableProps) {
  return (
    <div className="w-max bg-white rounded-[20px] p-6">
      <div className="mb-12 flex items-center justify-between w-full">
        <button className="bg-green-600 text-sm font-medium leading-6 tracking-tight rounded-lg py-2 px-4 text-white flex items-center gap-1">
          <Plus className="w-5 h-5" />
          Adicionar
        </button>

        <div className="w-[214px] h-[41px] flex items-center gap-3 bg-white focus-within:ring-1 focus-within:ring-leaf rounded-[49px] border-solid border border-leaf px-3 ">
          <Search className="w-4 h-4" />
          <input
            placeholder="Pesquisar..."
            className="flex-1 outline-none w-full  text-sm"
          />
        </div>
      </div>

      <table className="w-full">
        <thead className="w-full">
          <tr className="w-full">
            <th className="text-sm font-medium leading-6 tracking-tight text-gray-500 w-[216px] p-0">
              Nome
            </th>
            <th className="text-sm font-medium leading-6 tracking-tight text-gray-500 p-0 w-20">
              Tipo
            </th>
            <th className="text-sm font-medium leading-6 tracking-tight text-gray-500 w-28 p-0">
              Idade
            </th>
            <th className="text-sm font-medium leading-6 tracking-tight text-gray-500 w-28 p-0">
              Tamanho
            </th>
            <th className="text-sm font-medium leading-6 tracking-tight text-gray-500 w-24 p-0">
              Gênero
            </th>
          </tr>
        </thead>

        <tbody className="[&>*:nth-child(odd)]:bg-zinc-50 [&>*:nth-child(even)]:bg-zinc-100 p-2">
          {pets.map((pet) => (
            <tr key={pet.id}>
              <td className="flex items-center gap-2 text-green-700 text-sm font-medium tracking-tight leading-6 p-2 border-solid border-r border-r-gray-400">
                <img
                  className="w-8 h-8 rounded-full"
                  loading="lazy"
                  src={pet.avatarURL}
                  alt={pet.name}
                />
                {pet.name}
              </td>

              <td className="text-sm text-green-700 font-medium text-center p-2 border-solid border-r border-r-gray-400">
                {pet.type}
              </td>
              <td className="text-sm text-green-700 font-medium text-center p-2 border-solid border-r border-r-gray-400">
                {pet.age}
              </td>
              <td className="text-sm text-green-700 font-medium text-center p-2 border-solid border-r border-r-gray-400">
                {pet.size}
              </td>
              <td className="text-sm text-green-700 font-medium text-center p-2 border-solid border-r border-r-gray-400">
                {pet.gender}
              </td>

              <button className="w-10 p-2 rounded-[10px] bg-zinc-50">
                <HelpingHand
                  strokeWidth={2}
                  className="text-green-600 w-6 h-6"
                />
              </button>

              <button className="w-10 p-2 rounded-[10px] bg-zinc-50">
                <FileEdit strokeWidth={2} className="text-green-600 w-6 h-6" />
              </button>

              <button className="w-11 p-2 rounded-[10px] bg-zinc-50">
                <MinusCircle
                  strokeWidth={2}
                  className="text-green-600 w-6 h-6"
                />
              </button>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="w-full mt-6 flex items-center justify-between">
        <div>
          <span>1 - 2</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="bg-white border-solid border border-green-600 py-2 px-3 rounded">
            Anterior
          </button>
          <button className="bg-green-600 py-2 px-3 rounded text-white">
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}
