import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from './Input';
import { Spinner } from '../Spinner';
import { Save } from 'lucide-react';

type PixCodeFormData = {
  code: string;
};

const pixCodeSchema = yup.object().shape({
  code: yup.string().required('Código Pix obrigatório.'),
});

export function PixCodeForm() {
  const { register, handleSubmit, formState } = useForm<PixCodeFormData>({
    resolver: yupResolver(pixCodeSchema),
  });

  const { errors, isSubmitting } = formState;

  const handleOrganization: SubmitHandler<PixCodeFormData> = async (values) => {
    console.log(values);
  };

  return (
    <div className="mb-5 bg-zinc-50 p-5 rounded-[20px] flex flex-col gap-1 w-full h-max">
      <h4 className="text-green-800 text-[18px] font-bold leading-8 tracking-tight">
        Chave Pix
      </h4>

      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={handleSubmit(handleOrganization)}
      >
        <Input label="Chave Pix" {...register('code')} error={errors.code} />

        <button
          type="submit"
          className="w-max bg-leaf py-3 px-4 rounded hover:brightness-90 transition-colors mt-5 self-end"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Spinner />
          ) : (
            <span className="flex items-center gap-2 text-white">
              <Save strokeWidth={1} /> Salvar
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
