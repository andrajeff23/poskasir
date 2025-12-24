import { useState } from 'react';
import { Transaction } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Receipt, Printer } from 'lucide-react';
import { PrintReceipt } from './print-receipt';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  const handlePrint = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsPrintOpen(true);
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-12 text-center">
        <Receipt className="size-12 mx-auto mb-4 opacity-20" />
        <h3 className="text-gray-500">Belum ada transaksi</h3>
        <p className="text-gray-400">Transaksi akan muncul di sini setelah checkout</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {transactions.map(transaction => (
          <Card key={transaction.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="size-5" />
                    {transaction.id}
                  </CardTitle>
                  <p className="text-gray-500 mt-1">
                    {transaction.date.toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>
                    {transaction.paymentMethod === 'cash' && 'Tunai'}
                    {transaction.paymentMethod === 'debit' && 'Kartu Debit'}
                    {transaction.paymentMethod === 'ewallet' && 'E-Wallet'}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePrint(transaction)}
                    className="gap-2"
                  >
                    <Printer className="size-4" />
                    Cetak
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="space-y-1">
                  {transaction.items.map(item => (
                    <div key={item.id} className="flex justify-between text-gray-600">
                      <span>{item.name} x{item.quantity}</span>
                      <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span>Total:</span>
                  <span>Rp {transaction.total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PrintReceipt
        transaction={selectedTransaction}
        isOpen={isPrintOpen}
        onClose={() => {
          setIsPrintOpen(false);
          setSelectedTransaction(null);
        }}
      />
    </>
  );
}