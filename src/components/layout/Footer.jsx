import React from 'react';

const Footer = () => {
    return (
        <footer className="flex-shrink-0 px-6 py-3 bg-theme-green border-t border-gray-200">
            <div className="flex items-center justify-between">
                <p className="text-sm text-white-500">
                    &copy; {new Date().getFullYear()} FertiCore. Todos os direitos reservados.
                </p>
                <p className="text-sm text-white-500">
                    Versão: 1.0.0
                </p>
            </div>
        </footer>
    );
};

export default Footer;