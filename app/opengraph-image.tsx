import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Reads the local file directly (vs. fetching over HTTP) -- faster, and
// works the same at build time or per-request. Relies on the Node runtime
// (the App Router default -- Edge has no filesystem access, but nothing
// here opts into Edge).
export const alt = 'Cease to Resume -- AI resume tailoring, grounded in your real experience';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), 'public', 'logo-mark.png'));
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={160} height={160} alt="" />
        <div
          style={{
            marginTop: 32,
            fontSize: 68,
            fontWeight: 700,
            color: '#6d28d9',
            letterSpacing: '-0.02em',
          }}
        >
          Cease to Resume
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 32,
            color: '#71717a',
            maxWidth: 840,
            textAlign: 'center',
          }}
        >
          Tailor your resume to any job, grounded in your real experience.
        </div>
      </div>
    ),
    { ...size },
  );
}
