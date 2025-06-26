import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Factory, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { data } = useData();

  const ordersInProgress = data.productionOrders.filter(o => o.status === 'Em andamento').length;
  const lowStockMaterials = data.rawMaterials.filter(m => (data.stock[m.id] || 0) < (m.min_stock || 0)).length;
  const ordersCompleted = data.productionOrders.filter(o => o.status === 'Concluído').length;
  
  const statusData = [
    { name: 'Planejado', value: data.productionOrders.filter(p => p.status === 'Planejado').length },
    { name: 'Em andamento', value: data.productionOrders.filter(p => p.status === 'Em andamento').length },
    { name: 'Concluído', value: data.productionOrders.filter(p => p.status === 'Concluído').length },
    { name: 'Cancelado', value: data.productionOrders.filter(p => p.status === 'Cancelado').length },
  ];
  
  const COLORS = {
      'Planejado': '#3b82f6',
      'Em andamento': '#f97316',
      'Concluído': '#22c55e',
      'Cancelado': '#ef4444',
  };

  const productionData = data.finishedProducts.map(fp => ({
  name: fp.name.length > 15 ? `${fp.name.substring(0, 12)}...` : fp.name,
  stock: data.stock[fp.id] || 0,
}));

const materialsData = data.rawMaterials.map(rm => ({
  name: rm.name.length > 15 ? `${rm.name.substring(0, 12)}...` : rm.name,
  stock: data.stock[rm.id] || 0,
}));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Helmet>
        <title>Dashboard | FT Produção</title>
      </Helmet>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ordens em Andamento</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordersInProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ordens Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordersCompleted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos em Estoque</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.finishedProducts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas de Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{lowStockMaterials}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-5 mb-6">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Visão Geral do Estoque de Produtos Acabados</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
                <YAxis />
                <Tooltip cursor={{fill: 'rgba(139, 92, 246, 0.1)'}} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563' }} />
                <Legend />
                <Bar dataKey="stock" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Status das Ordens de Produção</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Estoque de Matérias-Primas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={materialsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
                <YAxis />
                <Tooltip cursor={{fill: 'rgba(139, 92, 246, 0.1)'}} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563' }} />
                <Legend />
                <Bar dataKey="stock" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Estoque Atual" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Dashboard;