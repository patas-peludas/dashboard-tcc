import Image from 'next/image';
import { Layout } from '@/components/Layout';
import { PetsTable } from '@/components/Table/PetsTable';
import { api } from '@/services/api';
import { clerkClient } from '@clerk/nextjs';
import { getAuth } from '@clerk/nextjs/server';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { Org } from './organizacao';
import catDogImg from '../assets/cat-dog.svg';
import { Cat } from 'lucide-react';

export type Pet = {
  id: string;
  cover_url: string | null;
  name: string;
  description: string;
  type: 'CAT' | 'DOG';
  age: 'BABY' | 'YOUNG' | 'ADULT' | 'SENIOR';
  size: 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE';
  gender: 'MALE' | 'FEMALE';
  city: string;
  uf: string;
  is_up_for_adoption: boolean;
  has_already_adopted: boolean;
  created_at: Date;
  org_id: string;
};

type PetsProps = {
  orgName: string;
  pets: Pet[];
  currentPage: number;
  totalPages: number;
};

export default function Pets({
  orgName,
  pets,
  currentPage,
  totalPages,
}: PetsProps) {
  return (
    <>
      <Head>
        <title>Pets | Patas Peludas</title>
      </Head>
      <Layout title="Pets" orgName={orgName}>
        {pets.length > 0 ? (
          <div className="w-max mx-auto">
            <PetsTable
              pets={pets}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        ) : (
          <div className="flex xs:flex-col lg:flex-row items-start">
            <Image src={catDogImg} alt="Ilustração de um cachorro e um gato" />

            <div className="flex flex-col gap-4">
              <h1 className="text-green-700 text-2xl font-medium">
                Nenhum pet cadastrado ainda...
              </h1>

              <button className="bg-green-600 text-lg font-medium leading-6 tracking-tight rounded-lg py-3 px-4 text-white flex items-center gap-2 w-max hover:bg-green-700 transition-all">
                <Cat className="w-6 h-6" />
                Cadastrar agora
              </button>
            </div>
          </div>
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

  if (!orgId) {
    return {
      redirect: {
        destination: '/organizacao/criar-ou-entrar',
        permanent: false,
      },
    };
  }

  try {
    const responseOrg = await api.get<{
      org: Org;
    }>(`/orgs/${orgId}`, { params: { by: 'ID' } });

    const responsePets = await api.get<{ pets: Pet[]; count: number }>(
      `/orgs/${orgId}/pets`
    );

    return {
      props: {
        orgName: responseOrg.data.org.name,
        pets: responsePets.data.pets,
        currentPage: ctx.params?.page ?? 1,
        totalPages: Math.ceil(responsePets.data.count / 20),
      },
    };
  } catch {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false,
      },
    };
  }
};
