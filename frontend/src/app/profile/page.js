"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

const PASSWORD_POLICY_MESSAGE = "Mật khẩu phải có ít nhất 6 ký tự, gồm chữ hoa, chữ thường và số";
const isStrongPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn, loading, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState("info");

  // Profile info state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState({ type: "", text: "" });

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState({ type: "", text: "" });

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login?redirect=/profile");
    }
  }, [loading, isLoggedIn, router]);

  // Pre-fill user info
  const populateFields = useCallback(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, [user]);

  useEffect(() => {
    queueMicrotask(populateFields);
  }, [populateFields]);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setInfoMessage({ type: "error", text: "Vui lòng nhập họ tên" });
      return;
    }

    setInfoLoading(true);
    setInfoMessage({ type: "", text: "" });

    try {
      const data = await api.put("/auth/profile", {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      updateUser(data.user);
      setInfoMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
    } catch (err) {
      setInfoMessage({ type: "error", text: err.message || "Cập nhật thất bại" });
    } finally {
      setInfoLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !isStrongPassword(newPassword)) {
      setPwMessage({ type: "error", text: PASSWORD_POLICY_MESSAGE });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMessage({ type: "error", text: "Mật khẩu xác nhận không khớp" });
      return;
    }
    // Only require current password if user has one (not Google-only)
    if (!user?.googleId && !currentPassword) {
      setPwMessage({ type: "error", text: "Vui lòng nhập mật khẩu hiện tại" });
      return;
    }

    setPwLoading(true);
    setPwMessage({ type: "", text: "" });

    try {
      const body = { newPassword };
      if (currentPassword) body.currentPassword = currentPassword;

      const data = await api.put("/auth/change-password", body);
      setPwMessage({ type: "success", text: data.message || "Đổi mật khẩu thành công!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwMessage({ type: "error", text: err.message || "Đổi mật khẩu thất bại" });
    } finally {
      setPwLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="auth-container">
        <div className="flex items-center justify-center py-20">
          <i className="fas fa-spinner fa-spin text-4xl text-[#45572f]"></i>
        </div>
      </div>
    );
  }

  const isGoogleOnly = !!user.googleId && !user.password;

  return (
    <div>

      <section className="max-w-[700px] mx-auto px-4 section-padding">
        {/* User Avatar & Role Badge */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden">
            <img src={user.avatar || "/Avatar.png"} alt="" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              user.role === "admin"
                ? "bg-amber-100 text-amber-700"
                : "bg-green-100 text-green-700"
            }`}>
              <i className={`fas ${user.role === "admin" ? "fa-shield-alt" : "fa-user"} mr-1`}></i>
              {user.role === "admin" ? "Quản trị viên" : "Khách hàng"}
            </span>
            {user.googleId && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                <i className="fab fa-google mr-1"></i>Google
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors border-b-2 ${
              activeTab === "info"
                ? "border-[#45572f] text-[#45572f]"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <i className="fas fa-user-edit mr-2"></i>Thông tin
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors border-b-2 ${
              activeTab === "password"
                ? "border-[#45572f] text-[#45572f]"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <i className="fas fa-lock mr-2"></i>Đổi mật khẩu
          </button>
        </div>

        {/* Tab: Info */}
        {activeTab === "info" && (
          <form onSubmit={handleUpdateInfo} className="bg-white border border-gray-200 rounded-xl p-8">
            {infoMessage.text && (
              <div className={`p-3 rounded-lg text-sm mb-6 flex items-center gap-2 ${
                infoMessage.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                <i className={`fas ${infoMessage.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`}></i>
                {infoMessage.text}
              </div>
            )}

            <div className="form-group">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <i className="fas fa-envelope mr-2 text-[#45572f]"></i>Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="input-field w-full bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email không thể thay đổi</p>
            </div>

            <div className="form-group">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <i className="fas fa-user mr-2 text-[#45572f]"></i>Họ và tên *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field w-full"
                required
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <i className="fas fa-phone mr-2 text-[#45572f]"></i>Số điện thoại
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field w-full"
                placeholder="0xxx xxx xxx"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <i className="fas fa-map-marker-alt mr-2 text-[#45572f]"></i>Địa chỉ
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input-field w-full min-h-[80px] resize-none"
                placeholder="Nhập địa chỉ giao hàng"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={infoLoading}
              className="btn btn-primary w-full py-3 rounded-full font-bold uppercase mt-2"
            >
              {infoLoading ? (
                <><i className="fas fa-spinner fa-spin mr-2"></i>Đang cập nhật...</>
              ) : (
                <><i className="fas fa-save mr-2"></i>Lưu thay đổi</>
              )}
            </button>
          </form>
        )}

        {/* Tab: Password */}
        {activeTab === "password" && (
          <form onSubmit={handleChangePassword} className="bg-white border border-gray-200 rounded-xl p-8">
            {pwMessage.text && (
              <div className={`p-3 rounded-lg text-sm mb-6 flex items-center gap-2 ${
                pwMessage.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                <i className={`fas ${pwMessage.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`}></i>
                {pwMessage.text}
              </div>
            )}

            {isGoogleOnly && (
              <div className="bg-blue-50 text-blue-700 border border-blue-200 p-3 rounded-lg text-sm mb-6 flex items-center gap-2">
                <i className="fas fa-info-circle"></i>
                Tài khoản Google chưa có mật khẩu. Bạn có thể đặt mật khẩu mới để đăng nhập bằng email.
              </div>
            )}

            {!isGoogleOnly && (
              <div className="form-group">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  <i className="fas fa-key mr-2 text-[#45572f]"></i>Mật khẩu hiện tại *
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input-field w-full"
                  placeholder="••••••••"
                />
              </div>
            )}

            <div className="form-group">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <i className="fas fa-lock mr-2 text-[#45572f]"></i>Mật khẩu mới *
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field w-full"
                placeholder="VD: Abc123"
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">Ít nhất 6 ký tự, gồm chữ hoa, chữ thường và số.</p>
            </div>

            <div className="form-group">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <i className="fas fa-check-double mr-2 text-[#45572f]"></i>Xác nhận mật khẩu mới *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field w-full"
                placeholder="Nhập lại mật khẩu mới"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={pwLoading}
              className="btn btn-primary w-full py-3 rounded-full font-bold uppercase mt-2"
            >
              {pwLoading ? (
                <><i className="fas fa-spinner fa-spin mr-2"></i>Đang xử lý...</>
              ) : (
                <><i className="fas fa-shield-alt mr-2"></i>Đổi mật khẩu</>
              )}
            </button>
          </form>
        )}

        {/* Account created date */}
        <p className="text-center text-xs text-gray-400 mt-8">
          <i className="far fa-calendar-alt mr-1"></i>
          Tài khoản tạo ngày {new Date(user.createdAt).toLocaleDateString("vi-VN")}
        </p>
      </section>
    </div>
  );
}
