# Marefat Pilgrimage - Sanity CMS Dashboard

![Status](https://img.shields.io/badge/Status-Ready-green)
![Implementation](https://img.shields.io/badge/Implementation-Complete-blue)

یک سیستم مدیریت محتوای (CMS) کامل، حرفه‌ای و user-friendly برای مدیریت تورها، بلاگ و FAQ سایت Marefat Pilgrimage.

---

## 🎯 چرا Sanity؟

- ✅ **User-Friendly**: UI ساده برای مدیران غیرتکنیکال
- ✅ **رایگان**: تا 10,000 documents و 5GB assets
- ✅ **سریع**: CDN-optimized images
- ✅ **امن**: Authentication + CORS
- ✅ **Real-time**: تغییرات بلافاصله نمایش داده می‌شود
- ✅ **بدون نگهداری**: Sanity infrastructure را مدیریت می‌کند

---

## 📖 مستندات

### 🚀 برای شروع سریع (۱۲ دقیقه)

**[QUICK_START.md](./QUICK_START.md)** - ۳ گام ساده تا یک CMS کامل

```bash
1. ساخت حساب Sanity (۵ دقیقه)
2. تنظیم Environment Variables (۲ دقیقه)  
3. اجرای Migration (۵ دقیقه)
```

### 📚 برای جزئیات کامل

**[SANITY_CMS_SETUP.md](./SANITY_CMS_SETUP.md)** - راهنمای جامع نصب، استفاده و عیب‌یابی

**[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - خلاصه فنی پیاده‌سازی

**[sanity/README.md](./sanity/README.md)** - راهنمای Sanity Studio

---

## 🏗️ معماری

```
┌─────────────────────────────────────────────────────────────┐
│                    Marefat Pilgrimage Website                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├─── Next.js 14 (Frontend)
                              │    ├── /tours
                              │    ├── /blog
                              │    └── /faq
                              │
                              ├─── Sanity CMS (Headless)
                              │    ├── Studio (localhost:3333)
                              │    ├── Content Lake (Cloud)
                              │    └── CDN (Images)
                              │
                              └─── Static Data (Fallback)
                                   └── src/data/tours.ts
```

---

## 📁 ساختار پروژه

```
marefatPilgrimage/
│
├── 📘 QUICK_START.md              ← شروع اینجا
├── 📗 SANITY_CMS_SETUP.md         ← راهنمای کامل
├── 📙 IMPLEMENTATION_SUMMARY.md   ← خلاصه فنی
│
├── sanity/                         🎨 Sanity Studio
│   ├── schemas/
│   │   ├── tour.ts                ← Schema تور (کامل)
│   │   ├── blogPost.ts            ← Schema بلاگ
│   │   ├── blogCategory.ts        ← دسته‌بندی بلاگ
│   │   └── faq.ts                 ← Schema FAQ
│   ├── migrations/
│   │   └── migrate-all.ts         ← Script انتقال داده
│   └── README.md
│
├── sanity.config.ts               ⚙️ Config Studio
│
├── src/
│   ├── lib/sanity/
│   │   ├── client.ts              ← Sanity Client
│   │   ├── queries.ts             ← GROQ Queries
│   │   └── types.ts               ← TypeScript Types
│   │
│   ├── app/
│   │   ├── tours/
│   │   │   ├── page.tsx           ← Server Component (Sanity)
│   │   │   └── ToursClient.tsx    ← Client Component (Filtering)
│   │   ├── blog/page.tsx          ← Blog listing
│   │   └── faq/page.tsx           ← FAQ page
│   │
│   ├── components/ui/
│   │   └── TourCard.tsx           ← آپدیت شده برای Sanity
│   │
│   └── data/tours.ts              💾 Static Data (Backup)
│
└── .env                           🔐 Environment Variables
```

---

## 🎨 ویژگی‌های CMS

### Tours Management

```typescript
✅ Basic Info (title, destination, dates, duration)
✅ Pricing (با support برای "On request")
✅ Early Bird Discounts (با deadline)
✅ Features (hotel, meals, flights, transfers)
✅ Rich Content (description, highlights, itinerary)
✅ Package Options (multiple tiers)
✅ Images (تا 6 تصویر با CDN)
✅ Special Notes & Deadlines
✅ Spiritual Guide Info
```

### Blog Management

```typescript
✅ Rich Text Editor (Portable Text)
✅ Categories با Reference
✅ Featured Images
✅ SEO Metadata
✅ Author & Reading Time
✅ Publishing Date Control
```

### FAQ Management

```typescript
✅ Question & Answer
✅ Categories (umrah, visa, rituals, practical)
✅ Sorting با Order field
✅ Publish/Unpublish Toggle
```

---

## 🚀 Commands

```bash
# Development
npm run dev              # Next.js (port 3000)
npm run studio           # Sanity Studio (port 3333)

# Migration
npm run migrate          # انتقال تمام داده‌ها

# Production
npm run build            # Build Next.js
npm run studio:deploy    # Deploy Studio به Sanity Cloud

# Other
npm run lint             # ESLint
npm run studio:build     # Build Studio
```

---

## 📊 آمار پیاده‌سازی

```
✅ 15 فایل جدید
✅ 3 فایل آپدیت شده
✅ 6 npm packages
✅ 4 Sanity schemas
✅ 8 GROQ queries
✅ 1 Migration script
✅ 3 Documentation files
✅ 100% TypeScript
✅ 0 Breaking changes
```

---

## 🎬 گام‌های بعدی

### حالا چه کار کنید?

1. **⚡ Quick Start**: فایل [QUICK_START.md](./QUICK_START.md) را باز کنید
2. **🎯 ۳ گام ساده**: حساب Sanity بسازید و Migration اجرا کنید
3. **✅ تست**: Studio و Website را امتحان کنید
4. **📚 یادگیری**: مستندات کامل را بخوانید
5. **🚀 Deploy**: Studio و Website را به production ببرید

---

## 🔐 امنیت

```
✅ API Tokens در .env
✅ CORS محدود به domains مشخص
✅ Sanity Authentication
✅ .env در .gitignore
✅ Environment-based config
```

---

## 💰 هزینه

**Sanity Free Tier:**

```
✅ 3 Users
✅ 10,000 Documents (شما: ~20)
✅ 5GB Assets
✅ Unlimited API Requests
✅ CDN Included
✅ Built-in Backup

💵 هزینه: $0/ماه
```

---

## 🆘 کمک نیاز دارید?

### مستندات

1. [QUICK_START.md](./QUICK_START.md) - شروع سریع
2. [SANITY_CMS_SETUP.md](./SANITY_CMS_SETUP.md) - راهنمای کامل
3. [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - جزئیات فنی

### منابع خارجی

- 🌐 [Sanity Documentation](https://www.sanity.io/docs)
- 💬 [Community Slack](https://slack.sanity.io/)
- 📖 [GROQ Query Language](https://www.sanity.io/docs/groq)
- 🎓 [Sanity + Next.js Guide](https://www.sanity.io/guides/nextjs)

### مشکلات رایج

| مشکل | راه‌حل |
|------|--------|
| Can't fetch data | بررسی SANITY_PROJECT_ID |
| Images not loading | تنظیم CORS origins |
| Migration failed | Token باید "Editor" باشد |
| Studio won't start | Port 3333 را چک کنید |

---

## 🎯 ویژگی‌های کلیدی

### برای مدیر سایت

- 🎯 **UI ساده**: بدون نیاز به دانش تکنیکال
- 🖼️ **Drag & Drop**: آپلود ساده تصاویر
- 📝 **Rich Editor**: ویرایشگر متن حرفه‌ای
- ✅ **Validation**: راهنمایی در هر مرحله
- 📱 **Mobile-friendly**: مدیریت از موبایل

### برای Developer

- 🚀 **TypeScript**: Type-safe کامل
- 🔄 **Extensible**: Schema های قابل توسعه
- 🎨 **Clean Code**: ساختار واضح
- 📚 **Documented**: مستندات کامل
- 🧪 **Testable**: ساده برای تست

### برای کسب‌وکار

- 💰 **رایگان**: تا 10K documents
- ⚡ **سریع**: CDN + Caching
- 🔒 **امن**: Authentication
- 📈 **Scalable**: قابل رشد
- 🛠️ **Low Maintenance**: نگهداری کم

---

## ⚡ Performance

```
✅ CDN-optimized Images
✅ ISR Caching (Next.js 14)
✅ Optimized GROQ Queries
✅ Lazy Loading
✅ Responsive Images
✅ WebP Support
```

---

## 📈 Roadmap (اختیاری)

برای آینده می‌توانید اضافه کنید:

- [ ] Multi-language support (فارسی/انگلیسی)
- [ ] Advanced filtering در Studio
- [ ] Scheduled publishing
- [ ] Draft previews
- [ ] Custom dashboard widgets
- [ ] Email notifications
- [ ] Webhooks برای automation

---

## 🏆 Best Practices

### محتوا

✅ Alt text برای همه تصاویر
✅ SEO metadata برای blog posts
✅ Slug های واضح و خوانا
✅ Highlights کوتاه و جذاب (4-6 مورد)
✅ قیمت‌ها به USD

### تصاویر

✅ حداقل 1200x675px (16:9)
✅ فرمت WebP یا JPEG
✅ حداکثر 2MB per image
✅ Optimize قبل از آپلود

### امنیت

✅ API tokens را share نکنید
✅ `.env` در `.gitignore`
✅ Token های جداگانه برای prod/dev
✅ دسترسی محدود به CMS

---

## 📱 Support

این CMS از همه مرورگرهای مدرن پشتیبانی می‌کند:

```
✅ Chrome/Edge (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Mobile browsers
```

---

## 📝 License

این پروژه Private است و تمام حقوق برای Marefat Pilgrimage محفوظ است.

---

## 🎉 تمام شد!

شما الان یک CMS حرفه‌ای دارید که:

- ✅ آماده استفاده
- ✅ User-friendly
- ✅ Production-ready
- ✅ رایگان
- ✅ Scalable

**فقط ۳ گام تا راه‌اندازی! 🚀**

به [QUICK_START.md](./QUICK_START.md) بروید و شروع کنید.

---

*Built with ❤️ for Marefat Pilgrimage*

*Powered by Sanity.io + Next.js 14*
