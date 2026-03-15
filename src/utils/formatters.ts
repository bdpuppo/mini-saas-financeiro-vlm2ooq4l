export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(dateString: string): string {
  if (!dateString) return ''
  const parts = dateString.split('T')[0].split('-')
  if (parts.length !== 3) return dateString
  const [year, month, day] = parts
  return `${day}/${month}/${year.substring(2)}`
}

export function getStatusClass(status: string): string {
  if (!status) return 'bg-gray-200 text-gray-800'
  switch (status.toLowerCase().trim()) {
    case 'ok':
      return 'status-ok'
    case 'andamento':
      return 'status-andamento'
    case 'aguardando':
      return 'status-aguardando'
    case 'parado':
      return 'status-parado'
    default:
      return 'bg-gray-200 text-gray-800'
  }
}

export function normalizeString(str: string | null | undefined): string {
  if (!str) return ''
  return str.trim().toLowerCase()
}

export function extractDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  return dateStr.split('T')[0]
}
