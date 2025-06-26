
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Package, 
  ShoppingCart, 
  ClipboardList, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  BarChart3, 
  FileText,
  X,
  Factory
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Usuários', path: '/users' },
  { icon: Shield, label: 'Permissões', path: '/permissions' },
  { icon: Package, label: 'Matérias-Primas', path: '/raw-materials' },
  { icon: ShoppingCart, label: 'Produtos Acabados', path: '/finished-products' },
  { icon: ClipboardList, label: 'Ordens de Produção', path: '/production-orders' },
  { icon: ArrowUpCircle, label: 'Entrada de Materiais', path: '/material-entries' },
  { icon: ArrowDownCircle, label: 'Saída de Produtos', path: '/product-exits' },
  { icon: BarChart3, label: 'Analítico', path: '/analytics' },
  { icon: FileText, label: 'Relatórios', path: '/reports' }
];

function Sidebar({ open, setOpen }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: open ? 0 : -320 }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 sidebar-gradient border-r border-slate-700 lg:relative lg:translate-x-0",
          "flex flex-col"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Factory className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold gradient-text">Sistema Industrial</span>
              <p className="text-xs text-slate-400">Gestão de Produção</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                  "hover:bg-slate-700/50 group relative overflow-hidden",
                  isActive && "bg-blue-600/20 border border-blue-500/30"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-green-600/20 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={cn(
                  "h-5 w-5 transition-colors relative z-10",
                  isActive ? "text-blue-400" : "text-slate-400 group-hover:text-white"
                )} />
                <span className={cn(
                  "font-medium transition-colors relative z-10",
                  isActive ? "text-white" : "text-slate-300 group-hover:text-white"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-700">
          <div className="glass-effect rounded-lg p-3">
            <p className="text-xs text-slate-400 text-center">
              Sistema v1.0.0
            </p>
            <p className="text-xs text-slate-500 text-center mt-1">
              Gestão Industrial Completa
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Sidebar;
