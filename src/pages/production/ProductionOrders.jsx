import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2, Play, CheckCircle, XCircle } from 'lucide-react';

const ProductionOrders = () => {
    const { data, updateData } = useData();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);

    const statuses = ['Planejado', 'Em andamento', 'Concluído', 'Cancelado'];
    const statusColors = {
        'Planejado': 'bg-blue-200 text-blue-800',
        'Em andamento': 'bg-orange-200 text-orange-800',
        'Concluído': 'bg-green-200 text-green-800',
        'Cancelado': 'bg-red-200 text-red-800',
    };

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const newOrder = {
            id: currentOrder ? currentOrder.id : `po-${Date.now()}`,
            productId: formData.get('productId'),
            quantity: Number(formData.get('quantity')),
            status: currentOrder ? formData.get('status') : 'Planejado',
            createdAt: currentOrder ? currentOrder.createdAt : new Date().toISOString(),
        };

        const newOrders = currentOrder
            ? data.productionOrders.map(o => (o.id === newOrder.id ? newOrder : o))
            : [...data.productionOrders, newOrder];

        updateData({ ...data, productionOrders: newOrders });
        toast({ title: 'Sucesso!', description: `Ordem de produção ${currentOrder ? 'atualizada' : 'criada'}.` });
        setIsDialogOpen(false);
        setCurrentOrder(null);
    };

    const handleEdit = (order) => {
        setCurrentOrder(order);
        setIsDialogOpen(true);
    };

    const handleAddNew = () => {
        setCurrentOrder(null);
        setIsDialogOpen(true);
    };

    const handleDelete = (orderId) => {
        const newOrders = data.productionOrders.filter(o => o.id !== orderId);
        updateData({ ...data, productionOrders: newOrders });
        toast({ title: 'Sucesso!', description: 'Ordem de produção deletada.', variant: 'destructive' });
    };

    const handleStatusChange = (order, newStatus) => {
        if (newStatus === 'Concluído' && order.status !== 'Concluído') {
            const product = data.finishedProducts.find(p => p.id === order.productId);
            if (!product) {
                toast({ title: 'Erro!', description: 'Produto da ordem não encontrado.', variant: 'destructive' });
                return;
            }

            for (const bomItem of product.bom) {
                const material = data.rawMaterials.find(m => m.id === bomItem.materialId);
                const requiredQty = bomItem.quantity * order.quantity;
                const currentStock = data.stock[bomItem.materialId] || 0;
                if (!material || currentStock < requiredQty) {
                    toast({ title: 'Erro de Estoque!', description: `Estoque insuficiente de ${material?.name || 'matéria-prima'}.`, variant: 'destructive' });
                    return;
                }
            }

            let newStock = { ...data.stock };
            let newMovements = [...data.stockMovements];
            
            newStock[product.id] = (newStock[product.id] || 0) + order.quantity;
            newMovements.push({ id: `sm-${Date.now()}-in`, itemId: product.id, type: 'in', quantity: order.quantity, date: new Date().toISOString(), reason: `OP-${order.id}` });
            
            product.bom.forEach((bomItem, index) => {
                const requiredQty = bomItem.quantity * order.quantity;
                newStock[bomItem.materialId] -= requiredQty;
                newMovements.push({ id: `sm-${Date.now()}-out-${index}`, itemId: bomItem.materialId, type: 'out', quantity: requiredQty, date: new Date().toISOString(), reason: `OP-${order.id}` });
            });
            
            const updatedOrder = { ...order, status: newStatus };
            const newOrders = data.productionOrders.map(o => o.id === order.id ? updatedOrder : o);

            updateData({ ...data, productionOrders: newOrders, stock: newStock, stockMovements: newMovements });
            toast({ title: 'Sucesso!', description: 'Ordem concluída e estoque atualizado!' });

        } else if (order.status !== 'Concluído' && order.status !== 'Cancelado') {
             const updatedOrder = { ...order, status: newStatus };
             const newOrders = data.productionOrders.map(o => o.id === order.id ? updatedOrder : o);
             updateData({ ...data, productionOrders: newOrders });
             toast({ title: 'Status Alterado!', description: `Ordem movida para ${newStatus}.` });
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Helmet>
                <title>Ordens de Produção | InduManager</title>
            </Helmet>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ordens de Produção</h1>
                <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
                    <PlusCircle className="mr-2 h-4 w-4" /> Nova Ordem
                </Button>
            </div>
            
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Produto</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Criado em</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.productionOrders.map(order => {
                            const product = data.finishedProducts.find(p => p.id === order.productId);
                            return (
                                <TableRow key={order.id}>
                                    <TableCell>{product?.name || 'Produto não encontrado'}</TableCell>
                                    <TableCell>{order.quantity}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right space-x-1">
                                        {order.status === 'Planejado' && <Button variant="ghost" size="icon" title="Iniciar" onClick={() => handleStatusChange(order, 'Em andamento')}><Play className="h-4 w-4 text-orange-500" /></Button>}
                                        {order.status === 'Em andamento' && <Button variant="ghost" size="icon" title="Concluir" onClick={() => handleStatusChange(order, 'Concluído')}><CheckCircle className="h-4 w-4 text-green-500" /></Button>}
                                        {order.status !== 'Concluído' && order.status !== 'Cancelado' && <Button variant="ghost" size="icon" title="Cancelar" onClick={() => handleStatusChange(order, 'Cancelado')}><XCircle className="h-4 w-4 text-red-500" /></Button>}
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(order)}><Edit className="h-4 w-4" /></Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" disabled={order.status === 'Concluído'}><Trash2 className="h-4 w-4" /></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                    <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(order.id)}>Deletar</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{currentOrder ? 'Editar Ordem de Produção' : 'Nova Ordem de Produção'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="productId" className="text-right">Produto</Label>
                                <Select name="productId" defaultValue={currentOrder?.productId}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Selecione um produto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {data.finishedProducts.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="quantity" className="text-right">Quantidade</Label>
                                <Input id="quantity" name="quantity" type="number" defaultValue={currentOrder?.quantity} className="col-span-3" required />
                            </div>
                            {currentOrder && (
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="status" className="text-right">Status</Label>
                                    <Select name="status" defaultValue={currentOrder?.status} disabled={currentOrder.status === 'Concluído' || currentOrder.status === 'Cancelado'}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Selecione um status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statuses.filter(s => s !== 'Concluído' && s !== 'Cancelado').map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
                            <Button type="submit">Salvar</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
};

export default ProductionOrders;