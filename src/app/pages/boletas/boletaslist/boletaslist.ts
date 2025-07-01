import { Component } from '@angular/core';
import { Api } from '../../../services/api';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Boleta, Producto } from '../../../models/interfaces';
@Component({
  selector: 'app-boletaslist',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './boletaslist.html',
  styleUrl: './boletaslist.scss'
})
export class Boletaslist {
    boletas: Boleta[] = [];
  
  constructor( private http: HttpClient,private api : Api) {
    
  }

    ngOnInit(): void {
      this.ListarApi();

  }

  ListarApi(){
    this.api.ListBoleta().subscribe({
    next: res => {
      this.boletas = res
      console.log("res", this.boletas)
    },
    

    error: err => console.error('❌ Error al cargar las boleta', err)
  }); 

  }



}
