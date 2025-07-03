import { Component } from '@angular/core';
import { Api } from '../../../services/api';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Boleta, Producto } from '../../../models/interfaces';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-boletaslist',
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './boletaslist.html',
  styleUrl: './boletaslist.scss'
})
export class Boletaslist {
    boletas: Boleta[] = [];
    total = []
    fechaSeleccionada: string = '';
    
  
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

  Contabilidad(){
    console.log("decha selec",this.fechaSeleccionada)

  if (this.fechaSeleccionada === "") {
      Swal.fire('Selecciona una Fecha', 'Para generar Contabilidad','warning');
      return;

  }
    this.api.GetContabilidadTotal(this.fechaSeleccionada).subscribe({
    next: res => {
      this.total = res.total_general.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      console.log("respuesta total ", this.total)
      
      Swal.fire(`Contabilidad con fecha de ${this.fechaSeleccionada}`, `Total $ ${this.total}`,'success');
    },
    

    error: err => console.error('❌ Error', err)
  }); 

  }

}
