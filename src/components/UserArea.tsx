import { UserButton } from '@clerk/nextjs';
import { Bell } from 'lucide-react';

export function UserArea() {
  return (
    <div className="py-3 pr-3 pl-6 rounded-[30px] bg-white flex items-center gap-3">
      <button>
        <Bell strokeWidth={1} className="w-6 h-6 text-green-700" />
      </button>

      {/* <button>
              <Moon strokeWidth={1} className="w-6 h-6 text-green-700" />
            </button> */}

      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: 'w-10 h-10',
          },
        }}
      />
    </div>
  );
}
