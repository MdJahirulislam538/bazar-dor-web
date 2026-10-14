"use client";

import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState, FormEvent } from "react";

const SignInPage = () => {
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
    const user = Object.fromEntries(formData.entries()) as {
      email: string;
      password: string;
    };

    try {
      const { data, error } = await authClient.signIn.email({
        ...user,
        callbackURL: "/",
      });

      if (error) {
        setFeedback({ type: "error", message: "ইমেইল বা পাসওয়ার্ডটি সঠিক নয়।" });
      } else if (data) {
        setFeedback({ type: "success", message: "সাইন ইন সফল হয়েছে।" });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "সাইন ইন করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।",
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
          message: "এই মাধ্যমে সাইন ইন করা যায়নি। আবার চেষ্টা করুন।",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "এই মাধ্যমে সাইন ইন করা যায়নি। আবার চেষ্টা করুন।",
      });
    }
  }

  return (
    <section className="px-4 py-8 sm:py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)] md:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative flex min-h-56 flex-col justify-between overflow-hidden bg-rose-50 p-6 sm:p-10 md:min-h-[570px]">
          <div className="relative z-10">
            <p className="text-sm font-bold tracking-wide text-rose-700">বাজার দর</p>
            <h2 className="mt-6 max-w-xs text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              প্রতিদিনের বাজার, আরও সহজ
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-7 text-slate-600">
              আপনার অ্যাকাউন্টে প্রবেশ করে বাজারের দর ও আপডেট দেখুন।
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
            <p className="text-sm font-semibold text-rose-700">স্বাগতম</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">সাইন ইন</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              আপনার অ্যাকাউন্টের তথ্য দিয়ে প্রবেশ করুন।
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

            <form className="mt-7 space-y-5" onSubmit={onSubmit}>
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
                  autoComplete="current-password"
                  required
                  placeholder="আপনার পাসওয়ার্ড লিখুন"
                  className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-rose-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "সাইন ইন হচ্ছে..." : "সাইন ইন করুন"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs font-medium text-slate-400">
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
            <p className="mt-7 text-center text-sm text-slate-600">
              অ্যাকাউন্ট নেই?{" "}
              <Link href="/signup" className="font-bold text-rose-700 hover:text-rose-800">
                সাইন আপ করুন
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignInPage;
