import { api } from '@/services/api';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Pet } from '.';
import Head from 'next/head';
import { Layout } from '@/components/Layout';
import { Address, Org } from '../organizacao';
import { RegisterPetForm } from '@/components/Form/RegisterPetForm';
import { Locale } from '@/components/Form/Create/IndependentGroup';

export type PetPicture = {
  id: string;
  picture_url: string;
};

type PetProfileProps = {
  pet: Pet;
  petPicturesUrl: string[];
  orgName: string;
  locales: Locale[];
};

export default function PetProfile({
  pet,
  petPicturesUrl,
  orgName,
  locales,
}: PetProfileProps) {
  const title = `${pet.name} | Patas Peludas`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Layout title={pet.name} orgName={orgName}>
        <RegisterPetForm
          locales={locales}
          pet={pet}
          petPicturesUrl={petPicturesUrl}
          isUpdateMode
        />
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const id = ctx.params?.id;

  try {
    const { data } = await api.get<{ pet: Pet; petPictures: PetPicture[] }>(
      `/pets/${id}`
    );

    const responseOrg = await api.get<{
      org: Org;
      addresses: Address[];
    }>(`/orgs/${data.pet.org_id}/complete`, { params: { by: 'ID' } });

    const petPicturesUrl = data.petPictures.map((pet) => pet.picture_url);

    return {
      props: {
        pet: data.pet,
        petPicturesUrl,
        orgName: responseOrg.data.org.name,
        locales: responseOrg.data.addresses.map((address) => {
          return {
            city: address.city,
            uf: address.uf,
          };
        }),
      },
    };
  } catch (err) {
    return {
      redirect: {
        destination: '/pets',
        permanent: false,
      },
    };
  }
};

// To do
// 2 - Rever o update da ONG (algumas partes está dando erro) -> Addresses...
