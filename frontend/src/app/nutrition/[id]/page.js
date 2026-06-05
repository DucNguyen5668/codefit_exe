"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";

function getImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("/Dinh_duong") || url.startsWith("/ca_")) return url;
  if (url.startsWith("/uploads")) return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://127.0.0.1:5000"}${url}`;
  return url;
}

export default function NutritionDetail({ params }) {
  const resolvedParams = use(params);
  const articleId = resolvedParams.id;

  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadArticleData() {
      try {
        setLoading(true);
        // Fetch specific article by slug or ID
        const detailData = await api.get(`/posts/${articleId}`);
        setArticle(detailData.post);

        // Fetch all active articles to compute related ones
        const listData = await api.get("/posts");
        const allPosts = listData.posts || [];
        
        // Filter out current article and show top 3 related ones
        const filtered = allPosts
          .filter((p) => p._id !== detailData.post._id && p.slug !== detailData.post.slug)
          .slice(0, 3);
        setRelatedArticles(filtered);
      } catch (err) {
        console.error("Load article data error:", err);
        setError("Không tìm thấy bài viết yêu cầu hoặc lỗi kết nối.");
      } finally {
        setLoading(false);
      }
    }

    if (articleId) {
      loadArticleData();
    }
  }, [articleId]);

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-20 text-center">
        <i className="fas fa-spinner fa-spin text-4xl text-[#45572f] mb-4"></i>
        <p className="text-gray-500">Đang tải nội dung bài viết...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-20 text-center">
        <i className="fas fa-exclamation-triangle text-4xl text-[#cfa006] mb-4"></i>
        <h2 className="text-2xl font-bold mb-2">Không Tìm Thấy Bài Viết</h2>
        <p className="text-gray-500 mb-6">{error || "Bài viết bạn yêu cầu không tồn tại hoặc đã được gỡ bỏ."}</p>
        <Link href="/nutrition" className="btn btn-primary">
          QUAY LẠI DANH MỤC
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Main Blog Content */}
      <article className="max-w-[900px] mx-auto px-4 pb-16">
        <header className="article-header py-8">
          <span className="article-category bg-[#45572f]/10 text-[#45572f] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {article.category}
          </span>
          <h1 className="article-title text-2xl md:text-4xl font-extrabold text-gray-900 mt-4 mb-4 leading-tight">
            {article.title}
          </h1>
          <div className="article-meta-info text-sm text-gray-500 flex items-center gap-4">
            <span>
              <i className="far fa-calendar-alt mr-2 text-[#45572f]"></i>Ngày đăng: {new Date(article.createdAt).toLocaleDateString("vi-VN")}
            </span>
            <span>
              <i className="far fa-user mr-2 text-[#45572f]"></i>Tác giả: {article.author || "Nutricore Admin"}
            </span>
          </div>
        </header>

        {/* Hero image of article */}
        <div className="w-full h-[300px] md:h-[450px] rounded-2xl overflow-hidden mb-10 shadow-sm border border-gray-100">
          <img src={getImageUrl(article.image)} alt={article.title} className="w-full h-full object-cover" />
        </div>

        {/* Dynamic HTML Content */}
        <div 
          className="article-body prose max-w-none text-gray-800 text-base md:text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Divider */}
        <div className="border-t border-gray-100 my-16"></div>

        {/* Related Articles Carousel/Grid */}
        {relatedArticles.length > 0 && (
          <div>
            <h3 className="text-xl font-bold font-montserrat text-gray-900 mb-8 border-b border-gray-100 pb-4 flex items-center gap-2">
              <i className="fas fa-bookmark text-[#cfa006]"></i> Bài viết liên quan
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((item) => (
                <div key={item._id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between group">
                  <div>
                    <div className="h-44 overflow-hidden relative">
                      <img 
                        src={getImageUrl(item.image)} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                      />
                    </div>
                    <div className="p-5">
                      <span className="text-[#cfa006] text-xs font-bold uppercase tracking-wider block mb-1">
                        {item.category}
                      </span>
                      <h4 className="font-bold text-sm text-gray-800 line-clamp-2 leading-snug group-hover:text-[#45572f] transition-colors">
                        <Link href={`/nutrition/${item.slug || item._id}`}>{item.title}</Link>
                      </h4>
                    </div>
                  </div>
                  
                  <div className="px-5 pb-5 pt-3 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400 font-semibold">
                    <span>{new Date(item.createdAt).toLocaleDateString("vi-VN")}</span>
                    <Link href={`/nutrition/${item.slug || item._id}`} className="text-[#45572f] font-bold hover:text-[#cfa006] transition-colors">
                      Đọc tiếp
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
