import { CartItem } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Trash2, ShoppingCart as CartIcon } from 'lucide-react';

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
}

export function ShoppingCart({ items, onUpdateQuantity, onClearCart }: ShoppingCartProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CartIcon className="size-5" />
            <h2>Keranjang</h2>
          </div>
        </div>
        <div className="text-center py-8 text-gray-500">
          <CartIcon className="size-12 mx-auto mb-2 opacity-20" />
          <p>Keranjang kosong</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CartIcon className="size-5" />
          <h2>Keranjang</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearCart}
        >
          Kosongkan
        </Button>
      </div>
      
      <div className="divide-y max-h-[500px] overflow-y-auto">
        {items.map(item => (
          <div key={item.id} className="p-4 space-y-2">
            <div className="flex justify-between gap-2">
              <h3 className="line-clamp-2">{item.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdateQuantity(item.id, 0)}
                className="shrink-0"
              >
                <Trash2 className="size-4 text-red-500" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    onUpdateQuantity(item.id, Math.min(val, item.stock));
                  }}
                  className="w-16 text-center"
                  min="1"
                  max={item.stock}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                >
                  +
                </Button>
              </div>
              <span>
                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
              </span>
            </div>
            
            <p className="text-gray-500">
              @ Rp {item.price.toLocaleString('id-ID')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
