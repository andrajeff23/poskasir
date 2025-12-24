import { useState } from 'react';
import { ProductCatalog } from './components/product-catalog';
import { ShoppingCart } from './components/shopping-cart';
import { CheckoutModal } from './components/checkout-modal';
import { TransactionHistory } from './components/transaction-history';
import { Dashboard } from './components/dashboard';
import { Login } from './components/login';
import { ShoppingBasket, History, BarChart3, LogOut } from 'lucide-react';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Transaction {
  id: string;
  date: Date;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  cashAmount?: number;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Beras Premium 5kg', price: 75000, category: 'Bahan Pokok', stock: 50, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
  { id: '2', name: 'Minyak Goreng 2L', price: 35000, category: 'Bahan Pokok', stock: 30, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400' },
  { id: '3', name: 'Gula Pasir 1kg', price: 15000, category: 'Bahan Pokok', stock: 40, image: 'https://images.unsplash.com/photo-1606800052052-c2c89191cda9?w=400' },
  { id: '4', name: 'Telur Ayam 1kg', price: 28000, category: 'Protein', stock: 25, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400' },
  { id: '5', name: 'Susu UHT 1L', price: 18000, category: 'Minuman', stock: 60, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400' },
  { id: '6', name: 'Indomie Goreng', price: 3500, category: 'Mie Instan', stock: 100, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400' },
  { id: '7', name: 'Kopi Sachet (10pcs)', price: 12000, category: 'Minuman', stock: 45, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400' },
  { id: '8', name: 'Sabun Mandi', price: 8000, category: 'Kebersihan', stock: 35, image: 'https://images.unsplash.com/photo-1585155770960-a6eb1235f989?w=400' },
  { id: '9', name: 'Shampo Sachet', price: 2500, category: 'Kebersihan', stock: 80, image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400' },
  { id: '10', name: 'Teh Celup (25pcs)', price: 15000, category: 'Minuman', stock: 40, image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400' },
  { id: '11', name: 'Tepung Terigu 1kg', price: 12000, category: 'Bahan Pokok', stock: 30, image: 'https://images.unsplash.com/photo-1628584034103-5b5a2e3b7489?w=400' },
  { id: '12', name: 'Kecap Manis 600ml', price: 16000, category: 'Bumbu', stock: 25, image: 'https://images.unsplash.com/photo-1627662168895-62f532c56434?w=400' },
];

// Demo credentials
const DEMO_USERS = [
  { username: 'admin', password: 'admin123', name: 'Administrator' },
  { username: 'kasir', password: 'kasir123', name: 'Kasir' },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; name: string } | null>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleLogin = (username: string, password: string): boolean => {
    const user = DEMO_USERS.find(
      u => u.username === username && u.password === password
    );
    
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser({ username: user.username, name: user.name });
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCartItems([]);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== productId));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleCheckout = (paymentMethod: string, cashAmount?: number) => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const transaction: Transaction = {
      id: `TRX-${Date.now()}`,
      date: new Date(),
      items: [...cartItems],
      total,
      paymentMethod,
      cashAmount,
    };
    
    // Update stock produk
    setProducts(prev => prev.map(product => {
      const cartItem = cartItems.find(item => item.id === product.id);
      if (cartItem) {
        return { ...product, stock: product.stock - cartItem.quantity };
      }
      return product;
    }));
    
    setTransactions(prev => [transaction, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBasket className="size-6" />
            <div>
              <h1>Toko Kelontong</h1>
              <p className="text-gray-500">Point of Sale</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-gray-900">{currentUser?.name}</p>
              <p className="text-gray-500">@{currentUser?.username}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="size-4" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="pos" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pos" className="gap-2">
              <ShoppingBasket className="size-4" />
              POS
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="size-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="size-4" />
              Riwayat Transaksi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pos" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ProductCatalog products={products} onAddToCart={addToCart} />
              </div>
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <ShoppingCart
                    items={cartItems}
                    onUpdateQuantity={updateQuantity}
                    onClearCart={clearCart}
                  />
                  {cartItems.length > 0 && (
                    <div className="mt-4 p-4 bg-white rounded-lg border space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Item:</span>
                        <span>{totalItems}</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span>Total:</span>
                        <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => setIsCheckoutOpen(true)}
                      >
                        Checkout
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dashboard">
            <Dashboard transactions={transactions} totalProducts={products.length} />
          </TabsContent>

          <TabsContent value="history">
            <TransactionHistory transactions={transactions} />
          </TabsContent>
        </Tabs>
      </main>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        total={totalPrice}
        onConfirm={handleCheckout}
      />
    </div>
  );
}