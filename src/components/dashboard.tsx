import { useMemo } from "react";
import { Transaction } from "../App";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Package,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DashboardProps {
  transactions: Transaction[];
  totalProducts: number;
}

export function Dashboard({
  transactions,
  totalProducts,
}: DashboardProps) {
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTransactions = transactions.filter((t) => {
      const txDate = new Date(t.date);
      txDate.setHours(0, 0, 0, 0);
      return txDate.getTime() === today.getTime();
    });

    const totalRevenue = transactions.reduce(
      (sum, t) => sum + t.total,
      0,
    );
    const todayRevenue = todayTransactions.reduce(
      (sum, t) => sum + t.total,
      0,
    );
    const totalItems = transactions.reduce(
      (sum, t) =>
        sum +
        t.items.reduce(
          (itemSum, item) => itemSum + item.quantity,
          0,
        ),
      0,
    );

    return {
      totalTransactions: transactions.length,
      todayTransactions: todayTransactions.length,
      totalRevenue,
      todayRevenue,
      totalItems,
    };
  }, [transactions]);

  const dailySales = useMemo(() => {
    const salesMap = new Map<string, number>();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    last7Days.forEach((date) => {
      const dateStr = date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });
      salesMap.set(dateStr, 0);
    });

    transactions.forEach((t) => {
      const txDate = new Date(t.date);
      txDate.setHours(0, 0, 0, 0);
      const dateStr = txDate.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });
      if (salesMap.has(dateStr)) {
        salesMap.set(
          dateStr,
          (salesMap.get(dateStr) || 0) + t.total,
        );
      }
    });

    return Array.from(salesMap.entries()).map(
      ([date, total]) => ({
        date,
        total,
      }),
    );
  }, [transactions]);

  const topProducts = useMemo(() => {
    const productSales = new Map<
      string,
      { name: string; quantity: number; revenue: number }
    >();

    transactions.forEach((t) => {
      t.items.forEach((item) => {
        const existing = productSales.get(item.id);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.price * item.quantity;
        } else {
          productSales.set(item.id, {
            name: item.name,
            quantity: item.quantity,
            revenue: item.price * item.quantity,
          });
        }
      });
    });

    return Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [transactions]);

  const paymentMethodStats = useMemo(() => {
    const methodCounts = new Map<string, number>();
    transactions.forEach((t) => {
      methodCounts.set(
        t.paymentMethod,
        (methodCounts.get(t.paymentMethod) || 0) + 1,
      );
    });

    const methodNames: Record<string, string> = {
      cash: "Tunai",
      debit: "Kartu Debit",
      ewallet: "E-Wallet",
    };

    return Array.from(methodCounts.entries()).map(
      ([method, count]) => ({
        name: methodNames[method] || method,
        value: count,
      }),
    );
  }, [transactions]);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
  ];

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="size-12 mx-auto mb-4 opacity-20" />
        <h3 className="text-gray-500">
          Belum ada data transaksi
        </h3>
        <p className="text-gray-400">
          Dashboard akan menampilkan data setelah ada transaksi
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-gray-600">
              Total Transaksi
            </CardTitle>
            <ShoppingCart className="size-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <span className="text-gray-900">
                {stats.totalTransactions}
              </span>
              <p className="text-gray-500">
                Hari ini: {stats.todayTransactions}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-gray-600">
              Total Pendapatan
            </CardTitle>
            <DollarSign className="size-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <span className="text-gray-900">
                Rp {stats.totalRevenue.toLocaleString("id-ID")}
              </span>
              <p className="text-gray-500">
                Hari ini: Rp{" "}
                {stats.todayRevenue.toLocaleString("id-ID")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-gray-600">
              Item Terjual
            </CardTitle>
            <Package className="size-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <span className="text-gray-900">
                {stats.totalItems}
              </span>
              <p className="text-gray-500">Total item</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-gray-600">
              Produk
            </CardTitle>
            <TrendingUp className="size-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <span className="text-gray-900">
                {totalProducts}
              </span>
              <p className="text-gray-500">Total produk</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Penjualan 7 Hari Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) =>
                    `Rp ${value.toLocaleString("id-ID")}`
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#0088FE"
                  name="Penjualan"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metode Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 Produk Terlaris</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis />
              <Tooltip
                formatter={(value: number) =>
                  `Rp ${value.toLocaleString("id-ID")}`
                }
              />
              <Legend />
              <Bar
                dataKey="revenue"
                fill="#00C49F"
                name="Pendapatan"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}