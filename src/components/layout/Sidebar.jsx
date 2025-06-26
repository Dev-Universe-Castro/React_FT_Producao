import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, Box, Factory, Truck, Users, Key, BarChart2, FileText, PackageCheck, History } from 'lucide-react';

const NavItem = ({ to, icon, children }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center p-3 my-1 rounded-md transition-colors duration-200 ${
            isActive
                ? 'bg-theme-green text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-200'
            }`
        }
    >
        {icon}
        <span className="mx-4 font-medium">{children}</span>
    </NavLink>
);

const NavSectionTitle = ({ children }) => (
    <div className="px-3 mt-4 mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{children}</span>
    </div>
);


const Sidebar = () => {
    return (
        <aside className="hidden md:flex flex-col w-64 bg-white text-gray-700 border-r border-gray-200">
            <div className="flex items-center justify-center h-20 border-b border-gray-200 px-4">
                <div className="w-full">
                    <img  alt="FertiCore Logo" className="h-12 mx-auto" src="https://static.wixstatic.com/media/1681cd_512779dce5da449f9163ef192ecabf7c~mv2.png/v1/crop/x_0,y_1,w_990,h_468/fill/w_141,h_67,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/1681cd_512779dce5da449f9163ef192ecabf7c~mv2.png" />
                </div>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1">
                <NavSectionTitle>Principal</NavSectionTitle>
                <NavItem to="/dashboard" icon={<Home className="h-5 w-5" />}>Início</NavItem>

                <NavSectionTitle>Cadastros</NavSectionTitle>
                <NavItem to="/products/raw-materials" icon={<Box className="h-5 w-5" />}>Matérias-Primas</NavItem>
                <NavItem to="/products/finished-products" icon={<Package className="h-5 w-5" />}>Produtos Acabados</NavItem>
                
                <NavSectionTitle>Operacional</NavSectionTitle>
                <NavItem to="/production/orders" icon={<Factory className="h-5 w-5" />}>Ordens de Produção</NavItem>
                <NavItem to="/inventory/position" icon={<PackageCheck className="h-5 w-5" />}>Posição de Estoque</NavItem>
                <NavItem to="/inventory/entries" icon={<Truck className="h-5 w-5" />}>Entrada de Material</NavItem>
                <NavItem to="/inventory/movements" icon={<History className="h-5 w-5" />}>Movimentações</NavItem>
                
                <NavSectionTitle>Gestão e Análise</NavSectionTitle>
                <NavItem to="/management/users" icon={<Users className="h-5 w-5" />}>Usuários</NavItem>
                <NavItem to="/management/permissions" icon={<Key className="h-5 w-5" />}>Permissões</NavItem>
                <NavItem to="/analytics" icon={<BarChart2 className="h-5 w-5" />}>Analítico</NavItem>
                <NavItem to="/reports" icon={<FileText className="h-5 w-5" />}>Relatórios</NavItem>
            </nav>
        </aside>
    );
};

export default Sidebar;