import { MoreVertical } from 'lucide-react';

type TeamMembersProps = {
  members: {
    id: string;
    avatarURL: string;
    name: string;
    office: string;
  }[];
};

export function TeamMembers({ members }: TeamMembersProps) {
  return (
    <div className="bg-zinc-50 p-5 rounded-[20px] w-full">
      <h4 className="text-green-800 text-[18px] font-bold leading-8 tracking-tight">
        Membros da Organização
      </h4>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="py-3 px-4 w-full bg-white flex items-center rounded-2xl"
          >
            <img
              src={member.avatarURL}
              alt={member.name}
              loading="lazy"
              className="w-12 h-12 rounded-full"
            />

            <div className="ml-[18px] flex flex-col">
              <span className="text-green-700 text-base font-bold leading-7 tracking-tight">
                {member.name}
              </span>
              <p className="text-gray-500 text-xs font-medium leading-5 tracking-tight">
                {member.office}
              </p>
            </div>

            <button className="ml-auto">
              <MoreVertical className="text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
