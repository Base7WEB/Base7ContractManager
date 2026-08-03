import { LOGO_DATA_URI } from "./logo-base64.js";
import { escapeHtml } from "./format.js";

/**
 * CSS-base do kit documental, portado do protótipo já validado manualmente nesta mesma linha
 * de trabalho (10 páginas A4, capa navy com o logo real, tabelas de metadados, callouts de
 * aviso/segurança, checklist) — ver Base7_Web_CONTRATO-DomCorte-PREENCHIDO.pdf. Não é uma nova
 * tentativa de reproduzir a identidade visual, é a mesma que já foi conferida página a página.
 */
export const BASE_CSS = /* css */ `
  @page { size: A4; margin: 0; }
  html,body{margin:0;padding:0;}
  *{box-sizing:border-box; -webkit-print-color-adjust:exact; print-color-adjust:exact;}
  body{font-family:-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#1B1F2A;font-size:9.8pt;line-height:1.42;}

  .page{width:210mm;min-height:297mm;position:relative;background:#fff;page-break-after:always;}
  .page:last-of-type{page-break-after:auto;}
  .page-inner{padding:15mm 16mm 12mm;min-height:297mm;box-sizing:border-box;display:flex;flex-direction:column;}

  .doc-header{display:flex;align-items:flex-start;justify-content:space-between;gap:8mm;padding-bottom:3.4mm;border-bottom:0.5pt solid #E1E5EC;margin-bottom:4mm;}
  .doc-header img{height:7.4mm;display:block;}
  .doc-header .titles{text-align:right;}
  .doc-header .titles .t1{font-size:8.6pt;font-weight:700;letter-spacing:.02em;color:#0A6DC2;text-transform:uppercase;}
  .doc-header .titles .t2{font-size:7.1pt;color:#8993A6;text-transform:uppercase;letter-spacing:.04em;margin-top:.8mm;}

  .doc-footer{margin-top:auto;padding-top:2.6mm;border-top:0.5pt solid #E1E5EC;display:flex;justify-content:space-between;font-size:7.1pt;color:#8993A6;text-transform:uppercase;letter-spacing:.03em;}

  .sec-title{display:flex;align-items:center;gap:2.6mm;margin:0 0 2.4mm;}
  .sec-title.spaced{margin-top:5mm;}
  .sec-title .bar{width:1mm;height:4.6mm;background:#0096FE;border-radius:1px;flex:none;}
  .sec-title h2{font-size:12pt;margin:0;font-weight:700;color:#12141C;}

  .sec-block{margin-bottom:0;}
  .sec-block h3{font-size:9.8pt;font-weight:700;margin:3mm 0 1.2mm;color:#12141C;}
  .sec-block p{font-size:8.9pt;color:#333A47;line-height:1.36;margin:0 0 1.2mm;}
  .sec-block ul{margin:0 0 1.2mm;padding-left:4mm;}
  .sec-block li{font-size:8.9pt;color:#333A47;line-height:1.32;margin-bottom:.8mm;}
  .sec-block b{color:#12141C;}

  .meta-table{width:100%;border-collapse:collapse;margin:0 0 3mm;font-size:8.6pt;}
  .meta-table td{padding:1.7mm 3mm;border:0.4pt solid #E1E5EC;}
  .meta-table td.k{width:34%;font-weight:700;color:#12141C;background:#F5F7FA;}
  .meta-table td.v{color:#333A47;}

  table.doc-table{width:100%;border-collapse:collapse;margin:1.4mm 0 3.6mm;font-size:8.6pt;}
  table.doc-table thead th{background:#14171F;color:#fff;text-transform:uppercase;letter-spacing:.03em;font-size:7.2pt;padding:2mm 3mm;text-align:left;font-weight:700;}
  table.doc-table td{padding:2mm 3mm;border-bottom:0.4pt solid #E1E5EC;vertical-align:top;color:#333A47;}
  table.doc-table td b{color:#12141C;}
  table.doc-table tr:nth-child(even) td{background:#F7F9FB;}
  code.pill{background:#EEF1F6;color:#0A6DC2;border-radius:.8mm;padding:.6mm 1.6mm;font-family:"Consolas","SF Mono",monospace;font-size:8pt;}

  .callout{border-radius:1.5mm;padding:3mm 4.4mm;margin:2mm 0 3.6mm;font-size:8.6pt;line-height:1.4;}
  .callout .h{font-weight:700;font-size:9pt;margin-bottom:1.1mm;display:flex;align-items:center;gap:2mm;}
  .callout-warning{background:#EEF3FA;border-left:1mm solid #E2A63B;color:#333A47;}
  .callout-warning .h{color:#8A5A0A;}
  .callout-security{background:#FBECEC;border-left:1mm solid #D64545;color:#333A47;}
  .callout-security .h{color:#A5292A;}
  .callout-info{background:#EAF2FE;border-left:1mm solid #0096FE;color:#12141C;}
  .callout-info .h{color:#0A6DC2;}
  .callout-neutral{background:#F5F7FA;border-left:1mm solid #C3C9D6;color:#333A47;}

  .sig-grid{display:flex;gap:14mm;margin-top:6mm;}
  .sig-block{flex:1;}
  .sig-block .line{border-top:0.6pt solid #12141C;padding-top:2mm;}
  .sig-block .lbl{font-size:7.2pt;text-transform:uppercase;letter-spacing:.04em;color:#8993A6;margin-bottom:.8mm;}
  .sig-block .nm{font-weight:700;font-size:9.4pt;color:#12141C;}
  .sig-block .rl{font-size:8.2pt;color:#8993A6;}

  .dot{display:inline-block;width:2.4mm;height:2.4mm;border-radius:50%;background:#12141C;vertical-align:middle;margin-right:1.6mm;}
  .dot.outline{background:none;border:0.7pt solid #8993A6;}

  .checklist{list-style:none;margin:3mm 0 6mm;padding:0;}
  .checklist li{display:flex;align-items:center;gap:3mm;padding:2.1mm 0;font-size:9.6pt;font-weight:600;color:#12141C;border-bottom:0.4pt solid #EEF0F4;}
  .checklist li .box{width:3.6mm;height:3.6mm;border:0.8pt solid #12141C;border-radius:.6mm;display:inline-flex;align-items:center;justify-content:center;font-size:6.6pt;flex:none;color:#fff;}
  .checklist li.done .box{background:#12141C;}
  .checklist li.na .box{border-color:#B8BFCC;}
  .checklist li.na{color:#8993A6;font-weight:500;}

  .page-cover .page-inner{padding:0;min-height:297mm;}
  .cover-bg{
    width:210mm;min-height:297mm;
    background:
      radial-gradient(120% 70% at 15% -10%, rgba(0,150,254,.22) 0%, rgba(0,150,254,0) 55%),
      linear-gradient(160deg, #16264A 0%, #0C1428 45%, #070A14 100%);
    color:#fff; padding:22mm 20mm; box-sizing:border-box; display:flex; flex-direction:column;
  }
  .cover-badge{display:inline-block;align-self:flex-start;background:rgba(0,150,254,.16);border:0.5pt solid rgba(0,150,254,.55);color:#8FCBFF;font-size:8pt;letter-spacing:.06em;text-transform:uppercase;padding:1.8mm 4.4mm;border-radius:999px;font-weight:700;}
  .cover-title{font-size:24.5pt;font-weight:800;line-height:1.2;margin:6mm 0 3mm;max-width:130mm;letter-spacing:-.01em;}
  .cover-sub{font-size:10.2pt;color:#AEB8CE;max-width:108mm;line-height:1.55;}
  .cover-logo-wrap{margin:16mm 0 9mm;text-align:center;}
  .cover-logo-wrap img{width:82mm;}
  .cover-meta{width:100%;border-collapse:collapse;margin:0 0 8mm;}
  .cover-meta td{padding:3mm 0;border-bottom:0.4pt solid rgba(255,255,255,.14);font-size:9.6pt;}
  .cover-meta td.k{color:#6FB2F7;text-transform:uppercase;letter-spacing:.05em;font-weight:700;width:46mm;font-size:8.3pt;}
  .cover-meta td.v{color:#EDEFF5;}
  .cover-warning{margin-top:auto;background:rgba(255,255,255,.05);border:0.5pt solid rgba(255,255,255,.14);border-left:1mm solid #E2A63B;border-radius:1.5mm;padding:5mm 6mm;font-size:8.5pt;color:#C7CEDD;line-height:1.55;}
  .cover-warning .h{color:#F0BE63;font-weight:700;font-size:9.1pt;margin-bottom:1.6mm;}

  .closing-footer{margin-top:auto;text-align:center;padding-top:10mm;border-top:0.5pt solid #E1E5EC;}
  .closing-footer img{width:48mm;margin:6mm 0 3mm;}
  .closing-footer .tag{font-size:8.4pt;color:#8993A6;letter-spacing:.05em;text-transform:uppercase;}
`;

