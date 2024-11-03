export interface Category {
  id: number;
  nombre: string;
}

export interface Product {
  id: number;
  nombre: string;
  precio: number;
  categoria_id: number;
  category?: Category;
}

export interface ProductFormData {
  nombre: string;
  precio: string;
  categoria_id: string;
}