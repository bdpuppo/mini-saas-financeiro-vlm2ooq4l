export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year.substring(2)}`
}

export function getStatusClass(status: string): string {
  switch (status.toLowerCase()) {
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
