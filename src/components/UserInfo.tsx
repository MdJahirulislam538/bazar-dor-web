"use client";

import { authClient } from '@/lib/auth-client';
import Image from 'next/image';
import Link from 'next/link';

const UserInfo = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleSignout = async () => {
    await authClient.signOut();
  };

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm ring-1 ring-slate-100">
          <Link href="/profile" className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-emerald-200 bg-emerald-50">
              <Image
                src={user.image || '/logo-icon.png'}
                alt={user.name || 'User avatar'}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-600">
                Online
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleSignout}
            className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
          >
            লগআউট
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            href="/signin"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
          >
            সাইন ইন
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
          >
            সাইন আপ
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserInfo;