import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Category, Product, ProductFormData } from './types/product';
import { api } from './services/api';
import { ProductForm } from './components/ProductForm';
import { ProductTable } from './components/ProductTable';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Package } from 'lucide-react';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    nombre: '',
    precio: '',
    categoria_id: '',
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, formData);
        toast.success('Producto actualizado exitosamente');
      } else {
        await api.createProduct(formData);
        toast.success('Producto agregado exitosamente');
      }
      await fetchInitialData();
      resetForm();
    } catch (error) {
      toast.error('Error al procesar la operación');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      precio: product.precio.toString(),
      categoria_id: product.categoria_id.toString(),
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    
    try {
      await api.deleteProduct(id);
      toast.success('Producto eliminado exitosamente');
      await fetchInitialData();
    } catch (error) {
      toast.error('Error al eliminar el producto');
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', precio: '', categoria_id: '' });
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Package className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
        </div>

        <ProductForm
          formData={formData}
          categories={categories}
          editingProduct={editingProduct}
          onInputChange={handleInputChange}
          onSubmit={handleAddOrUpdate}
          onCancel={resetForm}
        />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

export default App;