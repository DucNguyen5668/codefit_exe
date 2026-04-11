import React from 'react';
import { NavLink } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen pt-[72px] bg-gradient-to-br from-dark-900 via-dark-50 to-dark-900">
      <section className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase mb-4">
          Chào mừng đến với
        </p>
        <h1 className="text-7xl md:text-8xl font-extrabold mb-8">
          <span className="gradient-text">CodeFit</span>
        </h1>
        <NavLink
          to="/courses"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-bold text-white
            bg-gradient-to-r from-brand-500 to-cyan-500
            hover:shadow-glow transition-all duration-300 hover:-translate-y-1 no-underline"
        >
          <Zap className="w-5 h-5" />
          Bắt đầu
          <ArrowRight className="w-5 h-5" />
        </NavLink>
      </section>
    </div>
  );
}
