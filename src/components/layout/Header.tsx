"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import UserInfo from '../UserInfo';
import CategoryNav from './CategoryNav';
// import Marquee from './Marquee';
import { useSyncExternalStore } from "react";

const formatBanglaDate = () => {
  const formatter = new Intl.DateTimeFormat('bn-BD', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
  });

    return formatter.format(new Date());
  };
  
  const subscribeToNothing = () => () => {};
  const getDateSnapshot = () => formatBanglaDate();
  const getServerDateSnapshot = () => "";

const Header = () => {
  const date = useSyncExternalStore(
    subscribeToNothing,
    getDateSnapshot,
    getServerDateSnapshot,
  );
  

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-red-100 bg-red-50 shadow-sm">
            <Image
              src="/logo-icon.png"
              alt="বাজার দর লোগো"
              width={40}
              height={40}
              priority
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
              বাজার দর
            </p>
            <p className="text-[11px] font-medium text-slate-500">{date}</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <UserInfo />
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/70">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <CategoryNav />
        </div>
      </div>

      {/* <Marquee /> */}
    </header>
  );
};

export default Header;