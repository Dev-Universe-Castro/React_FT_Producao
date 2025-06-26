
    import React, { useState } from 'react';
    import { useLocation, useNavigate } from 'react-router-dom';
    import { useAuth } from '@/contexts/AuthContext';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { Helmet } from 'react-helmet-async';
    import { motion } from 'framer-motion';

    const Login = () => {
      const navigate = useNavigate();
      const location = useLocation();
      const { login } = useAuth();
      const { toast } = useToast();
      const [email, setEmail] = useState('admin@indumanager.com');
      const [password, setPassword] = useState('password');

      const from = location.state?.from?.pathname || '/';

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
          toast({
            title: 'Erro de Validação',
            description: 'Por favor, preencha todos os campos.',
            variant: 'destructive',
          });
          return;
        }
        login({ email });
        navigate(from, { replace: true });
      };

      return (
        <>
          <Helmet>
            <title>Login - Gestão de Produção</title>
            <meta name="description" content="Página de login do sistema de gestão de produção." />
          </Helmet>
          <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700"
            >
              <h1 className="text-3xl font-bold text-white text-center mb-6 text-green-400">InduManager</h1>
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
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3">Entrar</Button>
              </form>
              <p className="text-center text-gray-400 mt-6">
                Não tem uma conta?{' '}
                <button onClick={() => navigate('/register')} className="text-green-400 hover:underline">
                  Registre-se
                </button>
              </p>
            </motion.div>
          </div>
        </>
      );
    };

    export default Login;
  