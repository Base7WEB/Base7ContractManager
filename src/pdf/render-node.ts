/**
 * Módulo Node-only (usa fs, child process via Puppeteer) — nunca deve ser importado por
 * código que roda no navegador. Usado por scripts/render-preview.ts (dev local) e por
 * api/documents/generate.ts (produção, Vercel Serverless Function).
 *
 * Em produção (Vercel/Lambda), usa @sparticuz/chromium (binário Linux empacotado para
 * ambiente serverless). Localmente, usa o Chrome/Edge já instalado na máquina — evita baixar
 * ~280MB de Chromium só para rodar `npm run pdf:preview`.
 */
import fs from "node:fs";
import puppeteer from "puppeteer-core";

const LOCAL_BROWSER_CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];

function isServerlessEnv(): boolean {
  return Boolean(process.env.VERCEL) || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);
}

export async function htmlToPdfBuffer(html: string): Promise<Buffer> {
  let executablePath: string;
  let args: string[] = [];

  if (isServerlessEnv()) {
    const chromium = (await import("@sparticuz/chromium")).default;
    executablePath = await chromium.executablePath();
    args = chromium.args;
  } else {
    const found = LOCAL_BROWSER_CANDIDATES.find((p) => fs.existsSync(p));
    if (!found) {
      throw new Error(
        "Nenhum Chrome/Edge encontrado localmente para renderizar o PDF. Ajuste LOCAL_BROWSER_CANDIDATES em src/pdf/render-node.ts ou rode via `vercel dev`/deploy.",
      );
    }
    executablePath = found;
  }

  const browser = await puppeteer.launch({ executablePath, args, headless: true });
  try {
    const page = await browser.newPage();
    // O HTML é autocontido (logo embutido como base64, sem requisições externas), então
    // "domcontentloaded" já é suficiente — não há rede para "networkidle0" esperar.
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