export function htmlDocument(pagesHtml: string, title: string): string {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>${BASE_CSS}</style>
</head>
<body>
${pagesHtml}
</body>
</html>`;
}

export function docHeader(title: string, subtitle: string): string {
  return `<div class="doc-header">
    <img src="${LOGO_DATA_URI}" alt="Base7 Web">
    <div class="titles">
      <div class="t1">${escapeHtml(title)}</div>
      <div class="t2">${escapeHtml(subtitle)}</div>
    </div>
  </div>`;
}

export function docFooter(pageLabel: string): string {
  return `<div class="doc-footer"><span>Base7 Web — Documentação de Sistemas</span><span>${escapeHtml(pageLabel)}</span></div>`;
}

export function sectionTitle(text: string, spaced = false): string {
  return `<div class="sec-title${spaced ? " spaced" : ""}"><span class="bar"></span><h2>${escapeHtml(text)}</h2></div>`;
}

export interface MetaCell {
  label: string;
  value: string;
}

/** Cada item de `rows` é uma linha da tabela, com 1 ou 2 pares label/valor (grid 2 colunas). */
export function metaTable(rows: MetaCell[][]): string {
  const trs = rows
    .map((row) => {
      const tds = row
        .map((cell) => `<td class="k">${escapeHtml(cell.label)}</td><td class="v">${cell.value}</td>`)
        .join("");
      return `<tr>${tds}</tr>`;
    })
    .join("");
  return `<table class="meta-table">${trs}</table>`;
}

export function docTable(headers: string[], rows: string[][], colWidths?: string[]): string {
  const thead = headers
    .map((h, i) => `<th${colWidths?.[i] ? ` style="width:${colWidths[i]};"` : ""}>${escapeHtml(h)}</th>`)
    .join("");
  const tbody = rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("");
  return `<table class="doc-table"><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>`;
}

type CalloutVariant = "warning" | "security" | "info" | "neutral";

export function callout(variant: CalloutVariant, title: string | null, html: string): string {
  const heading = title ? `<div class="h">${escapeHtml(title)}</div>` : "";
  return `<div class="callout callout-${variant}">${heading}${html}</div>`;
}

export interface SignatureBlock {
  label: string;
  name: string;
  role: string;
}

export function sigGrid(blocks: SignatureBlock[]): string {
  const cols = blocks
    .map(
      (b) => `<div class="sig-block">
        <div class="line">
          <div class="lbl">${escapeHtml(b.label)}</div>
          <div class="nm">${escapeHtml(b.name)}</div>
          <div class="rl">${b.role}</div>
        </div>
      </div>`,
    )
    .join("");
  return `<div class="sig-grid">${cols}</div>`;
}

export interface ChecklistItem {
  label: string;
  state: "done" | "na";
}

export function checklist(items: ChecklistItem[]): string {
  const lis = items
    .map((item) => {
      const symbol = item.state === "done" ? "✓" : "–";
      return `<li class="${item.state}"><span class="box">${symbol}</span> ${item.label}</li>`;
    })
    .join("");
  return `<ul class="checklist">${lis}</ul>`;
}

/** Envolve o conteúdo de uma página de documento comum (não capa/fechamento). */
export function contentPage(innerHtml: string): string {
  return `<div class="page"><div class="page-inner">${innerHtml}</div></div>`;
}

export { LOGO_DATA_URI };
