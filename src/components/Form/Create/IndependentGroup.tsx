import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '../Input';
import { celularMask } from 'masks-br';
import { Select } from '../Select';
import { Checkbox } from '../Checkbox';
import { TextArea } from '../TextArea';
import { Save } from 'lucide-react';
import { Spinner } from '@/components/Spinner';

type IndependentGroupFormData = {
  avatarUrl?: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  description?: string;
  role: {
    function: string;
    name: string;
  };
  bank: {
    pix_code: string;
  };
  socialMedias?: {
    instagramUrl: string;
    facebookUrl: string;
    twitterUrl: string;
    linkedinUrl: string;
  };
};

type IndependentGroupFormProps = {
  email: string | null;
};

const createOrgSchema = yup.object().shape({
  username: yup
    .string()
    .required('Nome de usuário da organização obrigatório.'),
  name: yup.string().required('Nome da organização obrigatório.'),
  email: yup
    .string()
    .required('E-mail da organização obrigatório.')
    .email('E-mail inválido'),
  phone: yup.string().required('Whatsapp da organização obrigatório.'),
  role: yup.object().shape({
    function: yup.string().required('Função obrigatória.'),
    name: yup.string().required('Nome do cargo obrigatório.'),
  }),
  bank: yup.object().shape({
    pix_code: yup.string().required('Código Pix obrigatório.'),
  }),
});

export function IndependentGroupForm({ email }: IndependentGroupFormProps) {
  const { register, handleSubmit, formState, setValue, resetField } =
    useForm<IndependentGroupFormData>({
      resolver: yupResolver(createOrgSchema),
    });

  const { errors, isSubmitting } = formState;

  const handleCreate: SubmitHandler<IndependentGroupFormData> = async (
    values
  ) => {
    console.log(values);
  };

  return (
    <form
      className="grid mobile:grid-cols-1 2xl:grid-cols-2 gap-6"
      onSubmit={handleSubmit(handleCreate)}
    >
      <fieldset className="border border-green-500 p-5 rounded flex flex-col gap-4">
        <legend className="text-base text-white px-3 py-2 bg-green-600 rounded mb-2">
          Informações básicas
        </legend>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <Input
            label="Nome de usuário da organização"
            placeholder="@minhaorganizacao"
            {...register('username')}
            error={errors.username}
            isRequired
          />
          <Input
            label="Nome da organização"
            placeholder="Minha Organização"
            {...register('name')}
            error={errors.name}
            isRequired
          />
          <Input
            label="Whatsapp da organização"
            placeholder="(11) 98765-4321"
            {...register('phone')}
            error={errors.phone}
            // tooltipMessage="Esse número ficará visível para o público entrar em contato"
            isRequired
            onChange={(e) => setValue('phone', celularMask(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="E-mail da organização"
            placeholder="minhaorganizacao@gmail.com"
            {...register('email')}
            error={errors.email}
            // tooltipMessage="Esse email ficará visível para o público entrar em contato"
            isRequired
          />

          {email && (
            <div className="mt-9">
              <Checkbox
                label="Usar o mesmo email do meu usuário"
                name="use-same-email"
                onChange={(e) => {
                  if (e.target.checked) {
                    setValue('email', email);
                  } else {
                    resetField('email');
                  }
                }}
              />
            </div>
          )}
        </div>

        <TextArea
          label="Descrição da organização"
          placeholder="Conte um pouco mais sobre a sua organização, missão e propósito..."
          {...register('description')}
          error={errors.description}
        />
      </fieldset>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <fieldset className="border border-green-500 p-5 rounded flex flex-col gap-4">
            <legend className="text-base text-white px-3 py-2 bg-green-600 rounded mb-2">
              Cargo
            </legend>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Sua função na organização"
                {...register('role.function')}
                error={errors.role?.function}
                isRequired
              >
                <option value="" disabled selected>
                  Escolha um tipo...
                </option>
                <option value="ADMIN">Administrador</option>
                <option value="MEMBER">Membro</option>
              </Select>

              <Input
                label="Seu cargo na organização"
                placeholder="Presidente"
                {...register('role.name')}
                error={errors.role?.name}
                isRequired
              />
            </div>
          </fieldset>

          <fieldset className="border border-green-500 p-5 rounded flex flex-col gap-4 h-max">
            <legend className="text-base text-white px-3 py-2 bg-green-600 rounded mb-2">
              Locais de atuação
            </legend>
          </fieldset>
        </div>

        <div className="flex flex-col gap-6">
          <fieldset className="border border-green-500 p-5 rounded flex flex-col gap-4">
            <legend className="text-base text-white px-3 py-2 bg-green-600 rounded mb-2">
              Informações Bancárias
            </legend>
            <Input
              label="Chave Pix"
              placeholder="chavepix"
              {...register('bank.pix_code')}
              error={errors.bank?.pix_code}
            />
            <Checkbox label="Usar o email do meu usuário" name="use-email" />
            <Checkbox
              label="Usar o número de whatsapp da minha organização"
              name="use-phone"
            />
            <Checkbox
              label="Usar o CNPJ  da minha organização"
              name="use-cnpj"
            />
          </fieldset>

          <fieldset className="border border-green-500 p-5 rounded flex flex-col gap-4">
            <legend className="text-base text-white px-3 py-2 bg-green-600 rounded mb-2">
              Redes Sociais
            </legend>

            <Input
              label="Instagram"
              placeholder="@minhaorganizacao"
              {...register('socialMedias.instagramUrl')}
              error={errors.socialMedias?.instagramUrl}
            />
            <Input
              label="Facebook"
              placeholder="@minhaorganizacao"
              {...register('socialMedias.facebookUrl')}
              error={errors.socialMedias?.facebookUrl}
            />
            <Input
              label="Twitter"
              placeholder="@minhaorganizacao"
              {...register('socialMedias.twitterUrl')}
              error={errors.socialMedias?.twitterUrl}
            />
            <Input
              label="LinkedIn"
              placeholder="@minhaorganizacao"
              {...register('socialMedias.linkedinUrl')}
              error={errors.socialMedias?.linkedinUrl}
            />
          </fieldset>
        </div>
      </div>

      <button
        type="submit"
        className="w-max bg-leaf py-3 px-4 rounded hover:brightness-90 transition-colors mt-2 self-start"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Spinner />
        ) : (
          <span className="flex items-center gap-2 text-white text-xl">
            <Save strokeWidth={1} /> Salvar
          </span>
        )}
      </button>
    </form>
  );
}
