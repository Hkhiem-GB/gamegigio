import React, { useEffect } from 'react';
import { X, Info, Gamepad2 } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  // Close on Escape key & Lock background scroll when open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className="relative z-10 w-full max-w-lg bg-[#180B0F]/98 border border-[#3B2027] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/90 overflow-hidden flex flex-col items-center text-center animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* SVG Running Border Light Beam (Tia sáng hồng đỏ chạy bám sát theo viền bo góc) */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 w-full h-full overflow-visible z-20"
        >
          {/* Lớp quầng sáng neon mờ dịu */}
          <rect
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            rx="24"
            ry="24"
            fill="none"
            stroke="#E61C39"
            strokeWidth="5"
            strokeLinecap="round"
            pathLength="100"
            className="animate-border-beam opacity-50"
            style={{
              strokeDasharray: '22 78',
              filter: 'drop-shadow(0 0 8px rgba(230, 28, 57, 0.8))',
            }}
          />
          {/* Lớp tia sáng hồng đỏ sắc nét */}
          <rect
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            rx="24"
            ry="24"
            fill="none"
            stroke="#FF4359"
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength="100"
            className="animate-border-beam"
            style={{
              strokeDasharray: '18 82',
              strokeDashoffset: '-2',
              filter: 'drop-shadow(0 0 6px #FF8A98)',
            }}
          />
          {/* Lớp lõi ánh sáng trắng hồng rực rỡ */}
          <rect
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            rx="24"
            ry="24"
            fill="none"
            stroke="#FFF0F3"
            strokeWidth="1.5"
            strokeLinecap="round"
            pathLength="100"
            className="animate-border-beam"
            style={{
              strokeDasharray: '8 92',
              strokeDashoffset: '-7',
            }}
          />
        </svg>

        {/* Ambient Crimson Glow (Top Center) */}
        <div
          aria-hidden="true"
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-40 bg-[#E61C39]/25 blur-3xl rounded-full pointer-events-none"
        />

        {/* Close Button 'X' (Top-Right) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng cửa sổ chào mừng"
          className="absolute top-4 right-4 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#211014] hover:bg-[#E52E45] text-[#A8A0A3] hover:text-white border border-[#3B2027] hover:border-[#FF4359] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="relative mt-1 mb-3">
          <img
            src="/game-gi-gio-logo.svg"
            alt="Game Gì Giờ? Logo"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain filter drop-shadow-[0_0_14px_rgba(230,28,57,0.5)] transition-transform hover:scale-105"
          />
        </div>

        {/* Brand Name Title */}
        <h2
          id="welcome-modal-title"
          className="font-brand font-black text-2xl sm:text-3xl tracking-[-0.02em] text-[#F5F1EC] uppercase select-none drop-shadow-sm"
        >
          GAME GÌ GIỜ<span className="text-[#E61C39] drop-shadow-[0_0_16px_rgba(230,28,57,0.6)] ml-[0.03em]">?</span>
        </h2>

        {/* Badge */}
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#2A1218] text-[#FF4359] border border-[#E61C39]/30">
          <Gamepad2 className="w-3.5 h-3.5 text-[#E61C39]" />
          <span>Vòng quay chọn game Steam ngẫu nhiên</span>
        </div>

        {/* Website Description */}
        <div className="mt-4 space-y-2 text-xs sm:text-sm text-[#A8A0A3] leading-relaxed">
          <p>
            Chào mừng bạn đến với <strong className="text-[#F5F1EC] font-semibold">Game Gì Giờ?</strong> — Giải pháp giúp bạn chấm dứt cơn đau đầu mỗi khi tự hỏi: <em className="text-[#F5F1EC]">"Hôm nay chơi gì?"</em>.
          </p>
          <p>
            Trang web hỗ trợ bạn quay ngẫu nhiên và tra cứu hàng trăm tựa game chất lượng trên nền tảng Steam theo từng thể loại, độ hiếm, tích hợp trailer và thông tin Việt hóa chi tiết.
          </p>
        </div>

        {/* Thank You & Enjoyment Wishes */}
        <div className="mt-4 px-4 py-2.5 rounded-xl bg-[#211014]/70 border border-[#3B2027]/80 text-xs sm:text-sm text-[#F5F3F4]/90 font-medium leading-relaxed">
          Cảm ơn bạn đã ghé thăm! Chúc bạn có những giờ phút trải nghiệm chơi game thật bùng nổ, vui vẻ! 🎮✨
        </div>

        {/* Important Vietnam Steam Notice Box */}
        <div className="w-full mt-4 p-3.5 rounded-2xl bg-[#281116]/90 border border-[#E61C39]/40 text-left flex items-start gap-3 shadow-inner">
          <div className="w-6 h-6 rounded-full bg-[#E61C39]/20 border border-[#E61C39]/40 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-3.5 h-3.5 text-[#FF4359]" />
          </div>
          <p className="text-[11px] sm:text-xs text-[#E8D8DC] leading-relaxed">
            <strong className="text-[#FF4359] font-bold">*Lưu ý:</strong> Steam hiện đang bị hạn chế tại Việt Nam. Hãy đổi sang <strong className="text-white font-semibold">VPN</strong> hoặc bật <strong className="text-white font-semibold">1.1.1.1 (Cloudflare)</strong> để có trải nghiệm tốt nhất.
          </p>
        </div>
      </div>
    </div>
  );
};
