import { Layout } from '@/components/Layout';
import { TeamMembers } from '@/components/TeamMembers';
import Head from 'next/head';
import { OrganizationForm } from '@/components/Form/OrganizationForm';
import { AddressForm } from '@/components/Form/AddressForm';
import { DescriptionForm } from '@/components/Form/DescriptionForm';
import { SocialMediaForm } from '@/components/Form/SocialMediaForm';
import { PixCodeForm } from '@/components/Form/PixCodeForm';

export default function Organization() {
  return (
    <>
      <Head>
        <title>Equipe | Patas Peludas</title>
      </Head>
      <Layout title="Organização">
        <div className="w-full">
          <div className="grid grid-cols-2 gap-5 w-full">
            <OrganizationForm />
            <AddressForm />
          </div>

          <div>
            <DescriptionForm />
          </div>

          <div className="grid grid-cols-2 gap-5 w-full">
            <SocialMediaForm />
            <PixCodeForm />
          </div>

          <TeamMembers members={members} />
        </div>
      </Layout>
    </>
  );
}
