import { useState, useMemo, useEffect } from "react";

/* ============== أيقونات مرسومة يدويًا (بدون أي مكتبة خارجية) ============== */
function Icon({ size = 18, color = "currentColor", fill = "none", strokeWidth = 2, style, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {children}
    </svg>
  );
}
function Plane(props) { return <Icon {...props} fill={props.color || "currentColor"} stroke="none"><path d="M2 12 21 3 13.5 20 11 13 2 12Z" /></Icon>; }
function Building2(props) { return <Icon {...props}><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" /><path d="M9 21v-3h6v3" /></Icon>; }
function Globe(props) { return <Icon {...props}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" /></Icon>; }
function User(props) { return <Icon {...props}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" /></Icon>; }
function Mail(props) { return <Icon {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M4 6.5 12 13l8-6.5" /></Icon>; }
function Phone(props) { return <Icon {...props}><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></Icon>; }
function ChevronRight(props) { return <Icon {...props}><path d="M9 4l8 8-8 8" /></Icon>; }
function ChevronLeft(props) { return <Icon {...props}><path d="M15 4 7 12l8 8" /></Icon>; }
function Search(props) { return <Icon {...props}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></Icon>; }
function Minus(props) { return <Icon {...props}><path d="M5 12h14" /></Icon>; }
function Plus(props) { return <Icon {...props}><path d="M12 5v14M5 12h14" /></Icon>; }
function ArrowLeftRight(props) { return <Icon {...props}><path d="M3 8h13M12 4l4 4-4 4" /><path d="M21 16H8m5 4-4-4 4-4" /></Icon>; }
function Calendar(props) { return <Icon {...props}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></Icon>; }
function Star(props) { return <Icon {...props} fill={props.fill || "none"}><path d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L12 16.9 6.4 20l1.4-6.2-4.8-4.3 6.4-.6L12 3Z" /></Icon>; }
function CreditCard(props) { return <Icon {...props}><rect x="2.5" y="5" width="19" height="14" rx="2" /><path d="M2.5 10h19" /><path d="M6 15h4" /></Icon>; }
function Wallet(props) { return <Icon {...props}><path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3" /><rect x="3" y="7" width="18" height="12" rx="2" /><circle cx="16" cy="13" r="1.4" /></Icon>; }
function CheckCircle2(props) { return <Icon {...props}><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.5 2.5L16 9.5" /></Icon>; }
function X(props) { return <Icon {...props}><path d="M5 5l14 14M19 5 5 19" /></Icon>; }
function MapPin(props) { return <Icon {...props}><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.3" /></Icon>; }
function HomeIcon(props) { return <Icon {...props}><path d="M4 11 12 4l8 7" /><path d="M6 10v10h12V10" /><path d="M10 20v-6h4v6" /></Icon>; }
function Briefcase(props) { return <Icon {...props}><rect x="3" y="8" width="18" height="12" rx="2" /><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M3 13h18" /></Icon>; }
function Users(props) { return <Icon {...props}><circle cx="9" cy="8" r="3.2" /><path d="M3 20c.8-3.4 3.2-5 6-5s5.2 1.6 6 5" /><circle cx="17.5" cy="9" r="2.4" /><path d="M15.7 15.2c2.2.3 3.9 1.7 4.5 4.3" /></Icon>; }
function Clock(props) { return <Icon {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></Icon>; }

import { initializeApp } from "firebase/app";
import {
  getAuth, RecaptchaVerifier, signInWithPhoneNumber,
  sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink,
} from "firebase/auth";

/* =========================================================================
   NASQ — الاتصال الحقيقي بـ Firebase (بريد Magic Link + جوال SMS OTP)
   شغّالة فقط بعد النشر على استضافة فعلية — لا تعمل داخل معاينة Claude
   لأن Firebase يحتاج تخزين المتصفح (localStorage/IndexedDB) وحزمة firebase
   غير متاحة داخل بيئة المعاينة هنا.
   ========================================================================= */
const firebaseConfig = {
  apiKey: "AIzaSyALUPQNgEv_xxSOSzmjVpkynph8I4-LKVo",
  authDomain: "nasq-cb21d.firebaseapp.com",
  projectId: "nasq-cb21d",
  storageBucket: "nasq-cb21d.firebasestorage.app",
  messagingSenderId: "137487163064",
  appId: "1:137487163064:web:1053d8b447762e37631e4d",
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

async function sendEmailOtpLink(email) {
  const redirectUrl = window.location.origin + window.location.pathname;
  await sendSignInLinkToEmail(auth, email, { url: redirectUrl, handleCodeInApp: true });
  window.localStorage.setItem("nasq_email_for_signin", email);
}
async function completeEmailSignInIfNeeded() {
  if (!isSignInWithEmailLink(auth, window.location.href)) return null;
  let email = window.localStorage.getItem("nasq_email_for_signin");
  if (!email) email = window.prompt("أدخل بريدك الإلكتروني لإكمال تسجيل الدخول");
  const result = await signInWithEmailLink(auth, email, window.location.href);
  window.localStorage.removeItem("nasq_email_for_signin");
  window.history.replaceState(null, "", redirectSafeUrl());
  return result.user;
}
function redirectSafeUrl() { return window.location.origin + window.location.pathname; }

let recaptchaVerifier = null;
let confirmationResult = null;
function setupRecaptcha(containerId) {
  if (recaptchaVerifier) return recaptchaVerifier;
  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, { size: "invisible" });
  return recaptchaVerifier;
}
async function sendPhoneOtp(phoneNumberE164) {
  const verifier = setupRecaptcha("recaptcha-container");
  confirmationResult = await signInWithPhoneNumber(auth, phoneNumberE164, verifier);
}
async function confirmPhoneOtp(code) {
  if (!confirmationResult) throw new Error("لم يتم إرسال رمز بعد");
  const result = await confirmationResult.confirm(code);
  return result.user;
}

/* =========================================================================
   NASQ — بيانات الدول والمدن (تغطي كل دول العالم تقريبًا مع أبرز مدنها)
   ========================================================================= */
const COUNTRIES = [
  { a: "السعودية", e: "Saudi Arabia", ct: [{ a: "الرياض", e: "Riyadh", k: "RUH" }, { a: "جدة", e: "Jeddah", k: "JED" }, { a: "الدمام", e: "Dammam", k: "DMM" }, { a: "المدينة المنورة", e: "Madinah", k: "MED" }, { a: "مكة المكرمة", e: "Makkah", k: "MAK" }, { a: "أبها", e: "Abha", k: "AHB" }] },
  { a: "الإمارات العربية المتحدة", e: "United Arab Emirates", ct: [{ a: "دبي", e: "Dubai", k: "DXB" }, { a: "أبوظبي", e: "Abu Dhabi", k: "AUH" }, { a: "الشارقة", e: "Sharjah", k: "SHJ" }] },
  { a: "قطر", e: "Qatar", ct: [{ a: "الدوحة", e: "Doha", k: "DOH" }] },
  { a: "الكويت", e: "Kuwait", ct: [{ a: "مدينة الكويت", e: "Kuwait City", k: "KWI" }] },
  { a: "البحرين", e: "Bahrain", ct: [{ a: "المنامة", e: "Manama", k: "BAH" }] },
  { a: "عُمان", e: "Oman", ct: [{ a: "مسقط", e: "Muscat", k: "MCT" }, { a: "صلالة", e: "Salalah", k: "SLL" }] },
  { a: "اليمن", e: "Yemen", ct: [{ a: "صنعاء", e: "Sanaa", k: "SAH" }] },
  { a: "الأردن", e: "Jordan", ct: [{ a: "عمّان", e: "Amman", k: "AMM" }, { a: "العقبة", e: "Aqaba", k: "AQJ" }] },
  { a: "لبنان", e: "Lebanon", ct: [{ a: "بيروت", e: "Beirut", k: "BEY" }] },
  { a: "سوريا", e: "Syria", ct: [{ a: "دمشق", e: "Damascus", k: "DAM" }] },
  { a: "العراق", e: "Iraq", ct: [{ a: "بغداد", e: "Baghdad", k: "BGW" }, { a: "البصرة", e: "Basra", k: "BSR" }, { a: "أربيل", e: "Erbil", k: "EBL" }] },
  { a: "فلسطين", e: "Palestine", ct: [{ a: "القدس", e: "Jerusalem", k: "JRS" }] },
  { a: "تركيا", e: "Turkey", ct: [{ a: "إسطنبول", e: "Istanbul", k: "IST" }, { a: "أنقرة", e: "Ankara", k: "ESB" }, { a: "أنطاليا", e: "Antalya", k: "AYT" }] },
  { a: "إيران", e: "Iran", ct: [{ a: "طهران", e: "Tehran", k: "THR" }] },
  { a: "مصر", e: "Egypt", ct: [{ a: "القاهرة", e: "Cairo", k: "CAI" }, { a: "الإسكندرية", e: "Alexandria", k: "HBE" }, { a: "شرم الشيخ", e: "Sharm El Sheikh", k: "SSH" }, { a: "الغردقة", e: "Hurghada", k: "HRG" }, { a: "الأقصر", e: "Luxor", k: "LXR" }] },
  { a: "المغرب", e: "Morocco", ct: [{ a: "الدار البيضاء", e: "Casablanca", k: "CMN" }, { a: "مراكش", e: "Marrakesh", k: "RAK" }, { a: "الرباط", e: "Rabat", k: "RBA" }, { a: "طنجة", e: "Tangier", k: "TNG" }] },
  { a: "الجزائر", e: "Algeria", ct: [{ a: "الجزائر العاصمة", e: "Algiers", k: "ALG" }] },
  { a: "تونس", e: "Tunisia", ct: [{ a: "تونس العاصمة", e: "Tunis", k: "TUN" }] },
  { a: "ليبيا", e: "Libya", ct: [{ a: "طرابلس", e: "Tripoli", k: "TIP" }] },
  { a: "السودان", e: "Sudan", ct: [{ a: "الخرطوم", e: "Khartoum", k: "KRT" }] },
  { a: "الصومال", e: "Somalia", ct: [{ a: "مقديشو", e: "Mogadishu", k: "MGQ" }] },
  { a: "جيبوتي", e: "Djibouti", ct: [{ a: "جيبوتي", e: "Djibouti", k: "JIB" }] },
  { a: "موريتانيا", e: "Mauritania", ct: [{ a: "نواكشوط", e: "Nouakchott", k: "NKC" }] },
  { a: "الصين", e: "China", ct: [{ a: "بكين", e: "Beijing", k: "PEK" }, { a: "شنغهاي", e: "Shanghai", k: "PVG" }, { a: "قوانغتشو", e: "Guangzhou", k: "CAN" }, { a: "هونغ كونغ", e: "Hong Kong", k: "HKG" }, { a: "تشنغدو", e: "Chengdu", k: "CTU" }] },
  { a: "اليابان", e: "Japan", ct: [{ a: "طوكيو", e: "Tokyo", k: "HND" }, { a: "أوساكا", e: "Osaka", k: "KIX" }, { a: "سابورو", e: "Sapporo", k: "CTS" }] },
  { a: "كوريا الجنوبية", e: "South Korea", ct: [{ a: "سيول", e: "Seoul", k: "ICN" }, { a: "بوسان", e: "Busan", k: "PUS" }] },
  { a: "كوريا الشمالية", e: "North Korea", ct: [{ a: "بيونغ يانغ", e: "Pyongyang", k: "FNJ" }] },
  { a: "الهند", e: "India", ct: [{ a: "نيودلهي", e: "New Delhi", k: "DEL" }, { a: "مومباي", e: "Mumbai", k: "BOM" }, { a: "بنغالورو", e: "Bengaluru", k: "BLR" }, { a: "تشيناي", e: "Chennai", k: "MAA" }, { a: "حيدر آباد", e: "Hyderabad", k: "HYD" }, { a: "غوا", e: "Goa", k: "GOI" }] },
  { a: "باكستان", e: "Pakistan", ct: [{ a: "إسلام آباد", e: "Islamabad", k: "ISB" }, { a: "كراتشي", e: "Karachi", k: "KHI" }, { a: "لاهور", e: "Lahore", k: "LHE" }] },
  { a: "بنغلاديش", e: "Bangladesh", ct: [{ a: "دكا", e: "Dhaka", k: "DAC" }] },
  { a: "سريلانكا", e: "Sri Lanka", ct: [{ a: "كولومبو", e: "Colombo", k: "CMB" }] },
  { a: "نيبال", e: "Nepal", ct: [{ a: "كاتماندو", e: "Kathmandu", k: "KTM" }] },
  { a: "بوتان", e: "Bhutan", ct: [{ a: "بارو", e: "Paro", k: "PBH" }] },
  { a: "المالديف", e: "Maldives", ct: [{ a: "ماليه", e: "Malé", k: "MLE" }] },
  { a: "أفغانستان", e: "Afghanistan", ct: [{ a: "كابول", e: "Kabul", k: "KBL" }] },
  { a: "تايلاند", e: "Thailand", ct: [{ a: "بانكوك", e: "Bangkok", k: "BKK" }, { a: "بوكيت", e: "Phuket", k: "HKT" }, { a: "تشيانغ ماي", e: "Chiang Mai", k: "CNX" }] },
  { a: "فيتنام", e: "Vietnam", ct: [{ a: "هانوي", e: "Hanoi", k: "HAN" }, { a: "هو تشي منه", e: "Ho Chi Minh City", k: "SGN" }] },
  { a: "كمبوديا", e: "Cambodia", ct: [{ a: "بنوم بنه", e: "Phnom Penh", k: "PNH" }, { a: "سيام ريب", e: "Siem Reap", k: "REP" }] },
  { a: "لاوس", e: "Laos", ct: [{ a: "فيينتيان", e: "Vientiane", k: "VTE" }] },
  { a: "ميانمار", e: "Myanmar", ct: [{ a: "يانغون", e: "Yangon", k: "RGN" }] },
  { a: "ماليزيا", e: "Malaysia", ct: [{ a: "كوالالمبور", e: "Kuala Lumpur", k: "KUL" }, { a: "بينانغ", e: "Penang", k: "PEN" }, { a: "لنكاوي", e: "Langkawi", k: "LGK" }] },
  { a: "سنغافورة", e: "Singapore", ct: [{ a: "سنغافورة", e: "Singapore", k: "SIN" }] },
  { a: "إندونيسيا", e: "Indonesia", ct: [{ a: "جاكرتا", e: "Jakarta", k: "CGK" }, { a: "بالي", e: "Bali", k: "DPS" }, { a: "سورابايا", e: "Surabaya", k: "SUB" }] },
  { a: "الفلبين", e: "Philippines", ct: [{ a: "مانيلا", e: "Manila", k: "MNL" }, { a: "سيبو", e: "Cebu", k: "CEB" }] },
  { a: "بروناي", e: "Brunei", ct: [{ a: "بندر سري بكاوان", e: "Bandar Seri Begawan", k: "BWN" }] },
  { a: "تيمور الشرقية", e: "East Timor", ct: [{ a: "ديلي", e: "Dili", k: "DIL" }] },
  { a: "منغوليا", e: "Mongolia", ct: [{ a: "أولانباتار", e: "Ulaanbaatar", k: "ULN" }] },
  { a: "كازاخستان", e: "Kazakhstan", ct: [{ a: "ألماتي", e: "Almaty", k: "ALA" }, { a: "أستانا", e: "Astana", k: "NQZ" }] },
  { a: "أوزبكستان", e: "Uzbekistan", ct: [{ a: "طشقند", e: "Tashkent", k: "TAS" }, { a: "سمرقند", e: "Samarkand", k: "SKD" }] },
  { a: "تركمانستان", e: "Turkmenistan", ct: [{ a: "عشق آباد", e: "Ashgabat", k: "ASB" }] },
  { a: "طاجيكستان", e: "Tajikistan", ct: [{ a: "دوشنبي", e: "Dushanbe", k: "DYU" }] },
  { a: "قيرغيزستان", e: "Kyrgyzstan", ct: [{ a: "بيشكيك", e: "Bishkek", k: "FRU" }] },
  { a: "أذربيجان", e: "Azerbaijan", ct: [{ a: "باكو", e: "Baku", k: "GYD" }] },
  { a: "أرمينيا", e: "Armenia", ct: [{ a: "يريفان", e: "Yerevan", k: "EVN" }] },
  { a: "جورجيا", e: "Georgia", ct: [{ a: "تبليسي", e: "Tbilisi", k: "TBS" }, { a: "باتومي", e: "Batumi", k: "BUS" }] },
  { a: "المملكة المتحدة", e: "United Kingdom", ct: [{ a: "لندن", e: "London", k: "LHR" }, { a: "مانشستر", e: "Manchester", k: "MAN" }, { a: "إدنبرة", e: "Edinburgh", k: "EDI" }] },
  { a: "أيرلندا", e: "Ireland", ct: [{ a: "دبلن", e: "Dublin", k: "DUB" }] },
  { a: "فرنسا", e: "France", ct: [{ a: "باريس", e: "Paris", k: "CDG" }, { a: "نيس", e: "Nice", k: "NCE" }, { a: "ليون", e: "Lyon", k: "LYS" }, { a: "مرسيليا", e: "Marseille", k: "MRS" }] },
  { a: "ألمانيا", e: "Germany", ct: [{ a: "برلين", e: "Berlin", k: "BER" }, { a: "ميونخ", e: "Munich", k: "MUC" }, { a: "فرانكفورت", e: "Frankfurt", k: "FRA" }, { a: "هامبورغ", e: "Hamburg", k: "HAM" }] },
  { a: "هولندا", e: "Netherlands", ct: [{ a: "أمستردام", e: "Amsterdam", k: "AMS" }] },
  { a: "بلجيكا", e: "Belgium", ct: [{ a: "بروكسل", e: "Brussels", k: "BRU" }] },
  { a: "لوكسمبورغ", e: "Luxembourg", ct: [{ a: "لوكسمبورغ", e: "Luxembourg", k: "LUX" }] },
  { a: "سويسرا", e: "Switzerland", ct: [{ a: "زيورخ", e: "Zurich", k: "ZRH" }, { a: "جنيف", e: "Geneva", k: "GVA" }] },
  { a: "النمسا", e: "Austria", ct: [{ a: "فيينا", e: "Vienna", k: "VIE" }, { a: "سالزبورغ", e: "Salzburg", k: "SZG" }] },
  { a: "إسبانيا", e: "Spain", ct: [{ a: "مدريد", e: "Madrid", k: "MAD" }, { a: "برشلونة", e: "Barcelona", k: "BCN" }, { a: "إشبيلية", e: "Seville", k: "SVQ" }, { a: "مالقة", e: "Málaga", k: "AGP" }] },
  { a: "البرتغال", e: "Portugal", ct: [{ a: "لشبونة", e: "Lisbon", k: "LIS" }, { a: "بورتو", e: "Porto", k: "OPO" }] },
  { a: "إيطاليا", e: "Italy", ct: [{ a: "روما", e: "Rome", k: "FCO" }, { a: "ميلانو", e: "Milan", k: "MXP" }, { a: "البندقية", e: "Venice", k: "VCE" }, { a: "فلورنسا", e: "Florence", k: "FLR" }] },
  { a: "الفاتيكان", e: "Vatican City", ct: [{ a: "الفاتيكان", e: "Vatican City", k: "FCO" }] },
  { a: "سان مارينو", e: "San Marino", ct: [{ a: "سان مارينو", e: "San Marino", k: "RMI" }] },
  { a: "اليونان", e: "Greece", ct: [{ a: "أثينا", e: "Athens", k: "ATH" }, { a: "سانتوريني", e: "Santorini", k: "JTR" }, { a: "ميكونوس", e: "Mykonos", k: "JMK" }] },
  { a: "قبرص", e: "Cyprus", ct: [{ a: "لارنكا", e: "Larnaca", k: "LCA" }] },
  { a: "مالطا", e: "Malta", ct: [{ a: "فاليتا", e: "Valletta", k: "MLA" }] },
  { a: "بولندا", e: "Poland", ct: [{ a: "وارسو", e: "Warsaw", k: "WAW" }, { a: "كراكوف", e: "Krakow", k: "KRK" }] },
  { a: "التشيك", e: "Czech Republic", ct: [{ a: "براغ", e: "Prague", k: "PRG" }] },
  { a: "سلوفاكيا", e: "Slovakia", ct: [{ a: "براتيسلافا", e: "Bratislava", k: "BTS" }] },
  { a: "المجر", e: "Hungary", ct: [{ a: "بودابست", e: "Budapest", k: "BUD" }] },
  { a: "رومانيا", e: "Romania", ct: [{ a: "بوخارست", e: "Bucharest", k: "OTP" }] },
  { a: "بلغاريا", e: "Bulgaria", ct: [{ a: "صوفيا", e: "Sofia", k: "SOF" }] },
  { a: "كرواتيا", e: "Croatia", ct: [{ a: "زغرب", e: "Zagreb", k: "ZAG" }, { a: "دوبروفنيك", e: "Dubrovnik", k: "DBV" }, { a: "سبليت", e: "Split", k: "SPU" }] },
  { a: "سلوفينيا", e: "Slovenia", ct: [{ a: "ليوبليانا", e: "Ljubljana", k: "LJU" }] },
  { a: "البوسنة والهرسك", e: "Bosnia and Herzegovina", ct: [{ a: "سراييفو", e: "Sarajevo", k: "SJJ" }] },
  { a: "صربيا", e: "Serbia", ct: [{ a: "بلغراد", e: "Belgrade", k: "BEG" }] },
  { a: "الجبل الأسود", e: "Montenegro", ct: [{ a: "بودغوريتسا", e: "Podgorica", k: "TGD" }] },
  { a: "مقدونيا الشمالية", e: "North Macedonia", ct: [{ a: "سكوبيه", e: "Skopje", k: "SKP" }] },
  { a: "ألبانيا", e: "Albania", ct: [{ a: "تيرانا", e: "Tirana", k: "TIA" }] },
  { a: "كوسوفو", e: "Kosovo", ct: [{ a: "بريشتينا", e: "Pristina", k: "PRN" }] },
  { a: "مولدوفا", e: "Moldova", ct: [{ a: "كيشيناو", e: "Chișinău", k: "KIV" }] },
  { a: "أوكرانيا", e: "Ukraine", ct: [{ a: "كييف", e: "Kyiv", k: "KBP" }] },
  { a: "بيلاروسيا", e: "Belarus", ct: [{ a: "مينسك", e: "Minsk", k: "MSQ" }] },
  { a: "روسيا", e: "Russia", ct: [{ a: "موسكو", e: "Moscow", k: "SVO" }, { a: "سان بطرسبرغ", e: "Saint Petersburg", k: "LED" }] },
  { a: "ليتوانيا", e: "Lithuania", ct: [{ a: "فيلنيوس", e: "Vilnius", k: "VNO" }] },
  { a: "لاتفيا", e: "Latvia", ct: [{ a: "ريغا", e: "Riga", k: "RIX" }] },
  { a: "إستونيا", e: "Estonia", ct: [{ a: "تالين", e: "Tallinn", k: "TLL" }] },
  { a: "فنلندا", e: "Finland", ct: [{ a: "هلسنكي", e: "Helsinki", k: "HEL" }] },
  { a: "السويد", e: "Sweden", ct: [{ a: "ستوكهولم", e: "Stockholm", k: "ARN" }] },
  { a: "النرويج", e: "Norway", ct: [{ a: "أوسلو", e: "Oslo", k: "OSL" }] },
  { a: "الدنمارك", e: "Denmark", ct: [{ a: "كوبنهاغن", e: "Copenhagen", k: "CPH" }] },
  { a: "آيسلندا", e: "Iceland", ct: [{ a: "ريكيافيك", e: "Reykjavík", k: "KEF" }] },
  { a: "أندورا", e: "Andorra", ct: [{ a: "أندورا لا فيلا", e: "Andorra la Vella", k: "BCN" }] },
  { a: "موناكو", e: "Monaco", ct: [{ a: "موناكو", e: "Monaco", k: "NCE" }] },
  { a: "ليختنشتاين", e: "Liechtenstein", ct: [{ a: "فادوز", e: "Vaduz", k: "ZRH" }] },
  { a: "نيجيريا", e: "Nigeria", ct: [{ a: "لاغوس", e: "Lagos", k: "LOS" }, { a: "أبوجا", e: "Abuja", k: "ABV" }] },
  { a: "غانا", e: "Ghana", ct: [{ a: "أكرا", e: "Accra", k: "ACC" }] },
  { a: "ساحل العاج", e: "Ivory Coast", ct: [{ a: "أبيدجان", e: "Abidjan", k: "ABJ" }] },
  { a: "السنغال", e: "Senegal", ct: [{ a: "داكار", e: "Dakar", k: "DSS" }] },
  { a: "مالي", e: "Mali", ct: [{ a: "باماكو", e: "Bamako", k: "BKO" }] },
  { a: "النيجر", e: "Niger", ct: [{ a: "نيامي", e: "Niamey", k: "NIM" }] },
  { a: "تشاد", e: "Chad", ct: [{ a: "إنجامينا", e: "N'Djamena", k: "NDJ" }] },
  { a: "الكاميرون", e: "Cameroon", ct: [{ a: "ياوندي", e: "Yaoundé", k: "NSI" }, { a: "دوالا", e: "Douala", k: "DLA" }] },
  { a: "جمهورية أفريقيا الوسطى", e: "Central African Republic", ct: [{ a: "بانغي", e: "Bangui", k: "BGF" }] },
  { a: "الغابون", e: "Gabon", ct: [{ a: "ليبرفيل", e: "Libreville", k: "LBV" }] },
  { a: "الكونغو", e: "Congo", ct: [{ a: "برازافيل", e: "Brazzaville", k: "BZV" }] },
  { a: "جمهورية الكونغو الديمقراطية", e: "DR Congo", ct: [{ a: "كينشاسا", e: "Kinshasa", k: "FIH" }] },
  { a: "أنغولا", e: "Angola", ct: [{ a: "لواندا", e: "Luanda", k: "LAD" }] },
  { a: "زامبيا", e: "Zambia", ct: [{ a: "لوساكا", e: "Lusaka", k: "LUN" }] },
  { a: "زيمبابوي", e: "Zimbabwe", ct: [{ a: "هراري", e: "Harare", k: "HRE" }, { a: "فيكتوريا فولز", e: "Victoria Falls", k: "VFA" }] },
  { a: "موزمبيق", e: "Mozambique", ct: [{ a: "مابوتو", e: "Maputo", k: "MPM" }] },
  { a: "مالاوي", e: "Malawi", ct: [{ a: "ليلونغوي", e: "Lilongwe", k: "LLW" }] },
  { a: "تنزانيا", e: "Tanzania", ct: [{ a: "دار السلام", e: "Dar es Salaam", k: "DAR" }, { a: "زنجبار", e: "Zanzibar", k: "ZNZ" }] },
  { a: "كينيا", e: "Kenya", ct: [{ a: "نيروبي", e: "Nairobi", k: "NBO" }, { a: "مومباسا", e: "Mombasa", k: "MBA" }] },
  { a: "أوغندا", e: "Uganda", ct: [{ a: "كمبالا", e: "Kampala", k: "EBB" }] },
  { a: "رواندا", e: "Rwanda", ct: [{ a: "كيغالي", e: "Kigali", k: "KGL" }] },
  { a: "بوروندي", e: "Burundi", ct: [{ a: "بوجومبورا", e: "Bujumbura", k: "BJM" }] },
  { a: "إثيوبيا", e: "Ethiopia", ct: [{ a: "أديس أبابا", e: "Addis Ababa", k: "ADD" }] },
  { a: "إريتريا", e: "Eritrea", ct: [{ a: "أسمرا", e: "Asmara", k: "ASM" }] },
  { a: "جنوب أفريقيا", e: "South Africa", ct: [{ a: "جوهانسبرغ", e: "Johannesburg", k: "JNB" }, { a: "كيب تاون", e: "Cape Town", k: "CPT" }, { a: "ديربان", e: "Durban", k: "DUR" }] },
  { a: "ناميبيا", e: "Namibia", ct: [{ a: "ويندهوك", e: "Windhoek", k: "WDH" }] },
  { a: "بوتسوانا", e: "Botswana", ct: [{ a: "غابورون", e: "Gaborone", k: "GBE" }] },
  { a: "ليسوتو", e: "Lesotho", ct: [{ a: "ماسيرو", e: "Maseru", k: "MSU" }] },
  { a: "إسواتيني", e: "Eswatini", ct: [{ a: "مبابان", e: "Mbabane", k: "SHO" }] },
  { a: "مدغشقر", e: "Madagascar", ct: [{ a: "أنتاناناريفو", e: "Antananarivo", k: "TNR" }] },
  { a: "موريشيوس", e: "Mauritius", ct: [{ a: "بورت لويس", e: "Port Louis", k: "MRU" }] },
  { a: "سيشل", e: "Seychelles", ct: [{ a: "فيكتوريا", e: "Victoria", k: "SEZ" }] },
  { a: "جزر القمر", e: "Comoros", ct: [{ a: "موروني", e: "Moroni", k: "HAH" }] },
  { a: "الرأس الأخضر", e: "Cape Verde", ct: [{ a: "برايا", e: "Praia", k: "RAI" }] },
  { a: "غينيا", e: "Guinea", ct: [{ a: "كوناكري", e: "Conakry", k: "CKY" }] },
  { a: "غينيا بيساو", e: "Guinea-Bissau", ct: [{ a: "بيساو", e: "Bissau", k: "OXB" }] },
  { a: "سيراليون", e: "Sierra Leone", ct: [{ a: "فريتاون", e: "Freetown", k: "FNA" }] },
  { a: "ليبيريا", e: "Liberia", ct: [{ a: "مونروفيا", e: "Monrovia", k: "ROB" }] },
  { a: "توغو", e: "Togo", ct: [{ a: "لومي", e: "Lomé", k: "LFW" }] },
  { a: "بنين", e: "Benin", ct: [{ a: "كوتونو", e: "Cotonou", k: "COO" }] },
  { a: "بوركينا فاسو", e: "Burkina Faso", ct: [{ a: "واغادوغو", e: "Ouagadougou", k: "OUA" }] },
  { a: "غامبيا", e: "Gambia", ct: [{ a: "بانجول", e: "Banjul", k: "BJL" }] },
  { a: "غينيا الاستوائية", e: "Equatorial Guinea", ct: [{ a: "مالابو", e: "Malabo", k: "SSG" }] },
  { a: "ساو تومي وبرينسيبي", e: "São Tomé and Príncipe", ct: [{ a: "ساو تومي", e: "São Tomé", k: "TMS" }] },
  { a: "جنوب السودان", e: "South Sudan", ct: [{ a: "جوبا", e: "Juba", k: "JUB" }] },
  { a: "الولايات المتحدة", e: "United States", ct: [{ a: "نيويورك", e: "New York", k: "JFK" }, { a: "لوس أنجلوس", e: "Los Angeles", k: "LAX" }, { a: "شيكاغو", e: "Chicago", k: "ORD" }, { a: "ميامي", e: "Miami", k: "MIA" }, { a: "سان فرانسيسكو", e: "San Francisco", k: "SFO" }, { a: "لاس فيغاس", e: "Las Vegas", k: "LAS" }, { a: "واشنطن", e: "Washington DC", k: "IAD" }, { a: "أورلاندو", e: "Orlando", k: "MCO" }, { a: "بوسطن", e: "Boston", k: "BOS" }, { a: "سياتل", e: "Seattle", k: "SEA" }] },
  { a: "كندا", e: "Canada", ct: [{ a: "تورونتو", e: "Toronto", k: "YYZ" }, { a: "فانكوفر", e: "Vancouver", k: "YVR" }, { a: "مونتريال", e: "Montreal", k: "YUL" }] },
  { a: "المكسيك", e: "Mexico", ct: [{ a: "مكسيكو سيتي", e: "Mexico City", k: "MEX" }, { a: "كانكون", e: "Cancún", k: "CUN" }, { a: "غوادالاخارا", e: "Guadalajara", k: "GDL" }] },
  { a: "غواتيمالا", e: "Guatemala", ct: [{ a: "مدينة غواتيمالا", e: "Guatemala City", k: "GUA" }] },
  { a: "بليز", e: "Belize", ct: [{ a: "مدينة بليز", e: "Belize City", k: "BZE" }] },
  { a: "هندوراس", e: "Honduras", ct: [{ a: "تيغوسيغالبا", e: "Tegucigalpa", k: "TGU" }] },
  { a: "السلفادور", e: "El Salvador", ct: [{ a: "سان سلفادور", e: "San Salvador", k: "SAL" }] },
  { a: "نيكاراغوا", e: "Nicaragua", ct: [{ a: "ماناغوا", e: "Managua", k: "MGA" }] },
  { a: "كوستاريكا", e: "Costa Rica", ct: [{ a: "سان خوسيه", e: "San José", k: "SJO" }] },
  { a: "بنما", e: "Panama", ct: [{ a: "مدينة بنما", e: "Panama City", k: "PTY" }] },
  { a: "كوبا", e: "Cuba", ct: [{ a: "هافانا", e: "Havana", k: "HAV" }] },
  { a: "جامايكا", e: "Jamaica", ct: [{ a: "كينغستون", e: "Kingston", k: "KIN" }, { a: "مونتيغو باي", e: "Montego Bay", k: "MBJ" }] },
  { a: "هايتي", e: "Haiti", ct: [{ a: "بورت أو برنس", e: "Port-au-Prince", k: "PAP" }] },
  { a: "جمهورية الدومينيكان", e: "Dominican Republic", ct: [{ a: "سانتو دومينغو", e: "Santo Domingo", k: "SDQ" }, { a: "بونتا كانا", e: "Punta Cana", k: "PUJ" }] },
  { a: "الباهاما", e: "Bahamas", ct: [{ a: "ناسو", e: "Nassau", k: "NAS" }] },
  { a: "بربادوس", e: "Barbados", ct: [{ a: "بريدجتاون", e: "Bridgetown", k: "BGI" }] },
  { a: "ترينيداد وتوباغو", e: "Trinidad and Tobago", ct: [{ a: "بورت أوف سبين", e: "Port of Spain", k: "POS" }] },
  { a: "كولومبيا", e: "Colombia", ct: [{ a: "بوغوتا", e: "Bogotá", k: "BOG" }, { a: "كارتاخينا", e: "Cartagena", k: "CTG" }, { a: "ميديلين", e: "Medellín", k: "MDE" }] },
  { a: "فنزويلا", e: "Venezuela", ct: [{ a: "كاراكاس", e: "Caracas", k: "CCS" }] },
  { a: "غيانا", e: "Guyana", ct: [{ a: "جورجتاون", e: "Georgetown", k: "GEO" }] },
  { a: "سورينام", e: "Suriname", ct: [{ a: "باراماريبو", e: "Paramaribo", k: "PBM" }] },
  { a: "الإكوادور", e: "Ecuador", ct: [{ a: "كيتو", e: "Quito", k: "UIO" }, { a: "غواياكيل", e: "Guayaquil", k: "GYE" }] },
  { a: "بيرو", e: "Peru", ct: [{ a: "ليما", e: "Lima", k: "LIM" }, { a: "كوسكو", e: "Cusco", k: "CUZ" }] },
  { a: "بوليفيا", e: "Bolivia", ct: [{ a: "لاباز", e: "La Paz", k: "LPB" }] },
  { a: "البرازيل", e: "Brazil", ct: [{ a: "ساو باولو", e: "São Paulo", k: "GRU" }, { a: "ريو دي جانيرو", e: "Rio de Janeiro", k: "GIG" }, { a: "برازيليا", e: "Brasília", k: "BSB" }] },
  { a: "باراغواي", e: "Paraguay", ct: [{ a: "أسونسيون", e: "Asunción", k: "ASU" }] },
  { a: "الأوروغواي", e: "Uruguay", ct: [{ a: "مونتيفيديو", e: "Montevideo", k: "MVD" }] },
  { a: "تشيلي", e: "Chile", ct: [{ a: "سانتياغو", e: "Santiago", k: "SCL" }] },
  { a: "الأرجنتين", e: "Argentina", ct: [{ a: "بوينس آيرس", e: "Buenos Aires", k: "EZE" }] },
  { a: "أستراليا", e: "Australia", ct: [{ a: "سيدني", e: "Sydney", k: "SYD" }, { a: "ملبورن", e: "Melbourne", k: "MEL" }, { a: "بريزبن", e: "Brisbane", k: "BNE" }, { a: "بيرث", e: "Perth", k: "PER" }] },
  { a: "نيوزيلندا", e: "New Zealand", ct: [{ a: "أوكلاند", e: "Auckland", k: "AKL" }, { a: "كوينزتاون", e: "Queenstown", k: "ZQN" }] },
  { a: "فيجي", e: "Fiji", ct: [{ a: "نادي", e: "Nadi", k: "NAN" }] },
  { a: "بابوا غينيا الجديدة", e: "Papua New Guinea", ct: [{ a: "بورت مورسبي", e: "Port Moresby", k: "POM" }] },
  { a: "جزر سليمان", e: "Solomon Islands", ct: [{ a: "هونيارا", e: "Honiara", k: "HIR" }] },
  { a: "فانواتو", e: "Vanuatu", ct: [{ a: "بورت فيلا", e: "Port Vila", k: "VLI" }] },
  { a: "ساموا", e: "Samoa", ct: [{ a: "آبيا", e: "Apia", k: "APW" }] },
  { a: "تونغا", e: "Tonga", ct: [{ a: "نوكوألوفا", e: "Nukuʻalofa", k: "TBU" }] },
  { a: "كيريباتي", e: "Kiribati", ct: [{ a: "تاراوا", e: "Tarawa", k: "TRW" }] },
  { a: "بالاو", e: "Palau", ct: [{ a: "كورور", e: "Koror", k: "ROR" }] },
  { a: "ميكرونيسيا", e: "Micronesia", ct: [{ a: "باليكير", e: "Palikir", k: "PNI" }] },
  { a: "جزر مارشال", e: "Marshall Islands", ct: [{ a: "ماجورو", e: "Majuro", k: "MAJ" }] },
  { a: "ناورو", e: "Nauru", ct: [{ a: "يارن", e: "Yaren", k: "INU" }] },
  { a: "توفالو", e: "Tuvalu", ct: [{ a: "فونافوتي", e: "Funafuti", k: "FUN" }] },
];
const FLAT_CITIES = COUNTRIES.flatMap((c) => c.ct.map((city) => ({ ...city, country: c.a, countryEn: c.e })));

const LANGUAGES = [
  { code: "ar", a: "العربية", e: "Arabic", full: true }, { code: "en", a: "الإنجليزية", e: "English", full: true },
  { code: "fr", a: "الفرنسية", e: "French" }, { code: "es", a: "الإسبانية", e: "Spanish" }, { code: "de", a: "الألمانية", e: "German" },
  { code: "it", a: "الإيطالية", e: "Italian" }, { code: "pt", a: "البرتغالية", e: "Portuguese" }, { code: "ru", a: "الروسية", e: "Russian" },
  { code: "tr", a: "التركية", e: "Turkish" }, { code: "fa", a: "الفارسية", e: "Persian" }, { code: "ur", a: "الأردية", e: "Urdu" },
  { code: "hi", a: "الهندية", e: "Hindi" }, { code: "bn", a: "البنغالية", e: "Bengali" }, { code: "zh", a: "الصينية", e: "Chinese" },
  { code: "ja", a: "اليابانية", e: "Japanese" }, { code: "ko", a: "الكورية", e: "Korean" }, { code: "vi", a: "الفيتنامية", e: "Vietnamese" },
  { code: "th", a: "التايلاندية", e: "Thai" }, { code: "id", a: "الإندونيسية", e: "Indonesian" }, { code: "ms", a: "الملايو", e: "Malay" },
  { code: "tl", a: "الفلبينية", e: "Filipino" }, { code: "sw", a: "السواحيلية", e: "Swahili" }, { code: "ha", a: "الهوسا", e: "Hausa" },
  { code: "am", a: "الأمهرية", e: "Amharic" }, { code: "so", a: "الصومالية", e: "Somali" }, { code: "he", a: "العبرية", e: "Hebrew" },
  { code: "el", a: "اليونانية", e: "Greek" }, { code: "pl", a: "البولندية", e: "Polish" }, { code: "cs", a: "التشيكية", e: "Czech" },
  { code: "sk", a: "السلوفاكية", e: "Slovak" }, { code: "hu", a: "المجرية", e: "Hungarian" }, { code: "ro", a: "الرومانية", e: "Romanian" },
  { code: "bg", a: "البلغارية", e: "Bulgarian" }, { code: "uk", a: "الأوكرانية", e: "Ukrainian" }, { code: "nl", a: "الهولندية", e: "Dutch" },
  { code: "sv", a: "السويدية", e: "Swedish" }, { code: "no", a: "النرويجية", e: "Norwegian" }, { code: "da", a: "الدنماركية", e: "Danish" },
  { code: "fi", a: "الفنلندية", e: "Finnish" }, { code: "is", a: "الآيسلندية", e: "Icelandic" }, { code: "sr", a: "الصربية", e: "Serbian" },
  { code: "hr", a: "الكرواتية", e: "Croatian" }, { code: "bs", a: "البوسنية", e: "Bosnian" }, { code: "sq", a: "الألبانية", e: "Albanian" },
  { code: "ka", a: "الجورجية", e: "Georgian" }, { code: "hy", a: "الأرمنية", e: "Armenian" }, { code: "az", a: "الأذربيجانية", e: "Azerbaijani" },
  { code: "kk", a: "الكازاخية", e: "Kazakh" }, { code: "uz", a: "الأوزبكية", e: "Uzbek" }, { code: "ps", a: "البشتو", e: "Pashto" },
  { code: "ku", a: "الكردية", e: "Kurdish" }, { code: "pa", a: "البنجابية", e: "Punjabi" }, { code: "ta", a: "التاميلية", e: "Tamil" },
  { code: "te", a: "التيلوغوية", e: "Telugu" }, { code: "mr", a: "الماراثية", e: "Marathi" }, { code: "gu", a: "الغوجراتية", e: "Gujarati" },
  { code: "ne", a: "النيبالية", e: "Nepali" }, { code: "si", a: "السنهالية", e: "Sinhala" }, { code: "my", a: "البورمية", e: "Burmese" },
  { code: "km", a: "الخميرية", e: "Khmer" }, { code: "lo", a: "اللاوية", e: "Lao" }, { code: "mn", a: "المنغولية", e: "Mongolian" },
  { code: "zu", a: "الزولو", e: "Zulu" }, { code: "yo", a: "اليوروبا", e: "Yoruba" }, { code: "ig", a: "الإيغبو", e: "Igbo" },
  { code: "af", a: "الأفريكانية", e: "Afrikaans" }, { code: "ca", a: "الكتالانية", e: "Catalan" }, { code: "eu", a: "الباسكية", e: "Basque" },
];

/* =========================================================================
   الترجمات
   ========================================================================= */
const T = {
  ar: {
    tagline: "احجز رحلتك، بلا تعقيد", getStarted: "ابدأ الآن",
    loginTitle: "تسجيل الدخول", loginSub: "سجّل الدخول لمتابعة حجزك",
    emailTab: "البريد الإلكتروني", phoneTab: "رقم الجوال",
    emailPlaceholder: "name@example.com", phonePlaceholder: "5XXXXXXXX",
    continueBtn: "متابعة", otpTitle: "أدخل رمز التحقق", otpSub: "أرسلنا رمزًا مكوّنًا من 6 أرقام إلى",
    verifyBtn: "تأكيد", resend: "إعادة إرسال الرمز",
    flightsTab: "طيران", hotelsTab: "فنادق",
    oneWay: "ذهاب فقط", roundTrip: "ذهاب وعودة",
    from: "من", to: "إلى", swap: "تبديل",
    departDate: "تاريخ المغادرة", returnDate: "تاريخ العودة",
    checkIn: "تاريخ الوصول", checkOut: "تاريخ المغادرة",
    passengers: "المسافرون", travelers: "المسافرون",
    adults: "بالغون", children: "أطفال", infants: "رضّع",
    adultsSub: "١٢ سنة فأكثر", childrenSub: "من ٢ إلى ١١ سنة", infantsSub: "أقل من سنتين",
    rooms: "الغرف",
    searchFlights: "ابحث عن رحلات", searchHotels: "ابحث عن فنادق",
    selectCity: "اختر المدينة", searchCityPlaceholder: "ابحث عن مدينة أو دولة",
    noResults: "لا توجد نتائج مطابقة",
    done: "تم", apply: "تطبيق",
    selectLanguage: "اختر اللغة", languageNote: "الترجمة الكاملة متاحة حاليًا بالعربية والإنجليزية، وبقية اللغات قادمة قريبًا",
    resultsTitleFlights: "الرحلات المتاحة", resultsTitleHotels: "الفنادق المتاحة",
    perNight: "لليلة الواحدة", direct: "رحلة مباشرة", choose: "اختيار", book: "احجز",
    paymentTitle: "الدفع", cardNumber: "رقم البطاقة", expiry: "الانتهاء", cvv: "CVV",
    nameOnCard: "الاسم على البطاقة", payWith: "الدفع باستخدام بطاقة", orPayWith: "أو ادفع باستخدام",
    payNow: "ادفع الآن", applePay: "Apple Pay", googlePay: "Google Pay",
    bookingConfirmed: "تم تأكيد الحجز!", confirmationSub: "أرسلنا تفاصيل حجزك إلى بريدك الإلكتروني",
    bookingRef: "رقم الحجز", backHome: "العودة للرئيسية",
    home: "الرئيسية", myTrips: "رحلاتي", profile: "حسابي",
    summary: "ملخص الحجز", total: "الإجمالي", guest: "نزيل", night: "ليلة",
    priceFrom: "يبدأ من",
  },
  en: {
    tagline: "Book your trip, without the hassle", getStarted: "Get started",
    loginTitle: "Log in", loginSub: "Log in to continue your booking",
    emailTab: "Email", phoneTab: "Phone number",
    emailPlaceholder: "name@example.com", phonePlaceholder: "5XXXXXXXX",
    continueBtn: "Continue", otpTitle: "Enter verification code", otpSub: "We sent a 6-digit code to",
    verifyBtn: "Verify", resend: "Resend code",
    flightsTab: "Flights", hotelsTab: "Hotels",
    oneWay: "One way", roundTrip: "Round trip",
    from: "From", to: "To", swap: "Swap",
    departDate: "Departure date", returnDate: "Return date",
    checkIn: "Check-in", checkOut: "Check-out",
    passengers: "Passengers", travelers: "Travelers",
    adults: "Adults", children: "Children", infants: "Infants",
    adultsSub: "Age 12+", childrenSub: "Age 2–11", infantsSub: "Under 2",
    rooms: "Rooms",
    searchFlights: "Search flights", searchHotels: "Search hotels",
    selectCity: "Select city", searchCityPlaceholder: "Search city or country",
    noResults: "No matching results",
    done: "Done", apply: "Apply",
    selectLanguage: "Select language", languageNote: "Full translation is currently available in Arabic and English — more languages are coming soon",
    resultsTitleFlights: "Available flights", resultsTitleHotels: "Available hotels",
    perNight: "per night", direct: "Direct flight", choose: "Select", book: "Book",
    paymentTitle: "Payment", cardNumber: "Card number", expiry: "Expiry", cvv: "CVV",
    nameOnCard: "Name on card", payWith: "Pay with card", orPayWith: "Or pay with",
    payNow: "Pay now", applePay: "Apple Pay", googlePay: "Google Pay",
    bookingConfirmed: "Booking confirmed!", confirmationSub: "We sent your booking details to your email",
    bookingRef: "Booking reference", backHome: "Back to home",
    home: "Home", myTrips: "My trips", profile: "Profile",
    summary: "Booking summary", total: "Total", guest: "guest", night: "night",
    priceFrom: "From",
  },
};

const COLORS = { ink: "#17140F", inkSoft: "#4A4433", parchment: "#EFE6D0", parchmentDeep: "#E2D3AC", tan: "#C7B78E", white: "#FFFFFF" };

/* =========================================================================
   شعار NASQ
   ========================================================================= */
function Logo({ size = 56, variant = "dark" }) {
  const ring = variant === "dark" ? COLORS.parchment : COLORS.ink;
  const disc = variant === "dark" ? COLORS.ink : COLORS.parchment;
  const planeA = variant === "dark" ? COLORS.parchment : COLORS.ink;
  const planeB = variant === "dark" ? COLORS.tan : COLORS.tan;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
      <circle cx="50" cy="50" r="47" fill="none" stroke={ring} strokeWidth="1.4" strokeDasharray="2.2 6" opacity="0.55" />
      <circle cx="50" cy="50" r="38" fill={disc} />
      <g transform="translate(50 50) rotate(-24) translate(-50 -46)">
        <path d="M50 20 L22 74 L50 60 Z" fill={planeA} />
        <path d="M50 20 L78 74 L50 60 Z" fill={planeB} />
      </g>
    </svg>
  );
}

/* =========================================================================
   عناصر مساعدة صغيرة
   ========================================================================= */
function Segmented({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", background: COLORS.parchmentDeep, borderRadius: 999, padding: 4, gap: 4 }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            flex: 1, border: "none", borderRadius: 999, padding: "10px 8px", fontSize: 13.5, fontWeight: 600,
            cursor: "pointer", transition: "all .2s ease",
            background: value === opt.value ? COLORS.ink : "transparent",
            color: value === opt.value ? COLORS.parchment : COLORS.inkSoft,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Perforation() {
  return <div style={{ height: 0, borderTop: `2px dashed ${COLORS.tan}`, margin: "14px 0" }} />;
}

function TicketCard({ children, style }) {
  return (
    <div style={{ position: "relative", background: COLORS.white, borderRadius: 18, padding: 18, boxShadow: "0 1px 0 rgba(23,20,15,0.05)", border: `1px solid ${COLORS.parchmentDeep}`, ...style }}>
      <div style={{ position: "absolute", top: "50%", left: -9, width: 18, height: 18, borderRadius: "50%", background: COLORS.parchment, transform: "translateY(-50%)" }} />
      <div style={{ position: "absolute", top: "50%", right: -9, width: 18, height: 18, borderRadius: "50%", background: COLORS.parchment, transform: "translateY(-50%)" }} />
      {children}
    </div>
  );
}

function Field({ label, icon, value, placeholder, onClick, dir }) {
  return (
    <button onClick={onClick} style={{ width: "100%", textAlign: dir === "rtl" ? "right" : "left", background: COLORS.parchmentDeep, border: "none", borderRadius: 14, padding: "12px 14px", cursor: onClick ? "pointer" : "default", display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ color: COLORS.inkSoft, display: "flex" }}>{icon}</span>
      <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
        <span style={{ fontSize: 11.5, color: COLORS.inkSoft }}>{label}</span>
        <span style={{ fontSize: 14.5, fontWeight: 600, color: COLORS.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value || placeholder}</span>
      </span>
    </button>
  );
}

function Stepper({ value, min, max, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <button onClick={() => value > min && onChange(value - 1)} disabled={value <= min}
        style={{ width: 32, height: 32, borderRadius: "50%", border: `1.4px solid ${COLORS.tan}`, background: value <= min ? COLORS.parchment : COLORS.white, color: COLORS.ink, display: "flex", alignItems: "center", justifyContent: "center", cursor: value <= min ? "default" : "pointer", opacity: value <= min ? 0.4 : 1 }}>
        <Minus size={15} />
      </button>
      <span style={{ width: 20, textAlign: "center", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{value}</span>
      <button onClick={() => value < max && onChange(value + 1)} disabled={value >= max}
        style={{ width: 32, height: 32, borderRadius: "50%", border: `1.4px solid ${COLORS.ink}`, background: value >= max ? COLORS.parchment : COLORS.ink, color: value >= max ? COLORS.inkSoft : COLORS.parchment, display: "flex", alignItems: "center", justifyContent: "center", cursor: value >= max ? "default" : "pointer", opacity: value >= max ? 0.4 : 1 }}>
        <Plus size={15} />
      </button>
    </div>
  );
}

function Sheet({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(23,20,15,0.45)" }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 440, maxHeight: "82vh", background: COLORS.parchment, borderRadius: "22px 22px 0 0", padding: "16px 18px 22px", overflowY: "auto", animation: "nasq-sheet-up .28s ease" }}>
        <div style={{ width: 40, height: 4, borderRadius: 4, background: COLORS.tan, margin: "0 auto 14px" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: COLORS.ink }}>{title}</h3>
          <button onClick={onClose} style={{ background: COLORS.parchmentDeep, border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: COLORS.ink }}>
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled, style }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ width: "100%", padding: "15px 18px", borderRadius: 14, border: "none", background: disabled ? COLORS.tan : COLORS.ink, color: COLORS.parchment, fontSize: 15, fontWeight: 700, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.6 : 1, ...style }}>
      {children}
    </button>
  );
}

/* =========================================================================
   التطبيق
   ========================================================================= */
export default function NasqApp() {
  const [lang, setLang] = useState("ar");
  const [langLabel, setLangLabel] = useState(null);
  const dir = lang === "ar" ? "rtl" : "ltr";
  const t = (k) => T[lang][k] ?? T.ar[k];

  const [screen, setScreen] = useState("splash");
  const [service, setService] = useState("flights");
  const [tripType, setTripType] = useState("roundtrip");

  const [from, setFrom] = useState(FLAT_CITIES.find((c) => c.k === "RUH"));
  const [to, setTo] = useState(FLAT_CITIES.find((c) => c.k === "DXB"));
  const [hotelCity, setHotelCity] = useState(FLAT_CITIES.find((c) => c.k === "IST"));
  const [pickerFor, setPickerFor] = useState(null);

  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [pax, setPax] = useState({ adults: 1, children: 0, infants: 0 });
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  const [showPax, setShowPax] = useState(false);
  const [showLang, setShowLang] = useState(false);

  const [loginMethod, setLoginMethod] = useState("email");
  const [loginValue, setLoginValue] = useState("");
  const [loginStep, setLoginStep] = useState("input");
  const [otp, setOtp] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [selectedResult, setSelectedResult] = useState(null);
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [pnr, setPnr] = useState("");

  // إن كان المستخدم قد فتح رابط الدخول القادم من البريد، يكمل الدخول تلقائيًا
  useEffect(() => {
    let cancelled = false;
    completeEmailSignInIfNeeded()
      .then((user) => { if (!cancelled && user) setScreen("home"); })
      .catch((err) => { if (!cancelled) setAuthError(err.message); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setScreen((s) => (s === "splash" ? "login" : s)), 1500);
    return () => clearTimeout(timer);
  }, []);

  async function handleLoginContinue() {
    setAuthError("");
    setAuthLoading(true);
    try {
      if (loginMethod === "email") {
        await sendEmailOtpLink(loginValue);
        setLoginStep("emailSent");
      } else {
        const e164 = loginValue.startsWith("+") ? loginValue : "+966" + loginValue.replace(/\D/g, "");
        await sendPhoneOtp(e164);
        setLoginStep("otp");
      }
    } catch (err) {
      setAuthError(err.message || String(err));
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleVerifyOtp() {
    setAuthError("");
    setAuthLoading(true);
    try {
      await confirmPhoneOtp(otp);
      setScreen("home");
    } catch (err) {
      setAuthError(err.message || String(err));
    } finally {
      setAuthLoading(false);
    }
  }

  const cityLabel = (c) => (c ? `${lang === "ar" ? c.a : c.e} · ${c.k}` : "");

  function openPicker(which) {
    setPickerFor(which);
  }
  function pickCity(city) {
    if (pickerFor === "from") setFrom(city);
    if (pickerFor === "to") setTo(city);
    if (pickerFor === "hotel") setHotelCity(city);
    setPickerFor(null);
  }
  function swapCities() {
    setFrom(to);
    setTo(from);
  }

  function paxSummary() {
    const total = pax.adults + pax.children + pax.infants;
    return lang === "ar" ? `${total} مسافر` : `${total} traveler${total > 1 ? "s" : ""}`;
  }
  function guestsSummary() {
    const total = guests.adults + guests.children;
    return lang === "ar" ? `${total} نزيل · ${guests.rooms} غرفة` : `${total} guest${total > 1 ? "s" : ""} · ${guests.rooms} room${guests.rooms > 1 ? "s" : ""}`;
  }

  function doSearch() {
    setScreen("results");
  }
  function choose(result) {
    setSelectedResult(result);
    setScreen("payment");
  }
  function formatCardNumber(v) {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }
  function formatExpiry(v) {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return digits.slice(0, 2) + "/" + digits.slice(2);
  }
  function pay() {
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    setPnr(code);
    setScreen("confirmation");
  }

  const FLIGHT_RESULTS = [
    { airline: lang === "ar" ? "السعودية" : "Saudia", dep: "08:20", arr: "10:45", dur: "2h 25m", price: 890 },
    { airline: lang === "ar" ? "طيران الإمارات" : "Emirates", dep: "13:10", arr: "16:05", dur: "2h 55m", price: 1120 },
    { airline: lang === "ar" ? "القطرية" : "Qatar Airways", dep: "19:40", arr: "22:30", dur: "2h 50m", price: 1050 },
    { airline: lang === "ar" ? "طيران ناس" : "flynas", dep: "05:55", arr: "08:15", dur: "2h 20m", price: 620 },
  ];
  const HOTEL_RESULTS = [
    { name: lang === "ar" ? "فندق أفق المدينة" : "City Horizon Hotel", stars: 5, rating: 9.1, price: 540 },
    { name: lang === "ar" ? "منتجع الواحة الذهبية" : "Golden Oasis Resort", stars: 5, rating: 8.8, price: 690 },
    { name: lang === "ar" ? "بوتيك دار السلام" : "Dar Al Salam Boutique", stars: 4, rating: 8.5, price: 340 },
    { name: lang === "ar" ? "نزل النخيل" : "Palm Court Inn", stars: 3, rating: 7.9, price: 210 },
  ];

  const fontImport = `@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');`;

  return (
    <div dir={dir} style={{ fontFamily: lang === "ar" ? "'IBM Plex Sans Arabic','IBM Plex Sans',sans-serif" : "'IBM Plex Sans','IBM Plex Sans Arabic',sans-serif", background: COLORS.parchment, minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <style>{`
        ${fontImport}
        * { box-sizing: border-box; }
        input { font-family: inherit; }
        input::placeholder { color: ${COLORS.inkSoft}; opacity: .55; }
        input[type="date"] { color-scheme: light; }
        @keyframes nasq-sheet-up { from { transform: translateY(24px); opacity:.4 } to { transform: translateY(0); opacity:1 } }
        @keyframes nasq-fade { from { opacity:0 } to { opacity:1 } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
        ::-webkit-scrollbar { width: 0; height: 0; }
        .nasq-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 440, minHeight: "100vh", background: COLORS.parchment, position: "relative", paddingBottom: screen === "home" ? 78 : 0 }}>

        {/* ===== SPLASH ===== */}
        {screen === "splash" && (
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, animation: "nasq-fade .5s ease" }}>
            <Logo size={92} variant="dark" />
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 1, color: COLORS.ink, fontFamily: "'IBM Plex Mono', monospace" }}>NASQ</div>
            <div style={{ fontSize: 14, color: COLORS.inkSoft }}>{t("tagline")}</div>
          </div>
        )}

        {/* ===== LOGIN ===== */}
        {screen === "login" && (
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: "48px 22px 28px" }}>
            <div id="recaptcha-container" />
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 26 }}>
              <Logo size={56} variant="dark" />
            </div>

            {authError && (
              <div style={{ background: COLORS.parchmentDeep, border: `1px solid ${COLORS.tan}`, borderRadius: 12, padding: "10px 12px", marginBottom: 16, fontSize: 12.5, color: COLORS.ink }}>{authError}</div>
            )}

            {loginStep === "input" && (
              <>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: COLORS.ink, margin: "0 0 4px", textAlign: "center" }}>{t("loginTitle")}</h1>
                <p style={{ fontSize: 13.5, color: COLORS.inkSoft, margin: "0 0 24px", textAlign: "center" }}>{t("loginSub")}</p>
                <Segmented
                  options={[{ value: "email", label: t("emailTab") }, { value: "phone", label: t("phoneTab") }]}
                  value={loginMethod}
                  onChange={(v) => { setLoginMethod(v); setLoginValue(""); setAuthError(""); }}
                />
                <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, background: COLORS.white, border: `1.4px solid ${COLORS.parchmentDeep}`, borderRadius: 14, padding: "13px 14px" }}>
                  {loginMethod === "email" ? <Mail size={18} color={COLORS.inkSoft} /> : <Phone size={18} color={COLORS.inkSoft} />}
                  {loginMethod === "phone" && <span className="nasq-mono" style={{ fontSize: 14.5, color: COLORS.ink }} dir="ltr">+966</span>}
                  <input
                    value={loginValue}
                    onChange={(e) => setLoginValue(e.target.value)}
                    placeholder={loginMethod === "email" ? t("emailPlaceholder") : t("phonePlaceholder")}
                    type={loginMethod === "email" ? "email" : "tel"}
                    style={{ border: "none", outline: "none", flex: 1, background: "transparent", fontSize: 14.5, color: COLORS.ink }}
                    dir="ltr"
                  />
                </div>
                <div style={{ marginTop: 22 }}>
                  <PrimaryButton disabled={!loginValue || authLoading} onClick={handleLoginContinue}>
                    {authLoading ? "..." : t("continueBtn")}
                  </PrimaryButton>
                </div>
              </>
            )}

            {loginStep === "emailSent" && (
              <div style={{ textAlign: "center" }}>
                <Mail size={40} color={COLORS.ink} style={{ marginBottom: 14 }} />
                <h1 style={{ fontSize: 20, fontWeight: 700, color: COLORS.ink, margin: "0 0 8px" }}>
                  {lang === "ar" ? "تحقق من بريدك" : "Check your email"}
                </h1>
                <p style={{ fontSize: 13.5, color: COLORS.inkSoft, margin: "0 0 6px", lineHeight: 1.7 }}>
                  {lang === "ar" ? "أرسلنا رابط دخول حقيقيًا إلى" : "We sent a real sign-in link to"}
                </p>
                <p className="nasq-mono" style={{ fontSize: 14, fontWeight: 700, color: COLORS.ink, marginBottom: 20 }} dir="ltr">{loginValue}</p>
                <p style={{ fontSize: 12.5, color: COLORS.inkSoft, lineHeight: 1.7 }}>
                  {lang === "ar" ? "افتح بريدك واضغط الرابط لإكمال الدخول تلقائيًا." : "Open your inbox and tap the link to finish signing in automatically."}
                </p>
                <button onClick={() => setLoginStep("input")} style={{ marginTop: 18, background: "none", border: "none", color: COLORS.inkSoft, fontSize: 13, textDecoration: "underline", cursor: "pointer" }}>
                  {lang === "ar" ? "رجوع" : "Back"}
                </button>
              </div>
            )}

            {loginStep === "otp" && (
              <>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: COLORS.ink, margin: "0 0 4px", textAlign: "center" }}>{t("otpTitle")}</h1>
                <p style={{ fontSize: 13.5, color: COLORS.inkSoft, margin: "0 0 4px", textAlign: "center" }}>{t("otpSub")}</p>
                <p className="nasq-mono" style={{ fontSize: 13.5, color: COLORS.ink, margin: "0 0 22px", textAlign: "center", fontWeight: 600 }} dir="ltr">+966{loginValue}</p>
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <input key={i} maxLength={1} value={otp[i] || ""} onChange={(e) => {
                      const c = e.target.value.replace(/\D/g, "");
                      const arr = otp.split(""); arr[i] = c; setOtp(arr.join("").slice(0, 6));
                    }} className="nasq-mono" style={{ width: 42, height: 52, textAlign: "center", fontSize: 19, fontWeight: 700, border: `1.6px solid ${COLORS.tan}`, borderRadius: 12, background: COLORS.white, color: COLORS.ink, outline: "none" }} />
                  ))}
                </div>
                <PrimaryButton disabled={otp.length < 6 || authLoading} onClick={handleVerifyOtp}>
                  {authLoading ? "..." : t("verifyBtn")}
                </PrimaryButton>
                <button onClick={handleLoginContinue} style={{ marginTop: 14, background: "none", border: "none", color: COLORS.inkSoft, fontSize: 13, textDecoration: "underline", cursor: "pointer" }}>{t("resend")}</button>
              </>
            )}
          </div>
        )}

        {/* ===== HOME ===== */}
        {screen === "home" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Logo size={34} variant="dark" />
                <span className="nasq-mono" style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink }}>NASQ</span>
              </div>
              <button onClick={() => setShowLang(true)} style={{ background: COLORS.white, border: `1px solid ${COLORS.parchmentDeep}`, borderRadius: 999, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: COLORS.ink }}>
                <Globe size={17} />
              </button>
            </div>

            <div style={{ padding: "10px 20px 20px" }}>
              <Segmented
                options={[{ value: "flights", label: t("flightsTab") }, { value: "hotels", label: t("hotelsTab") }]}
                value={service}
                onChange={setService}
              />
            </div>

            <TicketCard style={{ margin: "0 18px" }}>
              {service === "flights" ? (
                <>
                  <Segmented
                    options={[{ value: "oneway", label: t("oneWay") }, { value: "roundtrip", label: t("roundTrip") }]}
                    value={tripType}
                    onChange={setTripType}
                  />
                  <div style={{ position: "relative", marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                    <Field label={t("from")} icon={<Plane size={16} />} value={cityLabel(from)} onClick={() => openPicker("from")} dir={dir} />
                    <Field label={t("to")} icon={<MapPin size={16} />} value={cityLabel(to)} onClick={() => openPicker("to")} dir={dir} />
                    <button onClick={swapCities} title={t("swap")} style={{ position: "absolute", top: "50%", insetInlineEnd: 10, transform: "translateY(-50%)", width: 34, height: 34, borderRadius: "50%", background: COLORS.ink, color: COLORS.parchment, border: `3px solid ${COLORS.white}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <ArrowLeftRight size={15} />
                    </button>
                  </div>
                  <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                    <div style={{ flex: 1, background: COLORS.parchmentDeep, borderRadius: 14, padding: "10px 12px" }}>
                      <div style={{ fontSize: 11.5, color: COLORS.inkSoft, marginBottom: 3, display: "flex", alignItems: "center", gap: 6 }}><Calendar size={13} />{t("departDate")}</div>
                      <input type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)} style={{ border: "none", background: "transparent", fontSize: 13.5, fontWeight: 600, color: COLORS.ink, width: "100%", outline: "none" }} />
                    </div>
                    {tripType === "roundtrip" && (
                      <div style={{ flex: 1, background: COLORS.parchmentDeep, borderRadius: 14, padding: "10px 12px" }}>
                        <div style={{ fontSize: 11.5, color: COLORS.inkSoft, marginBottom: 3, display: "flex", alignItems: "center", gap: 6 }}><Calendar size={13} />{t("returnDate")}</div>
                        <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} style={{ border: "none", background: "transparent", fontSize: 13.5, fontWeight: 600, color: COLORS.ink, width: "100%", outline: "none" }} />
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <Field label={t("passengers")} icon={<Users size={16} />} value={paxSummary()} onClick={() => setShowPax(true)} dir={dir} />
                  </div>
                  <Perforation />
                  <PrimaryButton onClick={doSearch}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Search size={16} />{t("searchFlights")}</span></PrimaryButton>
                </>
              ) : (
                <>
                  <Field label={lang === "ar" ? "الوجهة" : "Destination"} icon={<Building2 size={16} />} value={cityLabel(hotelCity)} onClick={() => openPicker("hotel")} dir={dir} />
                  <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                    <div style={{ flex: 1, background: COLORS.parchmentDeep, borderRadius: 14, padding: "10px 12px" }}>
                      <div style={{ fontSize: 11.5, color: COLORS.inkSoft, marginBottom: 3, display: "flex", alignItems: "center", gap: 6 }}><Calendar size={13} />{t("checkIn")}</div>
                      <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} style={{ border: "none", background: "transparent", fontSize: 13.5, fontWeight: 600, color: COLORS.ink, width: "100%", outline: "none" }} />
                    </div>
                    <div style={{ flex: 1, background: COLORS.parchmentDeep, borderRadius: 14, padding: "10px 12px" }}>
                      <div style={{ fontSize: 11.5, color: COLORS.inkSoft, marginBottom: 3, display: "flex", alignItems: "center", gap: 6 }}><Calendar size={13} />{t("checkOut")}</div>
                      <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} style={{ border: "none", background: "transparent", fontSize: 13.5, fontWeight: 600, color: COLORS.ink, width: "100%", outline: "none" }} />
                    </div>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <Field label={t("travelers")} icon={<Users size={16} />} value={guestsSummary()} onClick={() => setShowPax(true)} dir={dir} />
                  </div>
                  <Perforation />
                  <PrimaryButton onClick={doSearch}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Search size={16} />{t("searchHotels")}</span></PrimaryButton>
                </>
              )}
            </TicketCard>

            <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 440, background: COLORS.white, borderTop: `1px solid ${COLORS.parchmentDeep}`, display: "flex", padding: "10px 24px calc(10px + env(safe-area-inset-bottom))", justifyContent: "space-between" }}>
              {[{ icon: <HomeIcon size={19} />, label: t("home"), active: true }, { icon: <Briefcase size={19} />, label: t("myTrips") }, { icon: <User size={19} />, label: t("profile") }].map((it, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: it.active ? COLORS.ink : COLORS.inkSoft, opacity: it.active ? 1 : 0.55, flex: 1 }}>
                  {it.icon}
                  <span style={{ fontSize: 10.5, fontWeight: 600 }}>{it.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== RESULTS ===== */}
        {screen === "results" && (
          <div style={{ padding: "18px 18px 30px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <button onClick={() => setScreen("home")} style={{ background: COLORS.white, border: `1px solid ${COLORS.parchmentDeep}`, borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: COLORS.ink }}>
                {dir === "rtl" ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: COLORS.ink }}>{service === "flights" ? t("resultsTitleFlights") : t("resultsTitleHotels")}</div>
                <div style={{ fontSize: 12.5, color: COLORS.inkSoft }}>
                  {service === "flights" ? `${cityLabel(from)} → ${cityLabel(to)}` : cityLabel(hotelCity)}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {service === "flights" ? FLIGHT_RESULTS.map((f, i) => (
                <TicketCard key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14.5, color: COLORS.ink }}>{f.airline}</div>
                      <div style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 2, display: "flex", alignItems: "center", gap: 5 }}><Clock size={12} />{t("direct")}</div>
                    </div>
                    <div className="nasq-mono" style={{ fontSize: 17, fontWeight: 700, color: COLORS.ink }}>${f.price}</div>
                  </div>
                  <Perforation />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div className="nasq-mono" style={{ textAlign: "center" }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{f.dep}</div>
                      <div style={{ fontSize: 10.5, color: COLORS.inkSoft }}>{from.k}</div>
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 10px" }}>
                      <div style={{ fontSize: 10.5, color: COLORS.inkSoft, marginBottom: 3 }}>{f.dur}</div>
                      <div style={{ width: "100%", borderTop: `1.4px dashed ${COLORS.tan}`, position: "relative" }}>
                        <Plane size={12} style={{ position: "absolute", top: -6, insetInlineEnd: 0, color: COLORS.inkSoft, transform: dir === "rtl" ? "scaleX(-1)" : "none" }} />
                      </div>
                    </div>
                    <div className="nasq-mono" style={{ textAlign: "center" }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{f.arr}</div>
                      <div style={{ fontSize: 10.5, color: COLORS.inkSoft }}>{to.k}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <PrimaryButton onClick={() => choose(f)}>{t("choose")}</PrimaryButton>
                  </div>
                </TicketCard>
              )) : HOTEL_RESULTS.map((h, i) => (
                <TicketCard key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14.5, color: COLORS.ink }}>{h.name}</div>
                      <div style={{ display: "flex", gap: 2, marginTop: 4 }}>
                        {Array.from({ length: h.stars }).map((_, s) => <Star key={s} size={13} fill={COLORS.ink} color={COLORS.ink} />)}
                      </div>
                    </div>
                    <div style={{ background: COLORS.parchmentDeep, borderRadius: 10, padding: "4px 8px", fontSize: 12.5, fontWeight: 700, color: COLORS.ink, height: "fit-content" }} className="nasq-mono">{h.rating}</div>
                  </div>
                  <Perforation />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div className="nasq-mono" style={{ fontSize: 18, fontWeight: 700, color: COLORS.ink }}>${h.price}</div>
                      <div style={{ fontSize: 11.5, color: COLORS.inkSoft }}>{t("perNight")}</div>
                    </div>
                    <div style={{ width: 140 }}><PrimaryButton onClick={() => choose(h)}>{t("book")}</PrimaryButton></div>
                  </div>
                </TicketCard>
              ))}
            </div>
          </div>
        )}

        {/* ===== PAYMENT ===== */}
        {screen === "payment" && (
          <div style={{ padding: "18px 18px 40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <button onClick={() => setScreen("results")} style={{ background: COLORS.white, border: `1px solid ${COLORS.parchmentDeep}`, borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: COLORS.ink }}>
                {dir === "rtl" ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
              <div style={{ fontSize: 17, fontWeight: 700, color: COLORS.ink }}>{t("paymentTitle")}</div>
            </div>

            {/* بطاقة مرئية */}
            <div style={{ background: COLORS.ink, borderRadius: 18, padding: 20, color: COLORS.parchment, marginBottom: 18, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, opacity: 0.06, background: `repeating-linear-gradient(135deg, ${COLORS.parchment} 0 2px, transparent 2px 22px)` }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
                <Logo size={26} variant="dark" />
                <span className="nasq-mono" style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>VISA</span>
              </div>
              <div style={{ width: 34, height: 24, borderRadius: 5, background: COLORS.tan, margin: "22px 0 14px" }} />
              <div className="nasq-mono" style={{ fontSize: 18, letterSpacing: 2, position: "relative" }} dir="ltr">
                {card.number || "•••• •••• •••• ••••"}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, position: "relative" }}>
                <span style={{ fontSize: 12.5, textTransform: "uppercase" }}>{card.name || (lang === "ar" ? "اسمك الكامل" : "YOUR NAME")}</span>
                <span className="nasq-mono" style={{ fontSize: 12.5 }} dir="ltr">{card.expiry || "MM/YY"}</span>
              </div>
            </div>

            <TicketCard>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink, marginBottom: 10 }}>{t("payWith")}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: COLORS.parchmentDeep, borderRadius: 12, padding: "11px 13px" }}>
                  <CreditCard size={16} color={COLORS.inkSoft} />
                  <input dir="ltr" value={card.number} onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })} placeholder={t("cardNumber")} maxLength={19} style={{ border: "none", background: "transparent", outline: "none", flex: 1, fontSize: 14 }} className="nasq-mono" />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: COLORS.parchmentDeep, borderRadius: 12, padding: "11px 13px" }}>
                    <input dir="ltr" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} placeholder={t("expiry")} maxLength={5} style={{ border: "none", background: "transparent", outline: "none", width: "100%", fontSize: 14 }} className="nasq-mono" />
                  </div>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: COLORS.parchmentDeep, borderRadius: 12, padding: "11px 13px" }}>
                    <input dir="ltr" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })} placeholder="CVV" maxLength={3} style={{ border: "none", background: "transparent", outline: "none", width: "100%", fontSize: 14 }} className="nasq-mono" />
                  </div>
                </div>
                <div style={{ background: COLORS.parchmentDeep, borderRadius: 12, padding: "11px 13px" }}>
                  <input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} placeholder={t("nameOnCard")} style={{ border: "none", background: "transparent", outline: "none", width: "100%", fontSize: 14 }} />
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <PrimaryButton disabled={card.number.replace(/\s/g, "").length < 16 || card.expiry.length < 5 || card.cvv.length < 3 || !card.name} onClick={pay}>{t("payNow")}</PrimaryButton>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
                <div style={{ flex: 1, borderTop: `1px dashed ${COLORS.tan}` }} />
                <span style={{ fontSize: 12, color: COLORS.inkSoft }}>{t("orPayWith")}</span>
                <div style={{ flex: 1, borderTop: `1px dashed ${COLORS.tan}` }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button onClick={pay} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: COLORS.ink, color: COLORS.parchment, border: "none", borderRadius: 12, padding: "13px", fontSize: 14.5, fontWeight: 700, cursor: "pointer" }}>
                  <Wallet size={16} />{t("applePay")}
                </button>
                <button onClick={pay} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: COLORS.white, color: COLORS.ink, border: `1.4px solid ${COLORS.ink}`, borderRadius: 12, padding: "13px", fontSize: 14.5, fontWeight: 700, cursor: "pointer" }}>
                  <Wallet size={16} />{t("googlePay")}
                </button>
              </div>
            </TicketCard>
          </div>
        )}

        {/* ===== CONFIRMATION ===== */}
        {screen === "confirmation" && (
          <div style={{ padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <CheckCircle2 size={54} color={COLORS.ink} style={{ marginBottom: 14 }} />
            <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.ink, margin: "0 0 6px" }}>{t("bookingConfirmed")}</h2>
            <p style={{ fontSize: 13.5, color: COLORS.inkSoft, margin: "0 0 26px" }}>{t("confirmationSub")}</p>

            <TicketCard style={{ width: "100%", textAlign: dir === "rtl" ? "right" : "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Logo size={30} variant="dark" />
                <span style={{ fontSize: 11, color: COLORS.inkSoft }}>{t("bookingRef")}</span>
              </div>
              <div className="nasq-mono" style={{ fontSize: 22, fontWeight: 700, color: COLORS.ink, letterSpacing: 2, margin: "6px 0 14px" }} dir="ltr">{pnr}</div>
              <Perforation />
              {service === "flights" ? (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="nasq-mono" style={{ fontWeight: 700 }}>{from?.k}</div>
                  <Plane size={16} color={COLORS.inkSoft} style={{ transform: dir === "rtl" ? "scaleX(-1)" : "none" }} />
                  <div className="nasq-mono" style={{ fontWeight: 700 }}>{to?.k}</div>
                </div>
              ) : (
                <div style={{ fontWeight: 700, fontSize: 14 }}>{hotelCity && (lang === "ar" ? hotelCity.a : hotelCity.e)}</div>
              )}
              <div style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 8 }}>{paxSummary()}</div>
            </TicketCard>

            <div style={{ width: "100%", marginTop: 22 }}>
              <PrimaryButton onClick={() => { setScreen("home"); setSelectedResult(null); }}>{t("backHome")}</PrimaryButton>
            </div>
          </div>
        )}

        {/* ===== CITY PICKER SHEET ===== */}
        {pickerFor && <CityPickerSheet lang={lang} t={t} dir={dir} onClose={() => setPickerFor(null)} onPick={pickCity} />}

        {/* ===== PASSENGER / GUEST SHEET ===== */}
        {showPax && (
          <Sheet title={service === "flights" ? t("passengers") : t("travelers")} onClose={() => setShowPax(false)}>
            {service === "flights" ? (
              <>
                <PaxRow label={t("adults")} sub={t("adultsSub")} value={pax.adults} min={1} max={9} onChange={(v) => setPax({ ...pax, adults: v, infants: Math.min(pax.infants, v) })} />
                <PaxRow label={t("children")} sub={t("childrenSub")} value={pax.children} min={0} max={8} onChange={(v) => setPax({ ...pax, children: v })} />
                <PaxRow label={t("infants")} sub={t("infantsSub")} value={pax.infants} min={0} max={pax.adults} onChange={(v) => setPax({ ...pax, infants: v })} />
              </>
            ) : (
              <>
                <PaxRow label={t("adults")} sub={t("adultsSub")} value={guests.adults} min={1} max={12} onChange={(v) => setGuests({ ...guests, adults: v })} />
                <PaxRow label={t("children")} sub={t("childrenSub")} value={guests.children} min={0} max={8} onChange={(v) => setGuests({ ...guests, children: v })} />
                <PaxRow label={t("rooms")} sub="" value={guests.rooms} min={1} max={6} onChange={(v) => setGuests({ ...guests, rooms: v })} />
              </>
            )}
            <div style={{ marginTop: 8 }}>
              <PrimaryButton onClick={() => setShowPax(false)}>{t("done")}</PrimaryButton>
            </div>
          </Sheet>
        )}

        {/* ===== LANGUAGE SHEET ===== */}
        {showLang && (
          <Sheet title={t("selectLanguage")} onClose={() => setShowLang(false)}>
            <p style={{ fontSize: 12.5, color: COLORS.inkSoft, margin: "0 0 14px", lineHeight: 1.6 }}>{t("languageNote")}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: "52vh", overflowY: "auto" }}>
              {LANGUAGES.map((l) => (
                <button key={l.code} onClick={() => { if (l.code === "ar" || l.code === "en") setLang(l.code); setLangLabel(l); setShowLang(false); }}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: (lang === l.code) ? COLORS.ink : COLORS.white, color: (lang === l.code) ? COLORS.parchment : COLORS.ink, border: `1px solid ${COLORS.parchmentDeep}`, borderRadius: 12, padding: "11px 14px", cursor: "pointer", fontSize: 14 }}>
                  <span style={{ fontWeight: 600 }}>{lang === "ar" ? l.a : l.e}</span>
                  <span style={{ fontSize: 11.5, opacity: 0.7 }}>{lang === "ar" ? l.e : l.a}</span>
                </button>
              ))}
            </div>
          </Sheet>
        )}
      </div>
    </div>
  );
}

