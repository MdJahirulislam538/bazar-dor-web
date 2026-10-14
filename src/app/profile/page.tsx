"use client";

import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState, type FormEvent } from "react";

const ProfilePage = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleUpdateProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const image = String(formData.get("image") ?? "").trim();

    try {
      const { error } = await authClient.updateUser({ name, image });

      if (error) {
        setFeedback({
          type: "error",
          message: "প্রোফাইল আপডেট করা যায়নি। আবার চেষ্টা করুন।",
        });
      } else {
        setFeedback({ type: "success", message: "প্রোফাইল আপডেট হয়েছে।" });
        setIsEditing(false);
      }
    } catch {
      setFeedback({
        type: "error",
        message: "প্রোফাইল আপডেট করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending) {
    return (
      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="h-72 animate-pulse rounded-lg border border-slate-200 bg-white" />
      </section>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="rounded-lg border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
          <p className="text-sm font-semibold text-rose-700">বাজার দর</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            প্রোফাইল দেখতে সাইন ইন করুন
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            আপনার অ্যাকাউন্টের তথ্য দেখতে ও আপডেট করতে আগে প্রবেশ করুন।
          </p>
          <Link
            href="/signin"
            className="mt-6 inline-flex rounded-md bg-rose-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-800"
          >
            সাইন ইন করুন
          </Link>
        </div>
      </section>
    );
  }

  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase();

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6">
        <p className="text-sm font-semibold text-rose-700">অ্যাকাউন্ট</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">আমার প্রোফাইল</h1>
        <p className="mt-2 text-sm text-slate-500">
          আপনার ব্যক্তিগত তথ্য দেখুন এবং প্রয়োজনে আপডেট করুন।
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-5 border-b border-rose-100 bg-rose-50/70 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-rose-100 text-xl font-bold text-rose-800 shadow-sm">
            {user.image ? (
              <Image
                src={user.image}
                alt={`${user.name} এর প্রোফাইল ছবি`}
                fill
                sizes="80px"
                unoptimized
                className="object-cover"
              />
            ) : (
              initials || "ব"
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase text-rose-700">
              সদস্য প্রোফাইল
            </p>
            <h2 className="mt-1 truncate text-2xl font-bold text-slate-900">
              {user.name}
            </h2>
            <p className="mt-1 break-all text-sm text-slate-600">{user.email}</p>
          </div>
          {!isEditing && (
            <button
              type="button"
              onClick={() => {
                setFeedback(null);
                setIsEditing(true);
              }}
              className="shrink-0 rounded-md border border-rose-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-800 transition hover:border-rose-300 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
            >
              তথ্য সম্পাদনা
            </button>
          )}
        </div>

        <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1fr_1.15fr]">
          <div>
            <h3 className="text-base font-bold text-slate-900">অ্যাকাউন্টের তথ্য</h3>
            <dl className="mt-5 divide-y divide-slate-100">
              <div className="py-4">
                <dt className="text-xs font-semibold text-slate-500">পূর্ণ নাম</dt>
                <dd className="mt-1 wrap-break-word text-sm font-medium text-slate-800">
                  {user.name}
                </dd>
              </div>
              <div className="py-4">
                <dt className="text-xs font-semibold text-slate-500">ইমেইল ঠিকানা</dt>
                <dd className="mt-1 break-all text-sm font-medium text-slate-800">
                  {user.email}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-slate-100 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            {feedback && (
              <p
                role="status"
                className={`mb-5 rounded-md border px-3 py-2.5 text-sm ${
                  feedback.type === "error"
                    ? "border-rose-200 bg-rose-50 text-rose-800"
                    : "border-emerald-200 bg-emerald-50 text-emerald-800"
                }`}
              >
                {feedback.message}
              </p>
            )}

            {isEditing ? (
              <form className="space-y-4" onSubmit={handleUpdateProfile}>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    প্রোফাইল সম্পাদনা
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    আপনার নাম ও প্রোফাইল ছবির ঠিকানা পরিবর্তন করুন।
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    নাম
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    defaultValue={user.name}
                    required
                    className="w-full rounded-md border border-slate-300 px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="image"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    প্রোফাইল ছবির URL
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="url"
                    defaultValue={user.image ?? ""}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full rounded-md border border-slate-300 px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
                  />
                </div>
                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-md bg-rose-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSaving ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তন সংরক্ষণ"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFeedback(null);
                      setIsEditing(false);
                    }}
                    disabled={isSaving}
                    className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                  >
                    বাতিল
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex h-full flex-col justify-center">
                <h3 className="text-base font-bold text-slate-900">
                  প্রোফাইল তথ্য
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  আপনার পরিচিতি ও অ্যাকাউন্টে ব্যবহৃত ইমেইল এখানে দেখা যাবে।
                  নাম বা ছবি বদলাতে সম্পাদনা নির্বাচন করুন।
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;