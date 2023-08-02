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
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

export type OngFormData = {
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
    instagramUrl?: string;
    facebookUrl?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
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

export type SocialMedia = {
  type: 'INSTAGRAM' | 'FACEBOOK' | 'TWITTER' | 'LINKEDIN';
  url: string;
};

type OngFormProps = {
  email: string | null;
  type: OrgType;
  isUpdateMode?: boolean;
  ongFormData?: OngFormData | null;
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

export function OngForm({
  email,
  type,
  isUpdateMode = false,
  ongFormData,
}: OngFormProps) {
  const [formData, setFormData] = useState(ongFormData);
  const [disableAddress, setDisableAddress] = useState(true);

  const { getToken } = useAuth();

  const router = useRouter();

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
    defaultValues: formData ?? undefined,
  });

  const { errors, isSubmitting, isDirty } = formState;

  const handleFormData: SubmitHandler<OngFormData> = async (values) => {
    const token = await getToken({ template: 'jwt-patas-peludas' });

    if (isUpdateMode) {
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

      const address = {
        cep: values.address.cep,
        street: values.address.street,
        number: values.address.number,
        complement: values.address.complement ?? null,
        neighborhood: values.address.neighborhood ?? null,
        city: values.address.city,
        uf: values.address.uf,
      };

      const socialMediasArray: SocialMedia[] = [];

      if (values.socialMedias?.instagramUrl) {
        socialMediasArray.push({
          type: 'INSTAGRAM',
          url: `https://www.instagram.com/${values.socialMedias.instagramUrl}`,
        });
      }

      if (values.socialMedias?.facebookUrl) {
        socialMediasArray.push({
          type: 'FACEBOOK',
          url: `https://www.facebook.com/${values.socialMedias.facebookUrl}`,
        });
      }

      if (values.socialMedias?.twitterUrl) {
        socialMediasArray.push({
          type: 'TWITTER',
          url: `https://www.twitter.com/${values.socialMedias.twitterUrl}`,
        });
      }

      if (values.socialMedias?.linkedinUrl) {
        socialMediasArray.push({
          type: 'LINKEDIN',
          url: `https://www.linkedin.com/in/${values.socialMedias.linkedinUrl}`,
        });
      }

      const { data } = await api.put(
        '/orgs',
        {
          ...org,
          addresses: [{ ...address }],
          socialMedias: socialMediasArray,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData({
        avatarUrl: data.org.avatar_url,
        username: data.org.username,
        name: data.org.name,
        cnpj: data.org.cnpj,
        email: data.org.email,
        phone: data.org.phone,
        description: data.org.description,
        office: 'remove',
        bank: {
          pix_code: data.org.pix_code,
        },
        socialMedias: {
          instagramUrl: data.socialMedias
            .find((social: SocialMedia) => social.type === 'INSTAGRAM')
            ?.url.split('.com/')[1],
          facebookUrl: data.socialMedias
            .find((social: SocialMedia) => social.type === 'FACEBOOK')
            ?.url.split('.com/')[1],
          twitterUrl: data.socialMedias
            .find((social: SocialMedia) => social.type === 'TWITTER')
            ?.url.split('.com/')[1],
          linkedinUrl: data.socialMedias
            .find((social: SocialMedia) => social.type === 'LINKEDIN')
            ?.url.split('.com/in/')[1],
        },
        address: {
          cep: data.addresses[0].cep,
          street: data.addresses[0].street,
          number: data.addresses[0].number,
          complement: data.addresses[0].complement,
          neighborhood: data.addresses[0].neighborhood,
          city: data.addresses[0].city,
          uf: data.addresses[0].uf,
        },
      });

      toast.custom(
        (t) => (
          <div
            className={`bg-green-500 px-6 py-4 shadow-md rounded-full flex flex-col gap-1 text-zinc-50 ${
              t.visible ? 'animate-enter' : 'animate-leave'
            }`}
          >
            <span className=" text-base font-semibold">
              Alterações salvas. 😁
            </span>
            <p className="text-xs">Alterações salvas com sucesso.</p>
          </div>
        ),
        { position: 'bottom-right' }
      );
    } else {
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

        const socialMediasArray: SocialMedia[] = [];

        if (values.socialMedias?.instagramUrl) {
          socialMediasArray.push({
            type: 'INSTAGRAM',
            url: `https://www.instagram.com/${values.socialMedias.instagramUrl}`,
          });
        }

        if (values.socialMedias?.facebookUrl) {
          socialMediasArray.push({
            type: 'FACEBOOK',
            url: `https://www.facebook.com/${values.socialMedias.facebookUrl}`,
          });
        }

        if (values.socialMedias?.twitterUrl) {
          socialMediasArray.push({
            type: 'TWITTER',
            url: `https://www.twitter.com/${values.socialMedias.twitterUrl}`,
          });
        }

        if (values.socialMedias?.linkedinUrl) {
          socialMediasArray.push({
            type: 'LINKEDIN',
            url: `https://www.linkedin.com/in/${values.socialMedias.linkedinUrl}`,
          });
        }

        if (socialMediasArray.length > 0) {
          await api.post(
            '/social-medias',
            { socialMedias: socialMediasArray },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        router.push('/');
      } catch {
        toast.custom(
          (t) => (
            <div
              className={`bg-red-500 px-6 py-4 shadow-md rounded-full flex flex-col gap-1 text-zinc-50 ${
                t.visible ? 'animate-enter' : 'animate-leave'
              }`}
            >
              <span className=" text-base font-semibold">
                Não foi possível completar a ação 🙁
              </span>
              <p className="text-xs">
                Se persistir o erro, entre em contato com o suporte.
              </p>
            </div>
          ),
          { position: 'bottom-right' }
        );
      }
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
      try {
        const { data } = await axios.get<AxiosAddressProps>(
          `https://brasilapi.com.br/api/cep/v1/${value}`
        );

        setValue('address.city', data.city);
        setValue('address.uf', data.state);
        setValue('address.neighborhood', data.neighborhood);
        setValue('address.street', data.street);
      } catch {
        setDisableAddress(false);
      }
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
    } else {
      clearErrors('username');
    }
  }

  return (
    <form
      className="grid mobile:grid-cols-1 2xl:grid-cols-2 gap-6"
      onSubmit={handleSubmit(handleFormData)}
    >
      <fieldset className="border border-green-500 p-5 rounded flex flex-col gap-4">
        <legend className="text-base text-white px-3 py-2 bg-green-600 rounded mb-2">
          Informações básicas
        </legend>

        <div className="grid xs:grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <Input
            label="Nome de usuário da organização"
            placeholder="minhaorganizacao"
            {...register('username')}
            error={errors.username}
            isRequired
            onChange={(e) =>
              setValue('username', e.target.value.replace(/^@/, ''))
            }
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
            onChange={(e) =>
              setValue('phone', celularMask(e.target.value), {
                shouldDirty: true,
              })
            }
          />
        </div>

        <div className="grid xs:grid-cols-1 lg:grid-cols-3 gap-4">
          <Input
            label="CNPJ da organização"
            placeholder="21.445.567/0001-92"
            {...register('cnpj')}
            error={errors.cnpj}
            isRequired
            onChange={(e) =>
              setValue('cnpj', cnpjMask(e.target.value), {
                shouldDirty: true,
              })
            }
          />

          <Input
            label="E-mail da organização"
            placeholder="minhaorganizacao@gmail.com"
            {...register('email')}
            error={errors.email}
            isRequired
          />

          {email && (
            <div className="xs:mt-0 lg:mt-9">
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

        {!isUpdateMode && (
          <div className="grid xs:grid-cols-1 lg:grid-cols-3 gap-4">
            <Input
              label="Seu cargo na organização"
              placeholder="Presidente"
              {...register('office')}
              error={errors.office}
              isRequired
            />
          </div>
        )}

        <TextArea
          label="Descrição da organização"
          placeholder="Conte um pouco mais sobre a sua organização, missão e propósito..."
          {...register('description')}
          error={errors.description}
        />
      </fieldset>

      <div className="grid xs:grid-cols-1 lg:grid-cols-2 gap-6">
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
                  setValue('address.cep', cepMask(value), {
                    shouldDirty: true,
                  });
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
              disabled={disableAddress}
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
                  disabled={disableAddress}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Bairro"
                placeholder="São Francisco"
                {...register('address.neighborhood')}
                error={errors.address?.neighborhood}
                disabled={disableAddress}
              />
              <Input
                label="Cidade"
                placeholder="Manaus"
                {...register('address.city')}
                error={errors.address?.city}
                disabled={disableAddress}
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
              placeholder="minhaorganizacao"
              {...register('socialMedias.instagramUrl')}
              error={errors.socialMedias?.instagramUrl}
              prefix="https://www.instagram.com/"
              onChange={(e) =>
                setValue(
                  'socialMedias.instagramUrl',
                  e.target.value.replace(/^@/, '')
                )
              }
            />
            <InputSocial
              label="Facebook"
              placeholder="minhaorganizacao"
              {...register('socialMedias.facebookUrl')}
              error={errors.socialMedias?.facebookUrl}
              prefix="https://www.facebook.com/"
              onChange={(e) =>
                setValue(
                  'socialMedias.facebookUrl',
                  e.target.value.replace(/^@/, '')
                )
              }
            />
            <InputSocial
              label="Twitter"
              placeholder="minhaorganizacao"
              {...register('socialMedias.twitterUrl')}
              error={errors.socialMedias?.twitterUrl}
              prefix="https://www.twitter.com/"
              onChange={(e) =>
                setValue(
                  'socialMedias.twitterUrl',
                  e.target.value.replace(/^@/, '')
                )
              }
            />
            <InputSocial
              label="LinkedIn"
              placeholder="minhaorganizacao"
              {...register('socialMedias.linkedinUrl')}
              error={errors.socialMedias?.linkedinUrl}
              prefix="https://www.linkedin.com/in/"
              onChange={(e) =>
                setValue(
                  'socialMedias.linkedinUrl',
                  e.target.value.replace(/^@/, '')
                )
              }
            />
          </fieldset>
        </div>
      </div>

      <button
        type="submit"
        className="w-32 h-12 bg-green-500 flex items-center justify-center rounded hover:brightness-90 transition-colors mt-2 self-start disabled:bg-green-700 disabled:cursor-not-allowed disabled:hover:bg-green-700"
        disabled={isSubmitting || !isDirty}
      >
        {isSubmitting ? (
          <div className="w-5 h-5">
            <Spinner />
          </div>
        ) : (
          <span className="flex items-center gap-2 text-white text-xl">
            <Save strokeWidth={1} /> Salvar
          </span>
        )}
      </button>
    </form>
  );
}