function PaxRow({ label, sub, value, min, max, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${COLORS.parchmentDeep}` }}>
      <div>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: COLORS.ink }}>{label}</div>
        {sub && <div style={{ fontSize: 11.5, color: COLORS.inkSoft }}>{sub}</div>}
      </div>
      <Stepper value={value} min={min} max={max} onChange={onChange} />
    </div>
  );
}

function CityPickerSheet({ lang, t, dir, onClose, onPick }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return FLAT_CITIES;
    return FLAT_CITIES.filter((c) => c.a.includes(q) || c.e.toLowerCase().includes(query) || c.country.includes(q) || c.countryEn.toLowerCase().includes(query) || c.k.toLowerCase().includes(query));
  }, [q]);

  return (
    <Sheet title={t("selectCity")} onClose={onClose}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.white, border: `1.4px solid ${COLORS.parchmentDeep}`, borderRadius: 12, padding: "10px 12px", marginBottom: 12 }}>
        <Search size={16} color={COLORS.inkSoft} />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchCityPlaceholder")} style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: 14 }} />
      </div>
      <div style={{ maxHeight: "56vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
        {filtered.length === 0 && <div style={{ textAlign: "center", color: COLORS.inkSoft, fontSize: 13, padding: "20px 0" }}>{t("noResults")}</div>}
        {filtered.slice(0, 200).map((c, i) => (
          <button key={i} onClick={() => onPick(c)} style={{ display: "flex", alignItems: "center", gap: 12, background: "transparent", border: "none", borderBottom: `1px solid ${COLORS.parchmentDeep}`, padding: "11px 4px", cursor: "pointer", textAlign: dir === "rtl" ? "right" : "left" }}>
            <div className="nasq-mono" style={{ width: 40, height: 40, borderRadius: "50%", background: COLORS.parchmentDeep, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: COLORS.ink, flexShrink: 0 }}>{c.k}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{lang === "ar" ? c.a : c.e}</div>
              <div style={{ fontSize: 12, color: COLORS.inkSoft }}>{lang === "ar" ? c.country : c.countryEn}</div>
            </div>
          </button>
        ))}
      </div>
    </Sheet>
  );
}
