import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { NumberInput } from './NumberInput';

interface Column {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'calculated';
  format?: (value: any) => string;
}

interface EditableTableProps {
  columns: Column[];
  data: any[];
  onDataChange: (newData: any[]) => void;
  onAddRow?: () => void;
  onDeleteRow?: (index: number) => void;
  currency?: string;
}

export const EditableTable = ({ columns, data, onDataChange, onAddRow, onDeleteRow }: EditableTableProps) => {
  const handleCellChange = (rowIndex: number, columnKey: string, value: string | number) => {
    const newData = [...data];
    const col = columns.find((c) => c.key === columnKey);
    const parsedValue = col?.type === 'number'
      ? (typeof value === 'number' ? value : parseFloat(value as string) || 0)
      : value;
    newData[rowIndex] = { ...newData[rowIndex], [columnKey]: parsedValue };
    onDataChange(newData);
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((col) => (
                <TableHead key={col.key} className="font-semibold text-foreground">{col.label}</TableHead>
              ))}
              {onDeleteRow && <TableHead className="w-20">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-muted/30">
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.type === 'calculated' ? (
                      <span className="font-medium text-foreground">
                        {col.format ? col.format(row[col.key]) : formatNumber(row[col.key])}
                      </span>
                    ) : col.type === 'number' ? (
                      <NumberInput
                        value={Number(row[col.key]) || 0}
                        onChange={(v) => handleCellChange(rowIndex, col.key, v)}
                        decimals={2}
                        className="h-9"
                      />
                    ) : (
                      <Input
                        type="text"
                        value={row[col.key] ?? ''}
                        onChange={(e) => handleCellChange(rowIndex, col.key, e.target.value)}
                        className="h-9"
                      />
                    )}
                  </TableCell>
                ))}
                {onDeleteRow && (
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => onDeleteRow(rowIndex)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {onAddRow && (
        <div className="p-4 border-t border-border bg-muted/30">
          <Button onClick={onAddRow} variant="outline" size="sm" className="w-full">
            <Plus className="w-4 h-4 mr-2" /> Añadir fila
          </Button>
        </div>
      )}
    </div>
  );
};
