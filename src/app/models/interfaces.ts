export interface DetalleProducto {
 codigo: string;
  nombre: string;
  precio: number;
  cantidad: number;
  tipo_venta: 'unidad' | 'gramos';
  total: number;
}

export interface Boleta {
  id: number;
  total: number;
  fecha: string;
  estado: string;
  detalles: DetalleProducto[];
}

export class Boletaslist {
  boletas: Boleta[] = [];
}

export interface Producto {
  id : number;
  codigo: string;
  nombre: string;
  fecha: string;
  precio: number;
  cantidad: number;
  descripcion: string;
  total: number;
}