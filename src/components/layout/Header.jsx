import React from 'react';
import { Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const Header = () => {
    const { user } = useAuth();
    const { toast } = useToast();

    const handleNotImplemented = () => {
        toast({
            title: "Funcionalidade em desenvolvimento! 🚧",
            description: "Este recurso ainda não foi implementado, mas não se preocupe! Você pode solicitá-lo em seu próximo prompt! 🚀",
        });
    };

    return (
        <header className="flex-shrink-0 bg-theme-green text-white shadow-md">
            <div className="flex items-center justify-between p-2 h-16">
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-theme-green-dark">
                        <Menu className="h-6 w-6" />
                    </Button>
                    <span className="ml-4 text-xl font-semibold">Expedição</span>
                </div>

                <div className="flex-1 flex justify-center px-4">
                     <Button 
                        onClick={handleNotImplemented}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded"
                    >
                        IR PARA ÁREA DO FUNCIONÁRIO
                    </Button>
                </div>

                <div className="flex items-center space-x-4 pr-4">
                    <span className="font-semibold uppercase">{user ? user.name : 'Usuário'}</span>
                </div>
            </div>
        </header>
    );
};

export default Header;