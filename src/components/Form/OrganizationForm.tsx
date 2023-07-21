import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from './Input';
import { Spinner } from '../Spinner';
import { Save } from 'lucide-react';

type OrganizationFormData = {
  name: string;
  email: string;
  phone?: string;
  cnpj?: string;
};

const organizationSchema = yup.object().shape({
  name: yup.string().required('Nome da organização obrigatório.'),
  email: yup.string().required('E-mail obrigatório.').email('E-mail inválido'),
});

export function OrganizationForm() {
  const { register, handleSubmit, formState } = useForm<OrganizationFormData>({
    resolver: yupResolver(organizationSchema),
  });

  const { errors, isSubmitting } = formState;

  const handleOrganization: SubmitHandler<OrganizationFormData> = async (
    values
  ) => {
    console.log(values);
  };

  return (
    <div className="mb-5 bg-zinc-50 p-5 rounded-[20px] flex flex-col gap-1 w-full">
      <h4 className="text-green-800 text-[18px] font-bold leading-8 tracking-tight">
        Dados da Organização
      </h4>

      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={handleSubmit(handleOrganization)}
      >
        <Input label="Nome" {...register('name')} error={errors.name} />

        <Input label="E-mail" {...register('email')} error={errors.email} />

        <Input label="WhatsApp" {...register('phone')} error={errors.phone} />

        <Input
          label="CNPJ (opcional)"
          {...register('cnpj')}
          error={errors.cnpj}
        />

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
