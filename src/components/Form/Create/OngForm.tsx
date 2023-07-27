import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { Input } from '../Input';
import { celularMask, cepMask, cnpjMask } from 'masks-br';
import { Checkbox } from '../Checkbox';
import { TextArea } from '../TextArea';
import { Save } from 'lucide-react';
import { Spinner } from '@/components/Spinner';
import { InputSocial } from '../InputSocial';
import { api } from '@/services/api';
import { OrgType } from '@/pages/organizacao/criar';

type OngFormData = {
  avatarUrl?: string;
  username: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  description?: string;
  office: string;
  bank: {
    pix_code: string;
  };
  socialMedias?: {
    instagramUrl: string;
    facebookUrl: string;
    twitterUrl: string;
    linkedinUrl: string;
  };
  address: {
    cep: string;
    street: string;
    number?: string;
    complement?: string;
    neighborhood: string;
    city: string;
    uf: string;
  };
};

type AxiosAddressProps = {
  state: string;
  city: string;
  neighborhood: string;
  street: string;
};

type OngFormProps = {
  email: string | null;
  type: OrgType;
  token: string;
};

const createOngSchema = yup.object().shape({
  username: yup
    .string()
    .required('Nome de usuário da organização obrigatório.'),
  name: yup.string().required('Nome da organização obrigatório.'),
  cnpj: yup.string().required('CNPJ da organização obrigatório.'),
  email: yup
    .string()
    .required('E-mail da organização obrigatório.')
    .email('E-mail inválido'),
  phone: yup.string().required('Whatsapp da organização obrigatório.'),
  office: yup.string().required('Nome do cargo obrigatório.'),
  bank: yup.object().shape({
    pix_code: yup.string().required('Código Pix obrigatório.'),
  }),
  address: yup.object().shape({
    cep: yup
      .string()
      .required('CEP obrigatório')
      .min(9, 'O CEP precisa ter 8 números'),
    neighborhood: yup.string().required('Bairro obrigatório'),
    street: yup.string().required('Endereço obrigatório'),
    city: yup.string().required('Cidade obrigatória.'),
    uf: yup.string().max(2, 'No máximo 2 letras').required(''),
  }),
});

