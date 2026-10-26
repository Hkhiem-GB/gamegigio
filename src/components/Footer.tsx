
import React from 'react';

export const Footer: React.FC = () => {
  return (
      <footer className="relative w-full border-t border-[#3B2027] bg-[#10090B] py-3 sm:py-4 overflow-hidden">
        {/* Hiệu ứng ánh sáng quét từ trái sang phải */}
        <div
            className="pointer-events-none absolute top-0 left-0 h-[1px] w-1/3 animate-footer-light"
            style={{
              background:
                  'linear-gradient(90deg, transparent, #FF4359, #FF8A98, #FF4359, transparent)',
              boxShadow: '0 0 8px 1px rgba(255, 67, 89, 0.65)',
            }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-1.5">
          {/* Copyright */}
          <div className="text-center">
            <p className="text-xs text-[#A8A0A3]">
              © 2026 HokaDev. All rights reserved.
            </p>
            <p className="text-[11px] text-[#756D70] mt-0.5">
              Trang web hỗ trợ game thủ lựa chọn ngẫu nhiên các tựa game chất lượng trên nền tảng Steam.
            </p>
          </div>
        </div>

        <style>{`
        @keyframes footer-light-sweep {
          0% {
            transform: translateX(-110%);
          }
          100% {
            transform: translateX(410%);
          }
        }

        .animate-footer-light {
          animation: footer-light-sweep 3.5s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-footer-light {
            animation: none;
            opacity: 0.7;
            left: 33.333%;
          }
        }
      `}</style>
      </footer>
  );
};
