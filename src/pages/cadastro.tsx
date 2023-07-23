import { Layout } from '@/components/Layout';
import { SelectProfile } from '@/components/SelectProfile';
import { api } from '@/services/api';
import { getAuth } from '@clerk/nextjs/server';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';

export default function Register() {
  return (
    <>
      <Head>
        <title>Cadastro | Patas Peludas</title>
      </Head>
      <Layout title="Cadastro" isLocked>
        <div className="w-max">
          <SelectProfile />
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const { getToken } = getAuth(ctx.req);
  const token = await getToken();

  if (!token) {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false,
      },
    };
  }

  try {
    await api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  } catch {
    return {
      props: {},
    };
  }
};
