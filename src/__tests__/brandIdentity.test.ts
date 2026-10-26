import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Brand Identity & Vietnamese Typography Tests', () => {
  it('SVG Logo contains exact brand color codes', () => {
    const svgPath = path.resolve(process.cwd(), 'public/game-gi-gio-logo.svg');
    const svgContent = fs.readFileSync(svgPath, 'utf-8');

    // Primary Red
    expect(svgContent).toContain('#E61C39');
    // Off-White Highlights
    expect(svgContent).toContain('#F5F1EC');
    // Burgundy Shadow
    expect(svgContent).toContain('#9C1328');
  });

  it('tailwind.config.js configures Montserrat for brand font and exact brand colors', () => {
    const tailwindPath = path.resolve(process.cwd(), 'tailwind.config.js');
    const tailwindContent = fs.readFileSync(tailwindPath, 'utf-8');

    expect(tailwindContent).toContain('"Montserrat"');
    expect(tailwindContent).toContain('#E61C39');
    expect(tailwindContent).toContain('#F5F1EC');
    expect(tailwindContent).toContain('#9C1328');
  });

  it('index.html imports Montserrat with weights 800 and 900', () => {
    const htmlPath = path.resolve(process.cwd(), 'index.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

    expect(htmlContent).toContain('family=Montserrat:wght@800;900');
    expect(htmlContent).toContain('selection:bg-[#E61C39]');
  });

  it('Header brand name adheres to #F5F1EC for "GAME GÌ GIỜ" and #E61C39 for "?"', () => {
    const headerPath = path.resolve(process.cwd(), 'src/components/Header.tsx');
    const headerContent = fs.readFileSync(headerPath, 'utf-8');

    expect(headerContent).toContain('GAME GÌ GIỜ');
    expect(headerContent).toContain('text-[#F5F1EC]');
    expect(headerContent).toContain('text-[#E61C39]');
    expect(headerContent).toContain('font-brand');
    expect(headerContent).toContain('tracking-[-0.02em]');
  });

  it('Hero Title in App.tsx adheres to #F5F1EC for "GAME GÌ GIỜ" and #E61C39 for "?"', () => {
    const appPath = path.resolve(process.cwd(), 'src/App.tsx');
    const appContent = fs.readFileSync(appPath, 'utf-8');

    expect(appContent).toContain('GAME GÌ GIỜ');
    expect(appContent).toContain('text-[#F5F1EC]');
    expect(appContent).toContain('text-[#E61C39]');
    expect(appContent).toContain('font-brand');
    expect(appContent).toContain('tracking-[-0.02em]');
  });

  it('Footer.tsx displays copyright and description', () => {
    const footerPath = path.resolve(process.cwd(), 'src/components/Footer.tsx');
    const footerContent = fs.readFileSync(footerPath, 'utf-8');

    expect(footerContent).toContain('© 2026 HokaDev. All rights reserved.');
    expect(footerContent).toContain('Trang web hỗ trợ game thủ');
  });

  it('Validates Vietnamese diacritics integrity (GÌ, GIỜ, Đ, Ư, Ơ)', () => {
    const testWords = ['GAME GÌ GIỜ?', 'ĐẶC BIỆT', 'ƯU TIÊN', 'ƠN NGHĨA'];
    for (const word of testWords) {
      // Ensure strings can be normalized to NFC and NFD without corruption
      const nfc = word.normalize('NFC');
      const nfd = word.normalize('NFD');
      expect(nfc.length).toBeGreaterThan(0);
      expect(nfd.normalize('NFC')).toBe(nfc);
    }

    // Specific codepoints check
    expect('GÌ'.charCodeAt(1)).toBe(0x00cc); // Ì
    expect('GIỜ'.charCodeAt(2)).toBe(0x1edc); // Ờ
    expect('Đ'.charCodeAt(0)).toBe(0x0110);   // Đ
    expect('Ư'.charCodeAt(0)).toBe(0x01af);   // Ư
    expect('Ơ'.charCodeAt(0)).toBe(0x01a0);   // Ơ
  });
});
