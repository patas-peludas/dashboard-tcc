/* eslint-disable react-hooks/exhaustive-deps */
import { Pet } from '@/pages/pets';
import { api } from '@/services/api';
import { Cat, Dog, FileEdit, MinusCircle, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type PetsTableProps = {
  pets: Pet[];
  orgId: string;
  currentPage: number;
  totalPages: number;
};

const petTypes = {
  DOG: 'Cachorro',
  CAT: 'Gato',
};

const petAges = {
  BABY: 'Filhote',
  YOUNG: 'Jovem',
  ADULT: 'Adulto',
  SENIOR: 'Idoso',
};

const dogSizes = {
  SMALL: 'Pequeno (0-10Kg)',
  MEDIUM: 'Médio (10-25Kg)',
  LARGE: 'Grande (25-45Kg)',
  EXTRA_LARGE: 'Extra Grande (+45Kg)',
};

const catSizes = {
  SMALL: 'Pequeno (0-2Kg)',
  MEDIUM: 'Médio (2-4Kg)',
  LARGE: 'Grande (4-7Kg)',
  EXTRA_LARGE: 'Extra Grande (+7Kg)',
};

const petGenders = {
  MALE: 'Macho',
  FEMALE: 'Fêmea',
};

export function PetsTable({
  pets,
  orgId,
  currentPage,
  totalPages,
}: PetsTableProps) {
  const [name, setName] = useState('');
  const [petsArray, setPetsArray] = useState<Pet[]>(pets);

  const router = useRouter();

  useEffect(() => {
    if (name.length === 0) {
      setPetsArray(pets);
    }
  }, [name]);

  async function handlePetSearch() {
    try {
      const { data } = await api.get<{ pets: Pet[] }>(
        `/orgs/${orgId}/search-pets`,
        { params: { name } }
      );

      setPetsArray(data.pets);
    } catch {
      setPetsArray([]);
    }
  }

  return (
    <div className="w-max bg-white rounded-[20px] p-6">
      <div className="mb-12 flex items-center justify-between w-full">
        <Link
          href="/pets/cadastrar"
          className="bg-green-600 text-lg font-medium leading-6 tracking-tight rounded-lg py-3 px-4 text-white flex items-center gap-2 w-max hover:bg-green-700 transition-all"
        >
          <Dog className="w-6 h-6" />
          Cadastrar agora
        </Link>

        <div className="w-[214px] h-[41px] flex items-center gap-1 bg-white focus-within:ring-1 focus-within:ring-leaf rounded-[49px] border-solid border border-leaf px-3">
          <input
            placeholder="Pesquisar..."
            className="flex-1 outline-none w-full text-sm  border-none focus:ring-0 px-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && name.length > 0) {
                e.preventDefault();
                handlePetSearch();
              }
            }}
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <button
            onClick={() => {
              if (name.length > 0) {
                handlePetSearch;
              }
            }}
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      <table className="w-full">
        <thead className="w-full">
          <tr className="w-full">
            <th className="text-sm font-medium leading-6 tracking-tight text-gray-500 w-[216px] p-0">
              Nome
            </th>
            <th className="text-sm font-medium leading-6 tracking-tight text-gray-500 p-0 w-24">
              Tipo
            </th>
            <th className="text-sm font-medium leading-6 tracking-tight text-gray-500 w-28 p-0">
              Idade
            </th>
            <th className="text-sm font-medium leading-6 tracking-tight text-gray-500 w-40 p-0">
              Tamanho
            </th>
            <th className="text-sm font-medium leading-6 tracking-tight text-gray-500 w-24 p-0">
              Gênero
            </th>
            <th className="text-sm font-medium leading-6 tracking-tight text-gray-500 w-28 p-0">
              Ações rápidas
            </th>
          </tr>
        </thead>

        <tbody className="[&>*:nth-child(odd)]:bg-zinc-50 [&>*:nth-child(even)]:bg-zinc-100 p-2">
          {petsArray.map((pet) => (
            <tr key={pet.id}>
              <td className="flex items-center gap-2 text-green-700 text-sm font-medium tracking-tight leading-6 p-2 border-solid border-r border-r-gray-400">
                {pet.cover_url ? (
                  <Image
                    className="w-8 h-8 rounded-full"
                    loading="lazy"
                    src={pet.cover_url}
                    alt={pet.name}
                    width={32}
                    height={32}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center">
                    {pet.type === 'DOG' && <Dog strokeWidth={1} />}
                    {pet.type === 'CAT' && <Cat strokeWidth={1} />}
                  </div>
                )}
                {pet.name}
              </td>

              <td className="text-sm text-green-700 font-medium text-center p-2 border-solid border-r border-r-gray-400">
                {petTypes[pet.type]}
              </td>
              <td className="text-sm text-green-700 font-medium text-center p-2 border-solid border-r border-r-gray-400">
                {petAges[pet.age]}
              </td>
              <td className="text-sm text-green-700 font-medium text-center p-2 border-solid border-r border-r-gray-400">
                {pet.type === 'DOG' && dogSizes[pet.size]}
                {pet.type === 'CAT' && catSizes[pet.size]}
              </td>
              <td className="text-sm text-green-700 font-medium text-center p-2 border-solid border-r border-r-gray-400">
                {petGenders[pet.gender]}
              </td>

              <td className="flex items-center justify-center gap-4">
                <button
                  title="Editar informações"
                  onClick={() => router.push(`/pets/${pet.id}`)}
                >
                  <FileEdit
                    strokeWidth={2}
                    className="text-green-600 w-6 h-6"
                  />
                </button>
                <button title="Remover pet">
                  <MinusCircle
                    strokeWidth={2}
                    className="text-green-600 w-6 h-6"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="w-full mt-6 flex items-center justify-between">
          <div>
            <span>
              {currentPage} - {totalPages}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button className="bg-white border-solid border border-green-600 py-2 px-3 rounded">
              Anterior
            </button>
            <button className="bg-green-600 py-2 px-3 rounded text-white">
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
