import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-listacodigo',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './listacodigo.html',
  styleUrl: './listacodigo.scss'
})
export class Listacodigo {
  productos: any[] = [];

    constructor(private http: HttpClient,private api : Api) {
    
  }
ngOnInit(): void {
    this.api.listProducto().subscribe({
      next: (producto: any[]) => {
        console.log('res', producto);
        this.productos = producto;
      },
      error: err => {
        console.error('error', err);
      }
    });
  }

}
