import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api } from '../../../services/api';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mantenedor-productos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mantenedor-productos.html',
  styleUrl: './mantenedor-productos.scss'
})
export class MantenedorProductos {
productoForm: FormGroup;
  busqueda = '';
   productos: any[] = [];
  productosFiltrados = [...this.productos];

   constructor(private fb: FormBuilder,private Service: Api) {
    this.productoForm = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      peso: [0, [Validators.required, Validators.min(0)]],
      cantidad: [0, [Validators.required, Validators.min(1)]],
      tipoventa: ['', Validators.required],
    });

  }
  
  ngOnInit(): void {
    this.Service.listProducto().subscribe({
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
  

  guardar() {
     const rol = localStorage.getItem('rol')
     console.log("rol",rol)
    if (this.productoForm.valid) {
      console.log('Datos del producto:', JSON.stringify(this.productoForm.value));
      this.Service.addProducto(this.productoForm.value).subscribe({
      next: (producto) => {
        Swal.fire({
        icon: 'success',
        title: 'Producto agregado',
        text: 'El producto se ha agregado correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
      this.productoForm.reset();
      },
      error: (err) => console.error('Error al agregar producto:', err)
    });
      
    } else {
      console.log('Formulario inválido');
    }
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

buscarPorCodigo() {
  const codigo = this.productoForm.get('codigo')?.value;

  if (!codigo) {
    Swal.fire('Error', 'Debes ingresar un código para buscar.', 'warning');
    return;
  }

  this.Service.searchProducto(codigo).subscribe({
    next: (producto: any) => {
      this.productoForm.patchValue({
        nombre: producto.nombre,
        precio: producto.precio,
        peso: producto.peso_kg,
        cantidad: producto.cantidad,
        tipoventa: producto.tipo_venta
      });
    },
    error: () => {
      Swal.fire('Error', 'Producto no encontrado.', 'error');
    }
  });
}

actualizarProducto() {
  const codigo = this.productoForm.get('codigo')?.value;

  if (!codigo) {
    Swal.fire('Error', 'Debes buscar un producto primero.', 'warning');
    return;
  }
  console.log("codigo",codigo)

  const data = {
    codigo: this.productoForm.get('codigo')?.value,
    nombre: this.productoForm.get('nombre')?.value,
    precio: this.productoForm.get('precio')?.value,
    peso_kg: this.productoForm.get('peso')?.value,
    cantidad: this.productoForm.get('cantidad')?.value,
    tipo_venta: this.productoForm.get('tipoventa')?.value
  };

  this.Service.actualizarProducto(codigo, data).subscribe({
    next: () => {
      Swal.fire('Éxito', 'Producto actualizado correctamente.', 'success');
      this.productoForm.reset();

    },
    error: () => {
      Swal.fire('Error', 'No se pudo actualizar el producto.', 'error');
    }
  });
}

eliminarProducto() {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el producto de forma permanente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Llama al servicio para eliminar el producto
      const codigo = this.productoForm.get('codigo')?.value;

     this.Service.deleteProducto(codigo).subscribe({
    next: () => {
      Swal.fire('Éxito', 'Producto actualizado correctamente.', 'success');
      this.productoForm.reset();

    },
    error: () => {
      Swal.fire('Error', 'No se pudo actualizar el producto.', 'error');
    }
  });
    }
  });
}




 
}


