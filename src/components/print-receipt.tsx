import { Transaction } from '../App';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Printer } from 'lucide-react';

interface PrintReceiptProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PrintReceipt({ transaction, isOpen, onClose }: PrintReceiptProps) {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Struk Pembayaran</DialogTitle>
        </DialogHeader>

        <div id="receipt-content" className="space-y-4">
          <div className="text-center border-b pb-4">
            <h2>Toko Kelontong</h2>
            <p className="text-gray-600">Jl. Contoh No. 123</p>
            <p className="text-gray-600">Telp: (021) 1234-5678</p>
          </div>

          <div className="space-y-1 text-gray-700 border-b pb-4">
            <div className="flex justify-between">
              <span>No. Transaksi:</span>
              <span>{transaction.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Tanggal:</span>
              <span>
                {transaction.date.toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Waktu:</span>
              <span>
                {transaction.date.toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Kasir:</span>
              <span>Admin</span>
            </div>
          </div>

          <div className="space-y-2 border-b pb-4">
            <h3>Item Pembelian</h3>
            {transaction.items.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between">
                  <span>{item.name}</span>
                </div>
                <div className="flex justify-between text-gray-600 pl-2">
                  <span>{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</span>
                  <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Rp {transaction.total.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Metode Pembayaran:</span>
              <span>
                {transaction.paymentMethod === 'cash' && 'Tunai'}
                {transaction.paymentMethod === 'debit' && 'Kartu Debit'}
                {transaction.paymentMethod === 'ewallet' && 'E-Wallet'}
              </span>
            </div>
            {transaction.cashAmount && (
              <>
                <div className="flex justify-between">
                  <span>Dibayar:</span>
                  <span>Rp {transaction.cashAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kembalian:</span>
                  <span>Rp {(transaction.cashAmount - transaction.total).toLocaleString('id-ID')}</span>
                </div>
              </>
            )}
          </div>

          <div className="text-center border-t pt-4">
            <p className="text-gray-600">Terima kasih atas kunjungan Anda!</p>
            <p className="text-gray-600">Barang yang sudah dibeli tidak dapat ditukar/dikembalikan</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Tutup
          </Button>
          <Button onClick={handlePrint} className="flex-1 gap-2">
            <Printer className="size-4" />
            Cetak
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
