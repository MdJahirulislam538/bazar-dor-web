
import Link from "next/link";
import FastMarquee from "react-fast-marquee";

interface Headline {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "same" | string;
    pct: number;
  };
}

const Marquee = async () => {
  let headlines: Headline[] = [];

  try {
    const response = await fetch(
      "https://openapi.programming-hero.com/api/bazardor/products",
      { next: { revalidate: 60 } },
    );

    if (!response.ok) return null;

    const data: unknown = await response.json();
    if (!Array.isArray(data)) return null;

    headlines = data as Headline[];
  } catch {
    return null;
  }

  if (headlines.length === 0) return null;

  return (
    <div className="border-y border-rose-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-stretch px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 flex shrink-0 items-center gap-2 bg-rose-700 px-4 py-2.5 text-sm font-bold text-white after:absolute after:-right-2.5 after:top-0 after:h-full after:w-5 after:skew-x-[-15deg] after:bg-rose-700">
          <span className="relative z-10 h-2 w-2 rounded-full bg-amber-300" />
          <span className="relative z-10">বাজার আপডেট</span>
        </div>
        <FastMarquee
          className="min-w-0 py-2.5"
          direction="left"
          speed={38}
          pauseOnHover
          gradient={false}
        >
          {headlines.map((headline) => (
            <Link
              className="mx-5 inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-rose-700"
              href={`/product/${headline.id}`}
              key={headline.id}
            >
              {headline.categoryIcon && <span>{headline.categoryIcon}</span>}
              <span>{headline.nameBn}</span>
              <span >
                {headline.today > 0 ? `${headline.today} টাকা/কেজি` : headline.today}
              </span>
              <span
                className={`${headline.change.dir === "up" ? "text-green-500" : headline.change.dir === "down" ? "text-red-500" : "text-gray-500"}`}
              >
                {headline.change.pct > 0 ? `+${headline.change.pct.toFixed(2)}%` : `${headline.change.pct.toFixed(2)}%`}
              </span>

              <span aria-hidden="true" className="text-rose-400">
                •
              </span>
            </Link>
          ))}
        </FastMarquee>
      </div>
    </div>
  );
};

export default Marquee;