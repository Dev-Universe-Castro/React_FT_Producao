
    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { Helmet } from 'react-helmet-async';
    import { motion } from 'framer-motion';

    const Register = () => {
      const navigate = useNavigate();
      const { toast } = useToast();
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');

      const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
          toast({
            title: 'Erro de Senha',
            description: 'As senhas não coincidem.',
            variant: 'destructive',
          });
          return;
        }
        toast({
          title: '🚧 Funcionalidade não implementada',
          description: "Este recurso ainda não foi implementado, mas não se preocupe! Você pode solicitá-lo em seu próximo prompt! 🚀",
        });
      };

      return (
        <>
          <Helmet>
            <title>Registro - Gestão de Produção</title>
            <meta name="description" content="Página de registro de novos usuários." />
          </Helmet>
          <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700"
            >
              <h1 className="text-3xl font-bold text-white text-center mb-6 text-green-400">Criar Conta</h1>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-gray-700 rounded-md text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">Senha</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-gray-700 rounded-md text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="********"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="confirm-password">Confirmar Senha</label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 bg-gray-700 rounded-md text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="********"
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3">Registrar</Button>
              </form>
              <p className="text-center text-gray-400 mt-6">
                Já tem uma conta?{' '}
                <button onClick={() => navigate('/login')} className="text-green-400 hover:underline">
                  Faça login
                </button>
              </p>
            </motion.div>
          </div>
        </>
      );
    };

    export default Register;
  