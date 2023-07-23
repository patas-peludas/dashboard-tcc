import { HeartHandshake, Plus, User, Users } from 'lucide-react';
import { Box } from '../Box';
import { SelectButton } from './SelectButton';
import { useState } from 'react';

export function SelectProfile() {
  const [activeButton, setActiveButton] = useState<'ORG' | 'VISITOR' | null>(
    null
  );

  return (
    <Box title="Selecione o seu perfil">
      <div className="flex gap-8">
        <SelectButton
          Icon={HeartHandshake}
          title="Organização"
          isActive={activeButton === 'ORG'}
          onClick={() => setActiveButton('ORG')}
        />
        <SelectButton
          Icon={User}
          title="Visitante"
          isActive={activeButton === 'VISITOR'}
          onClick={() => setActiveButton('VISITOR')}
        />
      </div>

      {activeButton === 'ORG' && (
        <div className="mt-10 flex flex-col gap-4 items-start">
          <button className="flex items-center gap-2 border border-green-600 px-3 py-4 rounded-lg text-lg hover:bg-green-700 hover:text-zinc-50 transition-colors">
            <Plus /> Cadastrar organização
          </button>
          <button className="flex items-center gap-2 border border-green-600 px-3 py-4 rounded-lg text-lg hover:bg-green-700 hover:text-zinc-50 transition-colors">
            <Users />
            Entrar em uma organização
          </button>
        </div>
      )}
    </Box>
  );
}
