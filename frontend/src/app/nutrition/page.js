import Link from "next/link";
import { articles } from "@/data/mockData";

export default function NutritionOverview() {
  return (
    <div>
      {/* Page Banner */}
      <section className="page-banner">
        <div className="max-w-[1200px] mx-auto px-4 banner-inner">
          <h1 className="banner-title">Góc Dinh Dưỡng</h1>
          <div className="breadcrumbs">
            <Link href="/">Trang chủ</Link>
            <i className="fas fa-chevron-right text-xs"></i>
            <span>Dinh dưỡng</span>
          </div>
        </div>
      </section>

      {/* Articles Grid Container */}
      <section className="max-w-[1200px] mx-auto px-4 section-padding">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-[#cfa006] uppercase tracking-wider font-bold text-xs">BLOG & KIẾN THỨC</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-1 mb-4 font-montserrat">
            Bí Quyết Dinh Dưỡng Khoẻ Mạnh
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Khám phá những phân tích chuyên sâu về lợi ích của các loại hạt khô tự nhiên, cà phê rang mộc sạch và siêu thực phẩm cacao trong chế độ ăn hàng ngày.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article) => (
            <div 
              key={article.id} 
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row h-full group"
            >
              {/* Blog Image */}
              <div className="md:w-5/12 h-64 md:h-auto relative overflow-hidden bg-gray-100 flex-shrink-0">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Blog Details */}
              <div className="p-6 md:p-8 flex flex-col flex-grow justify-between">
                <div>
                  <span className="text-[#cfa006] font-bold text-xs uppercase tracking-wider block mb-2">
                    {article.category}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold font-montserrat text-gray-800 line-clamp-2 mb-3 group-hover:text-[#45572f] transition-colors leading-snug">
                    <Link href={`/nutrition/${article.id}`}>
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-4">
                    {article.summary}
                  </p>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-50 text-xs text-gray-400 font-semibold">
                  <span>
                    <i className="far fa-calendar-alt mr-1.5 text-[#45572f]"></i> {article.date}
                  </span>
                  <Link 
                    href={`/nutrition/${article.id}`} 
                    className="text-[#45572f] hover:text-[#cfa006] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    Xem chi tiết <i className="fas fa-arrow-right text-[10px]"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
