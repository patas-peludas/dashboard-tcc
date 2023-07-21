import { Layout } from '@/components/Layout';
import { PetsTable } from '@/components/Table/PetsTable';
import Head from 'next/head';

const pets = [
  {
    id: '1',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'Rex',
    type: 'Gato',
    age: 'Jovem',
    size: 'Pequeno',
    gender: 'Macho',
  },
  {
    id: '2',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'Rex',
    type: 'Gato',
    age: 'Jovem',
    size: 'Pequeno',
    gender: 'Macho',
  },
  {
    id: '3',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'Rex',
    type: 'Gato',
    age: 'Jovem',
    size: 'Pequeno',
    gender: 'Macho',
  },
  {
    id: '4',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'Rex',
    type: 'Gato',
    age: 'Jovem',
    size: 'Pequeno',
    gender: 'Macho',
  },
  {
    id: '5',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'Rex',
    type: 'Gato',
    age: 'Jovem',
    size: 'Pequeno',
    gender: 'Macho',
  },
  {
    id: '6',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'Rex',
    type: 'Gato',
    age: 'Jovem',
    size: 'Pequeno',
    gender: 'Macho',
  },
  {
    id: '7',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'Rex',
    type: 'Gato',
    age: 'Jovem',
    size: 'Pequeno',
    gender: 'Macho',
  },
  {
    id: '8',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'Rex',
    type: 'Gato',
    age: 'Jovem',
    size: 'Pequeno',
    gender: 'Macho',
  },
  {
    id: '9',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'Rex',
    type: 'Gato',
    age: 'Jovem',
    size: 'Pequeno',
    gender: 'Macho',
  },
  {
    id: '10',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'Rex',
    type: 'Gato',
    age: 'Jovem',
    size: 'Pequeno',
    gender: 'Macho',
  },
  {
    id: '11',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'Rex',
    type: 'Gato',
    age: 'Jovem',
    size: 'Pequeno',
    gender: 'Macho',
  },
  {
    id: '1',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'Rex',
    type: 'Gato',
    age: 'Jovem',
    size: 'Pequeno',
    gender: 'Macho',
  },
];

export default function Pets() {
  return (
    <>
      <Head>
        <title>Pets | Patas Peludas</title>
      </Head>
      <Layout title="Pets">
        <div className="w-max mx-auto">
          <PetsTable pets={pets} />
        </div>
      </Layout>
    </>
  );
}
