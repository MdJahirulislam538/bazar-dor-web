"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface NavItem {
  slug: string;
  nameBn: string;
  icon?: string;
}

const fallbackNavs: NavItem[] = [
  { slug: 'all', nameBn: 'সব', icon: '🔥' },
  { slug: 'fashion', nameBn: 'ফ্যাশন', icon: '👗' },
  { slug: 'electronics', nameBn: 'ইলেক্ট্রনিকস', icon: '📱' },
  { slug: 'grocery', nameBn: 'মুদিখানা', icon: '🛒' },
  { slug: 'beauty', nameBn: 'বিউটী', icon: '💄' },
  { slug: 'home-living', nameBn: 'হোম লিভিং', icon: '🏠' },
];

const NavLinks = () => {
  const [navs, setNavs] = useState<NavItem[]>(fallbackNavs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://openapi.programming-hero.com/api/bazardor/categories', {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch categories');
        }

        const payload = await res.json();
        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : fallbackNavs;

        setNavs(items.length ? items : fallbackNavs);
      } catch (error) {
        console.error('NavLinks fetch error:', error);
        setNavs(fallbackNavs);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav className="overflow-x-auto">
      <div className="flex min-w-max items-center gap-2">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
            ক্যাটাগরি লোড হচ্ছে...
          </div>
        )}

        {!loading &&
          navs.map((item) => (
            <Link
              key={item.slug}
              href={item.slug ? `/category/${item.slug}` : '/'}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <span className="text-base">{item.icon ?? '•'}</span>
              <span>{item.nameBn}</span>
            </Link>
          ))}
      </div>
    </nav>
  );
};

export default NavLinks;