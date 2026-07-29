import { STORAGE_KEY } from './constants';

export function exportToJSON(records: any[]) {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    appName: 'Preventivas Elétricas',
    recordCount: records.length,
    records
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  a.href = url;
  a.download = `preventivas-export-${timestamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importFromJSON(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        const records = Array.isArray(parsed) ? parsed : parsed.records ?? [];
        if (!Array.isArray(records)) {
          reject(new Error('Formato inválido: expected an array of records.'));
          return;
        }
        const validated = records.filter((r: any) => r && r.id && r.data && r.site && r.tipo && r.ticket);
        resolve(validated);
      } catch (err) {
        reject(new Error('Falha ao ler o arquivo JSON. Verifique o formato.'));
      }
    };
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo.'));
    reader.readAsText(file);
  });
}

export function clearLocalData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('preventiva-save-mode');
}
