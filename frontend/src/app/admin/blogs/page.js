"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

const emptyForm = {
  title: "",
  category: "Hạt dinh dưỡng",
  image: "",
  summary: "",
  content: "",
  author: "Nutricore Tây Nguyên"
};

function getImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("/Dinh_duong") || url.startsWith("/ca_")) return url;
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

function matchesFuzzySearch(post, searchTerm) {
  const tokens = normalizeSearchText(searchTerm).split(" ").filter(Boolean);
  if (tokens.length === 0) return true;
  const haystack = normalizeSearchText([
    post.title,
    post.category,
    post.summary,
    post.slug
  ].filter(Boolean).join(" "));
  return tokens.every(token => haystack.includes(token));
}

function UploadBox({ field, label, required, formData, uploadingField, onUpload }) {
  return (
    <div className="rounded-3xl border border-dashed border-[#d7bd93] bg-[#fffaf2] p-4">
      <label className="block text-xs font-black uppercase tracking-[0.18em] text-[#8b6d3d] mb-3">{label} {required && "*"}</label>
      <div className="grid sm:grid-cols-[160px_1fr] gap-4 items-center">
        <div className="aspect-[16/10] sm:w-[160px] rounded-2xl bg-white border border-[#eadfce] overflow-hidden flex items-center justify-center">
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

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [activeFormTab, setActiveFormTab] = useState("write"); // write | preview

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      const data = await api.get("/posts/admin/all");
      setPosts(data.posts || []);
    } catch (err) {
      console.error("Fetch posts error:", err);
      setError("Không thể tải danh sách bài viết.");
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (field, file) => {
    if (!file) return;
    setError("");
    setUploadingField(field);
    try {
      const data = await api.uploadImage(file);
      setFormData((prev) => ({ ...prev, [field]: data.url }));
      setSuccess("Upload ảnh thành công. Ảnh đã được gắn vào form bài viết.");
    } catch (err) {
      setError(err.message || "Upload ảnh thất bại.");
    } finally {
      setUploadingField("");
    }
  };

  const openAddModal = () => {
    setEditPost(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
    setActiveFormTab("write");
  };

  const openEditModal = (post) => {
    setEditPost(post);
    setFormData({
      title: post.title || "",
      category: post.category || "Hạt dinh dưỡng",
      image: post.image || "",
      summary: post.summary || "",
      content: post.content || "",
      author: post.author || "Nutricore Tây Nguyên"
    });
    setIsModalOpen(true);
    setActiveFormTab("write");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!formData.title || !formData.summary || !formData.content || !formData.image) {
      setError("Vui lòng nhập đầy đủ tiêu đề, danh mục, tóm tắt, nội dung và ảnh bài viết.");
      return;
    }
    try {
      setSaving(true);
      if (editPost) {
        await api.put(`/posts/${editPost._id}`, formData);
        setSuccess("Cập nhật bài viết thành công!");
      } else {
        await api.post("/posts", formData);
        setSuccess("Thêm bài viết mới thành công!");
      }
      setIsModalOpen(false);
      fetchPosts();
    } catch (err) {
      setError(err.message || "Lỗi khi lưu bài viết.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) return;
    try {
      await api.delete(`/posts/${postId}`);
      setSuccess("Xóa bài viết thành công!");
      fetchPosts();
    } catch {
      setError("Không thể xóa bài viết.");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
  };

  const filteredPosts = posts.filter((p) => {
    if (p.isActive === false) return false;
    const matchesSearch = matchesFuzzySearch(p, searchTerm);
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["Hạt dinh dưỡng", "Cà phê & Cacao", "Sức khỏe & Đời sống", "Khác"];

  if (loading) return <div className="min-h-[520px] flex items-center justify-center"><i className="fas fa-spinner fa-spin text-4xl text-[#183b20]"></i></div>;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-br from-[#183b20] via-[#264c2d] to-[#102918] text-white p-6 lg:p-8 shadow-2xl shadow-[#183b20]/15 overflow-hidden relative">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#d8892b]/20 rounded-full blur-3xl"></div>
        <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#f5cf9e]">Article Command Center</p>
            <h1 className="mt-3 text-3xl lg:text-4xl font-black">Quản lý bài viết</h1>
            <p className="mt-3 max-w-2xl text-white/65">Đăng tải kiến thức dinh dưỡng mới, chia sẻ kinh nghiệm ăn lành mạnh và cập nhật bài viết cho Góc Dinh Dưỡng.</p>
          </div>
          <button onClick={openAddModal} className="rounded-2xl bg-[#d8892b] hover:bg-[#c47722] px-6 py-4 font-black shadow-xl shadow-[#d8892b]/25 transition-all hover:-translate-y-0.5 whitespace-nowrap">
            <i className="fas fa-plus mr-2"></i> THÊM BÀI VIẾT
          </button>
        </div>
      </section>

      {(success || error) && (
        <div className={`rounded-2xl border p-4 text-sm font-bold ${success ? "bg-[#e7f6e9] border-[#b8dfc0] text-[#216b34]" : "bg-[#ffe7e3] border-[#f5b8af] text-[#b83b2d]"}`}>
          <i className={`fas ${success ? "fa-check-circle" : "fa-triangle-exclamation"} mr-2`}></i>
          {success || error}
        </div>
      )}

      <section className="rounded-[1.7rem] bg-white border border-[#eadfce] p-4 lg:p-5 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px_140px] gap-3">
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#b96d1e]"></i>
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm kiếm bài viết theo tiêu đề, danh mục, tóm tắt..." className="w-full rounded-2xl border border-[#eadfce] bg-[#fbf8f1] py-3 pl-11 pr-4 text-sm outline-none focus:border-[#183b20]" />
          </div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="rounded-2xl border border-[#eadfce] bg-[#fbf8f1] px-4 py-3 text-sm font-bold outline-none focus:border-[#183b20]">
            <option value="all">Tất cả danh mục</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button onClick={resetFilters} className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-black text-[#7b6c55] hover:bg-[#fbf8f1] transition-colors">
            <i className="fas fa-rotate-left mr-2"></i>Reset
          </button>
        </div>
      </section>

      <section className="rounded-[1.7rem] bg-white border border-[#eadfce] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#fbf8f1] text-[#75664e]">
              <tr>
                <th className="text-left px-6 py-4 font-black">Bài viết</th>
                <th className="text-left px-6 py-4 font-black">Danh mục</th>
                <th className="text-left px-6 py-4 font-black">Tác giả</th>
                <th className="text-left px-6 py-4 font-black">Ngày đăng</th>
                <th className="text-right px-6 py-4 font-black">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0e5d4]">
              {filteredPosts.map((post) => (
                <tr key={post._id} className="hover:bg-[#fffaf2] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={getImageUrl(post.image)} alt="" className="w-20 h-12 rounded-xl object-cover bg-[#fbf8f1] border border-[#eadfce] flex-shrink-0" />
                      <div>
                        <p className="font-black text-[#183b20] line-clamp-1">{post.title}</p>
                        <p className="text-xs text-[#8c7d66] mt-1 line-clamp-1">{post.summary}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-[#eef5eb] text-[#2f6d38] border border-[#cfe2c9] px-3 py-1.5 rounded-full text-xs font-black">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#3f4a35]">{post.author}</td>
                  <td className="px-6 py-4 text-[#7b6c55] font-bold">
                    {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditModal(post)} className="w-10 h-10 rounded-xl bg-[#eef5eb] text-[#183b20] hover:bg-[#183b20] hover:text-white transition-all" title="Sửa">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDelete(post._id)} className="w-10 h-10 rounded-xl bg-[#fff0ed] text-[#b83b2d] hover:bg-[#b83b2d] hover:text-white transition-all" title="Xóa">
                        <i className="far fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-14 text-center text-[#9a8d76]">
                    <i className="fas fa-newspaper text-4xl mb-3 block text-[#d8c6ab]"></i>
                    Không có bài viết nào khớp với bộ lọc
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-5xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-[#eadfce] px-6 py-5 flex justify-between items-center rounded-t-[2rem]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d8892b]">Article Editor</p>
                <h3 className="text-2xl font-black text-[#183b20]">
                  {editPost ? "Chỉnh sửa bài viết" : "Đăng bài viết mới"}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-11 h-11 rounded-2xl bg-[#fbf8f1] text-[#7b6c55] hover:bg-[#183b20] hover:text-white transition-all">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="lg:col-span-2">
                  <UploadBox field="image" label="Ảnh bài viết" required formData={formData} uploadingField={uploadingField} onUpload={handleUpload} />
                </div>
                <Input label="Tiêu đề bài viết *" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Công dụng tuyệt vời từ Hạt Điều" wide />
                
                <Field label="Danh mục *">
                  <select name="category" value={formData.category} onChange={handleInputChange} className="admin-input">
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </Field>
                <Input label="Tác giả" name="author" value={formData.author} onChange={handleInputChange} placeholder="Nutricore Tây Nguyên" />
                
                <Field label="Tóm tắt bài viết (Summary) *" wide>
                  <textarea name="summary" rows="2" value={formData.summary} onChange={handleInputChange} required className="admin-input resize-none" placeholder="Tóm tắt ngắn gọn xuất hiện trên danh sách bài viết..."></textarea>
                </Field>

                <div className="lg:col-span-2 space-y-3">
                  <div className="flex border-b border-gray-200">
                    <button type="button" onClick={() => setActiveFormTab("write")} className={`px-4 py-2 text-sm font-bold uppercase ${activeFormTab === "write" ? "border-b-2 border-[#183b20] text-[#183b20]" : "text-gray-400"}`}>Soạn thảo (HTML)</button>
                    <button type="button" onClick={() => setActiveFormTab("preview")} className={`px-4 py-2 text-sm font-bold uppercase ${activeFormTab === "preview" ? "border-b-2 border-[#183b20] text-[#183b20]" : "text-gray-400"}`}>Xem trước (Preview)</button>
                  </div>

                  {activeFormTab === "write" ? (
                    <Field label="Nội dung bài viết (HTML) *">
                      <textarea name="content" rows="12" value={formData.content} onChange={handleInputChange} required className="admin-input font-mono text-xs leading-relaxed" placeholder="Nội dung bài viết. Bạn có thể sử dụng các thẻ HTML như <p>, <h2>, <h3>, <ul>, <li>, <strong> để định dạng..."></textarea>
                    </Field>
                  ) : (
                    <div className="rounded-2xl border border-[#eadfce] bg-gray-50 p-6 min-h-[300px] overflow-y-auto max-h-[500px]">
                      <div className="prose max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: formData.content || "<p className='text-gray-400 italic'>Chưa có nội dung để hiển thị.</p>" }}></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-5 border-t border-[#eadfce] flex flex-col sm:flex-row justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-2xl border border-[#eadfce] px-6 py-3 font-black text-[#7b6c55] hover:bg-[#fbf8f1]">
                  HỦY BỎ
                </button>
                <button type="submit" disabled={saving || uploadingField} className="rounded-2xl bg-[#183b20] px-7 py-3 font-black text-white hover:bg-[#244d2d] disabled:opacity-60 shadow-lg shadow-[#183b20]/15">
                  <i className={`fas ${saving ? "fa-spinner fa-spin" : "fa-floppy-disk"} mr-2`}></i>
                  LƯU BÀI VIẾT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
