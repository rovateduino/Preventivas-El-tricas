// Contrato de testes do relatório: `npm run test:report`
// Node 24 remove os tipos de `./report.ts` direto, sem build previo.
import { buildReportHTML, getCorrenteGeralDC, usesTresFasesRecord, hasNomesRecord, formatDateBR } from './report.ts';

let failures = 0;
let total = 0;
const check = (name, cond, extra = '') => {
  total++;
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${cond ? '' : '  <-- ' + extra}`);
  if (!cond) failures++;
};
const run = (name, fn) => {
  try {
    return fn();
  } catch (e) {
    check(name, false, `lancou ${e.constructor.name}: ${e.message}`);
    return null;
  }
};

const evil = {
  id: 'x', data: '2026-10-15', tipo: 'QDF', ticket: '"><img src=x onerror=alert(1)>',
  temperatura: 30,
  site: { name: '<script>alert("n")</script>', sigla: "<i>'O'</i>", cat: 'HUB' },
  circuitos: [{ n: 1, viaA: '<b>a-evil</b>', viaB: '20' }, { n: 2, viaA: '5', viaB: '' }],
  medicaoCorrente: { geral: '<u>g-evil</u>' },
  tensaoAC: '-48', tipoComplemento: '<svg onload=alert(2)>', observacao: '</td><td>pwn',
  viaSelecionada: 'ambas',
};

const html = buildReportHTML(evil);
const scriptCount = (html.match(/<script/gi) || []).length;

check('payload do ticket escapado', html.includes('&lt;img src=x onerror=alert(1)&gt;'));
check('apenas o script legitimo de auto-print', scriptCount === 1);
check('complemento e observacao escapados', html.includes('&lt;svg onload=alert(2)&gt;') && html.includes('&lt;/td&gt;&lt;td&gt;pwn'));
check('escapa aspas e angulares', html.includes('&quot;&gt;&lt;img') && html.includes('&lt;script&gt;'));
check('tensao DC usa tensaoAC', html.includes('<td>-48 V</td>'));
check('temperatura renderizada', html.includes('30°C'));
check('titulo sem markup cruo', /<title>Preventiva &lt;i&gt;.* - 15\/10\/2026<\/title>/.test(html));

const viaA = buildReportHTML({ ...evil, viaSelecionada: 'A' });
check('via A oculta coluna B no corpo', (viaA.match(/<td>/g) || []).length < (html.match(/<td>/g) || []).length);
check('via A oculta header Via B', !viaA.includes('<th>Via B (A)</th>') && viaA.includes('<th>Via A (A)</th>'));
const viaB = buildReportHTML({ ...evil, viaSelecionada: 'B' });
check('via B oculta header Via A', !viaB.includes('<th>Via A (A)</th>') && viaB.includes('<th>Via B (A)</th>'));

const pdt = buildReportHTML({
  id: 'p', data: '2026-10-15', tipo: 'PDT', ticket: 'T-1',
  site: { name: 'Osasco', sigla: 'OCO', cat: 'HUB' },
  circuitos: [{ n: 1, r: '10', s: '<i>s</i>', t: '' }],
  medicaoCorrente: { total: '10', r: '10', s: '2', t: '0' },
  tensaoR: '127', tensaoRS: '220',
});
check('PDT tem colunas S e T', pdt.includes('<th>S (A)</th>') && pdt.includes('<th>T (A)</th>'));
check('PDT tem tensao composta', pdt.includes('TENSÃO COMPOSTA (ENTRE FASES)') && pdt.includes('220 V'));
check('PDT sem coluna Via', !pdt.includes('Via A (A)'));
check('PDT sem payload cruo', !pdt.includes('<i>s</i>'));

const minimal = buildReportHTML({
  id: 'm', data: '2026-10-15', tipo: 'QDCC', ticket: '',
  site: { name: 'Osasco', sigla: 'OCO', cat: 'HUB' },
  circuitos: [{ n: 1, viaA: '', viaB: '' }], medicaoCorrente: {},
});
check('campos ausentes viram dash', !minimal.includes('undefined'));
check('getCorrenteGeralDC prioriza medicaoCorrente.geral', getCorrenteGeralDC({ medicaoCorrente: { geral: '42' }, tensaoDC: '9' }) === '42');
check('getCorrenteGeralDC cai para tensaoDC', getCorrenteGeralDC({ tensaoDC: '9' }) === '9');

// Tipo escolhido como "OUTRO" grava em record.tipo o nome digitado pelo tecnico (ex: QDGE).
const outro = buildReportHTML({
  id: 'o', data: '2026-10-15', tipo: 'QDGE', ticket: 'T-9',
  site: { name: 'Osasco', sigla: 'OCO', cat: 'HUB' },
  circuitos: [{ n: 1, nome: 'Iluminação <b>RS</b>', r: '4', s: '3', t: '2' }],
  medicaoCorrente: { total: '4', r: '4', s: '3', t: '2' },
  tensaoR: '127', tensaoS: '128', tensaoT: '129',
});
check('OUTRO com tipo custom mostra colunas S e T', outro.includes('<th>S (A)</th>') && outro.includes('<th>T (A)</th>'));
check('OUTRO com tipo custom mostra coluna Nome', outro.includes('<th>Nome</th>'));
check('OUTRO renderiza nome do circuito escapado', outro.includes('Iluminação &lt;b&gt;RS&lt;/b&gt;'));
check('OUTRO exibe correntes de fase S e T', outro.includes('Corrente Fase S') && outro.includes('Corrente Fase T'));
check('OUTRO detectado via shape do circuito', usesTresFasesRecord({ tipo: 'QDGE', circuitos: [{ n: 1, r: '', s: '', t: '' }] }) === true);
check('QDF nunca ganha coluna Nome', !buildReportHTML({ ...evil, circuitos: [{ n: 1, viaA: '1', viaB: '2' }] }).includes('<th>Nome</th>'));
check('PDT sem nome não cria coluna Nome', hasNomesRecord({ tipo: 'PDT', circuitos: [{ n: 1, r: '', s: '', t: '' }] }) === false);

const qdfBase = {
  id: 'q', data: '2026-10-15', tipo: 'QDF', ticket: 'T-77',
  site: { name: 'Site QDF', sigla: 'QDF', cat: 'HUB' },
  circuitos: [{ n: 1, viaA: '10', viaB: '20' }],
  medicaoCorrente: { viaA: '10.0', viaB: '20.0', geral: '30.0' },
  viaSelecionada: 'ambas',
};
const qdf = buildReportHTML(qdfBase);
check('QDF ambas imprime Corrente Via A', qdf.includes('Corrente Via A') && qdf.includes('<td>10.0 A</td>'));
check('QDF ambas imprime Corrente Via B', qdf.includes('Corrente Via B') && qdf.includes('<td>20.0 A</td>'));
check('QDF ambas imprime Geral DC (A+B)', qdf.includes('Geral DC (A+B)') && qdf.includes('<td>30.0 A</td>'));
check('rotulo antigo "Corrente Geral DC" nao aparece mais', !qdf.includes('Corrente Geral DC'));
check('linha Geral DC (A+B) aparece uma unica vez', qdf.split('Geral DC (A+B)').length - 1 === 1);
const qdfSoA = buildReportHTML({ ...qdfBase, viaSelecionada: 'A' });
check('QDF restrito a Via A omite a linha da Via B', qdfSoA.includes('Corrente Via A') && !qdfSoA.includes('Corrente Via B'));
const qdfSoB = buildReportHTML({ ...qdfBase, viaSelecionada: 'B' });
check('QDF restrito a Via B omite a linha da Via A', qdfSoB.includes('Corrente Via B') && !qdfSoB.includes('Corrente Via A'));
const qdfSemMed = buildReportHTML({ ...qdfBase, medicaoCorrente: undefined });
check('QDF sem medicaoCorrente ainda imprime a geral', qdfSemMed.includes('Geral DC (A+B)') && !qdfSemMed.includes('undefined'));

// ---------------------------------------------------------------- casos de borda

const base = {
  id: 'b', data: '2026-10-15', tipo: 'QDF', ticket: 'T-1', temperatura: '25',
  site: { name: 'Osasco', sigla: 'OCO', cat: 'HUB' },
  circuitos: [{ n: 1, viaA: '1', viaB: '2' }],
  medicaoCorrente: { viaA: '1', viaB: '2', geral: '3' },
  viaSelecionada: 'ambas',
};

const vazio = run('E1 circuitos=[] nao lancou', () => buildReportHTML({ ...base, circuitos: [] }));
if (vazio) {
  check('E1 circuitos=[] nao contem undefined', !vazio.includes('undefined'));
  check('E1 circuitos=[] mantem cabecalho', vazio.includes('<th>Via A (A)</th>'));
}

const semCircuitos = run('E6 circuitos ausente (doc legado) nao lancou', () => buildReportHTML({ ...base, circuitos: undefined }));
if (semCircuitos) {
  check('E6 circuitos ausente tratado como lista vazia', !semCircuitos.includes('undefined') && semCircuitos.includes('<th>Via A (A)</th>'));
}

const semSite = run('E7 site ausente (doc legado) nao lancou', () => buildReportHTML({ ...base, site: undefined }));
if (semSite) {
  check('E7 site ausente vira dash no titulo', semSite.includes('<title>Preventiva - - 15/10/2026</title>'));
  check('E7 site ausente vira dash no subtitulo', semSite.includes('- (-) — Quadro QDF'));
  check('E7 site ausente nao contem undefined', !semSite.includes('undefined'));
}

const semData = run('E8 data ausente', () => buildReportHTML({ ...base, data: '' }));
if (semData) check('E8 data vazia nao contem undefined', !semData.includes('undefined'));
check('E9 formatDateBR de string vazia', formatDateBR('') === '-');

const virgula = run('E2 virgula', () => buildReportHTML({
  ...base,
  circuitos: [{ n: 1, viaA: '12,5', viaB: '7,25' }],
  medicaoCorrente: { viaA: '12,5', viaB: '7,25', geral: '19,75' },
}));
if (virgula) {
  check('E2 celula Via A preserva 12,5', virgula.includes('<td>12,5</td>'));
  check('E2 celula Via B preserva 7,25', virgula.includes('<td>7,25</td>'));
  check('E2 corrente geral preserva 19,75 A', virgula.includes('<td>19,75 A</td>'));
  check('E2 sem conversao para ponto decimal', !virgula.includes('12.5') && !virgula.includes('19.75'));
}

const htmlNome = run('E3 HTML em nome', () => buildReportHTML({
  ...base, tipo: 'PDT', viaSelecionada: undefined,
  circuitos: [{ n: 1, nome: '<img src=x onerror=alert(1)>', r: '1', s: '2', t: '3' }],
  medicaoCorrente: { total: '1', r: '1', s: '2', t: '3' },
  tensaoR: '127', tensaoS: '128', tensaoT: '129',
}));
if (htmlNome) {
  check('E3 nome escapado', htmlNome.includes('&lt;img src=x onerror=alert(1)&gt;'));
  check('E3 nenhum <script> alem do auto-print', (htmlNome.match(/<script/gi) || []).length === 1);
  check('E3 nenhum onerror cru', !/<img src=x onerror/.test(htmlNome));
}

const outroCru = run('E4 OUTRO sem complemento', () => buildReportHTML({
  ...base, tipo: 'OUTRO', tipoComplemento: '',
  circuitos: [{ n: 1, r: '1', s: '2', t: '3' }],
  medicaoCorrente: { total: '1', r: '1', s: '2', t: '3' },
  tensaoR: '127',
}));
if (outroCru) {
  check('E4 OUTRO ganha colunas S e T', outroCru.includes('<th>S (A)</th>') && outroCru.includes('<th>T (A)</th>'));
  check('E4 OUTRO imprime "Quadro OUTRO"', outroCru.includes('Quadro OUTRO'));
  check('E4 OUTRO sem undefined no titulo', !outroCru.includes('undefined'));
}

const muitos = run('E5 200 circuitos', () => buildReportHTML({
  ...base,
  circuitos: Array.from({ length: 200 }, (_, i) => ({ n: i + 1, viaA: String(i + 1), viaB: String(i + 1) })),
}));
if (muitos) {
  check('E5 200 linhas de circuito', (muitos.match(/<tr>/g) || []).length >= 200);
  check('E5 numero 200 nao truncado', muitos.includes('<td>200</td>'));
  check('E5 numero 7 com padStart', muitos.includes('<td>07</td>'));
  check('E5 sem undefined', !muitos.includes('undefined'));
  check('E5 tamanho do HTML < 400 KB', muitos.length < 400_000, `${muitos.length} chars`);
}

// "0" e um valor medido, nao um campo vazio: a geral da via A+B manda sobre tensaoDC.
check('E10 geral numerica 0 e preservada', getCorrenteGeralDC({ medicaoCorrente: { geral: 0 }, tensaoDC: '9' }) === '0');

console.log(failures === 0 ? `\nTODOS OS TESTES PASSARAM (${total})` : `\n${failures} FALHA(S) em ${total}`);
process.exit(failures === 0 ? 0 : 1);
