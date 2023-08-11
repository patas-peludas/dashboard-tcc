/* eslint-disable react-hooks/exhaustive-deps */
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Fieldset } from './Fieldset';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from './Input';
import { Select } from './Select';
import { useEffect, useState } from 'react';
import { TextArea } from './TextArea';
import { Locale } from './Create/IndependentGroup';
import { PetDropzone } from '../Upload/PetDropzone';
import { useAuth } from '@clerk/nextjs';
import { Spinner } from '../Spinner';
import { Cat, Dog } from 'lucide-react';
import { Checkbox } from './Checkbox';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { Pet } from '@/pages/pets';
import axios, { AxiosError } from 'axios';

export type DropzoneFile = {
  urlPathFromServer: string | null;
} & File;

type RegisterPetFormProps = {
  locales: Locale[];
  pet?: Pet;
  petPicturesUrl?: string[];
  isUpdateMode?: boolean;
};

export type RegisterPetFormData = {
  name: string;
  description?: string;
  type: string;
  age: string;
  size: string;
  gender: string;
  location: string;
  is_up_for_adoption: boolean;
};

const registerPetSchema = yup.object().shape({
  name: yup.string().required('Nome do pet obrigatório.'),
  type: yup.string().required('Tipo do pet obrigatório.'),
  age: yup.string().required('Idade do pet obrigatória.'),
  size: yup.string().required('Tamanho do pet obrigatório.'),
  gender: yup.string().required('Gênero do pet obrigatório.'),
  location: yup.string().required('Localização do pet obrigatória.'),
  is_up_for_adoption: yup.boolean().required('Informação do pet obrigatória.'),
});

export const LIMIT_IMAGE_QUANTITY = 6;

