'use client';
import Link from "next/link";
import Image from "next/image";
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

const Hero = () => {
  const date = useSyncExternalStore(
    subscribeToNothing,
    getDateSnapshot,
    getServerDateSnapshot,
  );

  return (
    <section className="mx-auto mt-6">
      <div className="flex flex-col items-center justify-between gap-8 rounded-3xl border border-[#dce7df] bg-[#fbfdfb] px-5 py-8 sm:px-8 md:flex-row md:px-10 md:py-10">

        {/* Left Content */}
        <div className="w-full md:max-w-[65%]">
          <span className="inline-flex rounded-full bg-[#e1f3e8] px-4 py-1.5 text-sm font-medium text-[#07853d]">
            {date}
          </span>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#202923] sm:text-4xl lg:text-[40px]">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-[#68716b]">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          <Link
            href="/products"
            className="mt-7 inline-flex items-center justify-center rounded-lg bg-[#07883f] px-6 py-3 text-sm font-bold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-[#066e34] hover:shadow-lg"
          >
            সব পণ্য দেখুন
          </Link>
        </div>

        {/* Right Illustration */}
        <div className="flex w-full items-center justify-center md:w-[35%]">
          <Image
            src="/bazar-hero.png"
            alt="Hero Illustration"
            width={400}
            height={400}
            className="w-full max-w-100"
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;