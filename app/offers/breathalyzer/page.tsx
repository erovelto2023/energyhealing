// @ts-nocheck
'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Star,
  ExternalLink,
  Box,
  Scale,
  TrendingUp,
  LayoutGrid,
  List,
  ChevronRight,
  ShoppingCart
} from 'lucide-react';

const rawData = [
  { id: "B0026IBZSK", title: "BACtrack S80 Breathalyzer", price: 129.99, rating: 4.3, reviews: 81, rank: 8182, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61SbonJ4WfL._AC_UL320_.jpg", opportunity: 52.96, weight: "0.35 lbs", dimensions: "2.32 x 1.06 x 4.56 inches", shipsBy: "FBA" },
  { id: "B079XXNBF3", title: "BACtrack C6 Keychain Breathalyzer", price: 69.99, rating: 4.1, reviews: 67, rank: 9837, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61+hGvBCZ7L._AC_UL320_.jpg", opportunity: 48.84, weight: "0.13 lbs", dimensions: "2.21 x 0.66 x 1.88 inches", shipsBy: "FBM" },
  { id: "B078SRVQH1", title: "BACtrack Scout Breathalyzer", price: 84.99, rating: 4.1, reviews: 12, rank: 39419, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/51+XLucF3bL._AC_UL320_.jpg", opportunity: 40.99, weight: "0.19 lbs", dimensions: "1.87 x 0.63 x 4.25 inches", shipsBy: "FBM" },
  { id: "B06ZYG3V9N", title: "BACtrack Professional Mouthpieces (20 Count)", price: 14.99, rating: 4.5, reviews: 18, rank: 20336, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61eDd3YF0SL._AC_UL320_.jpg", opportunity: 42.32, weight: "0.13 lbs", dimensions: "3 x 1.5 x 6 inches", shipsBy: "FBM" },
  { id: "B0FRFFMRS5", title: "Breathalyzer, 2026 Upgraded Professional-Grade", price: 24.99, rating: 3.6, reviews: 34, rank: 31918, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/51ERylzvPIL._AC_UL320_.jpg", opportunity: 44.31, weight: "0.15 lbs", dimensions: "4.8 x 3.19 x 1.26 inches", shipsBy: "FBM" },
  { id: "B00LVOU27U", title: "BACtrack Go Keychain Breathalyzer (White)", price: 36.99, rating: 3.7, reviews: 66, rank: 11104, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61dvV4fb-zL._AC_UL320_.jpg", opportunity: 46.97, weight: "0.13 lbs", dimensions: "1.45 x 0.55 x 2.4 inches", shipsBy: "FBM" },
  { id: "B0G4TSNJF3", title: "FluxAxis Breathalyzer, Advanced High-Accuracy", price: 29.99, rating: 3.8, reviews: 16, rank: 49346, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/51+e4918F0L._AC_UL320_.jpg", opportunity: 39.17, weight: "0.24 lbs", dimensions: "6.06 x 4.92 x 1.26 inches", shipsBy: "FBM" },
  { id: "B0G5P46T67", title: "Breathalyzer with LCD Display Portable", price: 23.99, rating: 3.0, reviews: 3, rank: 61689, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61X2ddTGRqL._AC_UL320_.jpg", opportunity: 40.76, weight: "0.15 lbs", dimensions: "5.08 x 3.15 x 1.22 inches", shipsBy: "FBM" },
  { id: "B07CKXQ5L5", title: "BACtrack C8 Breathalyzer", price: 89.99, rating: 4.2, reviews: 36, rank: 16081, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61jMmSTXxQL._AC_UL320_.jpg", opportunity: 43.86, weight: "0.13 lbs", dimensions: "2.5 x 0.66 x 2.2 inches", shipsBy: "FBM" },
  { id: "B0G64L56XT", title: "2026 Upgraded Breathalyzer with Carrying Case", price: 39.99, rating: 5.0, reviews: 33, rank: 21733, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/617K0iccGoL._AC_UL320_.jpg", opportunity: 46.13, weight: "0.37 lbs", dimensions: "6.22 x 5.71 x 1.93 inches", shipsBy: "FBM" },
  { id: "B0DL9V5ZH2", title: "Breathalyzer Keychain, Professional-Grade Accuracy", price: 19.99, rating: 3.9, reviews: 135, rank: 0, category: "All Departments", img: "http://ecx.images-amazon.com/images/I/61ZydydRpAL._AC_UL320_.jpg", opportunity: 46.42, weight: "0.11 lbs", dimensions: "3.74 x 2.6 x 1.65 inches", shipsBy: "FBM" },
  { id: "B0G5YNRK4B", title: "Breathalyzer with LCD Digital Display", price: 39.99, rating: 5.0, reviews: 12, rank: 88953, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61OOjOBmy4L._AC_UL320_.jpg", opportunity: 43.74, weight: "0.42 lbs", dimensions: "6.14 x 3.39 x 1.46 inches", shipsBy: "FBM" },
  { id: "B00EAHJQTA", title: "GREENWON Battery Powered Breathalyzer", price: 23.99, rating: 3.5, reviews: 1, rank: 97803, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/51MGaNtlSiL._AC_UL320_.jpg", opportunity: 42.12, weight: "0.18 lbs", dimensions: "1.96 x 1.06 x 4.33 inches", shipsBy: "FBM" },
  { id: "B006536ZXC", title: "BACtrack Keychain Breathalyzer (Black)", price: 39.99, rating: 3.7, reviews: 49, rank: 24565, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/611IZaa-EDL._AC_UL320_.jpg", opportunity: 30.88, weight: "0.20 lbs", dimensions: "6 x 1.25 x 8.25 inches", shipsBy: "FBM" },
  { id: "B0D3GVFGCP", title: "AssuTest 25 Tests Single-Use Disposable", price: 42.99, rating: 4.2, reviews: 33, rank: 125766, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/71WUll-ep5L._AC_UL320_.jpg", opportunity: 42.45, weight: "0.55 lbs", dimensions: "6.65 x 4.65 x 4.61 inches", shipsBy: "FBM" },
  { id: "B01MSPJXF4", title: "BACtrack Go Keychain Breathalyzer (Black)", price: 39.99, rating: 3.7, reviews: 66, rank: 10699, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/71PwjVuN3BL._AC_UL320_.jpg", opportunity: 46.47, weight: "0.25 lbs", dimensions: "2.4 x 0.55 x 1.45 inches", shipsBy: "FBM" },
  { id: "B0G3WNF5K4", title: "Alcohol Tester With LED Digital Display", price: 12.99, rating: 3.4, reviews: 3, rank: 123934, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/517Ow765RvL._AC_UL320_.jpg", opportunity: 35.30, weight: "0.12 lbs", dimensions: "4.72 x 3.15 x 1.18 inches", shipsBy: "FBM" },
  { id: "B0FY37G7DQ", title: "400 Pcs Breathalyzer Mouthpieces", price: 114.99, rating: 5.0, reviews: 11, rank: 199552, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/51O6KJqApHL._AC_UL320_.jpg", opportunity: 44.23, weight: "1.61 lbs", dimensions: "11.02 x 5.51 x 2.76 inches", shipsBy: "FBM" },
  { id: "B07MWZSX38", title: "iSOBER30 Breathalyzer", price: 79.99, rating: 3.7, reviews: 158, rank: 469873, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/81Co10QK7vL._AC_UL320_.jpg", opportunity: 40.97, weight: "0.15 lbs", dimensions: "3.94 x 1.73 x 0.59 inches", shipsBy: "FBM" },
  { id: "B01DZ0B5GE", title: "BACtrack Keychain Breathalyzer (Pink)", price: 39.99, rating: 3.6, reviews: 11, rank: 24470, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61+LLLwrpCL._AC_UL320_.jpg", opportunity: 37.89, weight: "0.18 lbs", dimensions: "1.45 x 0.55 x 2.44 inches", shipsBy: "FBM" },
  { id: "B0G4HJFTKH", title: "Breathalyzer with 15 Mouthpieces & Carrying Bag", price: 39.98, rating: 5.0, reviews: 3, rank: 132190, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/71mgEH-u5pL._AC_UL320_.jpg", opportunity: 42.46, weight: "0.26 lbs", dimensions: "4.33 x 2.76 x 1.57 inches", shipsBy: "FBM" },
  { id: "B00BPWWIDE", title: "BACtrack Keychain Breathalyzer (Blue)", price: 39.99, rating: 3.9, reviews: 14, rank: 24565, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61QoJjo8NrL._AC_UL320_.jpg", opportunity: 39.44, weight: "0.18 lbs", dimensions: "1.45 x 0.55 x 2.44 inches", shipsBy: "FBM" },
  { id: "B00R2X59A4", title: "BACtrack Trace Professional Breathalyzer", price: 99.99, rating: 4.3, reviews: 2, rank: 40651, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61ewx8DBqNL._AC_UL320_.jpg", opportunity: 39.81, weight: "0.19 lbs", dimensions: "4.25 x 1.87 x 0.63 inches", shipsBy: "FBM" },
  { id: "B0FZ9BRW4L", title: "Breathalyzer with Fuel Cell Sensor (Black)", price: 29.99, rating: 3.8, reviews: 8, rank: 166988, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/71OkgYRx7yL._AC_UL320_.jpg", opportunity: 38.03, weight: "0.49 lbs", dimensions: "6.26 x 3.39 x 1.93 inches", shipsBy: "FBM" },
  { id: "B07RZ5NPRD", title: "BACtrack C6 Keychain Breathalyzer (2 Pack)", price: 132.99, rating: 4.1, reviews: 67, rank: 9678, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61f+5AsgFuL._AC_UL320_.jpg", opportunity: 49.43, weight: "0.60 lbs", dimensions: "7.64 x 3.94 x 2.64 inches", shipsBy: "FBM" },
  { id: "B07PY5VKXM", title: "iSOBER Breathalyzer Mouthpiece (20pcs / Pack)", price: 9.99, rating: 4.1, reviews: 71, rank: 143491, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/71sFbUtT64L._AC_UL320_.jpg", opportunity: 30.26, weight: "0.07 lbs", dimensions: "N/A", shipsBy: "FBM" },
  { id: "B0G5PNX874", title: "Breathalyzer with LCD Display & 12 Mouthpieces", price: 23.99, rating: 5.0, reviews: 1, rank: 135677, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61bc+F8FneL._AC_UL320_.jpg", opportunity: 47.15, weight: "0.15 lbs", dimensions: "4.96 x 3.11 x 1.26 inches", shipsBy: "FBM" },
  { id: "B004U48FEK", title: "BACtrack Element Breathalyzer", price: 84.99, rating: 4.2, reviews: 19, rank: 27842, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/616tr1F-f3L._AC_UL320_.jpg", opportunity: 40.97, weight: "0.00 lbs", dimensions: "2 x 0.75 x 4.75 inches", shipsBy: "FBM" },
  { id: "B0DYDB3Q2M", title: "150 Pack Individually Packaged Mouthpieces", price: 40.99, rating: 4.1, reviews: 11, rank: 100126, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61YtzfUshVL._AC_UL320_.jpg", opportunity: 40.23, weight: "0.82 lbs", dimensions: "9.25 x 5.98 x 4.49 inches", shipsBy: "FBM" },
  { id: "B0BVFTGJRH", title: "150 Pcs Breathalyzer Mouthpieces for S-80", price: 46.99, rating: 4.7, reviews: 31, rank: 80560, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/51nlzSlb9IL._AC_UL320_.jpg", opportunity: 44.61, weight: "0.60 lbs", dimensions: "8.27 x 5.12 x 1.57 inches", shipsBy: "FBM" },
  { id: "B07PDVCFBY", title: "50 Pcs Professional Breathalyzer Mouthpieces", price: 19.99, rating: 4.3, reviews: 105, rank: 174964, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/515yNqlS0TL._AC_UL320_.jpg", opportunity: 52.35, weight: "0.20 lbs", dimensions: "5.59 x 3.9 x 1.46 inches", shipsBy: "FBM" },
  { id: "B0FSZ5CGG8", title: "Portable BAC Device with 20 Mouthpieces", price: 39.99, rating: 5.0, reviews: 5, rank: 55313, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/71pR-2tGD2L._AC_UL320_.jpg", opportunity: 44.03, weight: "0.24 lbs", dimensions: "6.46 x 2.87 x 1.34 inches", shipsBy: "FBM" },
  { id: "B0F5PKQ97K", title: "Breathalyzer Mouthpieces (10-Pack) Trace/Scout", price: 8.99, rating: 4.3, reviews: 24, rank: 137025, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/51WNwLdGDVL._AC_UL320_.jpg", opportunity: 39.43, weight: "0.07 lbs", dimensions: "5.94 x 3.54 x 1.57 inches", shipsBy: "FBM" },
  { id: "B0G23N166R", title: "High-Precision Alcohol Tester with USB Charging", price: 39.99, rating: 5.0, reviews: 2, rank: 254038, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/71YhohaiE9L._AC_UL320_.jpg", opportunity: 42.16, weight: "0.68 lbs", dimensions: "6.18 x 3.43 x 2.01 inches", shipsBy: "FBM" },
  { id: "B07S1XBJ4W", title: "Professional Ketone Breath Meter Tester", price: 35.99, rating: 3.4, reviews: 93, rank: 281116, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/51DOW-6pC2L._AC_UL320_.jpg", opportunity: 41.02, weight: "0.24 lbs", dimensions: "6.14 x 3.94 x 1.65 inches", shipsBy: "FBM" },
  { id: "B09TR5FDWC", title: "800 Pieces Professional Mouthpieces", price: 209.99, rating: 4.1, reviews: 16, rank: 177337, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/41zxTV+imBL._AC_UL320_.jpg", opportunity: 42.59, weight: "3.15 lbs", dimensions: "12.99 x 8.66 x 3.94 inches", shipsBy: "FBM" },
  { id: "B00CFN1HNY", title: "BACtrack Mobile Smartphone Breathalyzer", price: 99.99, rating: 4.0, reviews: 15, rank: 82255, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/610FbZRjA8L._AC_UL320_.jpg", opportunity: 39.59, weight: "0.13 lbs", dimensions: "1.75 x 0.63 x 2.75 inches", shipsBy: "FBM" },
  { id: "B07VHHPKGW", title: "iSOBER 10 Breathalyzer Professional Accuracy", price: 99.99, rating: 4.3, reviews: 218, rank: 186672, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/81MeikaCNUL._AC_UL320_.jpg", opportunity: 44.13, weight: "0.35 lbs", dimensions: "4.1 x 2.1 x 0.7 inches", shipsBy: "FBM" },
  { id: "B0G63VLYTN", title: "YYBNN Breathalyzer LCD Digital Display", price: 29.99, rating: 5.0, reviews: 12, rank: 47524, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61aJZVyeeoL._AC_UL320_.jpg", opportunity: 43.72, weight: "0.18 lbs", dimensions: "6.46 x 3.58 x 1.02 inches", shipsBy: "FBM" },
  { id: "B0G1BKHHZB", title: "USB Rechargeable Digital TFT Display Tester", price: 45.99, rating: 5.0, reviews: 3, rank: 317108, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61yCbwGhzCL._AC_UL320_.jpg", opportunity: 41.76, weight: "0.50 lbs", dimensions: "15 x 11 x 5 inches", shipsBy: "FBM" },
  { id: "B0D62G2NCJ", title: "Party Gifts Portable Breathalyzer Tester", price: 14.63, rating: 3.6, reviews: 34, rank: 315166, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/51fxtXCpYoL._AC_UL320_.jpg", opportunity: 38.55, weight: "0.13 lbs", dimensions: "5.28 x 3.62 x 1.14 inches", shipsBy: "FBM" },
  { id: "B0FRG1M9D5", title: "Breathalyzer, Non-Contact High-Precision", price: 29.90, rating: 5.0, reviews: 1, rank: 241044, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61Urae4+RkL._AC_UL320_.jpg", opportunity: 41.65, weight: "0.11 lbs", dimensions: "1.1 x 1 x 3.54 inches", shipsBy: "FBM" },
  { id: "B07B9N7J84", title: "JASTEK 30 Pieces Mouthpieces only for JS/JA", price: 15.76, rating: 4.0, reviews: 57, rank: 501967, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61Qq4H17VcL._AC_UL320_.jpg", opportunity: 52.86, weight: "0.13 lbs", dimensions: "5.2 x 3.66 x 1.42 inches", shipsBy: "FBM" },
  { id: "B08GX2GJ9N", title: "[Know Your Limit] ALCO9 TX6010L Professional", price: 49.99, rating: 4.0, reviews: 58, rank: 443868, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/51Nb7o0sUvL._AC_UL320_.jpg", opportunity: 42.41, weight: "0.26 lbs", dimensions: "2.55 x 1.49 x 4.92 inches", shipsBy: "FBM" },
  { id: "B0DPMVYT3G", title: "300-Pack Breathalyzer Mouthpieces S-75-80", price: 78.88, rating: 3.7, reviews: 6, rank: 204630, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/61gxXc5MODL._AC_UL320_.jpg", opportunity: 37.58, weight: "0.88 lbs", dimensions: "7.7 x 6.32 x 4.72 inches", shipsBy: "FBM" },
  { id: "B0DXKS6269", title: "150 Pieces Breathalyzer Mouthpieces S-80 S75", price: 36.98, rating: 4.7, reviews: 9, rank: 476328, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/41ndQj2nFGL._AC_UL320_.jpg", opportunity: 40.40, weight: "0.60 lbs", dimensions: "8.11 x 5.39 x 1.97 inches", shipsBy: "FBM" },
  { id: "B0F66P55V9", title: "Portable Breathalyzer with Sobriety Reminder", price: 69.99, rating: 4.3, reviews: 28, rank: 175213, category: "Health and Household", img: "http://ecx.images-amazon.com/images/I/71Se5PbFnjL._AC_UL320_.jpg", opportunity: 41.88, weight: "0.33 lbs", dimensions: "6.42 x 3.23 x 1.65 inches", shipsBy: "FBM" },
];

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('opportunity');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter out duplicates and search
  const products = useMemo(() => {
    // Unique by ID
    const uniqueMap = new Map();
    rawData.forEach(item => {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    });

    let list = Array.from(uniqueMap.values());

    // Search
    if (searchTerm) {
      list = list.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    list.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (sortOrder === 'asc') return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

    return list;
  }, [searchTerm, sortBy, sortOrder]);

  const toggleSort = (key: any) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Box className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">0.8 Breathalyzer</h1>
                <p className="text-xs text-slate-500 font-medium">Market Data Dashboard</p>
              </div>
            </div>

            <div className="flex flex-1 max-w-md items-center relative">
              <Search className="absolute left-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products or ASINs..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls bar */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="text-slate-500">Sort by:</span>
            <button
              onClick={() => toggleSort('opportunity')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all ${sortBy === 'opportunity' ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
            >
              Opp Score <ArrowUpDown className="w-3 h-3" />
            </button>
            <button
              onClick={() => toggleSort('price')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all ${sortBy === 'price' ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
            >
              Price <ArrowUpDown className="w-3 h-3" />
            </button>
            <button
              onClick={() => toggleSort('rating')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all ${sortBy === 'rating' ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
            >
              Rating <ArrowUpDown className="w-3 h-3" />
            </button>
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Showing <span className="text-indigo-600">{products.length}</span> unique products
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-white p-6 flex items-center justify-center">
                  <img
                    src={product.img}
                    alt={product.title}
                    className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/200?text=No+Image"; }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-slate-500 border border-slate-100 uppercase tracking-wider">
                      {product.shipsBy}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className={`px-2 py-1 rounded-full text-[10px] font-bold text-white shadow-sm flex items-center gap-1 ${product.opportunity > 45 ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                      <TrendingUp className="w-3 h-3" /> {product.opportunity}
                    </div>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 border-t border-slate-50">
                  <div className="mb-2">
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest truncate mb-1">{product.id}</p>
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-2 min-h-[40px] leading-snug group-hover:text-indigo-600 transition-colors">
                      {product.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center text-amber-400">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs font-bold ml-1 text-slate-700">{product.rating}</span>
                    </div>
                    <span className="text-slate-300">|</span>
                    <span className="text-[11px] text-slate-500 font-medium">{product.reviews} reviews</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-medium block">Price</span>
                      <span className="text-lg font-black text-slate-900">${product.price}</span>
                    </div>
                    <a
                      href={`http://www.amazon.com/dp/${product.id}`}
                      target="_blank"
                      className="bg-slate-900 hover:bg-indigo-600 text-white p-2.5 rounded-xl transition-all shadow-sm active:scale-95"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                  <th className="px-6 py-4">Product Info</th>
                  <th className="px-6 py-4 hidden md:table-cell">Metrics</th>
                  <th className="px-6 py-4 hidden lg:table-cell">Physical</th>
                  <th className="px-6 py-4 text-right">Price & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.img}
                          className="w-12 h-12 object-contain bg-white rounded border border-slate-100 p-1"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/50?text=Img"; }}
                        />
                        <div className="max-w-md">
                          <p className="text-[10px] font-bold text-indigo-600 mb-0.5">{product.id}</p>
                          <p className="text-sm font-bold text-slate-800 line-clamp-1">{product.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold">{product.shipsBy}</span>
                            <span className="text-[10px] bg-indigo-50 px-1.5 py-0.5 rounded text-indigo-600 font-bold">{product.category}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 w-8">Rate:</span>
                          <div className="flex items-center text-amber-400">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            <span className="text-[11px] font-bold ml-1 text-slate-700">{product.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 w-8">Opp:</span>
                          <span className="text-[11px] font-bold text-slate-700">{product.opportunity}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="space-y-1 text-[11px] text-slate-500">
                        <p className="flex items-center gap-1"><Scale className="w-3 h-3" /> {product.weight}</p>
                        <p className="flex items-center gap-1"><Box className="w-3 h-3" /> {product.dimensions}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <span className="text-lg font-black text-slate-900">${product.price}</span>
                        <a
                          href={`http://www.amazon.com/dp/${product.id}`}
                          target="_blank"
                          className="text-indigo-600 hover:text-indigo-700 font-bold text-sm flex items-center gap-1"
                        >
                          Details <ChevronRight className="w-4 h-4" />
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

      <footer className="bg-white border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-sm text-slate-500">© 2026 0.8 Breathalyzer Analysis Dashboard • Professional Data Processing</p>
        </div>
      </footer>
    </div>
  );
};

export default App;