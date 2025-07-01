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

   constructor(private fb: FormBuilder,private Service: Api) {
    this.productoForm = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      peso: [0, [Validators.required, Validators.min(0)]],
      cantidad: [0, [Validators.required, Validators.min(1)]]
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
}
