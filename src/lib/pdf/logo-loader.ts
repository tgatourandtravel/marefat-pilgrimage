/**
 * Loads Marefat SVG logos and converts them to base64 PNGs for use in jsPDF.
 * Uses @resvg/resvg-js (pure WebAssembly — works in Node.js without native deps).
 *
 * Two variants:
 *   - Icon only  (public/logo.svg)          – square, ~402×405
 *   - Horizontal (public/logo-horizontal.svg) – full logo with wordmark, 400×140
 */

import { readFileSync } from 'fs';
import path from 'path';

let cachedIcon: string | null = null;
let cachedHorizontal: string | null = null;

async function convertSvg(svgPath: string, widthPx: number): Promise<string | null> {
  try {
    const { Resvg } = await import('@resvg/resvg-js');
    const svgBuffer = readFileSync(svgPath);
    const resvg = new Resvg(svgBuffer, {
      fitTo: { mode: 'width', value: widthPx },
      background: 'rgba(0,0,0,0)',
    });
    const png = resvg.render().asPng();
    return `data:image/png;base64,${Buffer.from(png).toString('base64')}`;
  } catch (err) {
    console.warn('Logo PNG conversion failed:', err);
    return null;
  }
}

/** Square icon (public/logo.svg) */
export async function getLogoBase64(): Promise<string | null> {
  if (cachedIcon) return cachedIcon;
  const svgPath = path.join(process.cwd(), 'public', 'logo.svg');
  cachedIcon = await convertSvg(svgPath, 400);
  return cachedIcon;
}

/** Full horizontal logo with wordmark (public/logo-horizontal.svg) */
export async function getHorizontalLogoBase64(): Promise<string | null> {
  if (cachedHorizontal) return cachedHorizontal;
  const svgPath = path.join(process.cwd(), 'public', 'logo-horizontal.svg');
  cachedHorizontal = await convertSvg(svgPath, 600);
  return cachedHorizontal;
}
