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
import { PlusCircle, Edit, Trash2, MinusCircle } from 'lucide-react';

const FinishedProducts = () => {
    const { data, updateData } = useData();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [bom, setBom] = useState([]);

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const productData = {
            id: currentProduct ? currentProduct.id : `fp-${Date.now()}`,
            name: formData.get('name'),
            unit: formData.get('unit'),
            minStock: Number(formData.get('minStock')),
            maxStock: Number(formData.get('maxStock')),
            bom: bom
        };

        const newProducts = currentProduct
            ? data.finishedProducts.map(p => (p.id === productData.id ? productData : p))
            : [...data.finishedProducts, productData];
            
        let newStock = { ...data.stock };
        if (!currentProduct) {
            newStock[productData.id] = 0;
        }

        updateData({ ...data, finishedProducts: newProducts, stock: newStock });
        toast({ title: 'Sucesso!', description: `Produto ${currentProduct ? 'atualizado' : 'criado'} com sucesso.` });
        setIsDialogOpen(false);
        setCurrentProduct(null);
        setBom([]);
    };

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setBom(product.bom || []);
        setIsDialogOpen(true);
    };

    const handleAddNew = () => {
        setCurrentProduct(null);
        setBom([]);
        setIsDialogOpen(true);
    };

    const handleDelete = (productId) => {
        const newProducts = data.finishedProducts.filter(p => p.id !== productId);
        const newStock = { ...data.stock };
        delete newStock[productId];
        
        updateData({ ...data, finishedProducts: newProducts, stock: newStock });
        toast({ title: 'Sucesso!', description: 'Produto deletado com sucesso.', variant: 'destructive' });
    };

    const addBomItem = () => {
        setBom([...bom, { materialId: '', quantity: 1 }]);
    };

    const updateBomItem = (index, field, value) => {
        const newBom = [...bom];
        newBom[index][field] = field === 'quantity' ? Number(value) : value;
        setBom(newBom);
    };
    
    const removeBomItem = (index) => {
        const newBom = bom.filter((_, i) => i !== index);
        setBom(newBom);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Helmet>
                <title>Produtos Acabados | InduManager</title>
            </Helmet>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cadastro de Produtos Acabados</h1>
                <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
                    <PlusCircle className="mr-2 h-4 w-4" /> Novo Produto
                </Button>
            </div>
            
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Est. Mínimo</TableHead>
                            <TableHead>Est. Máximo</TableHead>
                            <TableHead>Unidade</TableHead>
                            <TableHead>Itens na BOM</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.finishedProducts.map(product => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.minStock}</TableCell>
                                <TableCell>{product.maxStock}</TableCell>
                                <TableCell>{product.unit}</TableCell>
                                <TableCell>{product.bom.length}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}><Edit className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                <AlertDialogDescription>Essa ação não pode ser desfeita. Isso irá deletar permanentemente o produto.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(product.id)}>Deletar</AlertDialogAction>
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
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{currentProduct ? 'Editar Produto Acabado' : 'Novo Produto Acabado'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Nome</Label>
                                <Input id="name" name="name" defaultValue={currentProduct?.name} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="unit" className="text-right">Unidade</Label>
                                <Input id="unit" name="unit" defaultValue={currentProduct?.unit} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="minStock" className="text-right">Estoque Mín.</Label>
                                <Input id="minStock" name="minStock" type="number" defaultValue={currentProduct?.minStock} className="col-span-3" required />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="maxStock" className="text-right">Estoque Máx.</Label>
                                <Input id="maxStock" name="maxStock" type="number" defaultValue={currentProduct?.maxStock} className="col-span-3" required />
                            </div>
                        </div>

                        <div className="my-4">
                            <h3 className="font-semibold mb-2">Estrutura do Produto (BOM)</h3>
                            <div className="space-y-2">
                                {bom.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Select value={item.materialId} onValueChange={(value) => updateBomItem(index, 'materialId', value)}>
                                            <SelectTrigger><SelectValue placeholder="Selecione matéria-prima" /></SelectTrigger>
                                            <SelectContent>
                                                {data.rawMaterials.map(material => (
                                                    <SelectItem key={material.id} value={material.id}>{material.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Input type="number" placeholder="Qtd." value={item.quantity} onChange={(e) => updateBomItem(index, 'quantity', e.target.value)} className="w-24" />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeBomItem(index)}><MinusCircle className="h-4 w-4 text-red-500" /></Button>
                                    </div>
                                ))}
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addBomItem} className="mt-2">Adicionar Item à BOM</Button>
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

export default FinishedProducts;