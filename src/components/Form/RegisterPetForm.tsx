import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Fieldset } from './Fieldset';
import { useForm } from 'react-hook-form';
import { Input } from './Input';
import { Select } from './Select';
import { useState } from 'react';

export type RegisterPetFormData = {
  name: string;
  type: string;
  age: string;
  size: string;
  gender: string;
  city: string;
  uf: string;
  is_up_for_adoption: boolean;
  has_already_adopted: boolean;
};

const registerPetSchema = yup.object().shape({
  name: yup.string().required('Nome do pet obrigatório.'),
  type: yup.string().required('Tipo do pet obrigatório.'),
  age: yup.string().required('Idade do pet obrigatória.'),
  size: yup.string().required('Tamanho do pet obrigatório.'),
  gender: yup.string().required('Gênero do pet obrigatório.'),
  city: yup.string().required('Cidade do pet obrigatória.'),
  uf: yup.string().required('UF do pet obrigatório.'),
  is_up_for_adoption: yup.boolean().required('Informação do pet obrigatória.'),
  has_already_adopted: yup.boolean().required('Informação do pet obrigatória.'),
});

export function RegisterPetForm() {
  const [type, setType] = useState<'DOG' | 'CAT' | null>(null);

  const { register, formState } = useForm<RegisterPetFormData>({
    resolver: yupResolver(registerPetSchema),
  });

  const { errors } = formState;

  return (
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
            Pequeno {type === 'DOG' && '(0-10Kg)'} {type === 'CAT' && '(0-2Kg)'}
          </option>
          <option value="MEDIUM">
            Médio {type === 'DOG' && '(10-25Kg)'} {type === 'CAT' && '(2-4Kg)'}
          </option>
          <option value="LARGE">
            Grande {type === 'DOG' && '(25-45Kg)'} {type === 'CAT' && '(4-7Kg)'}
          </option>
          <option value="EXTRA_LARGE">
            Extra Grande {type === 'DOG' && '(+45Kg)'}{' '}
            {type === 'CAT' && '(+7Kg)'}
          </option>
        </Select>
      </div>

      <div className="grid xs:grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
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
    </Fieldset>
  );
}
