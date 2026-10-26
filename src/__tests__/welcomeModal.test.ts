import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Welcome Modal Integrity Tests', () => {
  const componentPath = path.resolve(process.cwd(), 'src/components/WelcomeModal.tsx');
  const appPath = path.resolve(process.cwd(), 'src/App.tsx');

  const componentContent = fs.readFileSync(componentPath, 'utf-8');
  const appContent = fs.readFileSync(appPath, 'utf-8');

  it('Verifies WelcomeModal exists and is imported & rendered in App.tsx', () => {
    expect(appContent).toContain("import { WelcomeModal } from './components/WelcomeModal';");
    expect(appContent).toContain('isWelcomeModalOpen');
    expect(appContent).toContain('<WelcomeModal');
    expect(appContent).toContain('useState<boolean>(true)');
  });

  it('Verifies WelcomeModal includes the brand Logo and Name', () => {
    expect(componentContent).toContain('src="/game-gi-gio-logo.svg"');
    expect(componentContent).toContain('GAME GÌ GIỜ');
    expect(componentContent).toContain('text-[#E61C39]');
    expect(componentContent).toContain('text-[#F5F1EC]');
  });

  it('Verifies WelcomeModal includes the website description', () => {
    expect(componentContent).toContain('Game Gì Giờ?');
    expect(componentContent).toContain('Steam');
    expect(componentContent).toContain('thể loại');
  });

  it('Verifies WelcomeModal includes thank you and best wishes', () => {
    expect(componentContent).toContain('Cảm ơn bạn đã ghé thăm');
    expect(componentContent).toContain('trải nghiệm chơi game');
  });

  it('Verifies WelcomeModal includes note about Steam Vietnam / VPN / 1.1.1.1', () => {
    expect(componentContent).toContain('Steam');
    expect(componentContent).toContain('Việt Nam');
    expect(componentContent).toContain('VPN');
    expect(componentContent).toContain('1.1.1.1');
    expect(componentContent).toContain('Cloudflare');
  });

  it('Verifies WelcomeModal includes the close X button at top right', () => {
    expect(componentContent).toContain('<X');
    expect(componentContent).toContain('aria-label="Đóng cửa sổ chào mừng"');
    expect(componentContent).toContain('absolute top-4 right-4');
  });

  it('Verifies WelcomeModal supports Escape key to close', () => {
    expect(componentContent).toContain("e.key === 'Escape'");
  });
});
