# UI Components Usage Guide

این راهنما نحوه استفاده صحیح از کامپوننت‌های استاندارد UI را توضیح می‌دهد.

## فلسفه طراحی

همه کامپوننت‌ها بر اساس Design System مشترک طراحی شده‌اند و با تغییر در یک جا، تمام موارد استفاده به‌روز می‌شوند.

### ویژگی‌های کلیدی:
- ✅ **استاندارد سازی**: همه فیلدها دارای حداقل ارتفاع استاندارد هستند
- ✅ **Validation Support**: پشتیبانی از نمایش خطاها
- ✅ **Accessibility**: قابل دسترس برای همه کاربران
- ✅ **Design System**: استفاده از رنگ‌ها و فواصل مشترک
- ✅ **User Friendly**: ارتفاع مناسب برای راحتی کاربر

---

## Input Component

کامپوننت استاندارد برای تمام فیلدهای ورودی.

### حداقل ارتفاع‌های استاندارد:
- `xs`: 32px
- `sm`: 36px
- `md`: 42px (پیش‌فرض)
- `lg`: 48px
- `xl`: 56px

### مثال استفاده:

```tsx
import { Input } from "@/components/ui/Input";

// مثال ساده
<Input
  label="First Name"
  type="text"
  value={firstName}
  onChange={(e) => setFirstName(e.target.value)}
  required
/>

// با Validation
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  onBlur={() => validateEmail()}
  error={emailError}
  helperText="We'll never share your email"
  required
/>

// سایزهای مختلف
<Input label="Small" size="sm" />
<Input label="Medium (Default)" size="md" />
<Input label="Large" size="lg" />
```

### Props:
- `label`: متن برچسب
- `type`: نوع input (text, email, tel, date, etc.)
- `value`: مقدار فیلد
- `onChange`: تابع تغییر مقدار
- `onBlur`: تابع زمان خروج از فیلد
- `error`: پیام خطا (اگر وجود داشته باشد)
- `helperText`: متن راهنما (فقط زمانی که خطا نداریم)
- `required`: اجباری بودن فیلد
- `size`: اندازه فیلد (xs, sm, md, lg, xl)
- `placeholder`: متن placeholder
- `disabled`: غیرفعال کردن فیلد

---

## PhoneInput Component

کامپوننت استاندارد برای شماره تلفن با انتخاب کد کشور.

### ویژگی‌های کلیدی:
- ✅ Dropdown انتخاب کد کشور با پرچم
- ✅ Format خودکار شماره تلفن
- ✅ Validation داخلی
- ✅ Responsive و User-Friendly
- ✅ حداقل ارتفاع استاندارد: 42px

### مثال استفاده:

```tsx
import { PhoneInput } from "@/components/ui/PhoneInput";

// مثال ساده
<PhoneInput
  label="Phone Number"
  value={phone}
  onChange={(value) => setPhone(value || "")}
  defaultCountry="US"
  required
/>

// با Validation
<PhoneInput
  label="Contact Number"
  value={phone}
  onChange={(value) => setPhone(value || "")}
  onBlur={() => validatePhone()}
  error={phoneError}
  defaultCountry="US"
  required
/>

// با کشور پیش‌فرض متفاوت
<PhoneInput
  label="Phone"
  value={phone}
  onChange={(value) => setPhone(value || "")}
  defaultCountry="GB"  // United Kingdom
  helperText="We'll call you to confirm your booking"
/>
```

### Props:
- `label`: متن برچسب
- `value`: مقدار شماره تلفن (با کد کشور مثل "+1234567890")
- `onChange`: تابع تغییر مقدار (value: string | undefined) => void
- `onBlur`: تابع زمان خروج از فیلد
- `error`: پیام خطا
- `helperText`: متن راهنما
- `required`: اجباری بودن
- `defaultCountry`: کشور پیش‌فرض (کد دو حرفی مثل "US", "GB", "DE")
- `placeholder`: متن placeholder
- `disabled`: غیرفعال کردن فیلد

### کدهای کشورهای رایج:
- `US` - United States
- `GB` - United Kingdom  
- `DE` - Germany
- `FR` - France
- `CA` - Canada
- `AU` - Australia
- `AE` - United Arab Emirates
- `SA` - Saudi Arabia

### چرا از PhoneInput استفاده کنیم؟
✅ **User-Friendly**: کاربر نیازی به تایپ کد کشور ندارد  
✅ **کمتر خطا**: Format خودکار و validation داخلی  
✅ **حرفه‌ای**: مشابه سایت‌های بزرگ (Airbnb, Booking.com)  
✅ **International**: پشتیبانی از تمام کشورها  

---

## Select Component

کامپوننت استاندارد برای dropdown/select.

### حداقل ارتفاع‌های استاندارد:
- `xs`: 32px
- `sm`: 36px
- `md`: 42px (پیش‌فرض)
- `lg`: 48px
- `xl`: 56px

### مثال استفاده:

