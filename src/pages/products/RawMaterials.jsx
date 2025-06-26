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
import { Card } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const RawMaterials = () => {
    const { data, updateData } = useData();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentMaterial, setCurrentMaterial] = useState(null);

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const materialData = {
            id: currentMaterial ? currentMaterial.id : `rm-${Date.now()}`,
            name: formData.get('name'),
            unit: formData.get('unit'),
            minStock: Number(formData.get('minStock')),
            maxStock: Number(formData.get('maxStock')),
        };

        const newMaterials = currentMaterial
            ? data.rawMaterials.map(m => (m.id === materialData.id ? materialData : m))
            : [...data.rawMaterials, materialData];
        
        let newStock = { ...data.stock };
        if (!currentMaterial) {
            newStock[materialData.id] = 0;
        }

        updateData({ ...data, rawMaterials: newMaterials, stock: newStock });
        toast({ title: 'Sucesso!', description: `Matéria-prima ${currentMaterial ? 'atualizada' : 'criada'} com sucesso.` });
        setIsDialogOpen(false);
        setCurrentMaterial(null);
    };

    const handleEdit = (material) => {
        setCurrentMaterial(material);
        setIsDialogOpen(true);
    };
    
    const handleAddNew = () => {
        setCurrentMaterial(null);
        setIsDialogOpen(true);
    };

    const handleDelete = (materialId) => {
        const newMaterials = data.rawMaterials.filter(m => m.id !== materialId);
        const newStock = { ...data.stock };
        delete newStock[materialId];
        
        updateData({ ...data, rawMaterials: newMaterials, stock: newStock });
        toast({ title: 'Sucesso!', description: 'Matéria-prima deletada com sucesso.', variant: 'destructive' });
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Helmet>
                <title>Matérias-Primas | InduManager</title>
            </Helmet>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cadastro de Matérias-Primas</h1>
                <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
                    <PlusCircle className="mr-2 h-4 w-4" /> Nova Matéria-Prima
                </Button>
            </div>
            
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Estoque Mínimo</TableHead>
                            <TableHead>Estoque Máximo</TableHead>
                            <TableHead>Unidade</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.rawMaterials.map(material => (
                            <TableRow key={material.id}>
                                <TableCell>{material.name}</TableCell>
                                <TableCell>{material.minStock}</TableCell>
                                <TableCell>{material.maxStock}</TableCell>
                                <TableCell>{material.unit}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(material)}><Edit className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                <AlertDialogDescription>Essa ação não pode ser desfeita. Isso irá deletar permanentemente a matéria-prima.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(material.id)}>Deletar</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{currentMaterial ? 'Editar Matéria-Prima' : 'Nova Matéria-Prima'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Nome</Label>
                                <Input id="name" name="name" defaultValue={currentMaterial?.name} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="unit" className="text-right">Unidade</Label>
                                <Input id="unit" name="unit" defaultValue={currentMaterial?.unit} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="minStock" className="text-right">Estoque Mín.</Label>
                                <Input id="minStock" name="minStock" type="number" defaultValue={currentMaterial?.minStock} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="maxStock" className="text-right">Estoque Máx.</Label>
                                <Input id="maxStock" name="maxStock" type="number" defaultValue={currentMaterial?.maxStock} className="col-span-3" required />
                            </div>
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

export default RawMaterials;