/**
 * Loads the Marefat icon-only SVG (public/logo.svg, viewBox 402×405)
 * and converts it to a transparent PNG via @resvg/resvg-js.
 *
 * The horizontal wordmark is intentionally built as native jsPDF text
 * alongside this icon so there is no embedded image background artifact.
 */

import { readFileSync } from 'fs';
import path from 'path';

let cached: string | null = null;

export async function getLogoBase64(): Promise<string | null> {
  if (cached) return cached;
  try {
    const { Resvg } = await import('@resvg/resvg-js');
    const svgPath = path.join(process.cwd(), 'public', 'logo.svg');
    const svgBuffer = readFileSync(svgPath);
    const resvg = new Resvg(svgBuffer, {
      fitTo: { mode: 'width', value: 300 },
      background: 'rgba(0,0,0,0)',
    });
    const png = resvg.render().asPng();
    cached = `data:image/png;base64,${Buffer.from(png).toString('base64')}`;
    return cached;
  } catch (err) {
    console.warn('Logo PNG conversion failed:', err);
    return null;
  }
}

/** @deprecated — no longer needed; kept for any external callers */
export async function getHorizontalLogoBase64(): Promise<string | null> {
  return getLogoBase64();
}
