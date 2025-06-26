import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { Factory } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Register = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = (e) => {
        e.preventDefault();
        setLoading(true);
        const result = register(name, email, password);
        if (result.success) {
            toast({
                title: "Registro bem-sucedido!",
                description: result.message,
            });
            navigate('/login');
        } else {
            toast({
                title: "Falha no registro",
                description: result.message,
                variant: 'destructive',
            });
        }
        setLoading(false);
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Helmet>
        <title>Registro | InduManager</title>
      </Helmet>
       <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
             <div className="flex justify-center items-center mb-4">
                <Factory className="h-10 w-10 text-green-600" />
                <span className="ml-3 text-3xl font-bold text-gray-800 dark:text-white">InduManager</span>
            </div>
            <CardTitle className="text-2xl">Crie sua conta</CardTitle>
            <CardDescription>Preencha os campos para se registrar.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister}>
              <div className="grid w-full items-center gap-4">
                 <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" type="text" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" type="password" placeholder="Crie uma senha forte" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>
              <Button className="w-full mt-6 bg-green-600 hover:bg-green-700" type="submit" disabled={loading}>
                  {loading ? 'Registrando...' : 'Registrar'}
              </Button>
            </form>
          </CardContent>
           <CardFooter className="flex justify-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">Já tem uma conta? <NavLink to="/login" className="font-medium text-green-600 hover:underline">Faça Login</NavLink></p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;