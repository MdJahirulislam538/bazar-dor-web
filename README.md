# Bazar Dor

Bazar Dor বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দাম দেখার একটি ওয়েব অ্যাপ। এখানে পণ্য ও category অনুযায়ী আজকের দাম, আগের দামের পরিবর্তন এবং বিভিন্ন বাজারের সর্বনিম্ন ও সর্বোচ্চ মূল্য দেখা যায়।

## মূল সুবিধা

- আজ দাম বেড়েছে বা কমেছে এমন পণ্যের তালিকা
- Category অনুযায়ী পণ্য দেখা এবং দাম অনুসারে সাজানো
- প্রতিটি পণ্যের বিস্তারিত তথ্য ও বাজারভিত্তিক price table
- Email/password দিয়ে sign in এবং Google/GitHub sign-in
- Sign in করা ব্যবহারকারীর জন্য protected product details ও profile
- Responsive layout এবং বাংলা number/date formatting

## প্রযুক্তি

- Next.js 16, React 19 ও TypeScript
- Tailwind CSS
- Better Auth ও MongoDB
- Programming Hero Bazar Dor API

## চালানোর নিয়ম

প্রয়োজন: Node.js, npm এবং MongoDB database connection.

Project root-এ `.env.local` ফাইল তৈরি করে auth configuration দিন:

```env
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_DB_CONNECTION_URL=mongodb://127.0.0.1:27017

# Google/GitHub sign-in চালু করতে provider credentials দিন
BETTER_AUTH_URL_GOOGLE_CLIENT_ID=
BETTER_AUTH_URL_GOOGLE_CLIENT_SECRET=
BETTER_AUTH_URL_GITHUB_CLIENT_ID=
BETTER_AUTH_URL_GITHUB_CLIENT_SECRET=
```

এরপর dependencies install করে development server চালান:

```bash
npm install
npm run dev
```

Browser-এ [http://localhost:3000](http://localhost:3000) খুলুন। Production build যাচাই ও চালাতে:

```bash
npm run build
npm start
```

পণ্যের তথ্য [Programming Hero Bazar Dor API](https://openapi.programming-hero.com/api/bazardor) থেকে আসে। MongoDB connection এবং OAuth provider credentials গোপন রাখুন; এগুলো source control-এ commit করবেন না।
