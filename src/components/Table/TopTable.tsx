import Link from 'next/link';

type TopTable = {
  title: string;
  link: string;
  tableItems: string[];
  contributions: {
    avatarURL: string;
    name: string;
    amount: number;
  }[];
};

export function TopTable({ title, link, tableItems, contributions }: TopTable) {
  return (
    <div className="bg-white rounded-[20px] p-6">
      <div className="flex items-center justify-between">
        <h4 className="text-xl text-green-800 font-bold leading-8 tracking-tight">
          {title}
        </h4>

        <Link
          href={link}
          passHref
          className="text-green-300 text-sm font-medium leading-6 tracking-tight py-1 px-2 bg-zinc-100 rounded-[70px]"
        >
          Ver todos
        </Link>
      </div>

      <table className="mt-7 w-full">
        <thead>
          <tr className="flex items-center justify-between">
            {tableItems.map((item) => (
              <th
                key={item}
                className="text-sm font-medium leading-6 tracking-tight text-gray-400 w-max p-0"
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="flex flex-col gap-2 mt-5 [&>*:nth-child(odd)]:bg-zinc-50 [&>*:nth-child(even)]:bg-zinc-100">
          {contributions.map((item, index) => (
            <tr
              key={index}
              className="flex items-center justify-between w-full py-2 px-2"
            >
              <td className="flex items-center gap-2 text-green-700 text-sm font-bold tracking-tight leading-6">
                <img
                  className="w-8 h-8 rounded-full"
                  loading="lazy"
                  src={item.avatarURL}
                  alt={item.name}
                />
                {item.name}
              </td>
              <td className="text-sm font-medium leading-6 tracking-tight text-gray-400">
                {' '}
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(item.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