```tsx
import { Select } from "@/components/ui/Select";

// مثال ساده
<Select
  label="Country"
  value={country}
  onChange={(e) => setCountry(e.target.value)}
  options={["USA", "Canada", "UK"]}
  required
/>

// با آبجکت‌ها
<Select
  label="Tour Type"
  value={tourType}
  onChange={(e) => setTourType(e.target.value)}
  options={[
    { value: "umrah", label: "Umrah" },
    { value: "hajj", label: "Hajj" },
    { value: "ziyarat", label: "Ziyarat" }
  ]}
  error={tourTypeError}
/>

// با سایز بزرگتر برای راحتی کاربر
<Select
  label="Number of Travelers"
  size="lg"
  options={["1", "2", "3", "4", "5+"]}
/>
```

### Props:
همه props مشابه Input است به اضافه:
- `options`: آرایه از string ها یا objects با value و label

---

## Textarea Component

کامپوننت استاندارد برای متن چندخطی.

### حداقل ارتفاع‌های استاندارد:
- `xs`: 64px
- `sm`: 72px
- `md`: 96px (پیش‌فرض)
- `lg`: 120px
- `xl`: 144px

### مثال استفاده:

```tsx
import { Textarea } from "@/components/ui/Textarea";

<Textarea
  label="Message"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  rows={4}
  placeholder="Tell us about your journey..."
  helperText="Minimum 10 characters"
  required
/>

// با Validation
<Textarea
  label="Special Requirements"
  value={requirements}
  onChange={(e) => setRequirements(e.target.value)}
  error={requirementsError}
  size="lg"
/>
```

### Props:
همه props مشابه Input است به اضافه:
- `rows`: تعداد خطوط (پیش‌فرض: 4)

---

## Card Component

کامپوننت استاندارد برای کارت‌ها و کانتینرها.

### Variants:
- `default`: پس‌زمینه ivory/90 با border خفیف
- `elevated`: با shadow برای برجستگی
- `outlined`: شفاف با border
- `bordered`: با border واضح‌تر

### Padding Sizes:
- `none`: بدون padding
- `sm`: 12px
- `md`: 20px (پیش‌فرض)
- `lg`: 24px
- `xl`: 32px

### مثال استفاده:

```tsx
import { Card } from "@/components/ui/Card";

// کارت ساده
<Card>
  <h2>Title</h2>
  <p>Content</p>
</Card>

// کارت برجسته با padding بیشتر
<Card variant="elevated" padding="lg">
  <h2>Important Information</h2>
  <p>This card stands out</p>
</Card>

// کارت با hover effect
<Card hover variant="outlined" padding="md">
  <h3>Clickable Card</h3>
</Card>

// کارت سفارشی
<Card 
  variant="bordered" 
  padding="xl"
  className="border-gold/30 bg-gradient-to-br from-gold/5 to-gold-soft/10"
>
  <h2>Special Card</h2>
</Card>
```

### Props:
- `variant`: نوع کارت (default, elevated, outlined, bordered)
- `padding`: اندازه padding (none, sm, md, lg, xl)
- `hover`: فعال‌سازی hover effect
- `className`: class های اضافی برای سفارشی‌سازی

---

## رنگ‌های استاندارد (از Design System)

### استفاده در validation:
```tsx
// خطاها
className="text-danger"          // متن قرمز
className="border-danger"        // border قرمز
className="bg-danger-light/10"   // پس‌زمینه قرمز خیلی کم‌رنگ

// موفقیت
className="text-gold"            // متن طلایی
className="border-gold"          // border طلایی
className="bg-gold/10"          // پس‌زمینه طلایی کم‌رنگ

// متن عادی
className="text-charcoal"        // متن مشکی اصلی
className="text-charcoal/60"     // متن مشکی کم‌رنگ (راهنما)
```

---

## Best Practices

### ✅ همیشه از کامپوننت‌های استاندارد استفاده کنید:
```tsx
// ✅ درست
<Input label="Name" />

// ❌ اشتباه - inline input
<input className="..." />
```

### ✅ برای فیلدهای اجباری از required استفاده کنید:
```tsx
<Input label="Email" required />
```

### ✅ برای نمایش خطا از prop error استفاده کنید:
```tsx
<Input
  label="Phone"
  error={phoneError}
  value={phone}
  onChange={handlePhoneChange}
  onBlur={validatePhone}
/>
```

### ✅ از helperText برای راهنمایی استفاده کنید:
```tsx
<Input
  label="Password"
  type="password"
  helperText="Minimum 8 characters"
/>
```

### ✅ برای فیلدهای مهم از size بزرگتر استفاده کنید:
```tsx
// فیلدهایی که کاربر باید راحت‌تر با آنها کار کند
<Select label="Number of Travelers" size="lg" />
<Input label="Booking Reference" size="lg" />
```

---

## تغییرات در Design System

اگر می‌خواهید تغییری در طراحی کامپوننت‌ها ایجاد کنید:

1. به فایل کامپوننت مورد نظر بروید (Input.tsx, Select.tsx, etc.)
2. تغییرات را در `sizeStyles` یا `baseStyles` اعمال کنید
3. تغییرات به‌طور خودکار در تمام صفحات اعمال می‌شود

### مثال:
```typescript
// در Input.tsx
const sizeStyles: Record<SizeVariant, string> = {
  md: "px-3 py-2.5 text-sm min-h-[42px]",  // تغییر این خط
  // ...
};
```

این تغییر در **تمام Input های سایز md در کل پروژه** اعمال می‌شود!

---

## پشتیبانی

برای سوالات یا مشکلات، به فایل `src/components/README.md` مراجعه کنید.
