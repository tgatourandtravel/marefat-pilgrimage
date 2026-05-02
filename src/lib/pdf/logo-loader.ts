/**
 * Loads Marefat logo assets and returns base64 strings for use in jsPDF.
 *
 * Horizontal logo (public/logo-horizontal.jpg) — 1024×358 JPEG
 *   Full wordmark: circular icon + vertical rule + "MAREFAT / Pilgrimage" text
 *   Loaded directly from disk as JPEG — no runtime SVG conversion needed.
 *   Format for jsPDF addImage: 'JPEG'
 *
 * Icon only (public/logo.svg) — 402×405 SVG → PNG via @resvg/resvg-js
 *   Used where only the icon medallion is needed.
 *   Format for jsPDF addImage: 'PNG'
 */

import { readFileSync } from 'fs';
import path from 'path';

let cachedHorizontal: string | null = null;
let cachedIcon: string | null = null;

/**
 * Full horizontal wordmark logo (JPEG).
 * Aspect ratio ≈ 2.86 (1024 × 358 px).
 * Returns a data URI with format "data:image/jpeg;base64,…"
 */
export async function getHorizontalLogoBase64(): Promise<string | null> {
  if (cachedHorizontal) return cachedHorizontal;
  try {
    const filePath = path.join(process.cwd(), 'public', 'logo-horizontal.jpg');
    const buf = readFileSync(filePath);
    cachedHorizontal = `data:image/jpeg;base64,${buf.toString('base64')}`;
    return cachedHorizontal;
  } catch (err) {
    console.warn('Horizontal logo load failed:', err);
    return null;
  }
}

/**
 * Icon-only square logo (SVG → PNG via @resvg/resvg-js).
 * Returns a data URI with format "data:image/png;base64,…"
 */
export async function getLogoBase64(): Promise<string | null> {
  if (cachedIcon) return cachedIcon;
  try {
    const { Resvg } = await import('@resvg/resvg-js');
    const svgPath = path.join(process.cwd(), 'public', 'logo.svg');
    const svgBuffer = readFileSync(svgPath);
    const resvg = new Resvg(svgBuffer, {
      fitTo: { mode: 'width', value: 400 },
      background: 'rgba(0,0,0,0)',
    });
    const png = resvg.render().asPng();
    cachedIcon = `data:image/png;base64,${Buffer.from(png).toString('base64')}`;
    return cachedIcon;
  } catch (err) {
    console.warn('Icon logo PNG conversion failed:', err);
    return null;
  }
}
