import { Input } from './Input';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Spinner } from '../Spinner';
import { Save } from 'lucide-react';

type AddressFormData = {
  cep: string;
  street: string;
  number?: string;
  complement?: string;
  neighborhood: string;
  city: string;
  uf: string;
};

const addressSchema = yup.object().shape({
  cep: yup.string().required('CEP obrigatório.'),
  street: yup.string().required('Endereço obrigatório.'),
  neighborhood: yup.string().required('Bairro obrigatório.'),
  city: yup.string().required('Cidade obrigatório.'),
  uf: yup.string().required('Unidade Federativa obrigatório.'),
});

export function AddressForm() {
  const { register, handleSubmit, formState } = useForm<AddressFormData>({
    resolver: yupResolver(addressSchema),
  });

  const { errors, isSubmitting } = formState;

  const handleAddress: SubmitHandler<AddressFormData> = async (values) => {
    console.log(values);
  };

  return (
    <div className="mb-5 bg-zinc-50 p-5 rounded-[20px] flex flex-col gap-1 w-full">
      <h4 className="text-green-800 text-[18px] font-bold leading-8 tracking-tight">
        Endereço da Organização
      </h4>

      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={handleSubmit(handleAddress)}
      >
        <div className="grid grid-cols-2 gap-4">
          <Input label="CEP" {...register('cep')} error={errors.cep} />

          <a
            href="https://buscacepinter.correios.com.br/app/endereco/index.php"
            target="_blank"
            rel="noreferrer"
            className="text-xs my-auto"
          >
            Não sei meu CEP
          </a>
        </div>
        <Input label="Endereço" {...register('street')} error={errors.street} />

        <div className="grid grid-cols-3 gap-4">
          <Input label="Número" {...register('number')} error={errors.number} />
          <Input
            label="Complemento"
            {...register('complement')}
            error={errors.complement}
          />
          <Input label="UF" {...register('uf')} error={errors.uf} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Bairro"
            {...register('neighborhood')}
            error={errors.neighborhood}
          />
          <Input label="Cidade" {...register('city')} error={errors.city} />
        </div>

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
