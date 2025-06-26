import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ProductExits = () => {
    const { data, updateFinishedProduct, addStockMovement } = useData();
    const { toast } = useToast();
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedProduct || !quantity || quantity <= 0) {
            toast({ title: 'Erro de Validação', description: 'Por favor, preencha todos os campos corretamente.', variant: 'destructive' });
            return;
        }

        const product = data.finishedProducts.find(p => p.id === selectedProduct);
        if (!product) {
            toast({ title: 'Erro', description: 'Produto não encontrado.', variant: 'destructive' });
            return;
        }

        if (product.stock < quantity) {
            toast({ title: 'Erro de Estoque', description: `Estoque insuficiente. Disponível: ${product.stock}`, variant: 'destructive' });
            return;
        }

        const updatedProduct = { ...product, stock: product.stock - Number(quantity) };
        updateFinishedProduct(updatedProduct);
        addStockMovement({
            id: `sm-${Date.now()}`,
            itemId: selectedProduct,
            type: 'out',
            quantity: Number(quantity),
            date: new Date().toISOString(),
            reason: reason || 'Saída Manual',
        });
        
        toast({ title: 'Sucesso!', description: `Saída de ${quantity} ${product.unit} de ${product.name} registrada.` });
        setSelectedProduct('');
        setQuantity('');
        setReason('');
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Helmet>
                <title>Saída de Produtos | InduManager</title>
            </Helmet>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Registrar Saída de Produto Acabado</h1>
            
            <Card className="max-w-lg mx-auto">
                <CardHeader>
                    <CardTitle>Nova Saída do Estoque</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="product">Produto Acabado</Label>
                            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um produto" />
                                </SelectTrigger>
                                <SelectContent>
                                    {data.finishedProducts.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="quantity">Quantidade</Label>
                            <Input id="quantity" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" min="1" />
                        </div>
                        <div>
                            <Label htmlFor="reason">Motivo (Venda, Transferência, etc.)</Label>
                            <Input id="reason" type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="Ex: Venda-987" />
                        </div>
                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">Registrar Saída</Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ProductExits;