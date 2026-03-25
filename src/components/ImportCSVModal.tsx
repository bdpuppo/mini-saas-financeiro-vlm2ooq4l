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
import { toast } from '@/hooks/use-toast'

interface ImportCSVModalProps {
  onImport: (data: any[]) => Promise<void>
}

export function ImportCSVModal({ onImport }: ImportCSVModalProps) {
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.name.endsWith('.xlsx')) {
      toast({
        title: 'Atenção',
        description: 'Por favor, salve seu arquivo Excel como CSV (.csv) para importar.',
        variant: 'destructive',
      })
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const lines = text.split('\n').filter((l) => l.trim().length > 0)
      if (lines.length < 2) {
        toast({ title: 'Erro', description: 'Arquivo vazio ou sem dados.', variant: 'destructive' })
        return
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/"/g, ''))

      const parsed = lines.slice(1).map((line) => {
        // simple CSV parsing handling quotes partially
        const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''))
        const obj: any = {}
        headers.forEach((h, i) => {
          let val = values[i] || ''
          if (h === 'valor' || h === 'amount') val = parseFloat(val) as any
          obj[h] = val
        })
        return {
          data: obj.data || obj.date || new Date().toISOString().split('T')[0],
          valor: obj.valor || obj.amount || 0,
          categoria: obj.categoria || obj.category || 'Importado',
          descricao: obj.descricao || obj.description || 'Importação',
        }
      })

      setPreview(parsed)
    }
    reader.readAsText(file)
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onImport(preview)
      toast({ title: 'Sucesso', description: 'Dados importados com sucesso!' })
      setOpen(false)
      setPreview([])
    } catch (e) {
      toast({
        title: 'Erro',
        description: 'Erro ao importar dados. Verifique a formatação.',
        variant: 'destructive',
      })
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
          Importar Excel
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
              <strong>data, valor, categoria, descricao</strong>.
            </p>
          </div>

          {preview.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <div className="border rounded-md max-h-[300px] overflow-auto shadow-sm">
                <Table>
                  <TableHeader className="bg-slate-50 sticky top-0">
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.slice(0, 50).map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>{row.data}</TableCell>
                        <TableCell className="font-mono text-right">{row.valor}</TableCell>
                        <TableCell>{row.categoria}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{row.descricao}</TableCell>
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
