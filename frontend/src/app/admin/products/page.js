"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

const emptyForm = {
  name: "",
  price: "",
  oldPrice: "",
  category: "nuts",
  weight: "",
  origin: "Việt Nam",
  brand: "NUTRICORE TÂY NGUYÊN",
  stockQty: 100,
  image: "",
  desc: "",
  storage: "",
  descImage: ""
};

function getImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("/home") || url.startsWith("/ca_") || url.startsWith("/product")) return url;
  if (url.startsWith("/uploads")) return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://127.0.0.1:5000"}${url}`;
  return url;
}

function normalizeSearchText(value = "") {
  return value
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesFuzzySearch(product, searchTerm) {
  const tokens = normalizeSearchText(searchTerm).split(" ").filter(Boolean);
  if (tokens.length === 0) return true;
  const haystack = normalizeSearchText([
    product.name,
    product.brand,
    product.desc,
    product.origin,
    product.weight,
    product.slug
  ].filter(Boolean).join(" "));
  return tokens.every(token => haystack.includes(token));
}

function UploadBox({ field, label, required, formData, uploadingField, onUpload }) {
  return (
    <div className="rounded-3xl border border-dashed border-[#d7bd93] bg-[#fffaf2] p-4">
      <label className="block text-xs font-black uppercase tracking-[0.18em] text-[#8b6d3d] mb-3">{label} {required && "*"}</label>
      <div className="grid sm:grid-cols-[160px_1fr] gap-4 items-center">
        <div className="aspect-square rounded-2xl bg-white border border-[#eadfce] overflow-hidden flex items-center justify-center">
          {formData[field] ? (
            <img src={getImageUrl(formData[field])} alt={label} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-[#b8a17c]">
              <i className="fas fa-cloud-arrow-up text-3xl mb-2"></i>
              <p className="text-xs font-bold">Chưa có ảnh</p>
            </div>
          )}
        </div>
        <div>
          <input id={`upload-${field}`} type="file" accept="image/*" className="hidden" onChange={(e) => onUpload(field, e.target.files?.[0])} />
          <label htmlFor={`upload-${field}`} className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#183b20] px-5 py-3 text-sm font-black text-white hover:bg-[#244d2d] transition-all shadow-lg shadow-[#183b20]/15">
            <i className={`fas ${uploadingField === field ? "fa-spinner fa-spin" : "fa-upload"}`}></i>
            {uploadingField === field ? "Đang upload..." : "Chọn ảnh từ máy"}
          </label>
          <p className="mt-3 text-xs text-[#8c7d66]">Hỗ trợ JPEG, PNG, WEBP, GIF. Dung lượng tối đa 5MB.</p>
          {formData[field] && <p className="mt-2 text-[11px] text-[#2f6d38] break-all">{formData[field]}</p>}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, wide }) {
  return <div className={wide ? "lg:col-span-2" : ""}><label className="block text-xs font-black uppercase tracking-[0.16em] text-[#75664e] mb-2">{label}</label>{children}</div>;
}

function Input({ label, wide, ...props }) {
  return <Field label={label} wide={wide}><input {...props} className="admin-input" /></Field>;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const data = await api.get("/products/admin/all");
      setProducts(data.products || []);
    } catch (err) {
      console.error("Fetch products error:", err);
      setError("Không thể tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: ["price", "oldPrice", "stockQty"].includes(name) ? (value === "" ? "" : Number(value)) : value }));
  };

  const handleUpload = async (field, file) => {
    if (!file) return;
    setError("");
    setUploadingField(field);
    try {
      const data = await api.uploadImage(file);
      setFormData((prev) => ({ ...prev, [field]: data.url }));
      setSuccess("Upload ảnh thành công. Ảnh đã được gắn vào form sản phẩm.");
    } catch (err) {
      setError(err.message || "Upload ảnh thất bại.");
    } finally {
      setUploadingField("");
    }
  };

  const openAddModal = () => {
    setEditProduct(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name || "",
      price: product.price || "",
      oldPrice: product.oldPrice || "",
      category: product.category || "nuts",
      weight: product.weight || "",
      origin: product.origin || "Việt Nam",
      brand: product.brand || "NUTRICORE TÂY NGUYÊN",
      stockQty: product.stockQty || 0,
      image: product.image || "",
      desc: product.desc || "",
      storage: product.storage || "",
      descImage: product.descImage || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!formData.name || !formData.price || !formData.image) {
      setError("Vui lòng nhập tên, giá và upload ảnh chính cho sản phẩm.");
      return;
    }
    try {
      setSaving(true);
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, formData);
        setSuccess("Cập nhật sản phẩm thành công!");
      } else {
        await api.post("/products", formData);
        setSuccess("Thêm sản phẩm thành công!");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      setError(err.message || "Lỗi khi lưu sản phẩm.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return;
    try {
      await api.delete(`/products/${productId}`);
      setSuccess("Xóa sản phẩm thành công!");
      fetchProducts();
    } catch {
      setError("Không thể xóa sản phẩm.");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedPriceRange("all");
  };

  const categoryLabels = { nuts: "Hạt dinh dưỡng", coffee_cacao: "Cà phê & Cacao", other: "Khác" };
  const filteredProducts = products.filter((p) => {
    if (p.isActive === false) return false;
    const matchesSearch = matchesFuzzySearch(p, searchTerm);
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    let matchesPrice = true;
    if (selectedPriceRange === "under50") matchesPrice = p.price < 50000;
    if (selectedPriceRange === "50to150") matchesPrice = p.price >= 50000 && p.price <= 150000;
    if (selectedPriceRange === "above150") matchesPrice = p.price > 150000;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (loading) return <div className="min-h-[520px] flex items-center justify-center"><i className="fas fa-spinner fa-spin text-4xl text-[#183b20]"></i></div>;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-br from-[#183b20] via-[#264c2d] to-[#102918] text-white p-6 lg:p-8 shadow-2xl shadow-[#183b20]/15 overflow-hidden relative">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#d8892b]/20 rounded-full blur-3xl"></div>
        <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-5"><div><p className="text-xs font-black uppercase tracking-[0.28em] text-[#f5cf9e]">Product command center</p><h1 className="mt-3 text-3xl lg:text-4xl font-black">Quản lý sản phẩm</h1><p className="mt-3 max-w-2xl text-white/65">Tạo sản phẩm, upload ảnh trực tiếp từ máy, kiểm soát giá bán và tồn kho như một gian hàng chuyên nghiệp.</p></div><button onClick={openAddModal} className="rounded-2xl bg-[#d8892b] hover:bg-[#c47722] px-6 py-4 font-black shadow-xl shadow-[#d8892b]/25 transition-all hover:-translate-y-0.5"><i className="fas fa-plus mr-2"></i> THÊM SẢN PHẨM</button></div>
      </section>

      {(success || error) && <div className={`rounded-2xl border p-4 text-sm font-bold ${success ? "bg-[#e7f6e9] border-[#b8dfc0] text-[#216b34]" : "bg-[#ffe7e3] border-[#f5b8af] text-[#b83b2d]"}`}><i className={`fas ${success ? "fa-check-circle" : "fa-triangle-exclamation"} mr-2`}></i>{success || error}</div>}

      <section className="rounded-[1.7rem] bg-white border border-[#eadfce] p-4 lg:p-5 shadow-sm"><div className="grid grid-cols-1 lg:grid-cols-[1fr_220px_220px_140px] gap-3"><div className="relative"><i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#b96d1e]"></i><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm gần đúng: tên, thương hiệu, mô tả, xuất xứ..." className="w-full rounded-2xl border border-[#eadfce] bg-[#fbf8f1] py-3 pl-11 pr-4 text-sm outline-none focus:border-[#183b20]" /></div><select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="rounded-2xl border border-[#eadfce] bg-[#fbf8f1] px-4 py-3 text-sm font-bold outline-none focus:border-[#183b20]"><option value="all">Tất cả loại</option><option value="nuts">Hạt dinh dưỡng</option><option value="coffee_cacao">Cà phê & Cacao</option><option value="other">Khác</option></select><select value={selectedPriceRange} onChange={(e) => setSelectedPriceRange(e.target.value)} className="rounded-2xl border border-[#eadfce] bg-[#fbf8f1] px-4 py-3 text-sm font-bold outline-none focus:border-[#183b20]"><option value="all">Tất cả giá</option><option value="under50">Dưới 50,000 đ</option><option value="50to150">50,000 đ - 150,000 đ</option><option value="above150">Trên 150,000 đ</option></select><button onClick={resetFilters} className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-black text-[#7b6c55] hover:bg-[#fbf8f1] transition-colors"><i className="fas fa-rotate-left mr-2"></i>Reset</button></div></section>

      <section className="rounded-[1.7rem] bg-white border border-[#eadfce] overflow-hidden shadow-sm"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-[#fbf8f1] text-[#75664e]"><tr><th className="text-left px-6 py-4 font-black">Sản phẩm</th><th className="text-left px-6 py-4 font-black">Phân loại</th><th className="text-left px-6 py-4 font-black">Giá bán</th><th className="text-left px-6 py-4 font-black">Tồn kho</th><th className="text-left px-6 py-4 font-black">Đơn vị</th><th className="text-right px-6 py-4 font-black">Hành động</th></tr></thead><tbody className="divide-y divide-[#f0e5d4]">{filteredProducts.map((product) => (<tr key={product._id} className="hover:bg-[#fffaf2] transition-colors"><td className="px-6 py-4"><div className="flex items-center gap-4"><img src={getImageUrl(product.image)} alt={product.name} className="w-16 h-16 rounded-2xl object-cover bg-[#fbf8f1] border border-[#eadfce]" /><div><p className="font-black text-[#183b20] line-clamp-1">{product.name}</p><p className="text-xs text-[#8c7d66] mt-1">{product.brand}</p></div></div></td><td className="px-6 py-4"><span className="bg-[#eef5eb] text-[#2f6d38] border border-[#cfe2c9] px-3 py-1.5 rounded-full text-xs font-black">{categoryLabels[product.category] || "Khác"}</span></td><td className="px-6 py-4"><p className="font-black text-[#b96d1e]">{product.price?.toLocaleString("vi-VN")} đ</p>{product.oldPrice > 0 && <p className="text-xs text-[#a99a81] line-through mt-1">{product.oldPrice.toLocaleString("vi-VN")} đ</p>}</td><td className="px-6 py-4 font-bold text-[#3f4a35]">{product.stockQty} sản phẩm</td><td className="px-6 py-4 text-[#7b6c55] font-bold">{product.weight || "-"}</td><td className="px-6 py-4"><div className="flex justify-end gap-2"><button onClick={() => openEditModal(product)} className="w-10 h-10 rounded-xl bg-[#eef5eb] text-[#183b20] hover:bg-[#183b20] hover:text-white transition-all" title="Sửa"><i className="fas fa-edit"></i></button><button onClick={() => handleDelete(product._id)} className="w-10 h-10 rounded-xl bg-[#fff0ed] text-[#b83b2d] hover:bg-[#b83b2d] hover:text-white transition-all" title="Xóa"><i className="far fa-trash-alt"></i></button></div></td></tr>))}{filteredProducts.length === 0 && <tr><td colSpan="6" className="px-6 py-14 text-center text-[#9a8d76]"><i className="fas fa-box-open text-4xl mb-3 block text-[#d8c6ab]"></i>Không có sản phẩm nào khớp với bộ lọc</td></tr>}</tbody></table></div></section>

      {isModalOpen && <div className="fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4 backdrop-blur-sm"><div className="bg-white rounded-[2rem] w-full max-w-5xl max-h-[92vh] overflow-y-auto shadow-2xl"><div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-[#eadfce] px-6 py-5 flex justify-between items-center rounded-t-[2rem]"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#d8892b]">Product editor</p><h3 className="text-2xl font-black text-[#183b20]">{editProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h3></div><button onClick={() => setIsModalOpen(false)} className="w-11 h-11 rounded-2xl bg-[#fbf8f1] text-[#7b6c55] hover:bg-[#183b20] hover:text-white transition-all"><i className="fas fa-times"></i></button></div><form onSubmit={handleSubmit} className="p-6 space-y-6"><div className="grid grid-cols-1 lg:grid-cols-2 gap-5"><div className="lg:col-span-2"><UploadBox field="image" label="Ảnh chính sản phẩm" required formData={formData} uploadingField={uploadingField} onUpload={handleUpload} /></div><Input label="Tên sản phẩm *" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Hạt điều sấy giòn vị muối" wide /><Input label="Giá bán (đ) *" name="price" type="number" value={formData.price} onChange={handleInputChange} required /><Input label="Giá gốc cũ (đ)" name="oldPrice" type="number" value={formData.oldPrice} onChange={handleInputChange} /><Field label="Loại sản phẩm *"><select name="category" value={formData.category} onChange={handleInputChange} className="admin-input"><option value="nuts">Hạt dinh dưỡng</option><option value="coffee_cacao">Cà phê & Cacao</option><option value="other">Khác</option></select></Field><Input label="Trọng lượng *" name="weight" value={formData.weight} onChange={handleInputChange} required placeholder="500g" /><Input label="Thương hiệu" name="brand" value={formData.brand} onChange={handleInputChange} /><Input label="Số lượng tồn kho" name="stockQty" type="number" value={formData.stockQty} onChange={handleInputChange} /><Input label="Xuất xứ" name="origin" value={formData.origin} onChange={handleInputChange} /><div className="lg:col-span-2"><UploadBox field="descImage" label="Ảnh phụ mô tả chi tiết" formData={formData} uploadingField={uploadingField} onUpload={handleUpload} /></div><Field label="Mô tả sản phẩm" wide><textarea name="desc" rows="4" value={formData.desc} onChange={handleInputChange} className="admin-input resize-none"></textarea></Field><Input label="Hướng dẫn bảo quản" name="storage" value={formData.storage} onChange={handleInputChange} wide placeholder="Để nơi khô ráo, thoáng mát..." /></div><div className="pt-5 border-t border-[#eadfce] flex flex-col sm:flex-row justify-end gap-3"><button type="button" onClick={() => setIsModalOpen(false)} className="rounded-2xl border border-[#eadfce] px-6 py-3 font-black text-[#7b6c55] hover:bg-[#fbf8f1]">HỦY BỎ</button><button type="submit" disabled={saving || uploadingField} className="rounded-2xl bg-[#183b20] px-7 py-3 font-black text-white hover:bg-[#244d2d] disabled:opacity-60 shadow-lg shadow-[#183b20]/15"><i className={`fas ${saving ? "fa-spinner fa-spin" : "fa-floppy-disk"} mr-2`}></i>LƯU SẢN PHẨM</button></div></form></div></div>}
    </div>
  );
}
