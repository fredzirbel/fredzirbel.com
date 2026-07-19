import { ImageResponse } from 'next/og';

export const alt = 'Fred Zirbel — Principal Security Analyst';
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
          background: 'radial-gradient(circle at 85% 20%, #20253f 0%, #08080d 42%, #050507 75%)',
          color: '#f2f2ef',
          padding: '70px 78px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, color: '#c6ff4a', letterSpacing: 5 }}>FZ / SIGNAL</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 94, fontWeight: 800, lineHeight: 0.95, letterSpacing: -4 }}>FRED ZIRBEL</div>
          <div style={{ display: 'flex', marginTop: 30, fontSize: 29, color: '#a9a9b5' }}>Principal Security Analyst · Detection Engineering · Security Tooling</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 22, color: '#7a87ff' }}>
          <div style={{ width: 80, height: 3, background: '#c6ff4a' }} />
          fredzirbel.com
        </div>
      </div>
    ),
    size,
  );
}
