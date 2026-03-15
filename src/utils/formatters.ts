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
      return 'bg-green-100 text-green-800 border border-green-200'
    case 'andamento':
      return 'bg-blue-100 text-blue-800 border border-blue-200'
    case 'aguardando':
      return 'bg-amber-100 text-amber-800 border border-amber-200'
    case 'parado':
      return 'bg-red-100 text-red-800 border border-red-200'
    default:
      return 'bg-slate-100 text-slate-800 border border-slate-200'
  }
}

export function normalizeString(str: string | null | undefined): string {
  if (!str) return ''
  return str.trim().toLowerCase()
}

export function extractDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  // Use regex to robustly grab YYYY-MM-DD anywhere in the string,
  // ignoring time and timezone parts.
  const match = dateStr.match(/(\d{4}-\d{2}-\d{2})/)
  if (match) return match[1]
  return dateStr.split('T')[0].split(' ')[0]
}