export function OngForm({ email, type, token }: OngFormProps) {
  const {
    register,
    handleSubmit,
    formState,
    setValue,
    resetField,
    clearErrors,
    reset,
    setError,
  } = useForm<OngFormData>({
    resolver: yupResolver(createOngSchema),
  });

  const { errors, isSubmitting } = formState;

  const handleCreate: SubmitHandler<OngFormData> = async (values) => {
    try {
      const org = {
        avatar_url: null,
        username: values.username,
        name: values.name,
        type,
        cnpj: values.cnpj,
        email: values.email,
        phone: values.phone,
        description: values.description ?? null,
        pix_code: values.bank.pix_code,
      };

      await api.post(
        '/orgs',
        { ...org },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await api.post(
        '/teams',
        { role: values.office },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const address = {
        cep: values.address.cep,
        street: values.address.street,
        number: values.address.number,
        complement: values.address.complement ?? null,
        neighborhood: values.address.neighborhood ?? null,
        city: values.address.city,
        uf: values.address.uf,
      };

      await api.post(
        '/addresses',
        { ...address },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //To Do Socials
    } catch (err) {
      console.log(err);
    }
  };

  async function handleSetAddress(value: string) {
    try {
      const { data } = await axios.get<AxiosAddressProps>(
        `https://brasilapi.com.br/api/cep/v2/${value}`
      );

      setValue('address.city', data.city);
      setValue('address.uf', data.state);
      setValue('address.neighborhood', data.neighborhood);
      setValue('address.street', data.street);
    } catch {
      resetField('address.city');
      resetField('address.uf');
      resetField('address.neighborhood');
      resetField('address.street');
      resetField('address.number');
      resetField('address.complement');
    }
  }

  async function handleUsernameVerification(value: string) {
    const { data } = await api.get<{ verification: boolean }>(
      '/orgs/verify-username',
      {
        params: { username: value },
      }
    );

    const { verification } = data;

    if (!verification) {
      setError('username', { message: 'Nome de usuário indisponível' });
    }
  }

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
            onBlur={(e) => handleUsernameVerification(e.target.value)}
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
            isRequired
            onChange={(e) => setValue('phone', celularMask(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="CNPJ da organização"
            placeholder="21.445.567/0001-92"
            {...register('cnpj')}
            error={errors.cnpj}
            isRequired
            onChange={(e) => setValue('cnpj', cnpjMask(e.target.value))}
          />

          <Input
            label="E-mail da organização"
            placeholder="minhaorganizacao@gmail.com"
            {...register('email')}
            error={errors.email}
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

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Seu cargo na organização"
            placeholder="Presidente"
            {...register('office')}
            error={errors.office}
            isRequired
          />
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
          <fieldset className="border border-green-500 p-5 rounded flex flex-col gap-4 h-max">
            <legend className="text-base text-white px-3 py-2 bg-green-600 rounded mb-2">
              Endereço
            </legend>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="CEP da organização"
                placeholder="69079-442"
                {...register('address.cep')}
                error={errors.address?.cep}
                onChange={(e) => {
                  const value = e.target.value;
                  setValue('address.cep', cepMask(value));
                  const cep = value.replace(/[^0-9]/g, '');
                  if (value === '') {
                    reset();
                  }

                  if (cep.length === 8) {
                    clearErrors('address.cep');
                    handleSetAddress(cep);
                  }
                }}
              />

              <div className="mt-8">
                <a
                  href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs my-auto"
                >
                  Não sei meu CEP
                </a>
              </div>
            </div>

            <Input
              label="Endereço da organização"
              placeholder="Beco Domingos Monteiro"
              {...register('address.street')}
              error={errors.address?.street}
              disabled
            />

            <div className="flex items-center gap-4">
              <div className="w-16">
                <Input
                  label="Número"
                  placeholder="10"
                  {...register('address.number')}
                  error={errors.address?.number}
                />
              </div>

              <div className="flex-1">
                <Input
                  label="Complemento"
                  placeholder="Bloco A"
                  {...register('address.complement')}
                  error={errors.address?.complement}
                />
              </div>

              <div className="w-11">
                <Input
                  label="UF"
                  placeholder="AM"
                  {...register('address.uf')}
                  error={errors.address?.uf}
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Bairro"
                placeholder="São Francisco"
                {...register('address.neighborhood')}
                error={errors.address?.neighborhood}
                disabled
              />
              <Input
                label="Cidade"
                placeholder="Manaus"
                {...register('address.city')}
                error={errors.address?.city}
                disabled
              />
            </div>
          </fieldset>

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
          </fieldset>
        </div>

        <div className="flex flex-col gap-6">
          <fieldset className="border border-green-500 p-5 rounded flex flex-col gap-4">
            <legend className="text-base text-white px-3 py-2 bg-green-600 rounded mb-2">
              Redes Sociais
            </legend>

            <InputSocial
              label="Instagram"
              placeholder="@minhaorganizacao"
              {...register('socialMedias.instagramUrl')}
              error={errors.socialMedias?.instagramUrl}
              prefix="https://www.instagram.com/"
            />
            <InputSocial
              label="Facebook"
              placeholder="@minhaorganizacao"
              {...register('socialMedias.facebookUrl')}
              error={errors.socialMedias?.facebookUrl}
              prefix="https://www.facebook.com/"
            />
            <InputSocial
              label="Twitter"
              placeholder="@minhaorganizacao"
              {...register('socialMedias.twitterUrl')}
              error={errors.socialMedias?.twitterUrl}
              prefix="https://www.twitter.com/"
            />
            <InputSocial
              label="LinkedIn"
              placeholder="@minhaorganizacao"
              {...register('socialMedias.linkedinUrl')}
              error={errors.socialMedias?.linkedinUrl}
              prefix="https://www.linkedin.com/in/"
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
