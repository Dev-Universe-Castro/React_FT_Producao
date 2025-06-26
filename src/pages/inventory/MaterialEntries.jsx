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

const MaterialEntries = () => {
    const { data, updateData, processStockUpdate } = useData();
    const { toast } = useToast();
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedMaterial || !quantity || Number(quantity) <= 0) {
            toast({ title: 'Erro de Validação', description: 'Por favor, preencha todos os campos corretamente.', variant: 'destructive' });
            return;
        }

        const material = data.rawMaterials.find(m => m.id === selectedMaterial);
        if (!material) {
            toast({ title: 'Erro', description: 'Matéria-prima não encontrada.', variant: 'destructive' });
            return;
        }
        
        const { newStock, newMovements } = processStockUpdate(
            selectedMaterial,
            Number(quantity),
            'in',
            reason || 'Entrada Manual'
        );

        updateData({ ...data, stock: newStock, stockMovements: newMovements });
        
        toast({ title: 'Sucesso!', description: `Entrada de ${quantity} ${material.unit} de ${material.name} registrada.` });
        setSelectedMaterial('');
        setQuantity('');
        setReason('');
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Helmet>
                <title>Entrada de Matéria-Prima | InduManager</title>
            </Helmet>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Registrar Entrada de Matéria-Prima</h1>
            
            <Card className="max-w-lg mx-auto">
                <CardHeader>
                    <CardTitle>Nova Entrada no Estoque</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="material">Matéria-Prima</Label>
                            <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma matéria-prima" />
                                </SelectTrigger>
                                <SelectContent>
                                    {data.rawMaterials.map(m => (
                                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="quantity">Quantidade</Label>
                            <Input id="quantity" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" min="1" />
                        </div>
                        <div>
                            <Label htmlFor="reason">Motivo (NFE, Recibo, etc.)</Label>
                            <Input id="reason" type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="Ex: NFE-67890" />
                        </div>
                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">Registrar Entrada</Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default MaterialEntries;