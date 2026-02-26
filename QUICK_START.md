# 🚀 Quick Start - شروع سریع

## ۳ گام ساده تا یک CMS کامل!

---

## گام ۱: ساخت حساب Sanity (۵ دقیقه) ⏱️

### 1.1 ثبت‌نام

1. به [sanity.io](https://www.sanity.io/) بروید
2. روی **"Start building"** کلیک کنید
3. با Google یا GitHub وارد شوید

### 1.2 ساخت پروژه

1. **Create new project** کلیک کنید
2. Project name: `Marefat Pilgrimage CMS`
3. Dataset: `production` را انتخاب کنید
4. Region: `US` یا `EU` (هرکدام نزدیک‌تر)

### 1.3 دریافت اطلاعات

بعد از ساخت پروژه:

```
✅ Project ID را کپی کنید
✅ به Settings → API بروید
✅ یک Token جدید بسازید:
   - Name: "Migration Token"
   - Permissions: "Editor"
✅ Token را کپی کنید (فقط یکبار نشان داده می‌شود!)
```

---

## گام ۲: تنظیم Environment Variables (۲ دقیقه) ⏱️

فایل `.env` در root پروژه را باز کنید:

```bash
# این سه خط را پیدا کنید و پر کنید:

NEXT_PUBLIC_SANITY_PROJECT_ID="xxx"  # ← Project ID از گام ۱.۳
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="xxx"  # ← Token از گام ۱.۳
```

**مثال:**

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID="abc123xyz"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="sk..."
```

### تنظیم CORS

در Sanity Dashboard:

```
Settings → API → CORS Origins → Add Origin

http://localhost:3000
http://localhost:3333
```

---

## گام ۳: اجرا! (۵ دقیقه) ⏱️

### 3.1 اجرای Migration

```bash
npm run migrate
```

این command:
- ✅ 4 تور را منتقل می‌کند
- ✅ 9 blog post را منتقل می‌کند
- ✅ 8 FAQ را منتقل می‌کند
- ✅ تصاویر را آپلود می‌کند

**منتظر بمانید تا کامل شود** (۲-۳ دقیقه)

### 3.2 اجرای Studio

Terminal جدید باز کنید:

```bash
npm run studio
```

Studio در آدرس باز می‌شود:
```
http://localhost:3333
```

### 3.3 اجرای Website

Terminal سوم باز کنید:

```bash
npm run dev
```

Website در آدرس باز می‌شود:
```
http://localhost:3000
```

---

## ✅ تست کنید!

### در Studio (http://localhost:3333)

- Tours → باید ۴ تور ببینید ✅
- Blog Posts → باید ۹ مقاله ببینید ✅
- FAQ → باید ۸ سؤال ببینید ✅

### در Website (http://localhost:3000)

- `/tours` → لیست تورها ✅
- `/blog` → مقالات ✅
- `/faq` → سؤالات ✅

---

## 🎉 تمام!

اگر همه چیز کار کرد، تبریک! شما الان یک CMS کامل دارید.

---

## 📚 مرحله بعدی؟

### برای مدیریت محتوا:

📖 فایل `SANITY_CMS_SETUP.md` را بخوانید

### برای جزئیات فنی:

📖 فایل `IMPLEMENTATION_SUMMARY.md` را بخوانید

---

## 🆘 مشکل دارید?

### "Project ID not found"

❌ مطمئن شوید `.env` را ذخیره کرده‌اید
✅ پروژه Next.js را restart کنید (`Ctrl+C` و دوباره `npm run dev`)

### "CORS error"

❌ CORS origins را چک کنید
✅ `localhost:3000` و `localhost:3333` را اضافه کنید

### "Migration failed"

❌ Token باید دسترسی "Editor" داشته باشد
✅ یک token جدید بسازید

### "Can't run studio"

✅ مطمئن شوید port 3333 آزاد است
✅ اگر نه: `npx sanity dev --port 3334`

---

## 💡 نکات مهم

1. **Terminalها را باز نگه دارید**
   - Terminal 1: Studio (`npm run studio`)
   - Terminal 2: Website (`npm run dev`)

2. **بعد از تغییر در Studio**
   - تغییرات بلافاصله در website ظاهر می‌شود
   - نیازی به restart نیست

3. **Backup**
   - فایل `src/data/tours.ts` را نگه دارید (backup)
   - می‌توانید بعداً پاک کنید

---

## 🎯 Commands مهم

```bash
# Development
npm run dev          # اجرای Next.js
npm run studio       # اجرای Sanity Studio

# Migration
npm run migrate      # انتقال داده‌ها

# Production
npm run build        # Build Next.js
npm run studio:deploy  # Deploy Studio
```

---

## 📞 کمک بیشتر

- 📖 [SANITY_CMS_SETUP.md](./SANITY_CMS_SETUP.md) - راهنمای کامل
- 📖 [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - جزئیات فنی
- 🌐 [Sanity Docs](https://www.sanity.io/docs)
- 💬 [Community Slack](https://slack.sanity.io/)

---

**موفق باشید! 🎉**

*برای سؤالات، به فایل‌های راهنما مراجعه کنید.*