export function RegisterPetForm({
  locales,
  pet,
  petPicturesUrl,
  isUpdateMode = false,
}: RegisterPetFormProps) {
  const [type, setType] = useState<'DOG' | 'CAT' | null>(pet?.type ?? null);
  const [files, setFiles] = useState<DropzoneFile[]>([]);
  const [cover, setCover] = useState<DropzoneFile | null>(null);

  const { getToken } = useAuth();
  const router = useRouter();

  const { register, formState, handleSubmit } = useForm<RegisterPetFormData>({
    resolver: yupResolver(registerPetSchema),
    defaultValues: {
      name: pet?.name,
      description: pet?.description ?? undefined,
      type: pet?.type,
      age: pet?.age,
      size: pet?.size,
      gender: pet?.gender,
      location: `${pet?.city} - ${pet?.uf}`,
      is_up_for_adoption: pet?.is_up_for_adoption,
    },
  });

  const { errors, isSubmitting } = formState;

  useEffect(() => {
    if (petPicturesUrl && petPicturesUrl.length > 0) {
      handleFiles(petPicturesUrl);
    }
  }, [petPicturesUrl]);

  useEffect(() => {
    if (pet && pet.cover_url) {
      handleCover(pet.cover_url);
    } else {
      setCover(files[0]);
    }
  }, [pet]);

  useEffect(() => {
    if (!cover) {
      setCover(files[0]);
    }
  }, [files]);

  async function handleFiles(urls: string[]) {
    const filePromises = urls.map((url) => downloadAndConvertToFile(url));
    const files = await Promise.all(filePromises);
    const dropzoneFiles = files as DropzoneFile[];

    setFiles(dropzoneFiles);
  }

  async function handleCover(url: string) {
    const file = await downloadAndConvertToFile(url);
    const dropzoneFile = file as DropzoneFile;

    setCover(dropzoneFile);
  }

  async function downloadAndConvertToFile(url: string) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      if (response.status === 200) {
        const blob = new Blob([response.data]);
        const fileName = url.substring(url.lastIndexOf('/') + 1); // Extrair o nome do arquivo da URL
        const file = new File([blob], fileName, { type: blob.type });

        Object.assign(file, {
          urlPathFromServer: url,
        });

        return file;
      } else {
        throw new Error(
          `Erro ao baixar o arquivo: ${response.status} ${response.statusText}`
        );
      }
    } catch (err) {
      const error = err as AxiosError;
      throw new Error(`Erro ao baixar o arquivo: ${error.message}`);
    }
  }

  const handleRegisterPet: SubmitHandler<RegisterPetFormData> = async (
    values
  ) => {
    const token = await getToken({ template: 'jwt-patas-peludas' });

    try {
      const picturesUrl: string[] = [];
      // let coverUrl;

      const pet = {
        cover_url: null,
        name: values.name,
        description: values.description,
        type: values.type,
        age: values.age,
        size: values.size,
        gender: values.gender,
        city: values.location.split(' - ')[0],
        uf: values.location.split(' - ')[1],
        is_up_for_adoption: values.is_up_for_adoption,
        has_already_adopted: false,
      };

      const { data } = await api.post(
        '/pets',
        { ...pet },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (files.length > 0) {
        const filesNotFromServer = files.filter(
          (f) => f.urlPathFromServer === null
        );
        const filesToUpload = filesNotFromServer as File[];

        await Promise.all(
          filesToUpload.map(async (file) => {
            const url = await handleUploadFile(file);
            picturesUrl.push(String(url));

            // if (file === cover) {
            //   coverUrl = url;
            // }
          })
        );
      }

      if (picturesUrl.length > 0) {
        await api.post(
          `/pets/${data.id}/pictures`,
          { picturesUrl },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      //To do
      // 2 - Implementar o update do pet

      router.push('/pets');
    } catch {
      toast.custom(
        (t) => (
          <div
            className={`bg-red-500 px-6 py-4 shadow-md rounded-full flex flex-col gap-1 text-zinc-50 ${
              t.visible ? 'animate-enter' : 'animate-leave'
            }`}
          >
            <span className=" text-base font-semibold">
              Não foi possível completar a ação 🙁
            </span>
            <p className="text-xs">Por favor tente novamente mais tarde.</p>
          </div>
        ),
        { position: 'bottom-right' }
      );
    }
  };

  async function handleUploadFile(file: File) {
    const token = await getToken({ template: 'jwt-patas-peludas' });

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const { data } = await api.post('/files/upload', uploadFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return data.fileUrl;
    } catch {
      toast.custom(
        (t) => (
          <div
            className={`bg-red-500 px-6 py-4 shadow-md rounded-full flex flex-col gap-1 text-zinc-50 ${
              t.visible ? 'animate-enter' : 'animate-leave'
            }`}
          >
            <span className=" text-base font-semibold">
              Não foi possível completar a ação 🙁
            </span>
            <p className="text-xs">Por favor tente novamente mais tarde.</p>
          </div>
        ),
        { position: 'bottom-right' }
      );
    }
  }

  function handleAddFiles(adds: DropzoneFile[]) {
    setFiles((prev) => {
      if (prev.length === LIMIT_IMAGE_QUANTITY) {
        return prev;
      }

      const prevQuantity = prev.length;
      const separateAdds = adds.splice(0, LIMIT_IMAGE_QUANTITY - prevQuantity);

      return [...prev, ...separateAdds];
    });
  }

  async function handleRemoveFile(file: DropzoneFile) {
    if (file.name === cover?.name) {
      setCover(null);
    }

    try {
      if (file.urlPathFromServer) {
        const token = await getToken({ template: 'jwt-patas-peludas' });
        const fileName = new URL(file.urlPathFromServer).pathname.split('/')[2];

        await api.delete(`/pets/pictures/${fileName}`, {
          params: {
            baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await api.delete(`/files/remove/${fileName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setFiles((prev) => prev.filter((p) => p !== file));
    } catch {
      toast.custom(
        (t) => (
          <div
            className={`bg-red-500 px-6 py-4 shadow-md rounded-full flex flex-col gap-1 text-zinc-50 ${
              t.visible ? 'animate-enter' : 'animate-leave'
            }`}
          >
            <span className=" text-base font-semibold">
              Não foi possível completar a ação 🙁
            </span>
            <p className="text-xs">Por favor tente novamente mais tarde.</p>
          </div>
        ),
        { position: 'bottom-right' }
      );
    }
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(handleRegisterPet)}
    >
      <Fieldset title="Dados do pet">
        <div className="grid xs:grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <Input
            label="Nome do pet"
            placeholder="Bolt Supercão"
            {...register('name')}
            error={errors.name}
          />

          <div className="grid xs:grid-cols-1 lg:grid-cols-2 gap-4">
            <Select
              label="Tipo do pet"
              {...register('type')}
              error={errors.type}
              defaultValue=""
              onChange={(e) => setType(e.target.value as 'DOG' | 'CAT')}
            >
              <option value="" disabled>
                Escolha...
              </option>
              <option value="DOG">Cachorro</option>
              <option value="CAT">Gato</option>
            </Select>

            <Select
              label="Idade do pet"
              {...register('age')}
              error={errors.age}
              defaultValue=""
            >
              <option value="" disabled>
                Escolha...
              </option>
              <option value="BABY">Filhote</option>
              <option value="YOUNG">Jovem</option>
              <option value="ADULT">Adulto</option>
              <option value="SENIOR">Idoso</option>
            </Select>
          </div>

          <Select
            label="Tamanho do pet"
            {...register('size')}
            error={errors.size}
            defaultValue=""
          >
            <option value="" disabled>
              Escolha...
            </option>
            <option value="SMALL">
              Pequeno {type === 'DOG' && '(0-10Kg)'}{' '}
              {type === 'CAT' && '(0-2Kg)'}
            </option>
            <option value="MEDIUM">
              Médio {type === 'DOG' && '(10-25Kg)'}{' '}
              {type === 'CAT' && '(2-4Kg)'}
            </option>
            <option value="LARGE">
              Grande {type === 'DOG' && '(25-45Kg)'}{' '}
              {type === 'CAT' && '(4-7Kg)'}
            </option>
            <option value="EXTRA_LARGE">
              Extra Grande {type === 'DOG' && '(+45Kg)'}{' '}
              {type === 'CAT' && '(+7Kg)'}
            </option>
          </Select>
        </div>

        <div className="grid xs:grid-cols-1 lg:grid-cols-3 gap-4">
          <Select
            label="Localização do pet"
            {...register('location')}
            error={errors.location}
            defaultValue={`${locales[0].city} - ${locales[0].uf}`}
          >
            <option value="" disabled>
              Escolha...
            </option>
            {locales.map((locale) => (
              <option
                key={`${locale.city} - ${locale.uf}`}
                value={`${locale.city} - ${locale.uf}`}
              >
                {locale.city} - {locale.uf}
              </option>
            ))}
          </Select>

          <div className="mt-8 mx-auto">
            <Checkbox
              label="Está disponível para adoção?"
              {...register('is_up_for_adoption')}
              defaultChecked={!isUpdateMode}
            />
          </div>

          <div className="grid xs:grid-cols-1 lg:grid-cols-2 gap-4">
            <Select
              label="Sexo do pet"
              {...register('gender')}
              error={errors.gender}
              defaultValue=""
            >
              <option value="" disabled>
                Escolha...
              </option>
              <option value="MALE">Macho</option>
              <option value="FEMALE">Fêmea</option>
            </Select>
          </div>
        </div>

        <TextArea
          label="Descrição do pet"
          placeholder="Informe aqui as características do animal, como nome, espécie, raça, idade, gênero, temperamento e quaisquer outras informações relevantes sobre sua história, saúde e comportamento. Compartilhe detalhes que possam auxiliar na busca por um lar amoroso ou apadrinhadores dedicados. Lembre-se de incluir qualquer tratamento médico ou cuidado especial que o animal esteja recebendo..."
          {...register('description')}
        />
      </Fieldset>

      {files && (
        <Fieldset title="Imagens do pet">
          <PetDropzone
            files={files}
            handleAddFiles={handleAddFiles}
            handleRemoveFile={handleRemoveFile}
            cover={cover}
            setCover={setCover}
          />
        </Fieldset>
      )}

      {type && (
        <button
          type="submit"
          className="w-36 h-12 bg-green-500 flex items-center justify-center rounded hover:brightness-90 transition-colors mt-2 self-start disabled:bg-green-700 disabled:cursor-not-allowed disabled:hover:bg-green-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="w-5 h-5">
              <Spinner />
            </div>
          ) : (
            <span className="flex items-center gap-2 text-white text-xl">
              {type === 'DOG' && <Dog strokeWidth={1} />}
              {type === 'CAT' && <Cat strokeWidth={1} />}
              {isUpdateMode ? 'Salvar' : 'Cadastrar'}
            </span>
          )}
        </button>
      )}
    </form>
  );
}
