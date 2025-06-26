import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
    const { data } = useData();
    const [selectedItemId, setSelectedItemId] = useState('');
    const allItems = [...data.rawMaterials, ...data.finishedProducts];

    const chartData = useMemo(() => {
        if (!selectedItemId) return [];
        
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

        const relevantMovements = data.stockMovements
            .filter(m => m.itemId === selectedItemId && new Date(m.date) >= fifteenDaysAgo)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        const dailyData = {};

        for (let i = 0; i < 15; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateString = d.toLocaleDateString('pt-BR');
            dailyData[dateString] = { date: dateString, entrada: 0, saida: 0 };
        }
        
        relevantMovements.forEach(m => {
            const dateString = new Date(m.date).toLocaleDateString('pt-BR');
            if (dailyData[dateString]) {
                if (m.type === 'in') {
                    dailyData[dateString].entrada += m.quantity;
                } else {
                    dailyData[dateString].saida += m.quantity;
                }
            }
        });

        return Object.values(dailyData).sort((a,b) => new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-')));

    }, [selectedItemId, data.stockMovements]);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Helmet>
                <title>Analítico | InduManager</title>
            </Helmet>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analítico de Movimentação</h1>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <CardTitle>Entrada e Saída de Produtos (Últimos 15 dias)</CardTitle>
                        <div className="w-full sm:w-64">
                            <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um item..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {allItems.map(item => (
                                        <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {selectedItemId ? (
                         <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563' }} />
                                <Legend />
                                <Line type="monotone" dataKey="entrada" stroke="#22c55e" strokeWidth={2} name="Entrada" />
                                <Line type="monotone" dataKey="saida" stroke="#ef4444" strokeWidth={2} name="Saída" />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                            <p>Por favor, selecione um item para visualizar o gráfico.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default Analytics;