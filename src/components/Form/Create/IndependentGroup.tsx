import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Input } from '../Input';
import { celularMask } from 'masks-br';
import { Select } from '../Select';
import { Checkbox } from '../Checkbox';
import { TextArea } from '../TextArea';
import { MinusCircle, PlusCircle, Save } from 'lucide-react';
import { Spinner } from '@/components/Spinner';
import { OrgType } from '@/pages/organizacao/criar';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/services/api';
import { SocialMedia } from './OngForm';
import { useRouter } from 'next/router';
import { InputSocial } from '../InputSocial';
import { toast } from 'react-hot-toast';
import { Address } from '@/pages/organizacao';
import { useState } from 'react';

export type Locale = {
  city: string;
  uf: string;
};

export type IndependentGroupFormData = {
  avatarUrl?: string;
  username: string;
  name: string;
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
  locales: Locale[];
};

type IndependentGroupFormProps = {
  email: string | null;
  type: OrgType;
  isUpdateMode?: boolean;
  independentGroupFormData?: IndependentGroupFormData | null;
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
  office: yup.string().required('Nome do cargo obrigatório.'),
  bank: yup.object().shape({
    pix_code: yup.string().required('Código Pix obrigatório.'),
  }),
  locales: yup
    .array()
    .of(
      yup.object().shape({
        city: yup.string().required('Cidade obrigatória.'),
        uf: yup
          .string()
          .max(2, 'Máx. 2 caracteres')
          .required('UF obrigatório.'),
      })
    )
    .defined(),
});

const ufs = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

export function IndependentGroupForm({
  email,
  type,
  isUpdateMode = false,
  independentGroupFormData,
}: IndependentGroupFormProps) {
  const [formData, setFormData] = useState(independentGroupFormData);

  const { getToken } = useAuth();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState,
    setValue,
    resetField,
    clearErrors,
    setError,
    control,
  } = useForm<IndependentGroupFormData>({
    resolver: yupResolver(createOrgSchema),
    defaultValues: formData ?? {
      locales: [{ city: '', uf: '' }],
    },
  });

  const { errors, isSubmitting, isDirty } = formState;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'locales',
  });

  const handleFormData: SubmitHandler<IndependentGroupFormData> = async (
    values
  ) => {
    const token = await getToken({ template: 'jwt-patas-peludas' });

    if (isUpdateMode) {
      try {
        const org = {
          avatar_url: null,
          username: values.username,
          name: values.name,
          type,
          cnpj: null,
          email: values.email,
          phone: values.phone,
          description: values.description ?? null,
          pix_code: values.bank.pix_code,
        };

        const addresses: Omit<Address, 'id' | 'created_at' | 'org_id'>[] = [];

        if (values.locales.length > 0) {
          await Promise.all(
            values.locales.map(async (locale) => {
              const address = {
                cep: null,
                street: null,
                number: null,
                complement: null,
                neighborhood: null,
                city: locale.city,
                uf: locale.uf,
              };

              addresses.push(address);
            })
          );
        }

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
            addresses,
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
          locales: data.addresses.map((address: Address) => {
            return {
              city: address.city,
              uf: address.uf,
            };
          }),
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
    } else {
      try {
        const org = {
          avatar_url: null,
          username: values.username,
          name: values.name,
          type,
          cnpj: null,
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

        if (values.locales.length > 0) {
          await Promise.all(
            values.locales.map(async (locale) => {
              const address = {
                cep: null,
                street: null,
                number: null,
                complement: null,
                neighborhood: null,
                city: locale.city,
                uf: locale.uf,
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
            })
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
              Locais de atuação
            </legend>

            {fields.map((item, index) => (
              <div key={item.id} className="flex items-start gap-4 h-max mb-2">
                <Input
                  label="Cidade"
                  placeholder="Manaus"
                  {...register(`locales.${index}.city`)}
                  error={errors.locales?.[index]?.city}
                />

                <div className="w-28">
                  <Select
                    label="UF"
                    placeholder="AM"
                    {...register(`locales.${index}.uf`)}
                    error={errors.locales?.[index]?.uf}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Selecione...
                    </option>
                    {ufs.map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </Select>
                </div>

                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-8"
                >
                  <MinusCircle className="w-6 h-6" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ city: '', uf: '' })}
              className="bg-green-500 text-zinc-50 w-max px-3 py-3 rounded flex items-center justify-center gap-2 mt-6"
            >
              <PlusCircle className="w-6 h-6" />
              Adicionar mais
            </button>
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
