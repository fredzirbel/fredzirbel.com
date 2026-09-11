import { ImageResponse } from 'next/og';

export const alt = 'Fred Zirbel, security operations professional specializing in incident response and detection engineering';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-static';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'radial-gradient(circle at 85% 20%, #415a77 0%, #1b263b 45%, #0d1b2a 78%)',
          color: '#e0e1dd',
          padding: '70px 78px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, color: '#778da9', letterSpacing: 5 }}>FZ / SIGNAL</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 94, fontWeight: 800, lineHeight: 0.95, letterSpacing: -4 }}>FRED ZIRBEL</div>
          <div style={{ display: 'flex', marginTop: 30, fontSize: 29, color: '#9aa7bb' }}>Security Operations · Incident Response · Detection Engineering</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 22, color: '#778da9' }}>
          <div style={{ width: 80, height: 3, background: '#778da9' }} />
          fredzirbel.com
        </div>
      </div>
    ),
    size,
  );
}
