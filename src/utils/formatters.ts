export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(dateString: string): string {
  if (!dateString) return ''
  const match = dateString.match(/(\d{4}-\d{2}-\d{2})/)
  const strToSplit = match ? match[1] : dateString.split('T')[0].split(' ')[0]
  const parts = strToSplit.split('-')
  if (parts.length !== 3) return dateString
  const [year, month, day] = parts
  return `${day}/${month}/${year.substring(2)}`
}

export function getStatusClass(status: string): string {
  if (!status) return 'bg-slate-100 text-slate-800 border-slate-200'
  switch (status.toLowerCase().trim()) {
    case 'ok':
      return 'bg-green-600 text-white border-green-700'
    case 'andamento':
      return 'bg-blue-600 text-white border-blue-700'
    case 'aguardando':
      return 'bg-amber-500 text-slate-900 border-amber-600'
    case 'parado':
      return 'bg-red-600 text-white border-red-700'
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200'
  }
}

export function normalizeString(str: string | null | undefined): string {
  if (!str) return ''
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function extractDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const match = dateStr.match(/(\d{4}-\d{2}-\d{2})/)
  if (match) return match[1]
  return dateStr.split('T')[0].split(' ')[0]
}

export function parseImportDate(val: string): string {
  if (!val) return ''
  const norm = val.trim().toLowerCase()

  if (/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(norm)) {
    return norm.substring(0, 10)
  }

  let match = norm.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
  if (match) {
    const d = match[1].padStart(2, '0')
    const m = match[2].padStart(2, '0')
    const y = match[3]
    return `${y}-${m}-${d}`
  }

  match = norm.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/)
  if (match) {
    const y = match[1]
    const m = match[2].padStart(2, '0')
    const d = match[3].padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const months: Record<string, string> = {
    jan: '01',
    january: '01',
    fev: '02',
    feb: '02',
    february: '02',
    mar: '03',
    march: '03',
    abr: '04',
    apr: '04',
    april: '04',
    mai: '05',
    may: '05',
    jun: '06',
    june: '06',
    jul: '07',
    july: '07',
    ago: '08',
    aug: '08',
    august: '08',
    set: '09',
    sep: '09',
    september: '09',
    out: '10',
    oct: '10',
    october: '10',
    nov: '11',
    november: '11',
    dez: '12',
    dec: '12',
    december: '12',
  }

  match = norm.match(/^(\d{1,2})[/-]([a-z]+)$/)
  if (match) {
    const d = match[1].padStart(2, '0')
    const mStr = match[2]
    const m = months[mStr]
    if (m) {
      return `2026-${m}-${d}`
    }
  }

  return new Date().toISOString().split('T')[0]
}

export function parseImportCurrency(val: any): number {
  if (typeof val === 'number') return val
  if (!val) return 0

  let clean = String(val).replace(/[R$\s]/gi, '')

  if (clean.match(/\.\d{3},\d{2}$/) || clean.match(/,\d{2}$/)) {
    clean = clean.replace(/\./g, '').replace(',', '.')
  } else if (clean.match(/,\d{3}\.\d{2}$/)) {
    clean = clean.replace(/,/g, '')
  } else if (clean.includes(',') && clean.indexOf(',') > clean.lastIndexOf('.')) {
    clean = clean.replace(/\./g, '').replace(',', '.')
  }

  const parsed = parseFloat(clean)
  return isNaN(parsed) ? 0 : parsed
}

export function parseImportStatus(val: string): string {
  if (!val) return 'previsto'
  const norm = normalizeString(val)
  if (['pago', 'concluido', 'done', 'realizado', 'recebido', 'ok'].includes(norm))
    return 'realizado'
  if (['pendente', 'todo', 'pending', 'planejado', 'previsto', 'aguardando'].includes(norm))
    return 'previsto'
  return 'previsto'
}

export function mapFuzzyHeader(rawHeader: string): string {
  const norm = normalizeString(rawHeader)
  if (['data', 'date', 'dt'].includes(norm)) return 'data'
  if (['valor', 'value', 'amt', 'vlr', 'amount'].includes(norm)) return 'valor'
  if (['favorecido', 'fornecedor', 'vendor'].includes(norm)) return 'favorecido'
  if (['cliente', 'customer'].includes(norm)) return 'cliente'
  if (['categoria', 'cat', 'category'].includes(norm)) return 'categoria'
  if (['descricao', 'descrição', 'desc', 'description'].includes(norm)) return 'descricao'
  if (['status', 'st', 'state'].includes(norm)) return 'status'
  if (['responsavel', 'responsável', 'resp', 'responsable'].includes(norm)) return 'responsavel'
  if (['tipo', 'type'].includes(norm)) return 'tipo'
  return norm
}
