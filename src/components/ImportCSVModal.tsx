import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FileUp, Loader2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'

interface ImportCSVModalProps {
  onImport: (data: any[]) => Promise<void>
  modelType: string
}

export function ImportCSVModal({ onImport, modelType }: ImportCSVModalProps) {
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const expectedCols =
    (
      {
        all: ['data', 'descricao', 'categoria', 'valor', 'tipo'],
        saida: ['data', 'favorecido', 'categoria', 'descricao', 'valor', 'status'],
        entrada: ['data', 'cliente', 'categoria', 'descricao', 'valor', 'status'],
        atividades: ['data', 'descricao', 'status', 'responsavel'],
      } as Record<string, string[]>
    )[modelType] || []

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.name.endsWith('.xlsx')) {
      toast.error('Por favor, salve seu arquivo Excel como CSV (.csv) para importar.')
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const lines = text.split('\n').filter((l) => l.trim().length > 0)
      if (lines.length < 2) {
        toast.error('Arquivo vazio ou sem dados.')
        return
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/"/g, ''))

      const parsed = lines.slice(1).map((line) => {
        const values = []
        let current = ''
        let inQuotes = false
        for (let i = 0; i < line.length; i++) {
          const char = line[i]
          if (char === '"') inQuotes = !inQuotes
          else if (char === ',' && !inQuotes) {
            values.push(current.trim().replace(/^"|"$/g, ''))
            current = ''
          } else current += char
        }
        values.push(current.trim().replace(/^"|"$/g, ''))

        const obj: any = {}
        headers.forEach((h, i) => {
          let val = values[i] || ''
          if (h === 'valor') val = parseFloat(val) as any
          obj[h] = val
        })
        return obj
      })

      setPreview(parsed)
    }
    reader.readAsText(file)
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onImport(preview)
      toast.success('Dados importados com sucesso!')
      setOpen(false)
      setPreview([])
    } catch (e) {
      toast.error('Erro ao importar arquivo.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setPreview([])
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val)
        if (!val) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="text-slate-600 bg-white shadow-sm border-slate-200">
          <FileUp className="h-4 w-4 mr-2" />
          Importar Excel/CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Dados</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileUpload}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
            />
            <p className="text-xs text-slate-500 mt-3">
              O arquivo deve ser um CSV e conter as colunas:{' '}
              <strong>{expectedCols.join(', ')}</strong>.
            </p>
          </div>

          {preview.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <div className="border rounded-md max-h-[300px] overflow-auto shadow-sm">
                <Table>
                  <TableHeader className="bg-slate-50 sticky top-0">
                    <TableRow>
                      {expectedCols.map((col) => (
                        <TableHead key={col} className="capitalize">
                          {col}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.slice(0, 50).map((row, i) => (
                      <TableRow key={i}>
                        {expectedCols.map((col) => (
                          <TableCell
                            key={col}
                            className={
                              col === 'valor' ? 'font-mono text-right' : 'max-w-[200px] truncate'
                            }
                          >
                            {row[col]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {preview.length > 50 && (
                <p className="text-xs text-slate-500 mt-2 italic text-center">
                  Mostrando 50 de {preview.length} registros...
                </p>
              )}

              <Button onClick={handleConfirm} disabled={loading} className="w-full mt-4">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar Importação de {preview.length} registros
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
