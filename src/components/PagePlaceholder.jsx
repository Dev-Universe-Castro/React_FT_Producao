
    import React from 'react';
    import { Helmet } from 'react-helmet-async';
    import { motion } from 'framer-motion';
    import { Construction } from 'lucide-react';

    const PagePlaceholder = ({ title, description }) => {
      return (
        <>
          <Helmet>
            <title>{title} - Gestão de Produção</title>
            <meta name="description" content={description} />
          </Helmet>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-full text-center bg-gray-900 p-8 rounded-lg"
          >
            <Construction className="w-24 h-24 text-green-400 mb-6" />
            <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
            <p className="text-lg text-gray-400">Esta página está em construção.</p>
            <p className="text-md text-gray-500 mt-4">A funcionalidade completa será implementada em breve. Você pode solicitar esta funcionalidade no seu próximo prompt! 🚀</p>
          </motion.div>
        </>
      );
    };

    export default PagePlaceholder;
  