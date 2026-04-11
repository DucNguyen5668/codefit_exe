import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { CreditCard, Check, Zap } from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Miễn phí",
    price: "0",
    desc: "Dành cho người mới bắt đầu",
    popular: false,
    features: [
      "3 khóa học cơ bản",
      "20 bài tập",
      "5 lượt hỏi AI/ngày",
      "Theo dõi tiến độ cơ bản",
    ],
    cta: "Bắt đầu miễn phí",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "399.000",
    desc: "Trọn bộ tính năng hoàn chỉnh",
    popular: true,
    features: [
      "Tất cả khóa học (200+ khóa)",
      "Bài tập không giới hạn",
      "AI hỏi đáp không giới hạn",
      "Phân tích chi tiết & Bảng quản trị",
      "Thống kê tiến độ nâng cao",
      "Hỗ trợ ưu tiên 24/7",
    ],
    cta: "Nâng cấp Enterprise",
  },
];

export default function Payment() {
  const handleSelectPlan = (plan) => {
    if (plan.id === "free") {
      toast.success("Bạn đã chọn gói miễn phí! Bắt đầu học ngay.");
      return;
    }
    toast.info(`Gói ${plan.name} - Đây là bản demo. Thanh toán thật sẽ được tích hợp sau.`);
  };

  return (
    <div className="min-h-screen pt-[72px]">
      <div className="max-w-4xl mx-auto px-6 py-10">

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
            bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-4">
            <Zap className="w-3 h-3" />
            Bảng giá
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            Chọn gói phù hợp với <span className="gradient-text">bạn</span>
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Đơn giản, minh bạch. Học lập trình hiệu quả với CodeFit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {plans.map((plan) => (
            <div key={plan.id} className={`relative bg-dark-100/70 backdrop-blur-xl border rounded-2xl p-8
              ${plan.popular
                ? "border-brand-500 shadow-glow"
                : "border-brand-500/15"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-brand-500 to-cyan-500 rounded-full text-xs font-bold text-white whitespace-nowrap">
                  PHỔ BIẾN NHẤT
                </div>
              )}

              <div className={`font-bold text-sm mb-2 ${plan.popular ? "text-brand-400" : "text-gray-500"}`}>
                {plan.name}
              </div>
              <div className="text-4xl font-black mb-1">
                {plan.price}
                <span className="text-base font-normal text-gray-600 ml-1">đ</span>
                {plan.id !== "free" && (
                  <span className="text-xs font-normal text-gray-600 ml-1">/tháng</span>
                )}
              </div>
              <p className="text-gray-500 text-sm mb-6">{plan.desc}</p>

              <ul className="flex flex-col gap-2.5 mb-6 list-none flex-1">
                {plan.features.map((ft) => (
                  <li key={ft} className="flex items-center gap-2.5 text-sm">
                    <div className="w-5 h-5 rounded-full bg-success-500/15 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-success-500" />
                    </div>
                    <span className="text-gray-400">{ft}</span>
                  </li>
                ))}
              </ul>

              {plan.id === "free" ? (
                <NavLink to="/register"
                  className={`w-full flex items-center justify-center py-3 rounded-xl text-sm font-bold no-underline transition-all
                    ${plan.popular
                      ? "bg-gradient-to-r from-brand-500 to-cyan-500 text-white hover:shadow-glow"
                      : "bg-dark-200/60 border border-brand-500/20 text-gray-300 hover:border-brand-500/40"
                    }`}
                >
                  {plan.cta}
                </NavLink>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full flex items-center justify-center py-3 rounded-xl text-sm font-bold transition-all
                    ${plan.popular
                      ? "bg-gradient-to-r from-brand-500 to-cyan-500 text-white hover:shadow-glow"
                      : "bg-dark-200/60 border border-brand-500/20 text-gray-300 hover:border-brand-500/40"
                    }`}
                >
                  {plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="bg-dark-100/50 border border-brand-500/10 rounded-xl p-5 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <CreditCard className="w-4 h-4 text-gray-600" />
            Thanh toán qua Momo, VNPay, thẻ tín dụng. Hoàn tiền trong 7 ngày nếu không hài lòng.
          </div>
        </div>
      </div>
    </div>
  );
}
