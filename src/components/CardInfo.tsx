import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ElementType } from 'react';

type CardInfoProps = {
  currentDate: Date;
  Icon: ElementType;
  title: string;
  amount?: number;
  quantity?: number;
  growthComparedLastMonth: number;
};

export function CardInfo({
  currentDate,
  Icon,
  title,
  amount,
  quantity,
  growthComparedLastMonth,
}: CardInfoProps) {
  return (
    <div className="py-3 pr-10 pl-4 bg-white rounded-[20px] w-max flex flex-col items-center gap-2">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-zinc-50 relative border-solid border-2 border-leaf">
          <Icon
            strokeWidth={1}
            className="w-8 h-8 text-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-green-500 text-xs font-bold leading-normal">
            {format(currentDate, 'MMM/yy', { locale: ptBR })}
          </span>

          <h3 className="text-green-600 text-base font-medium leading-6">
            {title}
          </h3>

          {amount && (
            <p className="text-2xl text-green-700 font-bold tracking-tight">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(amount)}
            </p>
          )}

          {quantity && (
            <p className="text-2xl text-green-700 font-bold tracking-tight">
              {quantity}
            </p>
          )}
        </div>
      </div>

      {growthComparedLastMonth > 0 && (
        <p className="text-green-500 text-xs font-normal leading-5 tracking-tight">
          <strong className="text-green-800 font-bold">
            +{growthComparedLastMonth}%
          </strong>{' '}
          desde o mês passado
        </p>
      )}
    </div>
  );
}
