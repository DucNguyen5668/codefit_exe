"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

const ICON_OPTIONS = [
  { value: "fas fa-heart", label: "Trái tim" },
  { value: "fas fa-check", label: "Tích xanh" },
  { value: "fas fa-star", label: "Ngôi sao" },
  { value: "fas fa-leaf", label: "Chiếc lá" },
  { value: "fas fa-shield-alt", label: "Chiếc khiên" },
  { value: "fas fa-award", label: "Huy chương" },
];

export default function AboutUsPage() {
  const { isAdmin } = useAuth();
  
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadContent() {
      try {
        const data = await api.getAboutContent();
        setAboutData(data);
      } catch (err) {
        console.error("Failed to load about us content:", err);
        setError("Không thể tải nội dung trang About Us. Vui lòng tải lại trang.");
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await api.updateAboutContent(editData);
      setAboutData(updated);
      setIsEditing(false);
      alert("Cập nhật nội dung trang About Us thành công!");
    } catch (err) {
      console.error("Failed to save about content:", err);
      alert("Cập nhật thất bại: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(null);
    setIsEditing(false);
  };

  const handleImageUpload = async (e, indexToReplace = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước file ảnh không được vượt quá 5MB");
      return;
    }

    try {
      setSaving(true);
      const res = await api.uploadImage(file);
      const uploadedUrl = res.url;

      const updatedImages = [...editData.images];
      if (indexToReplace !== null) {
        updatedImages[indexToReplace] = uploadedUrl;
      } else {
        if (updatedImages.length >= 3) {
          alert("Chỉ cho phép tối đa 3 ảnh");
          setSaving(false);
          return;
        }
        updatedImages.push(uploadedUrl);
      }

      setEditData({ ...editData, images: updatedImages });
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Tải lên ảnh thất bại: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageDelete = (indexToDelete) => {
    if (editData.images.length <= 1) {
      alert("Trang About Us cần hiển thị nhất 1 hình ảnh.");
      return;
    }
    const updatedImages = editData.images.filter((_, idx) => idx !== indexToDelete);
    setEditData({ ...editData, images: updatedImages });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <i className="fas fa-spinner animate-spin text-3xl text-[#45572f]"></i>
        <p className="text-gray-500 text-sm font-semibold">Đang tải nội dung...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16 text-center">
        <div className="inline-flex w-16 h-16 rounded-full bg-red-50 text-red-500 items-center justify-center mb-4 text-2xl">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <p className="text-gray-700 font-semibold mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-[#45572f] hover:bg-[#607a44] text-white font-bold py-2 px-6 rounded-full text-sm"
        >
          Tải lại trang
        </button>
      </div>
    );
  }

  const currentData = isEditing ? editData : aboutData;

  return (
    <div className="relative animate-fadeIn">
      {/* Admin Control Bar */}
      {isAdmin && (
        <div className="bg-amber-50 border-b border-amber-200 py-3 px-4 sticky top-[75px] z-50 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fas fa-user-shield text-amber-600"></i>
            <span className="text-xs md:text-sm font-semibold text-amber-800">Chế độ quản trị About Us</span>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs py-1.5 px-4 rounded-lg flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                >
                  {saving ? (
                    <>
                      <i className="fas fa-spinner animate-spin"></i> Đang lưu...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i> Lưu lại
                    </>
                  )}
                </button>
                <button 
                  onClick={handleCancel}
                  disabled={saving}
                  className="bg-gray-500 hover:bg-gray-600 disabled:opacity-50 text-white font-bold text-xs py-1.5 px-4 rounded-lg flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                >
                  <i className="fas fa-times"></i> Hủy bỏ
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  setEditData({ ...aboutData });
                  setIsEditing(true);
                }}
                className="bg-[#45572f] hover:bg-[#607a44] text-white font-bold text-xs py-1.5 px-4 rounded-lg flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
              >
                <i className="fas fa-edit"></i> Chỉnh sửa nội dung
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <section className="max-w-[1200px] mx-auto px-4 section-padding">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Info Text */}
          <div className="flex-1 space-y-6 w-full">
            
            {/* Subtitle */}
            <div>
              {isEditing ? (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase">Tiêu đề phụ Sứ mệnh</label>
                  <input 
                    type="text" 
                    value={editData.missionSubtitle} 
                    onChange={(e) => setEditData({ ...editData, missionSubtitle: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-gray-200 text-xs font-bold text-[#cfa006] uppercase tracking-wider outline-none focus:border-[#45572f]"
                  />
                </div>
              ) : (
                <span className="text-[#cfa006] uppercase tracking-wider font-bold text-xs">{aboutData.missionSubtitle}</span>
              )}
            </div>

            {/* Title */}
            <div>
              {isEditing ? (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase">Tiêu đề chính Sứ mệnh</label>
                  <input 
                    type="text" 
                    value={editData.missionTitle} 
                    onChange={(e) => setEditData({ ...editData, missionTitle: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-gray-200 text-lg font-bold text-gray-900 outline-none focus:border-[#45572f]"
                  />
                </div>
              ) : (
                <h2 className="text-3xl font-extrabold text-gray-900 font-montserrat leading-tight">
                  {aboutData.missionTitle}
                </h2>
              )}
            </div>

            {/* Paragraphs */}
            <div className="space-y-4">
              {isEditing ? (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-400 uppercase">Đoạn văn nội dung giới thiệu</label>
                  {editData.missionParagraphs.map((para, pIndex) => (
                    <div key={pIndex} className="flex gap-2 items-start">
                      <textarea
                        value={para}
                        onChange={(e) => {
                          const updated = [...editData.missionParagraphs];
                          updated[pIndex] = e.target.value;
                          setEditData({ ...editData, missionParagraphs: updated });
                        }}
                        className="flex-1 min-h-[80px] p-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#45572f] leading-relaxed"
                        placeholder={`Đoạn văn thứ ${pIndex + 1}...`}
                      />
                      {editData.missionParagraphs.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => {
                            const updated = editData.missionParagraphs.filter((_, idx) => idx !== pIndex);
                            setEditData({ ...editData, missionParagraphs: updated });
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Xóa đoạn văn"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setEditData({
                        ...editData,
                        missionParagraphs: [...editData.missionParagraphs, ""]
                      });
                    }}
                    className="text-xs font-semibold text-[#45572f] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <i className="fas fa-plus-circle"></i> Thêm đoạn văn mới
                  </button>
                </div>
              ) : (
                aboutData.missionParagraphs.map((para, idx) => (
                  <p key={idx} className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {para}
                  </p>
                ))
              )}
            </div>

            {/* Core Values grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {isEditing ? (
                editData.coreValues.map((val, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50 relative space-y-3 shadow-sm">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-gray-400 uppercase">Giá trị cốt lõi {idx + 1}</label>
                      {editData.coreValues.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => {
                            const updated = editData.coreValues.filter((_, i) => i !== idx);
                            setEditData({ ...editData, coreValues: updated });
                          }}
                          className="text-red-500 text-xs font-semibold hover:underline cursor-pointer"
                        >
                          Xóa bỏ
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Chọn biểu tượng</label>
                      <select 
                        value={val.icon} 
                        onChange={(e) => {
                          const updated = [...editData.coreValues];
                          updated[idx] = { ...updated[idx], icon: e.target.value };
                          setEditData({ ...editData, coreValues: updated });
                        }}
                        className="w-full p-2.5 text-xs rounded-lg border border-gray-200 outline-none focus:border-[#45572f] bg-white cursor-pointer"
                      >
                        {ICON_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label} ({opt.value})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Tiêu đề</label>
                      <input 
                        type="text" 
                        value={val.title} 
                        onChange={(e) => {
                          const updated = [...editData.coreValues];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setEditData({ ...editData, coreValues: updated });
                        }}
                        className="w-full p-2 text-xs font-bold rounded-lg border border-gray-200 outline-none focus:border-[#45572f]"
                        placeholder="Tiêu đề..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Mô tả ngắn</label>
                      <textarea 
                        value={val.description} 
                        onChange={(e) => {
                          const updated = [...editData.coreValues];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setEditData({ ...editData, coreValues: updated });
                        }}
                        className="w-full p-2 text-xs rounded-lg border border-gray-200 min-h-[50px] outline-none focus:border-[#45572f]"
                        placeholder="Mô tả..."
                      />
                    </div>
                  </div>
                ))
              ) : (
                aboutData.coreValues.map((val, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-[#45572f] text-white flex items-center justify-center flex-shrink-0 shadow-sm animate-pulseOnce">
                      <i className={`${val.icon || "fas fa-check"} text-sm`}></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm mb-1">{val.title}</h4>
                      <p className="text-xs text-gray-500 leading-normal">{val.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setEditData({
                    ...editData,
                    coreValues: [...editData.coreValues, { icon: "fas fa-star", title: "Giá trị mới", description: "Mô tả giá trị cốt lõi mới." }]
                  });
                }}
                className="text-xs font-semibold text-[#45572f] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <i className="fas fa-plus-circle"></i> Thêm giá trị cốt lõi mới
              </button>
            )}
          </div>

          {/* Side Image / Images list (up to 3 stacked vertically) */}
          <div className="flex-1 flex flex-col gap-5 w-full max-w-lg lg:max-w-none">
            {currentData.images.map((imgUrl, index) => (
              <div key={index} className="relative rounded-2xl overflow-hidden shadow-md border-4 border-gray-50 group transition-all duration-300">
                <img 
                  src={imgUrl} 
                  alt={`Nutricore Tây Nguyên About image ${index + 1}`} 
                  className="w-full h-[260px] object-cover hover:scale-102 transition-transform duration-500"
                />
                
                {/* Image controls overlay when editing */}
                {isEditing && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="text-white text-xs font-bold">Hình ảnh {index + 1}</p>
                    <div className="flex gap-2">
                      <label className="cursor-pointer bg-white text-gray-800 hover:bg-gray-100 px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors">
                        <i className="fas fa-upload"></i> Thay ảnh
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleImageUpload(e, index)}
                        />
                      </label>
                      <button 
                        type="button"
                        onClick={() => handleImageDelete(index)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                      >
                        <i className="fas fa-trash-alt"></i> Xóa
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Add Image slot */}
            {isEditing && editData.images.length < 3 && (
              <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#45572f] hover:bg-gray-50 rounded-2xl h-[140px] transition-all bg-white shadow-sm">
                <i className="fas fa-plus-circle text-3xl text-gray-400 mb-2"></i>
                <span className="text-sm font-semibold text-gray-600">Thêm ảnh mới ({editData.images.length}/3)</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleImageUpload(e)}
                />
              </label>
            )}
          </div>
        </div>
      </section>

      {/* Vision Statement Section */}
      <section className="bg-gray-50 py-16 border-t border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          {isEditing ? (
            <div className="max-w-2xl mx-auto space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Tiêu đề phụ Tầm nhìn</label>
                <input 
                  type="text" 
                  value={editData.visionSubtitle} 
                  onChange={(e) => setEditData({ ...editData, visionSubtitle: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-gray-200 text-xs font-bold text-[#cfa006] text-center outline-none focus:border-[#45572f]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Tiêu đề chính Tầm nhìn</label>
                <input 
                  type="text" 
                  value={editData.visionTitle} 
                  onChange={(e) => setEditData({ ...editData, visionTitle: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-gray-200 text-base font-bold text-gray-900 text-center outline-none focus:border-[#45572f]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Mô tả Tầm nhìn</label>
                <textarea 
                  value={editData.visionDescription} 
                  onChange={(e) => setEditData({ ...editData, visionDescription: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-200 text-sm text-gray-600 min-h-[100px] outline-none focus:border-[#45572f] leading-relaxed"
                />
              </div>
            </div>
          ) : (
            <>
              <span className="text-[#cfa006] uppercase tracking-wider font-bold text-xs">{aboutData.visionSubtitle}</span>
              <h3 className="text-2xl md:text-3xl font-bold font-montserrat text-gray-900 mt-2 mb-4">
                {aboutData.visionTitle}
              </h3>
              <p className="text-gray-500 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
                {aboutData.visionDescription}
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
