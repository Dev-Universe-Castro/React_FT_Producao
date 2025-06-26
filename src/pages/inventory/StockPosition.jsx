import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowDownCircle } from 'lucide-react';

const StockPosition = () => {
    const { data, updateData, processStockUpdate } = useData();
    const { toast } = useToast();
    const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [exitQuantity, setExitQuantity] = useState('');
    const [exitReason, setExitReason] = useState('');

    const allItems = useMemo(() => {
        const materials = data.rawMaterials.map(item => ({ ...item, type: 'Matéria-Prima' }));
        const products = data.finishedProducts.map(item => ({ ...item, type: 'Produto Acabado' }));
        return [...materials, ...products].sort((a,b) => a.name.localeCompare(b.name));
    }, [data.rawMaterials, data.finishedProducts]);

    const handleOpenExitDialog = (product) => {
        setSelectedProduct(product);
        setIsExitDialogOpen(true);
    };

    const handleExitSubmit = (e) => {
        e.preventDefault();
        if (!selectedProduct || !exitQuantity || Number(exitQuantity) <= 0) {
            toast({ title: 'Erro de Validação', description: 'Por favor, preencha a quantidade corretamente.', variant: 'destructive' });
            return;
        }

        const currentStock = data.stock[selectedProduct.id] || 0;
        if (currentStock < Number(exitQuantity)) {
            toast({ title: 'Erro de Estoque', description: `Estoque insuficiente. Disponível: ${currentStock}`, variant: 'destructive' });
            return;
        }

        const { newStock, newMovements } = processStockUpdate(
            selectedProduct.id,
            Number(exitQuantity),
            'out',
            exitReason || 'Saída Manual'
        );

        updateData({ ...data, stock: newStock, stockMovements: newMovements });
        
        toast({ title: 'Sucesso!', description: `Saída de ${exitQuantity} ${selectedProduct.unit} de ${selectedProduct.name} registrada.` });
        
        setIsExitDialogOpen(false);
        setSelectedProduct(null);
        setExitQuantity('');
        setExitReason('');
    };

    const getStockStatusColor = (current, min, max) => {
        if (current < min) return 'text-red-500 font-bold';
        if (current > max) return 'text-yellow-500 font-bold';
        return '';
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Helmet>
                <title>Posição de Estoque | InduManager</title>
            </Helmet>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Posição de Estoque</h1>
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Estoque Atual</TableHead>
                            <TableHead>Est. Mínimo</TableHead>
                            <TableHead>Est. Máximo</TableHead>
                            <TableHead>Unidade</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allItems.map(item => {
                            const currentStock = data.stock[item.id] || 0;
                            return (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.type}</TableCell>
                                    <TableCell className={getStockStatusColor(currentStock, item.minStock, item.maxStock)}>{currentStock}</TableCell>
                                    <TableCell>{item.minStock}</TableCell>
                                    <TableCell>{item.maxStock}</TableCell>
                                    <TableCell>{item.unit}</TableCell>
                                    <TableCell className="text-right">
                                        {item.type === 'Produto Acabado' && (
                                            <Button variant="outline" size="sm" onClick={() => handleOpenExitDialog(item)}>
                                                <ArrowDownCircle className="mr-2 h-4 w-4" /> Saída Manual
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>

            <Dialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Registrar Saída de {selectedProduct?.name}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleExitSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="quantity" className="text-right">Quantidade</Label>
                                <Input id="quantity" name="quantity" type="number" value={exitQuantity} onChange={(e) => setExitQuantity(e.target.value)} className="col-span-3" required min="1" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="reason" className="text-right">Motivo</Label>
                                <Input id="reason" name="reason" value={exitReason} onChange={(e) => setExitReason(e.target.value)} placeholder="Venda, Transferência..." className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
                            <Button type="submit">Registrar Saída</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
};

export default StockPosition;