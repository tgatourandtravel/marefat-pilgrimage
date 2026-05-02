/**
 * Loads the Marefat SVG logo and converts it to a base64 PNG for use in jsPDF.
 * Uses @resvg/resvg-js (pure WebAssembly — works in Node.js without native deps).
 */

import { readFileSync } from 'fs';
import path from 'path';

let cachedLogoBase64: string | null = null;

export async function getLogoBase64(): Promise<string | null> {
  if (cachedLogoBase64) return cachedLogoBase64;

  try {
    const { Resvg } = await import('@resvg/resvg-js');
    const svgPath = path.join(process.cwd(), 'public', 'logo.svg');
    const svgBuffer = readFileSync(svgPath);

    const resvg = new Resvg(svgBuffer, {
      fitTo: { mode: 'width', value: 400 },
      background: 'rgba(0,0,0,0)',
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    cachedLogoBase64 = `data:image/png;base64,${Buffer.from(pngBuffer).toString('base64')}`;
    return cachedLogoBase64;
  } catch (err) {
    console.warn('Logo PNG conversion failed:', err);
    return null;
  }
}
