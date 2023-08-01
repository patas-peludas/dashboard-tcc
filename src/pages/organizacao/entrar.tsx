import { ErrorMessage } from '@/components/Form/ErrorMessage';
import { Input } from '@/components/Form/Input';
import { Layout } from '@/components/Layout';
import { Spinner } from '@/components/Spinner';
import { api } from '@/services/api';
import { clerkClient, useAuth } from '@clerk/nextjs';
import { getAuth } from '@clerk/nextjs/server';
import { LogIn, Search } from 'lucide-react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

type Org = {
  id: string;
  name: string;
};

export default function Enter() {
  const [search, setSearch] = useState('');
  const [office, setOffice] = useState('');
  const [org, setOrg] = useState<Org | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isError, setIsError] = useState(false);

  const { getToken } = useAuth();
  const router = useRouter();

  async function handleSearchOrgUserName() {
    try {
      setIsLoading(true);

      const { data } = await api.get(`/orgs/${search}`, {
        params: { by: 'USERNAME' },
      });

      setOrg({
        id: data.org.id,
        name: data.org.name,
      });
      setIsEmpty(false);
    } catch {
      setIsEmpty(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRequestToJoinOnOrgTeam() {
    if (office.length === 0) {
      setIsError(true);
      return;
    } else {
      setIsError(false);
    }

    if (!org) {
      return;
    }

    try {
      setIsLoadingRequest(true);
      const token = await getToken({ template: 'jwt-patas-peludas' });

      await api.post(
        '/teams/request',
        {
          role: office,
          orgId: org.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      router.push('/organizacao/aguardando-confirmacao');
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
    } finally {
      setIsLoadingRequest(false);
    }
  }

  return (
    <>
      <Head>
        <title>Entrar em uma organização | Patas Peludas</title>
      </Head>
      <Layout title="Entrar em uma organização" isLocked>
        <div className="xs:w-full lg:w-[600px]">
          <fieldset className="border border-green-500 p-5 rounded flex flex-col gap-4 mb-6 w-full">
            <legend className="text-base text-white px-3 py-2 bg-green-600 rounded mb-2">
              Pesquisar Organização
            </legend>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="org"
                className="text-zinc-700 text-xs font-medium leading-[15px] tracking-[0.15px]"
              >
                Nome de usuário da organização
              </label>
              <div className="flex items-center gap-1 max-w-[300px]">
                <input
                  type="text"
                  name="org"
                  id="org"
                  className="w-full h-10 p-2 text-sm text-green-600 leading-5 tracking-[0.15px] rounded border-solid border !outline-none ring-leaf placeholder:text-zinc-400 focus:!ring-leaf focus:ring-1 border-green-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearchOrgUserName();
                    }
                  }}
                />

                <button
                  className="bg-green-500 text-zinc-50 h-10 px-2 rounded hover:bg-green-600 transition-colors"
                  onClick={handleSearchOrgUserName}
                >
                  <Search strokeWidth={1} />
                </button>
              </div>
            </div>

            <div className="w-full mt-5">
              {isLoading ? (
                <div className="w-10 h-10 mx-auto">
                  <Spinner />
                </div>
              ) : (
                <>
                  {isEmpty ? (
                    <span className="flex-1 text-xl text-green-700">
                      Nenhuma organização encontrada
                    </span>
                  ) : (
                    <>
                      {org && (
                        <div className="w-full border border-1 border-leaf p-3 rounded flex flex-col">
                          <span className="text-xl text-green-700">
                            {org?.name}
                          </span>

                          <div className="mt-4 flex xs:flex-col lg:flex-row lg:items-end gap-4">
                            <div className="flex-1">
                              <Input
                                name="office"
                                label="Seu cargo na organização"
                                placeholder="Voluntário"
                                value={office}
                                onChange={(e) => setOffice(e.target.value)}
                                isRequired
                              />
                            </div>

                            <button
                              onClick={handleRequestToJoinOnOrgTeam}
                              className="flex items-center justify-center gap-2 bg-green-500 h-14 w-44 rounded text-zinc-50 text-base font-medium hover:bg-green-600 transition-all disabled:bg-green-700 disabled:cursor-not-allowed"
                              disabled={isLoadingRequest}
                            >
                              {isLoadingRequest ? (
                                <div className="w-6 h-6">
                                  <Spinner />
                                </div>
                              ) : (
                                <>
                                  <LogIn strokeWidth={2} />
                                  Solicitar entrada
                                </>
                              )}
                            </button>
                          </div>

                          {isError && (
                            <div className="mt-1">
                              <ErrorMessage message="Cargo obrigatório." />
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </fieldset>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const { getToken, userId } = getAuth(ctx.req);

  const token = await getToken({ template: 'jwt-patas-peludas' });

  if (!token || !userId) {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false,
      },
    };
  }

  const user = await clerkClient.users.getUser(userId);

  const orgId = user?.publicMetadata.orgId;

  if (orgId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  } else {
    return {
      props: {},
    };
  }
};
