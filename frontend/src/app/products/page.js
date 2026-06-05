"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/api";

const categories = [
  { id: "all", name: "Tất cả sản phẩm" },
  { id: "nuts", name: "Hạt dinh dưỡng" },
  { id: "coffee_cacao", name: "Cà phê & Cacao" },
  { id: "other", name: "Khác" }
];

const priceRanges = [
  { id: "all", label: "Tất cả giá", min: "", max: "" },
  { id: "under50", label: "Dưới 50,000 đ", min: "", max: "50000" },
  { id: "50to150", label: "50,000 đ - 150,000 đ", min: "50000", max: "150000" },
  { id: "above150", label: "Trên 150,000 đ", min: "150000", max: "" }
];

const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
  { value: "name_asc", label: "Tên A-Z" }
];

const formatCurrency = (value) => `${Number(value || 0).toLocaleString("vi-VN")} đ`;

export default function ProductsCatalog() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, searchTerm, priceRange, minPrice, maxPrice, sort]);

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort !== "newest") params.set("sort", sort);
    params.set("page", page);
    params.set("limit", 9);
    return params.toString();
  }, [maxPrice, minPrice, searchTerm, selectedCategory, sort, page]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const query = buildQuery();
      const data = await api.get(`/products${query ? `?${query}` : ""}`);
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setTotalProducts(data.total || (data.products ? data.products.length : 0));
    } catch (err) {
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  }, [buildQuery]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 250);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handlePriceRange = (rangeId) => {
    const range = priceRanges.find(item => item.id === rangeId) || priceRanges[0];
    setPriceRange(rangeId);
    setMinPrice(range.min);
    setMaxPrice(range.max);
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setPriceRange("all");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setPage(1);
  };

  return (
    <div>
      <section className="page-banner">
        <div className="max-w-[1200px] mx-auto px-4 banner-inner">
          <h1 className="banner-title">Danh Mục Sản Phẩm</h1>
          <div className="breadcrumbs">
            <Link href="/">Trang chủ</Link>
            <i className="fas fa-chevron-right text-xs"></i>
            <span>Sản phẩm</span>
          </div>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-4 section-padding">
        {/* Mobile Filter Toggle */}
        <button
          className="mobile-filter-toggle md:hidden"
          onClick={() => setShowMobileFilter(!showMobileFilter)}
        >
          <i className={`fas ${showMobileFilter ? 'fa-times' : 'fa-sliders-h'}`}></i>
          {showMobileFilter ? 'Đóng bộ lọc' : 'Bộ lọc & Tìm kiếm'}
        </button>
        <div className="catalog-layout">
          <aside className={`sidebar ${showMobileFilter ? 'mobile-visible' : ''}`}>
            <h3 className="sidebar-title">Tìm kiếm & lọc</h3>

            <div className="filter-group">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Từ khóa</label>
              <div className="relative mb-5">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#45572f]"></i>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="            VD: ca phe, hạt điều..."
                  className="input-field w-full pl-11"
                />
              </div>

              <h4 className="text-sm font-bold text-gray-700 mb-3">Danh mục</h4>
              <ul className="filter-list mb-5">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`filter-link w-full text-left bg-transparent border-none cursor-pointer ${selectedCategory === cat.id ? "active font-bold text-[#45572f]" : "text-gray-700"
                        }`}
                    >
                      <span>{cat.name}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <h4 className="text-sm font-bold text-gray-700 mb-3">Khoảng giá</h4>
              <div className="space-y-2 mb-5">
                {priceRanges.map(range => (
                  <button
                    key={range.id}
                    onClick={() => handlePriceRange(range.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors ${priceRange === range.id ? "bg-[#45572f] text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Sắp xếp</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field w-full mb-5">
                {sortOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>

              <button onClick={() => { resetFilters(); }} className="w-full rounded-xl border border-gray-200 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50">
                <i className="fas fa-rotate-left mr-2"></i>Xóa bộ lọc
              </button>
              <button onClick={() => setShowMobileFilter(false)} className="w-full rounded-xl bg-[#45572f] text-white py-2.5 text-sm font-bold mt-2 md:hidden">
                <i className="fas fa-check mr-2"></i>Áp dụng
              </button>
            </div>

            <div className="hidden lg:block bg-[#45572f] text-white p-6 rounded-lg text-center mt-8 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#cfa006] rounded-full opacity-20"></div>
              <h4 className="font-montserrat font-bold text-lg mb-2">Tìm kiếm thông minh</h4>
              <p className="text-xs text-gray-300 mb-4 leading-relaxed">Gõ có dấu hoặc không dấu đều được, ví dụ: <b>ca phe</b>, <b>hat dieu</b>.</p>
              <i className="fas fa-magnifying-glass-chart text-3xl text-[#cfa006]"></i>
            </div>
          </aside>

          <main>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 border-b border-gray-100 pb-4">
              <p className="text-sm text-gray-500 font-medium">
                Hiển thị <span className="font-bold text-gray-800">{products.length}</span> trên <span className="font-bold text-gray-800">{totalProducts}</span> sản phẩm
              </p>
              {searchTerm && <p className="text-sm text-gray-500">Từ khóa: <b className="text-[#45572f]">{searchTerm}</b></p>}
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <i className="fas fa-spinner fa-spin text-4xl text-[#45572f]"></i>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-lg">
                <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 font-medium">Không tìm thấy sản phẩm nào.</p>
              </div>
            ) : (
              <>
                <div className="product-grid-3">
                  {products.map((product) => (
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
                        Chi tiết sản phẩm
                      </div>
                    </Link>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12 pb-6">
                    <button
                      onClick={() => setPage(p => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        page === 1
                          ? "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400 border border-gray-200"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm"
                      }`}
                    >
                      <i className="fas fa-chevron-left text-xs"></i>
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all shadow-sm ${
                          page === p
                            ? "bg-[#45572f] text-white"
                            : "bg-white text-gray-700 hover:bg-[#45572f]/10 border border-gray-200"
                        }`}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                      disabled={page === totalPages}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        page === totalPages
                          ? "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400 border border-gray-200"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm"
                      }`}
                    >
                      <i className="fas fa-chevron-right text-xs"></i>
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}
