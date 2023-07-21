import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MinusCircle } from 'lucide-react';

type ContributionsTableProps = {
  contributions: {
    id: string;
    avatarURL: string;
    name: string;
    type: string;
    amount: number;
    date: Date;
  }[];
};

export function ContributionsTable({ contributions }: ContributionsTableProps) {
  return (
    <div className="w-max bg-white rounded-[20px] p-6">
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
              Valor
            </th>
            <th className="text-sm font-medium leading-6 tracking-tight text-gray-500 w-28 p-0">
              Dia
            </th>
          </tr>
        </thead>

        <tbody className="[&>*:nth-child(odd)]:bg-zinc-50 [&>*:nth-child(even)]:bg-zinc-100 p-2">
          {contributions.map((contribution) => (
            <tr key={contribution.id}>
              <td className="flex items-center gap-2 text-green-700 text-sm font-medium tracking-tight leading-6 p-2 border-solid border-r border-r-gray-400">
                <img
                  className="w-8 h-8 rounded-full"
                  loading="lazy"
                  src={contribution.avatarURL}
                  alt={contribution.name}
                />
                {contribution.name}
              </td>

              <td className="text-sm text-green-700 font-medium text-center p-2 border-solid border-r border-r-gray-400">
                {contribution.type}
              </td>
              <td className="text-sm text-green-700 font-medium text-center p-2 border-solid border-r border-r-gray-400">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(contribution.amount)}
              </td>
              <td className="text-sm text-green-700 font-medium text-center p-2 border-solid border-r border-r-gray-400">
                {format(contribution.date, 'dd/MM/yy', {
                  locale: ptBR,
                })}
              </td>

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
