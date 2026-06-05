"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, customer: 0, admin: 0, banned: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, selectedRole, selectedStatus]);

  async function fetchUsers() {
    try {
      setLoading(true);
      setError("");
      
      const query = new URLSearchParams();
      if (searchTerm.trim()) query.append("search", searchTerm.trim());
      if (selectedRole !== "all") query.append("role", selectedRole);
      if (selectedStatus !== "all") query.append("status", selectedStatus);

      const data = await api.get(`/users?${query.toString()}`);
      setUsers(data.users || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Fetch users error:", err);
      setError(err.message || "Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  }

  const handleToggleBan = async (userToUpdate) => {
    const actionText = userToUpdate.isBanned ? "mở khóa" : "khóa";
    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản của ${userToUpdate.name || userToUpdate.email}?`)) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      const data = await api.put(`/users/${userToUpdate._id}/ban`);
      setSuccess(data.message || "Cập nhật trạng thái tài khoản thành công!");
      fetchUsers();
    } catch (err) {
      setError(err.message || "Không thể thay đổi trạng thái tài khoản.");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedRole("all");
    setSelectedStatus("all");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <section className="rounded-[2rem] bg-gradient-to-br from-[#183b20] via-[#264c2d] to-[#102918] text-white p-6 lg:p-8 shadow-2xl shadow-[#183b20]/15 overflow-hidden relative">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#d8892b]/20 rounded-full blur-3xl"></div>
        <div className="relative">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#f5cf9e]">Membership management</p>
          <h1 className="mt-3 text-3xl lg:text-4xl font-black">Quản lý khách hàng</h1>
          <p className="mt-3 max-w-2xl text-white/65">
            Xem danh sách tất cả các thành viên đã đăng ký, thống kê số lượng tài khoản và thực hiện khóa (ban) các tài khoản vi phạm chính sách của cửa hàng.
          </p>
        </div>
      </section>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="rounded-[1.7rem] bg-white border border-[#eadfce] p-6 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl flex-shrink-0">
            <i className="fas fa-users"></i>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Tổng người dùng</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.total}</h3>
          </div>
        </div>

        {/* Customers */}
        <div className="rounded-[1.7rem] bg-white border border-[#eadfce] p-6 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center text-xl flex-shrink-0">
            <i className="fas fa-user-tag"></i>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Khách hàng</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.customer}</h3>
          </div>
        </div>

        {/* Admins */}
        <div className="rounded-[1.7rem] bg-white border border-[#eadfce] p-6 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl flex-shrink-0">
            <i className="fas fa-user-shield"></i>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Quản trị viên</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.admin}</h3>
          </div>
        </div>

        {/* Banned */}
        <div className="rounded-[1.7rem] bg-white border border-[#eadfce] p-6 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-xl flex-shrink-0">
            <i className="fas fa-user-slash"></i>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Tài khoản bị khóa</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.banned}</h3>
          </div>
        </div>
      </div>

      {/* Message Notifications */}
      {(success || error) && (
        <div className={`rounded-2xl border p-4 text-sm font-bold ${success ? "bg-[#e7f6e9] border-[#b8dfc0] text-[#216b34]" : "bg-[#ffe7e3] border-[#f5b8af] text-[#b83b2d]"}`}>
          <i className={`fas ${success ? "fa-check-circle" : "fa-triangle-exclamation"} mr-2`}></i>
          {success || error}
        </div>
      )}

      {/* Search and Filters Section */}
      <section className="rounded-[1.7rem] bg-white border border-[#eadfce] p-4 lg:p-5 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px_200px_140px] gap-3">
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#b96d1e]"></i>
            <input 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Tìm theo họ tên, email, số điện thoại..." 
              className="w-full rounded-2xl border border-[#eadfce] bg-[#fbf8f1] py-3 pl-11 pr-4 text-sm outline-none focus:border-[#183b20]" 
            />
          </div>
          
          <select 
            value={selectedRole} 
            onChange={(e) => setSelectedRole(e.target.value)} 
            className="rounded-2xl border border-[#eadfce] bg-[#fbf8f1] px-4 py-3 text-sm font-bold outline-none focus:border-[#183b20]"
          >
            <option value="all">Tất cả quyền hạn</option>
            <option value="customer">Khách hàng</option>
            <option value="admin">Quản trị viên</option>
          </select>
          
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)} 
            className="rounded-2xl border border-[#eadfce] bg-[#fbf8f1] px-4 py-3 text-sm font-bold outline-none focus:border-[#183b20]"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="banned">Đã bị khóa</option>
          </select>
          
          <button 
            onClick={resetFilters} 
            className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-black text-[#7b6c55] hover:bg-[#fbf8f1] transition-colors"
          >
            <i className="fas fa-rotate-left mr-2"></i>Reset
          </button>
        </div>
      </section>

      {/* Users Table */}
      <section className="rounded-[1.7rem] bg-white border border-[#eadfce] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <i className="fas fa-spinner fa-spin text-4xl text-[#183b20]"></i>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-[#fbf8f1] text-[#75664e]">
                <tr>
                  <th className="text-left px-6 py-4 font-black">Người dùng</th>
                  <th className="text-left px-6 py-4 font-black">Liên hệ</th>
                  <th className="text-left px-6 py-4 font-black">Quyền hạn</th>
                  <th className="text-left px-6 py-4 font-black">Ngày tham gia</th>
                  <th className="text-left px-6 py-4 font-black">Trạng thái</th>
                  <th className="text-right px-6 py-4 font-black">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0e5d4]">
                {users.map((item) => (
                  <tr key={item._id} className="hover:bg-[#fffaf2] transition-colors">
                    {/* User profile */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
                          {item.avatar ? (
                            <img src={item.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <i className="fas fa-user text-gray-400 text-lg"></i>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-[#183b20]">{item.name || "Chưa đặt tên"}</p>
                          <p className="text-xs text-gray-400">{item.googleId ? "Đăng nhập bằng Google" : "Đăng nhập bằng Email"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact details */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{item.email}</p>
                      {item.phone && <p className="text-xs text-[#8c7d66] mt-0.5"><i className="fas fa-phone-alt mr-1 text-[10px]"></i>{item.phone}</p>}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${
                        item.role === "admin"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      }`}>
                        <i className={`fas ${item.role === "admin" ? "fa-shield-halved" : "fa-user"} mr-1 text-[10px]`}></i>
                        {item.role === "admin" ? "Quản trị viên" : "Khách hàng"}
                      </span>
                    </td>

                    {/* Date joined */}
                    <td className="px-6 py-4 text-gray-500 font-semibold">
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </td>

                    {/* Account status */}
                    <td className="px-6 py-4">
                      {item.isBanned ? (
                        <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-black inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                          Đã bị khóa
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-black inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          Hoạt động
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button 
                          onClick={() => handleToggleBan(item)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 border ${
                            item.isBanned
                              ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border-emerald-100"
                              : "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-red-100"
                          }`}
                          title={item.isBanned ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                        >
                          <i className={`fas ${item.isBanned ? "fa-unlock" : "fa-user-slash"}`}></i>
                          {item.isBanned ? "Mở khóa" : "Khóa"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {users.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-14 text-center text-[#9a8d76]">
                      <i className="fas fa-users-slash text-4xl mb-3 block text-[#d8c6ab]"></i>
                      Không tìm thấy người dùng nào phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
