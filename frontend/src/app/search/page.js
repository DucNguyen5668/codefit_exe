"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";

const categories = [
  { id: "all", name: "Tất cả" },
  { id: "nuts", name: "Hạt dinh dưỡng" },
  { id: "coffee_cacao", name: "Cà phê & Cacao" },
  { id: "other", name: "Khác" }
];

const priceRanges = [
  { id: "all", label: "Tất cả giá", min: "", max: "" },
  { id: "under50", label: "Dưới 50,000 đ", min: "", max: "50000" },
  { id: "50to150", label: "50,000 đ - 150,000 đ", min: "50000", max: "150000" },
  { id: "150to300", label: "150,000 đ - 300,000 đ", min: "150000", max: "300000" },
  { id: "above300", label: "Trên 300,000 đ", min: "300000", max: "" },
  { id: "custom", label: "Tùy chỉnh", min: "", max: "" }
];

const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
  { value: "name_asc", label: "Tên A-Z" }
];

const formatCurrency = (value) => `${Number(value || 0).toLocaleString("vi-VN")} đ`;

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [priceRange, setPriceRange] = useState("all");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  useEffect(() => {
    const matchedRange = priceRanges.find(range =>
      range.id !== "custom" && range.min === (searchParams.get("minPrice") || "") && range.max === (searchParams.get("maxPrice") || "")
    );
    queueMicrotask(() => setPriceRange(matchedRange?.id || "custom"));
  }, [searchParams]);

  const buildParams = useCallback((overrides = {}) => {
    const params = new URLSearchParams();
    const values = {
      q: query,
      category,
      minPrice,
      maxPrice,
      sort,
      ...overrides
    };

    if (values.q?.trim()) params.set("q", values.q.trim());
    if (values.category && values.category !== "all") params.set("category", values.category);
    if (values.minPrice) params.set("minPrice", values.minPrice);
    if (values.maxPrice) params.set("maxPrice", values.maxPrice);
    if (values.sort && values.sort !== "newest") params.set("sort", values.sort);
    return params;
  }, [category, maxPrice, minPrice, query, sort]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = buildParams();
      const apiParams = new URLSearchParams(params);
      if (apiParams.has("q")) {
        apiParams.set("search", apiParams.get("q"));
        apiParams.delete("q");
      }
      const data = await api.get(`/products?${apiParams.toString()}`);
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message || "Không thể tìm kiếm sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => {
    queueMicrotask(() => {
      setQuery(searchParams.get("q") || "");
      setCategory(searchParams.get("category") || "all");
      setMinPrice(searchParams.get("minPrice") || "");
      setMaxPrice(searchParams.get("maxPrice") || "");
      setSort(searchParams.get("sort") || "newest");
    });
  }, [searchParams]);

  useEffect(() => {
    queueMicrotask(fetchProducts);
  }, [fetchProducts]);

  const applyUrl = (overrides = {}) => {
    const params = buildParams(overrides);
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    applyUrl({ q: query });
  };

  const handleRangeChange = (rangeId) => {
    const range = priceRanges.find(item => item.id === rangeId) || priceRanges[0];
    setPriceRange(rangeId);
    if (rangeId !== "custom") {
      setMinPrice(range.min);
      setMaxPrice(range.max);
      applyUrl({ minPrice: range.min, maxPrice: range.max });
    }
  };

  const hasFilters = useMemo(() => Boolean(query || category !== "all" || minPrice || maxPrice || sort !== "newest"), [category, maxPrice, minPrice, query, sort]);

  return (
    <div>
<section className="max-w-[1200px] mx-auto px-4 section-padding">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#45572f] via-[#5d713e] to-[#26351b] p-6 md:p-9 text-white shadow-2xl mb-8 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#f7ca3a]/20 rounded-full blur-3xl"></div>
          <div className="relative">
            <p className="uppercase tracking-[0.25em] text-[#f7ca3a] text-xs font-bold mb-3">Smart Search</p>
            <h2 className="text-3xl md:text-4xl font-black mb-3">Bạn đang tìm món gì hôm nay?</h2>
            <p className="text-white/75 max-w-2xl text-sm mb-6">Gõ có dấu hoặc không dấu đều được. Ví dụ: “ca phe”, “hạt điều”, “dieu muoi”.</p>
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-2 flex flex-col md:flex-row gap-2 shadow-xl">
              <div className="relative flex-1">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#45572f]"></i>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl text-gray-800 outline-none"
                  placeholder="Tìm sản phẩm, thương hiệu, mô tả..."
                />
              </div>
              <button className="h-12 px-7 rounded-xl bg-[#f7ca3a] text-[#26351b] font-black hover:bg-[#ffd95b] transition-colors">
                Tìm kiếm
              </button>
            </form>
          </div>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <aside className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-black text-[#45572f] mb-4">Bộ lọc</h3>
              <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Danh mục</label>
              <select value={category} onChange={(e) => { setCategory(e.target.value); applyUrl({ category: e.target.value }); }} className="input-field w-full mb-4">
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>

              <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Khoảng giá</label>
              <div className="space-y-2 mb-4">
                {priceRanges.map(range => (
                  <button
                    key={range.id}
                    onClick={() => handleRangeChange(range.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors ${priceRange === range.id ? "bg-[#45572f] text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              {priceRange === "custom" && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Từ" className="input-field w-full" />
                  <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Đến" className="input-field w-full" />
                  <button onClick={() => applyUrl({ minPrice, maxPrice })} className="col-span-2 btn btn-primary rounded-xl py-2 font-bold">Áp dụng giá</button>
                </div>
              )}

              <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Sắp xếp</label>
              <select value={sort} onChange={(e) => { setSort(e.target.value); applyUrl({ sort: e.target.value }); }} className="input-field w-full">
                {sortOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>

              {hasFilters && (
                <button onClick={() => router.push("/search")} className="mt-4 w-full rounded-xl border border-gray-200 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50">
                  <i className="fas fa-rotate-left mr-2"></i>Xóa bộ lọc
                </button>
              )}
            </div>
          </aside>

          <main>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 border-b border-gray-100 pb-4">
              <p className="text-sm text-gray-500">
                {query ? <>Kết quả cho <b className="text-[#45572f]">“{query}”</b></> : "Tất cả sản phẩm phù hợp"}
              </p>
              <p className="text-sm font-bold text-gray-700">{products.length} sản phẩm</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl p-4 text-sm mb-4">{error}</div>}

            {loading ? (
              <div className="flex justify-center py-20"><i className="fas fa-spinner fa-spin text-4xl text-[#45572f]"></i></div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                <i className="fas fa-search text-5xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-bold mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-500 text-sm">Thử từ khóa ngắn hơn hoặc bỏ bớt bộ lọc giá.</p>
              </div>
            ) : (
              <div className="product-grid-3">
                {products.map(product => (
                  <Link href={`/product/${product.slug}`} key={product._id} className="product-card group">
                    <div className="product-img-wrapper relative">
                      <span className="product-badge">NUTRICORE</span>
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <h3 className="product-name text-gray-800 line-clamp-2 min-h-[54px] flex items-center justify-center font-semibold text-center mt-2 group-hover:text-[#45572f] transition-colors">
                      {product.name}
                    </h3>
                    <div className="product-price mt-4">
                      <span className="current-price text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
                      {product.oldPrice > 0 && <span className="old-price text-sm text-gray-400 line-through">{formatCurrency(product.oldPrice)}</span>}
                    </div>
                    <div className="mt-4 pt-2 border-t border-gray-100 text-center text-xs font-bold text-[#45572f] uppercase tracking-wider group-hover:text-[#cfa006] transition-colors">
                      Xem chi tiết
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="section-padding text-center"><i className="fas fa-spinner fa-spin text-4xl text-[#45572f]"></i></div>}>
      <SearchContent />
    </Suspense>
  );
}
