"use client";

import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState, type FormEvent } from "react";

const SignUpPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const image = String(formData.get("image") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        image: image || undefined,
        password,
        callbackURL: "/",
      });

      if (error) {
        setFeedback({
          type: "error",
          message: "অ্যাকাউন্ট তৈরি করা যায়নি। তথ্যগুলো যাচাই করে আবার চেষ্টা করুন।",
        });
      } else if (data) {
        setFeedback({ type: "success", message: "অ্যাকাউন্ট তৈরি হয়েছে।" });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "অ্যাকাউন্ট তৈরি করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setFeedback(null);
    try {
      const { error } = await authClient.signIn.social({ provider });
      if (error) {
        setFeedback({
          type: "error",
          message: "এই মাধ্যমে সাইন আপ করা যায়নি। আবার চেষ্টা করুন।",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "এই মাধ্যমে সাইন আপ করা যায়নি। আবার চেষ্টা করুন।",
      });
    }
  };

  return (
    <section className="px-4 py-8 sm:py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)] md:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative flex min-h-56 flex-col justify-between overflow-hidden bg-rose-50 p-6 sm:p-10 md:min-h-160">
          <div className="relative z-10">
            <p className="text-sm font-bold tracking-wide text-rose-700">বাজার দর</p>
            <h2 className="mt-6 max-w-xs text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              বাজারের খবর থাকুক হাতের কাছেই
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-7 text-slate-600">
              অ্যাকাউন্ট খুলে আপনার বাজারের অভিজ্ঞতা শুরু করুন।
            </p>
          </div>
          <Image
            src="/bazar-hero.png"
            alt="বাজারের তাজা সবজির ঝুড়ি"
            width={265}
            height={240}
            priority
            className="relative z-10 mx-auto mt-5 h-auto w-40 sm:w-52 md:w-60"
          />
        </aside>

        <div className="flex items-center p-6 sm:p-10 md:p-12">
          <div className="mx-auto w-full max-w-md">
            <p className="text-sm font-semibold text-rose-700">নতুন সদস্য</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">সাইন আপ</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              কয়েকটি তথ্য দিয়ে আপনার অ্যাকাউন্ট তৈরি করুন।
            </p>

            {feedback && (
              <p
                role="status"
                className={`mt-5 rounded-md border px-3 py-2.5 text-sm ${
                  feedback.type === "error"
                    ? "border-rose-200 bg-rose-50 text-rose-800"
                    : "border-emerald-200 bg-emerald-50 text-emerald-800"
                }`}
              >
                {feedback.message}
              </p>
            )}

            <form className="mt-7 space-y-4" onSubmit={onSubmit}>
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
                  নাম
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="আপনার নাম লিখুন"
                  className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
                />
              </div>
              <div>
                <label htmlFor="image" className="mb-2 block text-sm font-semibold text-slate-700">
                  প্রোফাইল ছবির URL <span className="font-normal text-slate-400">(ঐচ্ছিক)</span>
                </label>
                <input
                  id="image"
                  name="image"
                  type="url"
                  autoComplete="url"
                  placeholder="https://example.com/photo.jpg"
                  className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                  ইমেইল
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="আপনার ইমেইল লিখুন"
                  className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                  পাসওয়ার্ড
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  placeholder="কমপক্ষে ৮ অক্ষর"
                  className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-rose-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs font-medium text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              অথবা
              <span className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialSignIn("google")}
                className="rounded-md border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
              >
                Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialSignIn("github")}
                className="rounded-md border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
              >
                GitHub
              </button>
            </div>
            <p className="mt-6 text-center text-sm text-slate-600">
              আগে থেকেই অ্যাকাউন্ট আছে?{" "}
              <Link href="/signin" className="font-bold text-rose-700 hover:text-rose-800">
                সাইন ইন করুন
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUpPage;
