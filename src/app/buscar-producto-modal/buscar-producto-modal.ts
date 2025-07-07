import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../services/api';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-buscar-producto-modal',
  imports: [CommonModule,FormsModule],
  standalone: true,
  templateUrl: './buscar-producto-modal.html',
  styleUrl: './buscar-producto-modal.scss'
})
export class BuscarProductoModal {
  @Output() productoSeleccionado = new EventEmitter<any>();
  @Output() cerrar = new EventEmitter<void>();

  busqueda = '';
 productos: any[] = [];
productosFiltrados = [...this.productos];

    constructor(private http: HttpClient,private api : Api) {
    
  }
ngOnInit(): void {
    this.api.listProducto().subscribe({
      next: (producto: any[]) => {
        console.log('res', producto);
        this.productos = producto;
         this.productosFiltrados = [...this.productos];
      },
      error: err => {
        console.error('error', err);
      }
    });
    
  }

filtrarProductos() {
  const texto = this.busqueda.trim().toLowerCase();

  if (!texto) {
    this.productosFiltrados = [...this.productos];
    return;
  }

  this.productosFiltrados = this.productos.filter(producto =>
    producto.nombre.toLowerCase().includes(texto)
  );
}

   seleccionarProducto(producto: any) {
    this.productoSeleccionado.emit(producto);
    this.cerrar.emit();
  }

}
