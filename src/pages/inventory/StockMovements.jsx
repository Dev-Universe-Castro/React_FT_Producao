import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const StockMovements = () => {
    const { data } = useData();

    const allItems = useMemo(() => {
        const itemsMap = new Map();
        data.rawMaterials.forEach(item => itemsMap.set(item.id, item.name));
        data.finishedProducts.forEach(item => itemsMap.set(item.id, item.name));
        return itemsMap;
    }, [data.rawMaterials, data.finishedProducts]);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Helmet>
                <title>Movimentações de Estoque | InduManager</title>
            </Helmet>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Movimentações de Estoque</h1>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Motivo</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.stockMovements.map(movement => (
                            <TableRow key={movement.id}>
                                <TableCell>{new Date(movement.date).toLocaleString('pt-BR')}</TableCell>
                                <TableCell>{allItems.get(movement.itemId) || 'Item desconhecido'}</TableCell>
                                <TableCell>
                                    <Badge variant={movement.type === 'in' ? 'default' : 'destructive'} className={movement.type === 'in' ? 'bg-green-500' : 'bg-red-500'}>
                                        {movement.type === 'in' ? 'Entrada' : 'Saída'}
                                    </Badge>
                                </TableCell>
                                <TableCell>{movement.quantity}</TableCell>
                                <TableCell>{movement.reason}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </motion.div>
    );
};

export default StockMovements;