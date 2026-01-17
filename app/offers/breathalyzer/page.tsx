// @ts-nocheck
'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Star, 
  ExternalLink, 
  Box, 
  TrendingUp,
  LayoutGrid,
  List,
  ChevronRight,
  ShieldCheck,
  BadgePercent,
  Scale
} from 'lucide-react';

// Affiliate-ready product data extracted and deduplicated from the source
const rawData = [
  { id: "B0FRFFMRS5", title: "Breathalyzer, 2026 Upgraded Professional-Grade Accuracy", price: 24.99, rating: 3.6, reviews: 34, rank: 31918, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/51ERylzvPIL._AC_UL320_.jpg", opportunity: 44.31, weight: "0.15 lbs", dimensions: "4.8 x 3.19 x 1.26 inches", shipsBy: "FBM" },
  { id: "B00LVOU27U", title: "BACtrack Go Keychain Breathalyzer (White)", price: 36.99, rating: 3.7, reviews: 66, rank: 11108, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61dvV4fb-zL._AC_UL320_.jpg", opportunity: 46.96, weight: "0.13 lbs", dimensions: "1.45 x 0.55 x 2.4 inches", shipsBy: "FBM" },
  { id: "B0G4TSNJF3", title: "FluxAxis Breathalyzer, Advanced High-Accuracy Personal", price: 29.99, rating: 3.8, reviews: 16, rank: 62177, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/51+e4918F0L._AC_UL320_.jpg", opportunity: 39.11, weight: "0.24 lbs", dimensions: "6.06 x 4.92 x 1.26 inches", shipsBy: "FBM" },
  { id: "B0026IBZSK", title: "BACtrack S80 Breathalyzer Professional-Grade", price: 129.99, rating: 4.3, reviews: 81, rank: 8182, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61SbonJ4WfL._AC_UL320_.jpg", opportunity: 52.96, weight: "0.35 lbs", dimensions: "2.32 x 1.06 x 4.56 inches", shipsBy: "FBA" },
  { id: "B079XXNBF3", title: "BACtrack C6 Keychain Breathalyzer Smartphone Sync", price: 69.99, rating: 4.1, reviews: 67, rank: 9678, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61+hGvBCZ7L._AC_UL320_.jpg", opportunity: 48.99, weight: "0.13 lbs", dimensions: "2.21 x 0.66 x 1.88 inches", shipsBy: "FBM" },
  { id: "B0G5P46T67", title: "Breathalyzer with LCD Display Portable (12 Mouthpieces)", price: 23.99, rating: 3.0, reviews: 3, rank: 71382, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61X2ddTGRqL._AC_UL320_.jpg", opportunity: 40.71, weight: "0.15 lbs", dimensions: "5.08 x 3.15 x 1.22 inches", shipsBy: "FBM" },
  { id: "B07CKXQ5L5", title: "BACtrack C8 Breathalyzer Police-Grade", price: 89.99, rating: 4.2, reviews: 36, rank: 16081, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61jMmSTXxQL._AC_UL320_.jpg", opportunity: 43.86, weight: "0.13 lbs", dimensions: "2.5 x 0.66 x 2.2 inches", shipsBy: "FBM" },
  { id: "B0G64L56XT", title: "2026 Upgraded Breathalyzer with 10 Mouthpieces", price: 39.99, rating: 5.0, reviews: 33, rank: 21293, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/617K0iccGoL._AC_UL320_.jpg", opportunity: 46.13, weight: "0.37 lbs", dimensions: "6.22 x 5.71 x 1.93 inches", shipsBy: "FBM" },
  { id: "B0DL9V5ZH2", title: "Breathalyzer Keychain, Professional High Accuracy", price: 19.99, rating: 3.9, reviews: 135, rank: 0, category: "All Departments", img: "http://ecx.images-amazon.com/images/I/61ZydydRpAL._AC_UL320_.jpg", opportunity: 46.42, weight: "0.11 lbs", dimensions: "3.74 x 2.6 x 1.65 inches", shipsBy: "FBM" },
  { id: "B0G5YNRK4B", title: "Breathalyzer for Alcohol with LCD Digital Display", price: 39.99, rating: 5.0, reviews: 12, rank: 56239, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61OOjOBmy4L._AC_UL320_.jpg", opportunity: 43.91, weight: "0.42 lbs", dimensions: "6.14 x 3.39 x 1.46 inches", shipsBy: "FBM" },
  { id: "B00EAHJQTA", title: "GREENWON Battery Powered Breathalyzer Keychain", price: 23.99, rating: 3.5, reviews: 1, rank: 97803, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/51MGaNtlSiL._AC_UL320_.jpg", opportunity: 42.12, weight: "0.18 lbs", dimensions: "1.96 x 1.06 x 4.33 inches", shipsBy: "FBM" },
  { id: "B006536ZXC", title: "BACtrack Keychain Breathalyzer (Black)", price: 39.99, rating: 3.7, reviews: 49, rank: 24473, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/611IZaa-EDL._AC_UL320_.jpg", opportunity: 30.88, weight: "0.20 lbs", dimensions: "6 x 1.25 x 8.25 inches", shipsBy: "FBM" },
  { id: "B0D3GVFGCP", title: "AssuTest 25 Tests Single-Use Disposable Analyzer", price: 42.99, rating: 4.2, reviews: 33, rank: 125766, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/71WUll-ep5L._AC_UL320_.jpg", opportunity: 42.45, weight: "0.55 lbs", dimensions: "6.65 x 4.65 x 4.61 inches", shipsBy: "FBM" },
  { id: "B01MSPJXF4", title: "BACtrack Go Keychain Breathalyzer (Black)", price: 39.99, rating: 3.7, reviews: 66, rank: 11104, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/71PwjVuN3BL._AC_UL320_.jpg", opportunity: 46.08, weight: "0.25 lbs", dimensions: "2.4 x 0.55 x 1.45 inches", shipsBy: "FBM" },
  { id: "B0G3WNF5K4", title: "Alcohol Tester With LED Digital Display (Car Use)", price: 12.99, rating: 3.4, reviews: 3, rank: 126825, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/517Ow765RvL._AC_UL320_.jpg", opportunity: 35.29, weight: "0.12 lbs", dimensions: "4.72 x 3.15 x 1.18 inches", shipsBy: "FBM" },
  { id: "B078SRVQH1", title: "BACtrack Scout Breathalyzer Professional Accuracy", price: 84.99, rating: 4.1, reviews: 12, rank: 42975, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/51+XLucF3bL._AC_UL320_.jpg", opportunity: 40.97, weight: "0.19 lbs", dimensions: "1.87 x 0.63 x 4.25 inches", shipsBy: "FBM" },
  { id: "B01DZ0B5GE", title: "BACtrack Keychain Breathalyzer (Pink)", price: 39.99, rating: 3.6, reviews: 11, rank: 24470, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61+LLLwrpCL._AC_UL320_.jpg", opportunity: 37.89, weight: "0.18 lbs", dimensions: "1.45 x 0.55 x 2.44 inches", shipsBy: "FBM" },
  { id: "B015X6R9H2", title: "BREATHALYSER Plus (Pet Oral Health)", price: 21.90, rating: 4.4, reviews: 204, rank: 35931, category: "Pet Supplies", img: "http://ecx.images-amazon.com/images/I/81qhGrKD6yL._AC_UL320_.jpg", opportunity: 54.74, weight: "1.00 lbs", dimensions: "6.2 x 3 x 2.8 inches", shipsBy: "AMZ" },
  { id: "B0G4HJFTKH", title: "Breathalyzer with 15 Mouthpieces & Carrying Bag", price: 39.98, rating: 5.0, reviews: 3, rank: 132190, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/71mgEH-u5pL._AC_UL320_.jpg", opportunity: 42.46, weight: "0.26 lbs", dimensions: "4.33 x 2.76 x 1.57 inches", shipsBy: "FBM" },
  { id: "B00BPWWIDE", title: "BACtrack Keychain Breathalyzer (Blue)", price: 39.99, rating: 3.9, reviews: 14, rank: 24473, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61QoJjo8NrL._AC_UL320_.jpg", opportunity: 39.44, weight: "0.18 lbs", dimensions: "1.45 x 0.55 x 2.44 inches", shipsBy: "FBM" },
  { id: "B00R2X59A4", title: "BACtrack Trace Professional Breathalyzer", price: 99.99, rating: 4.3, reviews: 2, rank: 40651, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61ewx8DBqNL._AC_UL320_.jpg", opportunity: 39.81, weight: "0.19 lbs", dimensions: "4.25 x 1.87 x 0.63 inches", shipsBy: "FBM" },
  { id: "B06ZYG3V9N", title: "BACtrack Professional Mouthpieces (20 Count)", price: 14.99, rating: 4.5, reviews: 18, rank: 20336, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61eDd3YF0SL._AC_UL320_.jpg", opportunity: 42.32, weight: "0.13 lbs", dimensions: "3 x 1.5 x 6 inches", shipsBy: "FBM" },
  { id: "B0FZ9BRW4L", title: "Breathalyzer, Alcohol Tester with Fuel Cell Sensor", price: 29.99, rating: 3.8, reviews: 8, rank: 167005, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/71OkgYRx7yL._AC_UL320_.jpg", opportunity: 38.03, weight: "0.49 lbs", dimensions: "6.26 x 3.39 x 1.93 inches", shipsBy: "FBM" },
  { id: "B07RZ5NPRD", title: "BACtrack C6 Keychain Breathalyzer (2 Pack)", price: 132.99, rating: 4.1, reviews: 67, rank: 9678, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61f+5AsgFuL._AC_UL320_.jpg", opportunity: 49.43, weight: "0.60 lbs", dimensions: "7.64 x 3.94 x 2.64 inches", shipsBy: "FBM" },
  { id: "B0G1RVZ5W3", title: "Portable Breathealyzer to Test Alcohol (10 Mouthpieces)", price: 39.99, rating: 3.6, reviews: 11, rank: 301187, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61aJZVyeeoL._AC_UL320_.jpg", opportunity: 36.51, weight: "0.20 lbs", dimensions: "6.57 x 3.58 x 1.02 inches", shipsBy: "FBM" },
  { id: "B07PY5VKXM", title: "iSOBER Mouthpiece MP1000 (20pcs / Pack)", price: 9.99, rating: 4.1, reviews: 71, rank: 143491, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/71sFbUtT64L._AC_UL320_.jpg", opportunity: 30.26, weight: "0.07 lbs", dimensions: "N/A", shipsBy: "FBM" },
  { id: "B07PJ29332", title: "120 Pieces Breathalyzer Mouthpieces for S-75-80", price: 39.89, rating: 4.8, reviews: 233, rank: 58524, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/515yNqlS0TL._AC_UL320_.jpg", opportunity: 48.02, weight: "0.46 lbs", dimensions: "8.66 x 6.02 x 1.57 inches", shipsBy: "FBM" },
  { id: "B0DXN78MNQ", title: "Tyenaza Breath Alcohol Tester, Black Portable", price: 13.29, rating: 0, reviews: 0, rank: 352436, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/51L4ozepXyL._AC_UL320_.jpg", opportunity: 30.16, weight: "0.19 lbs", dimensions: "5.91 x 4.33 x 1.57 inches", shipsBy: "FBM" },
  { id: "B0G5PNX874", title: "Breathalyzer with LCD Display (12 Replaceable)", price: 23.99, rating: 5.0, reviews: 1, rank: 144260, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61bc+F8FneL._AC_UL320_.jpg", opportunity: 47.10, weight: "0.15 lbs", dimensions: "4.96 x 3.11 x 1.26 inches", shipsBy: "FBM" },
  { id: "B004U48FEK", title: "BACtrack Element Professional Breathalyzer", price: 84.99, rating: 4.2, reviews: 19, rank: 27842, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/616tr1F-f3L._AC_UL320_.jpg", opportunity: 40.97, weight: "0.00 lbs", dimensions: "2 x 0.75 x 4.75 inches", shipsBy: "FBM" },
  { id: "B0DYDB3Q2M", title: "150 Pack Individually Packaged Mouthpieces", price: 40.99, rating: 4.1, reviews: 11, rank: 100126, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61YtzfUshVL._AC_UL320_.jpg", opportunity: 40.23, weight: "0.82 lbs", dimensions: "9.25 x 5.98 x 4.49 inches", shipsBy: "FBM" },
  { id: "B0BVFTGJRH", title: "150 Pcs Breathalyzer Mouthpieces Compatible S-80/75", price: 46.99, rating: 4.7, reviews: 31, rank: 100073, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/51nlzSlb9IL._AC_UL320_.jpg", opportunity: 44.51, weight: "0.60 lbs", dimensions: "8.27 x 5.12 x 1.57 inches", shipsBy: "FBM" },
  { id: "B07PDVCFBY", title: "50 Pcs Professional Breathalyzer Mouthpieces", price: 19.99, rating: 4.3, reviews: 105, rank: 151667, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/515yNqlS0TL._AC_UL320_.jpg", opportunity: 52.47, weight: "0.20 lbs", dimensions: "5.59 x 3.9 x 1.46 inches", shipsBy: "FBM" },
  { id: "B0G1YGF6J9", title: "Fuel Cell Breathalyzer for Alcohol (Black 2)", price: 57.99, rating: 2.0, reviews: 3, rank: 407672, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61blIJw29gL._AC_UL320_.jpg", opportunity: 32.88, weight: "0.48 lbs", dimensions: "6.57 x 4.92 x 2.32 inches", shipsBy: "FBM" },
  { id: "B0FSZ5CGG8", title: "Portable BAC Device with 20 Mouthpieces Accurate", price: 39.99, rating: 5.0, reviews: 5, rank: 55313, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/71pR-2tGD2L._AC_UL320_.jpg", opportunity: 44.03, weight: "0.24 lbs", dimensions: "6.46 x 2.87 x 1.34 inches", shipsBy: "FBM" },
  { id: "B0FH63DM5Z", title: "Homealexa Portable Breath Alcohol Monitor", price: 31.99, rating: 4.6, reviews: 28, rank: 52095, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61zXhScAgvL._AC_UL320_.jpg", opportunity: 43.86, weight: "0.42 lbs", dimensions: "8.46 x 4.09 x 1.46 inches", shipsBy: "FBM" },
  { id: "B0F5PKQ97K", title: "Breathalyzer Mouthpieces (10-Pack) Compatible S75/S80", price: 8.99, rating: 4.3, reviews: 24, rank: 137025, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/51WNwLdGDVL._AC_UL320_.jpg", opportunity: 39.43, weight: "0.07 lbs", dimensions: "5.94 x 3.54 x 1.57 inches", shipsBy: "FBM" },
  { id: "B0G23N166R", title: "High-Precision Alcohol Tester with USB Charging", price: 39.99, rating: 5.0, reviews: 2, rank: 254063, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/71YhohaiE9L._AC_UL320_.jpg", opportunity: 42.16, weight: "0.68 lbs", dimensions: "6.18 x 3.43 x 2.01 inches", shipsBy: "FBM" },
  { id: "B07S1XBJ4W", title: "Professional Digital Ketone Breathalyzer", price: 35.99, rating: 3.4, reviews: 93, rank: 281116, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/51DOW-6pC2L._AC_UL320_.jpg", opportunity: 41.02, weight: "0.24 lbs", dimensions: "6.14 x 3.94 x 1.65 inches", shipsBy: "FBM" },
  { id: "B09TR5FDWC", title: "800 Pieces Professional Mouthpieces Compatible S-75-80", price: 209.99, rating: 4.1, reviews: 16, rank: 189920, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/41zxTV+imBL._AC_UL320_.jpg", opportunity: 42.52, weight: "3.15 lbs", dimensions: "12.99 x 8.66 x 3.94 inches", shipsBy: "FBM" },
  { id: "B00CFN1HNY", title: "BACtrack Mobile Smartphone Breathalyzer", price: 99.99, rating: 4.0, reviews: 15, rank: 82255, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/610FbZRjA8L._AC_UL320_.jpg", opportunity: 39.59, weight: "0.13 lbs", dimensions: "1.75 x 0.63 x 2.75 inches", shipsBy: "FBM" },
  { id: "B07VHHPKGW", title: "iSOBER 10 Breathalyzer Fuel Cell Sensor", price: 99.99, rating: 4.3, reviews: 218, rank: 186672, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/81MeikaCNUL._AC_UL320_.jpg", opportunity: 44.13, weight: "0.35 lbs", dimensions: "4.1 x 2.1 x 0.7 inches", shipsBy: "FBM" },
  { id: "B0G63VLYTN", title: "YYBNN Breathalyzer LCD Digital Display", price: 29.99, rating: 5.0, reviews: 12, rank: 47524, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61aJZVyeeoL._AC_UL320_.jpg", opportunity: 43.72, weight: "0.18 lbs", dimensions: "6.46 x 3.58 x 1.02 inches", shipsBy: "FBM" },
  { id: "B0G1BKHHZB", title: "USB Rechargeable Digital TFT Display Tester", price: 45.99, rating: 5.0, reviews: 3, rank: 317148, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61yCbwGhzCL._AC_UL320_.jpg", opportunity: 41.76, weight: "0.50 lbs", dimensions: "15 x 11 x 5 inches", shipsBy: "FBM" },
  { id: "B0D62G2NCJ", title: "Party Gifts Portable Breathalyzer Alcohol Tester", price: 14.63, rating: 3.6, reviews: 34, rank: 315206, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/51fxtXCpYoL._AC_UL320_.jpg", opportunity: 38.55, weight: "0.13 lbs", dimensions: "5.28 x 3.62 x 1.14 inches", shipsBy: "FBM" },
  { id: "B0FRG1M9D5", title: "Breathalyzer Non-Contact High-Precision Display", price: 29.90, rating: 5.0, reviews: 1, rank: 241044, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61Urae4+RkL._AC_UL320_.jpg", opportunity: 41.65, weight: "0.11 lbs", dimensions: "1.1 x 1 x 3.54 inches", shipsBy: "FBM" },
  { id: "B07B9N7J84", title: "JASTEK 30 Pieces Mouthpieces only JS/JA", price: 15.76, rating: 4.0, reviews: 57, rank: 287054, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61Qq4H17VcL._AC_UL320_.jpg", opportunity: 53.95, weight: "0.13 lbs", dimensions: "5.2 x 3.66 x 1.42 inches", shipsBy: "FBM" },
  { id: "B08GX2GJ9N", title: "[Know Your Limit] ALCO9 TX6010L Professional", price: 49.99, rating: 4.0, reviews: 58, rank: 457151, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/51Nb7o0sUvL._AC_UL320_.jpg", opportunity: 42.34, weight: "0.26 lbs", dimensions: "2.55 x 1.49 x 4.92 inches", shipsBy: "FBM" },
  { id: "B0F66P55V9", title: "Portable Breathalyzer Keychain Sobriety Reminder", price: 69.99, rating: 4.3, reviews: 28, rank: 167193, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/71Se5PbFnjL._AC_UL320_.jpg", opportunity: 41.92, weight: "0.33 lbs", dimensions: "6.42 x 3.23 x 1.65 inches", shipsBy: "FBM" },
  { id: "B0FY37G7DQ", title: "400 Pcs Hygienic Reusable Plastic Tips", price: 114.99, rating: 5.0, reviews: 11, rank: 244349, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/51O6KJqApHL._AC_UL320_.jpg", opportunity: 44.00, weight: "1.61 lbs", dimensions: "11.02 x 5.51 x 2.76 inches", shipsBy: "FBM" },
];

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('opportunity');
  const [sortOrder, setSortOrder] = useState('desc');

  // Process data: unique by ASIN, search filter, and default sort by Opportunity Score
  const products = useMemo(() => {
    const uniqueMap = new Map();
    rawData.forEach(item => {
      if (!uniqueMap.has(item.id)) uniqueMap.set(item.id, item);
    });
    
    let list = Array.from(uniqueMap.values());

    if (searchTerm) {
      list = list.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    list.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (sortOrder === 'asc') return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

    return list;
  }, [searchTerm, sortBy, sortOrder]);

  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  // Helper to construct Amazon URL with provided affiliate tag
  const getAffiliateUrl = (id) => `http://www.amazon.com/dp/${id}/?tag=weightlo0f57d-20`;

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
                <ShieldCheck className="text-white w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-neutral-950 uppercase">0.8 Breathalyzer</h1>
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  Premium Product Selections
                </div>
              </div>
            </div>

            <div className="flex flex-1 max-w-lg items-center relative">
              <Search className="absolute left-4 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search premium products..."
                className="w-full pl-11 pr-4 py-3 bg-neutral-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-xl">
              <button 
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
              >
                <LayoutGrid className="w-4 h-4" /> Grid
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
              >
                <List className="w-4 h-4" /> List
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Market Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              { label: 'Verified Unique Listings', value: products.length, icon: Box, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Highest Product Rating', value: '5.0 ★', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-neutral-200 flex items-center gap-5 shadow-sm">
                <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-black text-neutral-900">{stat.value}</p>
                </div>
              </div>
            ))}
        </div>

        {/* Sort controls */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4 px-2">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0">
            <span className="text-xs font-black text-neutral-400 uppercase whitespace-nowrap">Order By:</span>
            <button 
              onClick={() => toggleSort('opportunity')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black border transition-all whitespace-nowrap ${sortBy === 'opportunity' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}
            >
              <BadgePercent className="w-3.5 h-3.5" /> Best Deal {sortBy === 'opportunity' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              onClick={() => toggleSort('price')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black border transition-all whitespace-nowrap ${sortBy === 'price' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}
            >
              Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              onClick={() => toggleSort('rating')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black border transition-all whitespace-nowrap ${sortBy === 'rating' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}
            >
              Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>

        {/* Product Grid View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group bg-white rounded-[2.5rem] border border-neutral-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col">
                {/* Clickable Image Section */}
                <a 
                  href={getAffiliateUrl(product.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-[4/3] overflow-hidden bg-white p-8 flex items-center justify-center cursor-pointer"
                >
                  <img 
                    src={product.img} 
                    alt={product.title} 
                    className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/320?text=Product+Image"; }}
                  />
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="bg-neutral-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-widest shadow-lg">
                      {product.shipsBy}
                    </span>
                  </div>
                </a>
                
                <div className="px-8 pb-8 flex flex-col flex-1">
                  <div className="mb-4">
                    {/* Clickable Title */}
                    <a 
                      href={getAffiliateUrl(product.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:text-indigo-600 transition-colors"
                    >
                      <h3 className="text-lg font-black text-neutral-950 line-clamp-2 min-h-[3.5rem] leading-tight">
                        {product.title}
                      </h3>
                    </a>
                  </div>

                  <div className="flex items-center justify-between mb-6 bg-neutral-50 p-4 rounded-3xl">
                    <div className="flex items-center gap-1.5">
                      <Star className={`w-4 h-4 ${product.rating > 0 ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`} />
                      <span className="text-sm font-black text-neutral-900">{product.rating > 0 ? product.rating : 'N/A'}</span>
                    </div>
                    <div className="text-[11px] text-neutral-400 font-bold uppercase tracking-tighter">
                      {product.reviews} Verification Reviews
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest block mb-1">Price</span>
                      <span className="text-3xl font-black text-neutral-950 tracking-tight">${product.price}</span>
                    </div>
                    <a 
                      href={getAffiliateUrl(product.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-indigo-600 hover:bg-neutral-950 text-white p-4 rounded-2xl transition-all shadow-xl shadow-indigo-100 hover:shadow-indigo-200 active:scale-90"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Product List View */
          <div className="bg-white rounded-[3rem] border border-neutral-200 overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-neutral-950 border-b border-neutral-800">
                <tr className="text-[10px] uppercase tracking-[0.2em] font-black text-neutral-400">
                  <th className="px-8 py-6">Product Overview</th>
                  <th className="px-8 py-6 hidden md:table-cell">Rating</th>
                  <th className="px-8 py-6 hidden lg:table-cell">Physical Specs</th>
                  <th className="px-8 py-6 text-right">Market Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-6">
                        <a 
                          href={getAffiliateUrl(product.id)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="relative flex-shrink-0"
                        >
                          <img 
                            src={product.img} 
                            className="w-16 h-16 object-contain bg-white rounded-2xl border border-neutral-200 p-2 shadow-sm group-hover:scale-110 transition-transform"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/64?text=Img"; }}
                          />
                        </a>
                        <div className="max-w-md">
                          <a 
                            href={getAffiliateUrl(product.id)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block text-sm font-black text-neutral-900 group-hover:text-indigo-600 transition-colors line-clamp-1"
                          >
                            {product.title}
                          </a>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[9px] bg-neutral-900 px-2 py-0.5 rounded text-white font-black uppercase tracking-tighter">{product.shipsBy}</span>
                            <span className="text-[9px] bg-indigo-50 px-2 py-0.5 rounded text-indigo-600 font-black uppercase tracking-tighter">{product.category}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 hidden md:table-cell">
                      <div className="bg-amber-50 px-3 py-2 rounded-xl border border-amber-100 w-fit">
                        <div className="flex items-center text-amber-500">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs font-black ml-1 text-neutral-900">{product.rating > 0 ? product.rating : '-'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 hidden lg:table-cell">
                      <div className="space-y-1.5 text-[11px] text-neutral-500 font-bold uppercase tracking-tight">
                        <p className="flex items-center gap-2 text-neutral-800"><Box className="w-3.5 h-3.5 text-neutral-300" /> {product.dimensions}</p>
                        <p className="flex items-center gap-2 text-neutral-400"><Scale className="w-3.5 h-3.5 text-neutral-200" /> {product.weight}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-6">
                        <div className="text-right">
                          <span className="text-2xl font-black text-neutral-950">${product.price}</span>
                        </div>
                        <a 
                          href={getAffiliateUrl(product.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-neutral-950 text-white p-3 rounded-2xl transition-all shadow-lg hover:bg-indigo-600 active:scale-90"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Simplified Branding Footer */}
      <footer className="bg-neutral-950 text-neutral-400 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex items-center gap-3">
             <div className="bg-white/10 p-2 rounded-lg">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <span className="text-white font-black uppercase tracking-[0.3em]">0.8 Breathalyzer</span>
          </div>
          <div className="text-sm font-black uppercase tracking-widest text-neutral-400">
            Kathleen Heals - © 2026
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;