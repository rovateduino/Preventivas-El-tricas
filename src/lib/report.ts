export const usesTresFases = (tipo: string) => tipo === "PDT" || tipo === "OUTRO";
export const isViaAB = (tipo: string) => tipo === "QDF" || tipo === "QDCC";

export function formatDateBR(iso: string) {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const esc = (v: any) => escapeHtml(String(v ?? ''));
const dash = (v: any) => (v ? escapeHtml(String(v)) : "-");

export function getCorrenteGeralDC(record: { medicaoCorrente?: { geral?: string | number }; tensaoDC?: string }) {
  const geral = record.medicaoCorrente?.geral;
  if (geral !== undefined && geral !== null && String(geral).trim() !== "") return String(geral);
  return record.tensaoDC || "";
}

// Um quadro escolhido como "OUTRO" grava em `tipo` o nome digitado pelo técnico,
// então o layout das fases não pode ser deduzido só do tipo.
export function usesTresFasesRecord(record: any) {
  if (isViaAB(record.tipo)) return false;
  const circuitos = Array.isArray(record.circuitos) ? record.circuitos : [];
  return usesTresFases(record.tipo) || circuitos.some((c: any) => c?.s !== undefined || c?.t !== undefined);
}

export function hasNomesRecord(record: any) {
  const circuitos = Array.isArray(record.circuitos) ? record.circuitos : [];
  return !isViaAB(record.tipo) && circuitos.some((c: any) => c?.nome !== undefined);
}

export function buildReportHTML(record: any) {
  const circuitos = Array.isArray(record.circuitos) ? record.circuitos : [];
  const site = record.site || {};
  const tresFases = usesTresFasesRecord(record);
  const temNomes = hasNomesRecord(record);
  const viaAB = isViaAB(record.tipo);
  const viaSel = record.viaSelecionada || "ambas";
  const showViaA = !viaAB || viaSel === "A" || viaSel === "ambas";
  const showViaB = !viaAB || viaSel === "B" || viaSel === "ambas";

  const rows = circuitos
    .map(
      (c: any) => `
      <tr>
        <td>${esc(String(c?.n ?? '')).padStart(2, "0")}</td>
        ${temNomes ? `<td>${dash(c.nome)}</td>` : ""}
        ${viaAB
          ? `${showViaA ? `<td>${dash(c.viaA)}</td>` : ""}${showViaB ? `<td>${dash(c.viaB)}</td>` : ""}`
          : `<td>${dash(c.r)}</td>`}
        ${tresFases ? `<td>${dash(c.s)}</td>` : ""}
        ${tresFases ? `<td>${dash(c.t)}</td>` : ""}
      </tr>`
    )
    .join("");

  const mc = record.medicaoCorrente;
  const viaAbRows = `
    ${showViaA ? `<tr><td>Corrente Via A</td><td>${dash(mc?.viaA)} A</td></tr>` : ""}
    ${showViaB ? `<tr><td>Corrente Via B</td><td>${dash(mc?.viaB)} A</td></tr>` : ""}
    <tr><td>Geral DC (A+B)</td><td>${dash(getCorrenteGeralDC(record))} A</td></tr>`;
  const correnteRows = viaAB
    ? viaAbRows
    : mc
      ? `
        <tr><td>Corrente Total</td><td>${dash(mc.total)} A</td></tr>
        ${tresFases ? `<tr><td>Corrente Fase R</td><td>${dash(mc.r)} A</td></tr>` : `<tr><td>Corrente R</td><td>${dash(mc.r)} A</td></tr>`}
        ${tresFases ? `<tr><td>Corrente Fase S</td><td>${dash(mc.s)} A</td></tr>` : ""}
        ${tresFases ? `<tr><td>Corrente Fase T</td><td>${dash(mc.t)} A</td></tr>` : ""}`
      : "";

  const tensaoRows = viaAB
    ? `
      <tr><td>TENSÃO DC</td><td>${dash(record.tensaoAC)} V</td></tr>`
    : `
      <tr><td>Tensão Fase R</td><td>${dash(record.tensaoR)} V</td></tr>
      <tr><td>Tensão Fase S</td><td>${dash(record.tensaoS)} V</td></tr>
      <tr><td>Tensão Fase T</td><td>${dash(record.tensaoT)} V</td></tr>
      <tr><td colspan="2" style="font-size:10px;color:#64748b;letter-spacing:1px;padding-top:6px;">TENSÃO COMPOSTA (ENTRE FASES)</td></tr>
      <tr><td>Tensão Fase RS</td><td>${dash(record.tensaoRS)} V</td></tr>
      <tr><td>Tensão Fase ST</td><td>${dash(record.tensaoST)} V</td></tr>
      <tr><td>Tensão Fase TR</td><td>${dash(record.tensaoTR)} V</td></tr>`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<title>Preventiva ${dash(site.sigla)} - ${esc(formatDateBR(record.data))}</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; color: #111; padding: 32px; }
  h1 { font-size: 20px; margin-bottom: 4px; }
  h2 { font-size: 14px; margin: 0 0 8px; }
  .subtitle { color: #555; margin-bottom: 20px; font-size: 14px; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
  td, th { border: 1px solid #ccc; padding: 6px 10px; font-size: 13px; text-align: left; }
  th { background: #f2f2f2; }
  .meta td:first-child { font-weight: bold; width: 160px; border: none; padding: 3px 10px 3px 0; }
  .meta td:last-child { border: none; padding: 3px 0; }
  .meta table, .meta { border: none; }
  .corrente td:first-child { font-weight: bold; width: 220px; }
  @media print {
    body { padding: 0; }
  }
</style>
</head>
<body>
  <h1>Relatório de Preventiva Elétrica</h1>
  <div class="subtitle">${dash(site.name)} (${dash(site.sigla)}) — Quadro ${esc(record.tipo)}${record.tipoComplemento ? ` ${esc(record.tipoComplemento)}` : ""}</div>
  <table class="meta">
    <tbody>
      <tr><td>Data</td><td>${esc(formatDateBR(record.data))}</td></tr>
      <tr><td>Nº Ticket</td><td>${dash(record.ticket)}</td></tr>
      <tr><td>Temperatura</td><td>${record.temperatura ? `${esc(String(record.temperatura))}°C` : "-"}</td></tr>
      <tr><td>Categoria do Site</td><td>${esc(site.cat || site.categoria || "-")}</td></tr>
      ${record.tipoComplemento ? `<tr><td>Complemento do Quadro</td><td>${esc(record.tipoComplemento)}</td></tr>` : ""}
      ${tensaoRows}
      ${record.observacao ? `<tr><td>Observação</td><td style="white-space:pre-wrap">${esc(record.observacao)}</td></tr>` : ""}
    </tbody>
  </table>
  <table class="corrente">
    <tbody>
      ${correnteRows}
    </tbody>
  </table>
  <table>
    <thead>
      <tr>
        <th>Nº</th>
        ${temNomes ? `<th>Nome</th>` : ""}
        ${viaAB
          ? `${showViaA ? `<th>Via A (A)</th>` : ""}${showViaB ? `<th>Via B (A)</th>` : ""}`
          : `<th>R (A)</th>`}
        ${tresFases ? `<th>S (A)</th><th>T (A)</th>` : ""}
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
  <script>window.onload = function() { setTimeout(function(){ window.print(); }, 300); };</script>
</body>
</html>`;
}

export function downloadReport(record: any) {
  const html = buildReportHTML(record);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `preventiva-${record.site?.sigla || 'sem-site'}-${record.data || "sem-data"}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
