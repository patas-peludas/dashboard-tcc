import {
  CheckCircle,
  MoreVertical,
  ShieldAlert,
  UserX,
  X,
  XCircle,
} from 'lucide-react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { ConfirmationDialog } from './ConfirmationDialog';
import { api } from '@/services/api';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { Role } from '@/@types/clerk-user';
import { clsx } from 'clsx';
import * as Popover from '@radix-ui/react-popover';

export type Team = {
  id: string;
  role: string;
  is_approved: boolean;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    role: Role;
  };
  created_at: string;
};

type Member = {
  approveds: Team[];
  pendents: Team[];
};

type TeamMembersProps = {
  members: Member;
  userId: string;
  role: Role;
};

export function TeamMembers({ members, userId, role }: TeamMembersProps) {
  const [approveds, setApproveds] = useState(members.approveds);
  const [pendents, setPendents] = useState(members.pendents);

  const { getToken } = useAuth();

  async function handleRequestToJoin(team: Team, joinOnTeam: boolean) {
    const token = await getToken({ template: 'jwt-patas-peludas' });

    try {
      await api.patch(
        `/teams/${team.id}/action`,
        {
          joinOnTeam,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newTeam: Team = {
        ...team,
        is_approved: true,
        user: {
          id: team.user.id,
          avatar_url: team.user.avatar_url,
          name: team.user.name,
          role: 'MEMBER',
        },
      };

      if (joinOnTeam) {
        setApproveds((prev) => [...prev, newTeam]);
        setPendents((prev) => prev.filter((prev) => prev.id !== team.id));
      } else {
        setPendents((prev) => prev.filter((prev) => prev.id !== team.id));
      }
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
            <p className="text-xs">
              Se persistir o erro, entre em contato com o suporte.
            </p>
          </div>
        ),
        { position: 'bottom-right' }
      );
    }
  }

  async function handlePromoteToAdmin(teamId: string) {
    const token = await getToken({ template: 'jwt-patas-peludas' });
    try {
      await api.patch(
        `/teams/${teamId}/promote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newApproveds = [...approveds];
      const index = newApproveds.findIndex((team) => team.id === teamId);

      newApproveds[index].user.role = 'ADMIN';

      setApproveds(newApproveds);
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
            <p className="text-xs">
              Se persistir o erro, entre em contato com o suporte.
            </p>
          </div>
        ),
        { position: 'bottom-right' }
      );
    }
  }

  async function handleRemoveMember(teamId: string) {
    const token = await getToken({ template: 'jwt-patas-peludas' });

    try {
      await api.delete(`/teams/${teamId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApproveds((prev) => prev.filter((p) => p.id !== teamId));
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
            <p className="text-xs">
              Se persistir o erro, entre em contato com o suporte.
            </p>
          </div>
        ),
        { position: 'bottom-right' }
      );
    }
  }

  return (
    <div className="bg-zinc-50 p-5 rounded-[20px] w-full">
      <h4 className="text-green-800 text-[18px] font-bold leading-8 tracking-tight">
        Membros da Organização
      </h4>

      <span className="text-sm text-green-600">
        *Os administradores estão destacados
      </span>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {approveds.map((member) => (
          <div
            key={member.id}
            className={clsx(
              'py-3 px-4 w-full bg-white flex items-center rounded-2xl',
              {
                'ring ring-green-500': member.user.role === 'ADMIN',
              }
            )}
          >
            <img
              src={member.user.avatar_url}
              alt={member.user.name}
              loading="lazy"
              className="w-12 h-12 rounded-full"
            />

            <div className="ml-[18px] flex flex-col gap-1">
              {member.user.id === userId && (
                <span className="text-[8px] font-bold bg-green-600 w-max text-zinc-50 py-1 px-2 rounded-sm uppercase tracking-wider">
                  Você
                </span>
              )}

              <span className="text-green-700 text-base font-bold leading-tight tracking-tight">
                {member.user.name}
              </span>
              <p className="text-gray-500 text-xs font-medium leading-tight tracking-tight">
                {member.role}
              </p>
            </div>

            {role === 'ADMIN' && member.user.id !== userId && (
              <Popover.Root>
                <Popover.Trigger asChild>
                  <button className="ml-auto">
                    <MoreVertical className="text-gray-400" />
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    className="rounded p-5 w-[320px] bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.violet7)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
                    sideOffset={5}
                  >
                    <div className="flex flex-col gap-2.5">
                      <p className="text-mauve12 text-[15px] leading-[19px] font-medium mb-2.5">
                        Ações
                      </p>

                      {member.user.role === 'MEMBER' && (
                        <button
                          onClick={() => handlePromoteToAdmin(member.id)}
                          className="text-green-600 border border-1 border-green-500 hover:ring-1 hover:ring-green-500 transition-colors inline-flex h-[35px] items-center justify-center gap-2 rounded-[4px] px-[15px] py-5 font-medium leading-none outline-none focus:shadow-[0_0_0_2px] text-base"
                        >
                          <ShieldAlert />
                          Promover a administrador
                        </button>
                      )}

                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-green-600 border border-1 border-green-500 hover:ring-1 hover:ring-green-500 transition-colors inline-flex h-[35px] items-center justify-center gap-2 rounded-[4px] px-[15px] py-5 font-medium leading-none outline-none focus:shadow-[0_0_0_2px] text-base"
                      >
                        <UserX />
                        Remover membro
                      </button>
                    </div>
                    <Popover.Close
                      className="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-violet11 absolute top-[5px] right-[5px] hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 outline-none cursor-default"
                      aria-label="Close"
                    >
                      <X />
                    </Popover.Close>
                    <Popover.Arrow className="fill-white" />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            )}
          </div>
        ))}
      </div>

      {pendents.length > 0 && role === 'ADMIN' && (
        <div className="mt-10">
          <span className="text-zinc-700 text-base">Pendentes</span>

          <div className="mt-4 grid grid-cols-3 gap-4">
            {pendents.map((member) => (
              <div
                key={member.id}
                className="py-3 px-4 w-full bg-white  rounded-2xl"
              >
                <div className="flex items-center">
                  <img
                    src={member.user.avatar_url}
                    alt={member.user.name}
                    loading="lazy"
                    className="w-12 h-12 rounded-full"
                  />

                  <div className="ml-[18px] flex flex-col gap-1">
                    {member.user.id === userId && (
                      <span className="text-[8px] font-bold bg-green-600 w-max text-zinc-50 py-1 px-2 rounded-sm uppercase tracking-wider">
                        Você
                      </span>
                    )}

                    <span className="text-green-700 text-base font-bold leading-tight tracking-tight">
                      {member.user.name}
                    </span>
                    <p className="text-gray-500 text-xs font-medium leading-tight tracking-tight">
                      {member.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-8">
                  <AlertDialog.Root>
                    <AlertDialog.Trigger asChild>
                      <button className="bg-green-500 text-zinc-50 flex items-center gap-2 p-2 rounded hover:bg-green-600 transition-colors">
                        <CheckCircle /> Aceitar
                      </button>
                    </AlertDialog.Trigger>
                    <ConfirmationDialog
                      question="Tem certeza que irá aceitar a solicitação?"
                      message="Ao aceitar o membro, ele irá fazer parte do time da organização."
                      onConfimation={() => handleRequestToJoin(member, true)}
                    />
                  </AlertDialog.Root>

                  <AlertDialog.Root>
                    <AlertDialog.Trigger asChild>
                      <button className="bg-red-500 text-zinc-50 flex items-center gap-2 p-2 rounded hover:bg-red-600 transition-colors">
                        <XCircle /> Recusar
                      </button>
                    </AlertDialog.Trigger>
                    <ConfirmationDialog
                      question="Tem certeza que irá recusar a solicitação?"
                      message="Ao recusar o membro, ele não irá fazer parte do time da organização."
                      onConfimation={() => handleRequestToJoin(member, false)}
                    />
                  </AlertDialog.Root>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
