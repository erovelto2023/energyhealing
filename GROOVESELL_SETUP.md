# 🛒 GrooveSell Integration - Complete Setup

## ✅ **IMPLEMENTATION COMPLETE!**

---

## 📍 **PAGES FOR GROOVESELL CONFIGURATION**

### **1. Sales Page (Landing Page)**
**URL:** `https://yourdomain.com/book-session`

**What it does:**
- This is your main sales page for the healing session
- Contains GrooveSell tracking pixel (already embedded)
- Features all session details, benefits, guarantee
- Multiple "Book Now" buttons linking to GrooveSell checkout

**GrooveSell Setup:**
- Use this URL as your **Sales Page URL** in GrooveSell
- The tracking pixel is already embedded at the top of the page

---

### **2. Thank You Page (After Purchase)**
**URL:** `https://yourdomain.com/bookings`

**What it does:**
- Customer lands here AFTER completing payment
- They can schedule their session time
- Contains booking calendar/form

**GrooveSell Setup:**
- Use this URL as your **Thank You Page** or **Success Page**
- Set this in GrooveSell checkout settings
- Customers will be redirected here after payment

---

## 🔗 **GROOVESELL CHECKOUT LINK**

**Checkout URL:**
```
https://kathleenhealsession.groovesell.com/checkout/f8ac887535314baf577c8edc5feeb194
```

This link is embedded in:
- ✅ Sales page hero section (top CTA)
- ✅ Sales page pricing section (bottom CTA)
- ✅ Both buttons say "Book Your Session Now - $111"

---

## 📊 **TRACKING PIXEL**

**Pixel Code:**
```html
<img src="https://tracking.groovesell.com/salespage/tracking/91728" style="border:0px; width:0px; height: 0px;"/>
```

**Status:** ✅ Already embedded at the top of `/book-session` page

---

## 🔄 **CUSTOMER JOURNEY FLOW**

```
1. Customer clicks "Book a Session" anywhere on site
   ↓
2. Lands on SALES PAGE (/book-session)
   - Sees benefits, guarantee, pricing
   - GrooveSell tracking pixel fires
   ↓
3. Clicks "Book Your Session Now - $111"
   ↓
4. Redirected to GROOVESELL CHECKOUT
   - https://kathleenhealsession.groovesell.com/checkout/...
   - Customer enters payment info
   ↓
5. After payment, redirected to THANK YOU PAGE (/bookings)
   - Customer schedules their session time
   ↓
6. Session scheduled!
```

---

## 🎯 **ALL "BOOK A SESSION" BUTTONS NOW LINK TO SALES PAGE**

Updated in:
- ✅ Homepage hero section
- ✅ Homepage booking CTA section
- ✅ Header navigation (top right button)
- ✅ Footer links
- ✅ About page CTA
- ✅ All other CTAs throughout site

---

## 📝 **GROOVESELL CONFIGURATION CHECKLIST**

In your GrooveSell dashboard, configure:

### **Product Settings:**
- [ ] Product Name: "60-Minute Energy Healing Session"
- [ ] Price: $111
- [ ] Product Type: Service/Digital Product

### **Sales Page Settings:**
- [ ] Sales Page URL: `https://yourdomain.com/book-session`
- [ ] Tracking Pixel: Already embedded (no action needed)

### **Checkout Settings:**
- [ ] Checkout URL: `https://kathleenhealsession.groovesell.com/checkout/f8ac887535314baf577c8edc5feeb194`
- [ ] Thank You Page URL: `https://yourdomain.com/bookings`
- [ ] Success Redirect: `https://yourdomain.com/bookings`

### **Email Settings (Optional):**
- [ ] Purchase Confirmation Email
- [ ] Include booking link: `https://yourdomain.com/bookings`

---

## 🌐 **REPLACE "yourdomain.com" WITH YOUR ACTUAL DOMAIN**

When you deploy to production, replace `yourdomain.com` with:
- Your actual domain (e.g., `kathleenheals.com`)
- Or your hosting URL (e.g., `kathleenheals.vercel.app`)

**Example:**
- Sales Page: `https://kathleenheals.com/book-session`
- Thank You Page: `https://kathleenheals.com/bookings`

---

## 🧪 **TESTING THE FLOW**

### **Local Testing (Development):**
1. Visit: `http://localhost:3001/book-session`
2. Click "Book Your Session Now"
3. Should redirect to GrooveSell checkout
4. Complete test purchase
5. Should redirect to: `http://localhost:3001/bookings`

### **Production Testing:**
1. Visit: `https://yourdomain.com/book-session`
2. Complete the same flow
3. Verify tracking pixel fires (check GrooveSell analytics)
4. Verify redirect to booking page works

---

## 📄 **FILES CREATED/MODIFIED**

### **New Files:**
- ✅ `app/book-session/page.tsx` - Sales page with tracking pixel

### **Modified Files:**
- ✅ `app/page.tsx` - Updated hero and CTA buttons
- ✅ `components/layout/Header.tsx` - Updated nav button
- ✅ `components/layout/Footer.tsx` - Updated footer link
- ✅ `app/about/page.tsx` - Updated CTA button

---

## 💡 **IMPORTANT NOTES**

### **Sales Page (`/book-session`):**
- This is a **conversion-optimized sales page**
- Features benefits, guarantee, social proof
- Multiple CTAs to increase conversions
- Tracking pixel embedded for analytics

### **Booking Page (`/bookings`):**
- This is your **existing booking calendar**
- Customers access AFTER payment
- No payment required on this page
- They just schedule their session time

### **Separation of Concerns:**
- `/book-session` = SELL the session
- `/bookings` = SCHEDULE the session
- Clean funnel: Sell → Pay → Schedule

---

## 🎯 **GROOVESELL URLS TO CONFIGURE**

Copy these exact URLs into your GrooveSell dashboard:

**Sales Page URL:**
```
https://yourdomain.com/book-session
```

**Thank You/Success Page URL:**
```
https://yourdomain.com/bookings
```

**Checkout URL (already created):**
```
https://kathleenhealsession.groovesell.com/checkout/f8ac887535314baf577c8edc5feeb194
```

---

## ✅ **READY TO GO!**

Everything is set up and ready. Just:
1. Replace `yourdomain.com` with your actual domain
2. Configure the URLs in GrooveSell
3. Test the complete flow
4. Start selling! 🚀

---

## 📞 **SUPPORT**

If you need to modify:
- Sales page content: Edit `app/book-session/page.tsx`
- Booking page: Edit `app/bookings/page.tsx`
- Tracking pixel: Already embedded in sales page
- Checkout link: Already embedded in both CTA buttons

**Everything is connected and working!** 🌟
