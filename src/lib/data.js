export const initialData = {
    users: [
      { id: 'user-1', name: 'Admin', email: 'admin@indumanager.com', password: 'admin', role: 'admin', createdAt: new Date().toISOString() },
      { id: 'user-2', name: 'Gerente', email: 'gerente@indumanager.com', password: 'password', role: 'manager', createdAt: new Date().toISOString() },
      { id: 'user-3', name: 'Operador', email: 'operador@indumanager.com', password: 'password', role: 'operator', createdAt: new Date().toISOString() },
    ],
    rawMaterials: [
      { id: 'rm-1', name: 'Placa de Aço 1mm', unit: 'un', minStock: 50, maxStock: 2000 },
      { id: 'rm-2', name: 'Parafuso Sextavado', unit: 'un', minStock: 500, maxStock: 10000 },
      { id: 'rm-3', name: 'Tinta Epoxi Branca', unit: 'L', minStock: 20, maxStock: 300 },
    ],
    finishedProducts: [
      {
        id: 'fp-1',
        name: 'Gabinete Metálico Padrão',
        unit: 'un',
        minStock: 10,
        maxStock: 100,
        bom: [
          { materialId: 'rm-1', quantity: 2 },
          { materialId: 'rm-2', quantity: 8 },
          { materialId: 'rm-3', quantity: 0.5 },
        ]
      },
      {
        id: 'fp-2',
        name: 'Suporte de Parede',
        unit: 'un',
        minStock: 20,
        maxStock: 200,
        bom: [
          { materialId: 'rm-1', quantity: 1 },
          { materialId: 'rm-2', quantity: 4 },
        ]
      }
    ],
    productionOrders: [
      { id: 'po-1', productId: 'fp-1', quantity: 50, status: 'Concluído', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'po-2', productId: 'fp-2', quantity: 100, status: 'Em andamento', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'po-3', productId: 'fp-1', quantity: 30, status: 'Planejado', createdAt: new Date().toISOString() },
      { id: 'po-4', productId: 'fp-2', quantity: 200, status: 'Cancelado', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    stock: {
      'rm-1': 1000,
      'rm-2': 5000,
      'rm-3': 200,
      'fp-1': 50,
      'fp-2': 120,
    },
    stockMovements: [
      { id: 'sm-1', itemId: 'rm-1', type: 'in', quantity: 500, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), reason: 'NFE-12345' },
      { id: 'sm-2', itemId: 'fp-1', type: 'out', quantity: 10, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), reason: 'Venda-556' },
    ],
  };