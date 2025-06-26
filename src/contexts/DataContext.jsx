
import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    users: [],
    rawMaterials: [],
    finishedProducts: [],
    productionOrders: [],
    stock: {},
    stockMovements: []
  });

  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:5000/api';

  const loadData = async () => {
    try {
      setLoading(true);

      const [users, rawMaterials, finishedProducts, productionOrders, stock, stockMovements] = await Promise.all([
        fetch(`${API_BASE_URL}/users`).then(res => res.json()),
        fetch(`${API_BASE_URL}/materials`).then(res => res.json()),
        fetch(`${API_BASE_URL}/products`).then(res => res.json()),
        fetch(`${API_BASE_URL}/orders`).then(res => res.json()),
        fetch(`${API_BASE_URL}/stock`).then(res => res.json()),
        fetch(`${API_BASE_URL}/stock/movements`).then(res => res.json()),
      ]);

      // Convert database field names to frontend format
      const normalizedRawMaterials = rawMaterials.map(rm => ({
        ...rm,
        minStock: rm.min_stock,
        maxStock: rm.max_stock
      }));

      const normalizedFinishedProducts = finishedProducts.map(fp => ({
        ...fp,
        minStock: fp.min_stock,
        maxStock: fp.max_stock
      }));

      setData({
        users,
        rawMaterials: normalizedRawMaterials,
        finishedProducts: normalizedFinishedProducts,
        productionOrders,
        stock,
        stockMovements
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addUser = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const newUser = await response.json();
      setData(prev => ({ ...prev, users: [...prev.users, newUser] }));
      return newUser;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const updatedUser = await response.json();
      setData(prev => ({
        ...prev,
        users: prev.users.map(user => user.id === id ? updatedUser : user)
      }));
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const deleteUser = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' });
      setData(prev => ({
        ...prev,
        users: prev.users.filter(user => user.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const addRawMaterial = async (materialData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(materialData)
      });
      const newMaterial = await response.json();
      const normalized = { ...newMaterial, minStock: newMaterial.min_stock, maxStock: newMaterial.max_stock };
      setData(prev => ({ 
        ...prev, 
        rawMaterials: [...prev.rawMaterials, normalized],
        stock: { ...prev.stock, [newMaterial.id]: 0 }
      }));
      return normalized;
    } catch (error) {
      console.error('Error adding material:', error);
      throw error;
    }
  };

  const updateRawMaterial = async (id, materialData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(materialData)
      });
      const updatedMaterial = await response.json();
      const normalized = { ...updatedMaterial, minStock: updatedMaterial.min_stock, maxStock: updatedMaterial.max_stock };
      setData(prev => ({
        ...prev,
        rawMaterials: prev.rawMaterials.map(material => material.id === id ? normalized : material)
      }));
      return normalized;
    } catch (error) {
      console.error('Error updating material:', error);
      throw error;
    }
  };

  const deleteRawMaterial = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/materials/${id}`, { method: 'DELETE' });
      setData(prev => ({
        ...prev,
        rawMaterials: prev.rawMaterials.filter(material => material.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting material:', error);
      throw error;
    }
  };

  const addFinishedProduct = async (productData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const newProduct = await response.json();
      const normalized = { ...newProduct, minStock: newProduct.min_stock, maxStock: newProduct.max_stock };
      setData(prev => ({ 
        ...prev, 
        finishedProducts: [...prev.finishedProducts, normalized],
        stock: { ...prev.stock, [newProduct.id]: 0 }
      }));
      return normalized;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateFinishedProduct = async (id, productData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const updatedProduct = await response.json();
      const normalized = { ...updatedProduct, minStock: updatedProduct.min_stock, maxStock: updatedProduct.max_stock };
      setData(prev => ({
        ...prev,
        finishedProducts: prev.finishedProducts.map(product => product.id === id ? normalized : product)
      }));
      return normalized;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteFinishedProduct = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
      setData(prev => ({
        ...prev,
        finishedProducts: prev.finishedProducts.filter(product => product.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const addProductionOrder = async (orderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const newOrder = await response.json();
      setData(prev => ({ ...prev, productionOrders: [...prev.productionOrders, newOrder] }));
      return newOrder;
    } catch (error) {
      console.error('Error adding production order:', error);
      throw error;
    }
  };

  const updateProductionOrder = async (id, orderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const updatedOrder = await response.json();
      setData(prev => ({
        ...prev,
        productionOrders: prev.productionOrders.map(order => order.id === id ? updatedOrder : order)
      }));
      return updatedOrder;
    } catch (error) {
      console.error('Error updating production order:', error);
      throw error;
    }
  };

  const deleteProductionOrder = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/orders/${id}`, { method: 'DELETE' });
      setData(prev => ({
        ...prev,
        productionOrders: prev.productionOrders.filter(order => order.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting production order:', error);
      throw error;
    }
  };

  const addStockMovement = async (movementData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stock/movements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movementData)
      });
      const newMovement = await response.json();
      
      // Update local state
      setData(prev => {
        const newStock = { ...prev.stock };
        const currentStock = newStock[movementData.itemId] || 0;
        const quantity = movementData.quantity;
        newStock[movementData.itemId] = movementData.type === 'in' 
          ? currentStock + quantity 
          : Math.max(0, currentStock - quantity);
        
        return {
          ...prev,
          stock: newStock,
          stockMovements: [newMovement, ...prev.stockMovements]
        };
      });
      
      return newMovement;
    } catch (error) {
      console.error('Error adding stock movement:', error);
      throw error;
    }
  };

  const value = {
    data,
    loading,
    loadData,
    addUser,
    updateUser,
    deleteUser,
    addRawMaterial,
    updateRawMaterial,
    deleteRawMaterial,
    addFinishedProduct,
    updateFinishedProduct,
    deleteFinishedProduct,
    addProductionOrder,
    updateProductionOrder,
    deleteProductionOrder,
    addStockMovement,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
