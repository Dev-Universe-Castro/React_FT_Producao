import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const Users = () => {
    const { data, updateUser, deleteUser } = useData();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData.entries());

        if (!currentUser?.id) {
            userData.id = `user-${Date.now()}`;
            userData.createdAt = new Date().toISOString();
        } else {
            userData.id = currentUser.id;
            userData.createdAt = currentUser.createdAt;
        }

        updateUser(userData);
        toast({ title: 'Sucesso!', description: `Usuário ${currentUser ? 'atualizado' : 'criado'} com sucesso.` });
        setIsDialogOpen(false);
        setCurrentUser(null);
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setIsDialogOpen(true);
    };

    const handleAddNew = () => {
        setCurrentUser(null);
        setIsDialogOpen(true);
    };

    const handleDelete = (userId) => {
        deleteUser(userId);
        toast({ title: 'Sucesso!', description: 'Usuário deletado com sucesso.', variant: 'destructive' });
    };

    const roles = ['admin', 'manager', 'operator'];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Helmet>
                <title>Gestão de Usuários | InduManager</title>
            </Helmet>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gerenciamento de Usuários</h1>
                <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
                    <PlusCircle className="mr-2 h-4 w-4" /> Novo Usuário
                </Button>
            </div>
            
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Função</TableHead>
                            <TableHead>Criado em</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-red-200 text-red-800' : user.role === 'manager' ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'}`}>{user.role}</span></TableCell>
                                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}><Edit className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                <AlertDialogDescription>Essa ação não pode ser desfeita. Isso irá deletar permanentemente o usuário.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(user.id)}>Deletar</AlertDialogAction>
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
                        <DialogTitle>{currentUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Nome</Label>
                                <Input id="name" name="name" defaultValue={currentUser?.name} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input id="email" name="email" type="email" defaultValue={currentUser?.email} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">Senha</Label>
                                <Input id="password" name="password" type="password" placeholder={currentUser ? 'Deixe em branco para não alterar' : ''} className="col-span-3" required={!currentUser} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role" className="text-right">Função</Label>
                                <Select name="role" defaultValue={currentUser?.role || 'operator'}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Selecione uma função" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                                    </SelectContent>
                                </Select>
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

export default Users;