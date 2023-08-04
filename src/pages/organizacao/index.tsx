import { Layout } from '@/components/Layout';
import { Team, TeamMembers } from '@/components/TeamMembers';
import Head from 'next/head';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs';
import { api } from '@/services/api';
import { OngForm, OngFormData } from '@/components/Form/Create/OngForm';
import {
  IndependentGroupForm,
  IndependentGroupFormData,
} from '@/components/Form/Create/IndependentGroup';
import { Role } from '@/@types/clerk-user';
import { OrgType } from './criar';

export type Org = {
  id: string;
  avatar_url: string | null;
  username: string;
  name: string;
  type: OrgType;
  cnpj: string | null;
  email: string;
  phone: string;
  description: string | null;
  pix_code: string;
  created_at: Date;
};

export type SocialMediaType = 'INSTAGRAM' | 'FACEBOOK' | 'TWITTER' | 'LINKEDIN';

export type SocialMedia = {
  id: string;
  type: SocialMediaType;
  url: string;
  created_at: Date;
  org_id: string;
};

export type Address = {
  id: string;
  cep: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string;
  uf: string;
  created_at: Date;
  org_id: string;
};

type OrganizationProps = {
  userId: string;
  orgName: string;
  orgType: 'ONG' | 'INDEPENDENT_GROUP';
  members: {
    approveds: Team[];
    pendents: Team[];
  };
  role: Role;
  independentGroupFormData: IndependentGroupFormData | null;
  ongFormData: OngFormData | null;
};

export default function Organization({
  userId,
  orgName,
  orgType,
  members,
  role,
  independentGroupFormData,
  ongFormData,
}: OrganizationProps) {
  return (
    <>
      <Head>
        <title>Equipe | Patas Peludas</title>
      </Head>
      <Layout title={orgName} orgName={orgName}>
        <div className="flex flex-col gap-5">
          <TeamMembers members={members} userId={userId} role={role} />

          {role === 'ADMIN' && (
            <>
              {orgType === 'ONG' ? (
                <OngForm
                  email={null}
                  type="ONG"
                  ongFormData={ongFormData}
                  isUpdateMode
                />
              ) : (
                <IndependentGroupForm
                  email={null}
                  type="INDEPENDENT_GROUP"
                  independentGroupFormData={independentGroupFormData}
                  isUpdateMode
                />
              )}
            </>
          )}
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

  if (!orgId) {
    return {
      redirect: {
        destination: '/organizacao/criar-ou-entrar',
        permanent: false,
      },
    };
  }

  const { data } = await api.get('/teams/members', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const role = user?.publicMetadata.role;

  let independentGroupFormData;
  let ongFormData;

  let orgName;
  let orgType;

  if (role === 'ADMIN') {
    const { data } = await api.get<{
      org: Org;
      socialMedias: SocialMedia[];
      addresses: Address[];
    }>(`/orgs/${orgId}/complete`, { params: { by: 'ID' } });

    orgName = data.org.name;
    orgType = data.org.type;

    if (data.org.type === 'ONG') {
      ongFormData = {
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
          instagramUrl:
            data.socialMedias
              .find((social) => social.type === 'INSTAGRAM')
              ?.url.split('.com/')[1] ?? null,
          facebookUrl:
            data.socialMedias
              .find((social) => social.type === 'FACEBOOK')
              ?.url.split('.com/')[1] ?? null,
          twitterUrl:
            data.socialMedias
              .find((social) => social.type === 'TWITTER')
              ?.url.split('.com/')[1] ?? null,
          linkedinUrl:
            data.socialMedias
              .find((social) => social.type === 'LINKEDIN')
              ?.url.split('.com/in/')[1] ?? null,
        },
        address: data.addresses.find((address) => address.org_id === orgId)!,
      };

      independentGroupFormData = null;
    } else {
      independentGroupFormData = {
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
          instagramUrl:
            data.socialMedias
              .find((social) => social.type === 'INSTAGRAM')
              ?.url.split('.com/')[1] ?? null,
          facebookUrl:
            data.socialMedias
              .find((social) => social.type === 'FACEBOOK')
              ?.url.split('.com/')[1] ?? null,
          twitterUrl:
            data.socialMedias
              .find((social) => social.type === 'TWITTER')
              ?.url.split('.com/')[1] ?? null,
          linkedinUrl:
            data.socialMedias
              .find((social) => social.type === 'LINKEDIN')
              ?.url.split('.com/in/')[1] ?? null,
        },
        locales: data.addresses.map((address) => {
          return {
            city: address.city,
            uf: address.uf,
          };
        }),
      };

      ongFormData = null;
    }
  } else {
    const { data } = await api.get<{
      org: Org;
    }>(`/orgs/${orgId}`, { params: { by: 'ID' } });

    orgName = data.org.name;
    orgType = data.org.type;

    independentGroupFormData = null;
    ongFormData = null;
  }

  return {
    props: {
      userId,
      orgName,
      orgType,
      members: {
        approveds: data.approveds,
        pendents: data.pendents,
      },
      role,
      ongFormData,
      independentGroupFormData,
    },
  };
};
