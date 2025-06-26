import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { exportToXLS } from '@/lib/export';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { FileDown, Factory, Package, ArrowRightLeft } from 'lucide-react';

const Reports = () => {
    const { data } = useData();

    const handleExportOrders = () => {
        const reportData = data.productionOrders.map(order => {
            const product = data.finishedProducts.find(p => p.id === order.productId);
            return {
                'ID da Ordem': order.id,
                'Produto': product?.name || 'N/A',
                'Quantidade': order.quantity,
                'Status': order.status,
                'Data de Criação': new Date(order.createdAt).toLocaleString(),
            };
        });
        exportToXLS(reportData, 'Relatorio_Ordens_Producao');
    };
    
    const handleExportStock = () => {
        const rawMaterialsStock = data.rawMaterials.map(m => ({
            'Tipo': 'Matéria-Prima',
            'ID': m.id,
            'Nome': m.name,
            'Estoque Atual': m.stock,
            'Estoque Mínimo': m.minStock,
            'Unidade': m.unit,
        }));
        const finishedProductsStock = data.finishedProducts.map(p => ({
            'Tipo': 'Produto Acabado',
            'ID': p.id,
            'Nome': p.name,
            'Estoque Atual': p.stock,
            'Estoque Mínimo': '-',
            'Unidade': p.unit,
        }));
        exportToXLS([...rawMaterialsStock, ...finishedProductsStock], 'Relatorio_Estoque_Atual');
    };

    const handleExportMovements = () => {
        const allItems = [...data.rawMaterials, ...data.finishedProducts];
        const reportData = data.stockMovements.map(m => {
            const item = allItems.find(i => i.id === m.itemId);
            return {
                'ID da Movimentação': m.id,
                'Item': item?.name || 'N/A',
                'Tipo': m.type === 'in' ? 'Entrada' : 'Saída',
                'Quantidade': m.quantity,
                'Data': new Date(m.date).toLocaleString(),
                'Motivo': m.reason,
            };
        });
        exportToXLS(reportData, 'Relatorio_Movimentacoes_Estoque');
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Helmet>
                <title>Relatórios | InduManager</title>
            </Helmet>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Relatórios e Exportações</h1>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <Factory className="h-8 w-8 text-green-500 mb-2" />
                        <CardTitle>Ordens de Produção</CardTitle>
                        <CardDescription>Exporta um relatório de todas as ordens de produção.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleExportOrders} className="w-full">
                            <FileDown className="mr-2 h-4 w-4" /> Exportar XLS
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Package className="h-8 w-8 text-green-500 mb-2" />
                        <CardTitle>Estoque Atual</CardTitle>
                        <CardDescription>Exporta uma lista do estoque atual de todos os itens.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleExportStock} className="w-full">
                             <FileDown className="mr-2 h-4 w-4" /> Exportar XLS
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <ArrowRightLeft className="h-8 w-8 text-green-500 mb-2" />
                        <CardTitle>Entradas e Saídas</CardTitle>
                        <CardDescription>Exporta o histórico de movimentações do estoque.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleExportMovements} className="w-full">
                             <FileDown className="mr-2 h-4 w-4" /> Exportar XLS
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
};

export default Reports;