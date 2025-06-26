import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X } from 'lucide-react';

const permissionsConfig = {
    'Dashboard': { admin: true, manager: true, operator: true },
    'Gestão de Usuários': { admin: true, manager: false, operator: false },
    'Gestão de Permissões': { admin: true, manager: false, operator: false },
    'Cadastro de Produtos': { admin: true, manager: true, operator: false },
    'Ordens de Produção': { admin: true, manager: true, operator: true },
    'Gestão de Estoque': { admin: true, manager: true, operator: true },
    'Analítico': { admin: true, manager: true, operator: false },
    'Relatórios': { admin: true, manager: true, operator: false },
};

const roles = ['admin', 'manager', 'operator'];
const features = Object.keys(permissionsConfig);

const Permissions = () => {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Helmet>
                <title>Gestão de Permissões | InduManager</title>
            </Helmet>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Gerenciamento de Permissões</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Tabela de Acessos por Função</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Funcionalidade</TableHead>
                                {roles.map(role => (
                                    <TableHead key={role} className="text-center capitalize">{role}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {features.map(feature => (
                                <TableRow key={feature}>
                                    <TableCell className="font-medium">{feature}</TableCell>
                                    {roles.map(role => (
                                        <TableCell key={`${feature}-${role}`} className="text-center">
                                            {permissionsConfig[feature][role] ? (
                                                <Check className="h-5 w-5 text-green-500 mx-auto" />
                                            ) : (
                                                <X className="h-5 w-5 text-red-500 mx-auto" />
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default Permissions;