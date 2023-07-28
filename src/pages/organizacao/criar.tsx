import Head from 'next/head';
import { Layout } from '@/components/Layout';
import { useState } from 'react';
import { Select } from '@/components/Form/Select';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { api } from '@/services/api';
import { OngForm } from '@/components/Form/Create/OngForm';
import { IndependentGroupForm } from '@/components/Form/Create/IndependentGroup';
import { Role } from '@/@types/clerk-user';
import { clerkClient } from '@clerk/nextjs';

export type OrgType = 'ONG' | 'INDEPENDENT_GROUP';

type User = {
  id: string;
  avatarUrl: string;
  name: string;
  email: string;
  phone?: string;
  role: Role | null;
  isVerified: boolean;
};

type CreateProps = {
  email: string | null;
};

export default function Create({ email }: CreateProps) {
  const [type, setType] = useState<OrgType | null>(null);

  return (
    <>
      <Head>
        <title>Criar uma organização | Patas Peludas</title>
      </Head>
      <Layout title="Criar uma organização" isLocked>
        <fieldset className="border border-green-500 p-5 rounded flex flex-col gap-4 mb-6 w-max">
          <legend className="text-base text-white px-3 py-2 bg-green-600 rounded mb-2">
            Tipo de organização
          </legend>

          <div className="w-56">
            <Select
              label="Tipo de organização"
              name="type"
              onChange={(e) => setType(e.target.value as OrgType)}
              defaultValue=""
            >
              <option value="" disabled>
                Escolha um tipo...
              </option>
              <option value="ONG">ONG</option>
              <option value="INDEPENDENT_GROUP">
                Protetores Independentes
              </option>
            </Select>
          </div>
        </fieldset>

        {type && (
          <>
            {type === 'ONG' ? (
              <OngForm email={email} type={type} />
            ) : (
              <IndependentGroupForm email={email} type={type} />
            )}
          </>
        )}
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
    try {
      const { data } = await api.post<{ user: User }>(
        '/users',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        props: {
          email: data.user.email,
        },
      };
    } catch {
      const { data } = await api.get<{ user: User }>('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        props: {
          email: data.user.email,
        },
      };
    }
  }
};
