# Sanity CMS Setup Guide - راهنمای نصب و راه‌اندازی

این راهنما به شما کمک می‌کند تا Sanity CMS را برای مدیریت تورها، بلاگ و FAQ راه‌اندازی کنید.

---

## 🚀 مراحل راه‌اندازی اولیه

### گام ۱: ایجاد حساب Sanity

1. به آدرس [sanity.io](https://www.sanity.io/) بروید
2. روی "Start building" کلیک کنید و حساب کاربری بسازید
3. یک پروژه جدید ایجاد کنید:
   - Project name: `Marefat Pilgrimage CMS`
   - Dataset: `production`

### گام ۲: دریافت اطلاعات پروژه

بعد از ساخت پروژه:

1. به [sanity.io/manage](https://www.sanity.io/manage) بروید
2. پروژه خود را انتخاب کنید
3. به **Settings** → **API** بروید
4. **Project ID** را کپی کنید
5. یک **API Token** جدید بسازید:
   - نام: `Migration Token`
   - دسترسی: `Editor`
   - توکن را کپی کنید (فقط یکبار نمایش داده می‌شود!)

### گام ۳: پیکربندی Environment Variables

فایل `.env` در root پروژه را باز کنید و این مقادیر را پر کنید:

```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id_here"  # ← از گام ۲
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="your_api_token_here"  # ← از گام ۲
```

### گام ۴: تنظیم CORS Origins

در داشبورد Sanity:

1. **Settings** → **API** → **CORS Origins**
2. این originها را اضافه کنید:

```
http://localhost:3000
http://localhost:3333
```

(بعداً domain production خود را هم اضافه کنید)

---

## 📦 نصب و راه‌اندازی

### نصب Dependencies (انجام شده ✓)

پکیج‌های زیر نصب شده‌اند:
- `sanity` - Sanity Studio
- `@sanity/client` - Client برای fetch کردن داده
- `next-sanity` - Integration با Next.js
- `@sanity/image-url` - مدیریت تصاویر
- `@sanity/vision` - ابزار تست query

---

## 🎨 راه‌اندازی Sanity Studio

### اجرای Studio به صورت Local

```bash
npm run studio
```

Studio در آدرس `http://localhost:3333` باز می‌شود.

### ورود به Studio

- اولین بار که وارد می‌شوید، Sanity از شما می‌خواهد وارد حساب کاربری خود شوید
- بعد از ورود، می‌توانید محتوا اضافه کنید

---

## 🔄 انتقال داده‌های موجود (Migration)

### آماده‌سازی برای Migration

قبل از اجرای migration، مطمئن شوید:
1. فایل `.env` را با اطلاعات صحیح پر کرده‌اید
2. CORS origins را در Sanity تنظیم کرده‌اید
3. API token با دسترسی Editor دارید

### اجرای Migration Script

```bash
npx tsx sanity/migrations/migrate-all.ts
```

این script:
- ✅ 4 تور فعلی را منتقل می‌کند
- ✅ 9 مقاله بلاگ را منتقل می‌کند  
- ✅ 8 سؤال FAQ را منتقل می‌کند
- ✅ تصاویر تورها را آپلود می‌کند
- ✅ دسته‌بندی‌های بلاگ را می‌سازد

**نکته:** Migration ممکن است چند دقیقه طول بکشد (بخاطر آپلود تصاویر).

### بررسی نتیجه Migration

1. به `http://localhost:3333` بروید
2. محتوای منتقل شده را بررسی کنید:
   - **Tours** → 4 تور
   - **Blog Posts** → 9 مقاله
   - **FAQ** → 8 سؤال

---

## 📝 نحوه استفاده از CMS

### اضافه کردن تور جدید

1. در Studio به **Tours** بروید
2. روی **+ Create** کلیک کنید
3. فیلدهای زیر **الزامی** هستند:
   - Slug (URL identifier)
   - Title
   - Destination
   - Region, Type, Package Level
   - Start/End Date, Duration
   - Price
   - Hotel Stars, Meals, Transfer, etc.
   - Description, Highlights, Itinerary
   - Hotel Info, Flights Info
   - Included, Excluded, Documents
   - Packages (حداقل ۱ بسته)

4. **اختیاری:**
   - Early Bird Discount
   - Special Notes
   - Images (حداکثر ۶ عکس)

5. روی **Publish** کلیک کنید

### اضافه کردن Blog Post

1. در Studio به **Blog** → **Blog Posts** بروید
2. روی **+ Create** کلیک کنید
3. فیلدها را پر کنید:
   - Title
   - Category (باید اول یک category بسازید)
   - Excerpt (خلاصه)
   - Content (محتوای کامل - rich text editor)
   - Author
   - Reading Time
   - Featured Image
   - SEO Settings

4. **Publish**

### اضافه کردن FAQ

1. در Studio به **FAQ** بروید
2. روی **+ Create** کلیک کنید
3. فیلدها:
   - Question
   - Answer
   - Category (umrah, visa, rituals, practical)
   - Order (برای ترتیب نمایش)
   - Published (برای نمایش/عدم نمایش)

4. **Publish**

---

## 🌐 نمایش داده‌ها در سایت

### تست در Local

1. سایت Next.js را اجرا کنید:
```bash
npm run dev
```

2. صفحات زیر را تست کنید:
   - http://localhost:3000/tours
   - http://localhost:3000/blog
   - http://localhost:3000/faq

### نحوه کار Integration

- صفحات به صورت خودکار از Sanity داده می‌گیرند
- اگر Sanity پیکربندی نشده باشد، از داده‌های static استفاده می‌شود (fallback)
- تغییرات در CMS بلافاصله در سایت نمایش داده می‌شود

---

## 🚀 Deploy به Production

### Deploy Sanity Studio

دو روش داری برای deploy کردن studio:

#### روش ۱: Deploy به Sanity Cloud (رایگان)

```bash
npm run studio:deploy
```

این command یک URL می‌دهد مثل: `https://marefat-pilgrimage.sanity.studio`

#### روش ۲: Host کردن در Next.js

می‌توانید studio را در route `/studio` سایت خودتان host کنید (نیاز به کانفیگ اضافی دارد).

### Deploy Next.js Site

قبل از deploy، مطمئن شوید:

1. **Environment Variables** را در hosting provider تنظیم کنید:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=xxx
```

2. **CORS Origins** را در Sanity برای domain production اضافه کنید

3. Site را build و deploy کنید:
```bash
npm run build
```

---

## 📁 ساختار پروژه

```
marefatPilgrimage/
├── sanity/
│   ├── schemas/
│   │   ├── tour.ts          # Schema تور
│   │   ├── blogPost.ts      # Schema بلاگ
│   │   ├── blogCategory.ts  # Schema دسته‌بندی بلاگ
│   │   └── faq.ts           # Schema FAQ
│   ├── migrations/
│   │   └── migrate-all.ts   # Script انتقال داده
│   └── README.md
├── sanity.config.ts         # پیکربندی Sanity Studio
├── src/
│   ├── lib/sanity/
│   │   ├── client.ts        # Sanity client
│   │   ├── queries.ts       # GROQ queries
│   │   └── types.ts         # TypeScript types
│   ├── app/
│   │   ├── tours/
│   │   │   ├── page.tsx     # صفحه لیست تورها (با Sanity)
│   │   │   └── ToursClient.tsx
│   │   ├── blog/page.tsx    # (نیاز به آپدیت دارد)
│   │   └── faq/page.tsx     # (نیاز به آپدیت دارد)
│   └── data/tours.ts        # داده static (backup)
└── .env                     # Environment variables
```

---

## 🔧 Scripts موجود

```bash
# Next.js
npm run dev          # اجرای سایت در حالت development
npm run build        # build کردن سایت
npm run start        # اجرای production build

# Sanity Studio
npm run studio       # اجرای studio در localhost:3333
npm run studio:build # build کردن studio
npm run studio:deploy # deploy studio به Sanity Cloud

# Migration
npx tsx sanity/migrations/migrate-all.ts  # انتقال داده‌ها
```

---

## ✅ Checklist نصب

- [ ] حساب Sanity ساخته شده
- [ ] Project ID و API Token دریافت شده
- [ ] Environment variables در `.env` تنظیم شده
- [ ] CORS origins اضافه شده
- [ ] Studio اجرا شده (`npm run studio`)
- [ ] Migration اجرا شده
- [ ] داده‌ها در Studio بررسی شده
- [ ] صفحات سایت تست شده
- [ ] Studio deploy شده (production)
- [ ] CORS برای production domain تنظیم شده

---

## 🆘 عیب‌یابی (Troubleshooting)

### خطا: "Project ID not found"

**راه‌حل:** مطمئن شوید `NEXT_PUBLIC_SANITY_PROJECT_ID` در `.env` درست است.

### خطا: "CORS error"

**راه‌حل:** Domain را به CORS origins در Sanity dashboard اضافه کنید.

### خطا: "Authentication failed"

**راه‌حل:** 
1. مطمئن شوید `SANITY_API_TOKEN` درست است
2. توکن باید دسترسی "Editor" داشته باشد
3. توکن را دوباره بسازید

### تصاویر نمایش داده نمی‌شوند

**راه‌حل:**
1. مطمئن شوید تصاویر در Sanity آپلود شده‌اند
2. بررسی کنید که `@sanity/image-url` نصب شده
3. Console browser را برای خطاهای CORS چک کنید

### Migration خطا می‌دهد

**راه‌حل:**
1. مطمئن شوید API Token دسترسی Editor دارد
2. بررسی کنید فایل‌های تصویر در `/public/images/tours/` موجود هستند
3. اتصال اینترنت را چک کنید (برای آپلود تصاویر)

---

## 💡 نکات مهم

### بهترین روش‌ها (Best Practices)

1. **تصاویر:**
   - از تصاویر با کیفیت بالا استفاده کنید
   - حداقل 1200x675 پیکسل (aspect ratio 16:9)
   - فرمت WebP یا JPEG
   - حداکثر 2MB per image

2. **SEO:**
   - همیشه Alt Text برای تصاویر بنویسید
   - Meta Description برای blog posts پر کنید
   - Slug های واضح و خوانا بسازید

3. **محتوا:**
   - قبل از Publish، پیش‌نمایش کنید
   - Highlights را کوتاه و جذاب نگه دارید (4-6 مورد)
   - Itinerary را با جزئیات بنویسید

4. **قیمت‌گذاری:**
   - از Early Bird Discount برای تخفیف‌های زودهنگام استفاده کنید
   - برای تورهای "On Request" قیمت را 0 بگذارید
   - قیمت‌ها را به USD وارد کنید

### امنیت

- **هرگز** API Token را در GitHub یا جاهای عمومی share نکنید
- فایل `.env` را در `.gitignore` نگه دارید
- برای production از token های جداگانه استفاده کنید
- دسترسی CMS را فقط به افراد مجاز بدهید

### Backup

- Sanity به صورت خودکار از داده‌ها backup می‌گیرد
- می‌توانید از Sanity CLI برای export کردن داده استفاده کنید:
  ```bash
  sanity dataset export production backup.tar.gz
  ```

---

## 📚 منابع مفید

- [مستندات Sanity](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Sanity + Next.js Guide](https://www.sanity.io/guides/nextjs)
- [Image Optimization](https://www.sanity.io/docs/image-urls)

---

## 🎯 گام‌های بعدی

بعد از راه‌اندازی کامل:

1. ✅ آشنایی با Sanity Studio
2. ✅ تست اضافه کردن تور جدید
3. ✅ تست اضافه کردن blog post
4. ✅ آموزش مدیر سایت
5. ✅ Deploy به production
6. ✅ مانیتور کردن و بهینه‌سازی

---

## 💬 سؤالات رایج

**س: آیا می‌توانم بدون Sanity از سایت استفاده کنم؟**

ج: بله! سایت به صورت خودکار از داده‌های static استفاده می‌کند اگر Sanity پیکربندی نشده باشد.

**س: هزینه Sanity چقدر است؟**

ج: پلن رایگان شامل:
- 3 کاربر
- 10,000 document
- 5GB assets
- Unlimited API requests

برای اکثر پروژه‌ها کافی است!

**س: آیا می‌توانم محتوا را به فارسی بنویسم؟**

ج: بله! Sanity از Unicode کامل پشتیبانی می‌کند. می‌توانید محتوای فارسی، عربی و انگلیسی داشته باشید.

**س: چطور می‌توانم مدیر دوم اضافه کنم؟**

ج: در Sanity Dashboard → **Settings** → **Members** → دعوت ارسال کنید.

---

**تبریک! 🎉 شما Sanity CMS را با موفقیت راه‌اندازی کردید.**

برای سؤالات بیشتر، به [مستندات رسمی Sanity](https://www.sanity.io/docs) مراجعه کنید یا در [Community Slack](https://slack.sanity.io/) سؤال بپرسید.
