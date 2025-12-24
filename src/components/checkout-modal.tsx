import { useState } from 'react';
import { CartItem } from '../App';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { CreditCard, Wallet, Banknote } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  total: number;
  onConfirm: (paymentMethod: string, cashAmount?: number) => void;
}

export function CheckoutModal({ isOpen, onClose, cartItems, total, onConfirm }: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashAmount, setCashAmount] = useState('');

  const cashValue = parseInt(cashAmount) || 0;
  const change = cashValue - total;

  const handleConfirm = () => {
    if (paymentMethod === 'cash' && cashValue < total) {
      return;
    }
    onConfirm(paymentMethod, paymentMethod === 'cash' ? cashValue : undefined);
    setCashAmount('');
    setPaymentMethod('cash');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <h3>Ringkasan Pesanan</h3>
            <div className="bg-gray-50 rounded-lg p-3 space-y-1 max-h-40 overflow-y-auto">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-gray-600">
                  <span>{item.name} x{item.quantity}</span>
                  <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span>Total:</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3>Metode Pembayaran</h3>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Banknote className="size-5" />
                  Tunai
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="debit" id="debit" />
                <Label htmlFor="debit" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CreditCard className="size-5" />
                  Kartu Debit
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="ewallet" id="ewallet" />
                <Label htmlFor="ewallet" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Wallet className="size-5" />
                  E-Wallet
                </Label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === 'cash' && (
            <div className="space-y-2">
              <Label>Jumlah Uang Tunai</Label>
              <Input
                type="number"
                placeholder="Masukkan jumlah uang"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
              />
              {cashValue > 0 && (
                <div className="space-y-1 text-gray-600">
                  <div className="flex justify-between">
                    <span>Dibayar:</span>
                    <span>Rp {cashValue.toLocaleString('id-ID')}</span>
                  </div>
                  {change >= 0 && (
                    <div className="flex justify-between">
                      <span>Kembalian:</span>
                      <span>Rp {change.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  {change < 0 && (
                    <p className="text-red-500">Jumlah uang kurang</p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1"
              disabled={paymentMethod === 'cash' && cashValue < total}
            >
              Konfirmasi Pembayaran
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}