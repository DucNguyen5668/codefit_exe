"use client";

import { use } from "react";
import { articles } from "@/data/mockData";
import Link from "next/link";

export default function NutritionDetail({ params }) {
  const resolvedParams = use(params);
  const articleId = resolvedParams.id;

  const article = articles.find((a) => a.id === articleId);

  if (!article) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-20 text-center">
        <i className="fas fa-exclamation-triangle text-4xl text-[#cfa006] mb-4"></i>
        <h2 className="text-2xl font-bold mb-2">Không Tìm Thấy Bài Viết</h2>
        <p className="text-gray-500 mb-6">Bài viết bạn yêu cầu không tồn tại hoặc đã được gỡ bỏ.</p>
        <Link href="/nutrition" className="btn btn-primary">
          QUAY LẠI DANH MỤC
        </Link>
      </div>
    );
  }

  // Related articles (all except current, max 3)
  const relatedArticles = articles.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <div>
{/* Main Blog Content */}
      <article className="max-w-[900px] mx-auto px-4 pb-16">
        <header className="article-header">
          <span className="article-category">{article.category}</span>
          <h1 className="article-title text-2xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight">
            {article.title}
          </h1>
          <div className="article-meta-info text-sm text-gray-500 flex items-center gap-4">
            <span>
              <i className="far fa-calendar-alt mr-2 text-[#45572f]"></i>Ngày đăng: {article.date}
            </span>
            <span>
              <i className="far fa-user mr-2 text-[#45572f]"></i>Tác giả: Nutricore Admin
            </span>
          </div>
        </header>

        {/* Hero image of article */}
        <div className="w-full h-[300px] md:h-[450px] rounded-2xl overflow-hidden mb-10 shadow-sm">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        {/* Dynamic HTML Content */}
        <div 
          className="article-body prose max-w-none text-gray-800 text-base md:text-lg"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Divider */}
        <div className="border-t border-gray-100 my-16"></div>

        {/* Related Articles Carousel/Grid */}
        <div>
          <h3 className="text-xl font-bold font-montserrat text-gray-900 mb-8 border-b border-gray-100 pb-4 flex items-center gap-2">
            <i className="fas fa-bookmark text-[#cfa006]"></i> Bài viết liên quan
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((item) => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between group">
                <div>
                  <div className="h-44 overflow-hidden relative">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-[#cfa006] text-xs font-bold uppercase tracking-wider block mb-1">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-sm text-gray-800 line-clamp-2 leading-snug group-hover:text-[#45572f] transition-colors">
                      <Link href={`/nutrition/${item.id}`}>{item.title}</Link>
                    </h4>
                  </div>
                </div>
                
                <div className="px-5 pb-5 pt-3 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400 font-semibold">
                  <span>{item.date}</span>
                  <Link href={`/nutrition/${item.id}`} className="text-[#45572f] font-bold hover:text-[#cfa006] transition-colors">
                    Đọc tiếp
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
