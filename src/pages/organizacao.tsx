import { Layout } from '@/components/Layout';
import { TeamMembers } from '@/components/TeamMembers';
import { members } from '.';
import Head from 'next/head';
import { FileEdit } from 'lucide-react';
import { OrganizationForm } from '@/components/Form/OrganizationForm';
import { AddressForm } from '@/components/Form/AddressForm';
import { DescriptionForm } from '@/components/Form/DescriptionForm';

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

          <div className="mb-5 bg-zinc-50 p-5 rounded-[20px] flex flex-col gap-1 w-max">
            <h4 className="text-green-800 text-[18px] font-bold leading-8 tracking-tight">
              Chave Pix
            </h4>

            <div className="flex items-center gap-1">
              <span className="w-max border border-leaf p-2 rounded">
                asdifw89374293ohasdjfh39845yfds
              </span>

              <button>
                <FileEdit strokeWidth={2} className="text-green-600 w-7 h-7" />
              </button>
            </div>
          </div>

          <TeamMembers members={members} />
        </div>
      </Layout>
    </>
  );
}
