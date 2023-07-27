import { Layout } from '@/components/Layout';
import { HeartHandshake, LogIn } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';

export default function CreateOrEnter() {
  return (
    <>
      <Head>
        <title>Crie ou entre em uma organização | Patas Peludas</title>
      </Head>
      <Layout title="Crie ou entre em uma organização" isLocked>
        <div className="w-max">
          <div className="grid grid-cols-2 gap-8">
            <Link
              href="/organizacao/criar"
              className="w-44 h-44 p-3 border-gray-400 text-zinc-600 border hover:bg-green-300 hover:text-zinc-50 hover:border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 text-lg uppercase tracking-wider font-medium  shadow"
            >
              <HeartHandshake strokeWidth={1} className="w-32 h-32" />
              Criar
            </Link>

            <Link
              href="/organizacao/entrar"
              className="w-44 h-44 p-3 border-gray-400 text-zinc-600 border hover:bg-green-300 hover:text-zinc-50 hover:border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 text-lg uppercase tracking-wider font-medium  shadow"
            >
              <LogIn strokeWidth={1} className="w-32 h-32" />
              Entrar
            </Link>
          </div>
        </div>
      </Layout>
    </>
  );
}
