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
    
    boletasOriginales: any[] = [];
    busquedaNumero = ""
    fechaSeleccionada: string = '';
    
  
  constructor( private http: HttpClient,private api : Api) {
    
  }

    ngOnInit(): void {
      this.ListarApi();
      console.log(this.boletas);

  }
  

obtenerBoletasPorFecha() {
  console.log('📅 Fecha seleccionada:', this.fechaSeleccionada);
  this.api.getBoletas(this.fechaSeleccionada).subscribe({
    next: (res) => {
      this.boletasOriginales = res;
        this.boletas = [...res];
    },
    error: (err) => console.error(err)
  });
}


  ListarApi(){
    this.api.ListBoleta().subscribe({
    next: res => {
      this.boletas = res
      console.log("res", this.boletas)
        this.boletasOriginales = res;
        this.boletas = [...res];
    },
    

    error: err => console.error('❌ Error al cargar las boleta', err)
  }); 

  }

filtrarBoletasPorFecha() {
  const fechaBuscada = this.fechaSeleccionada; // "2025-07-02"

  this.boletas = this.boletas.filter(boleta => {
    const fechaBoleta = new Date(boleta.fecha);

    // Obtener fecha local en formato YYYY-MM-DD
    const yyyy = fechaBoleta.getFullYear();
    const mm = String(fechaBoleta.getMonth() + 1).padStart(2, '0');
    const dd = String(fechaBoleta.getDate()).padStart(2, '0');
    const fechaLocal = `${yyyy}-${mm}-${dd}`;

    return fechaLocal === fechaBuscada ;
  });
}
filtrarBoletasPorNumero() {
  const texto = this.busquedaNumero?.toString().trim();

  // Si el input está vacío, restaurar toda la lista original
  if (!texto) {
    this.boletas = [...this.boletasOriginales]; // <-- importante
    return;
  }

  this.boletas = this.boletasOriginales.filter(boleta =>
    boleta.id.toString().includes(texto)
  );
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

 eliminarBoleta(id: number): void {
  Swal.fire({
    title: '¿Eliminar esta boleta?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.api.eliminarBoleta(id).subscribe({
        next: res => {
          Swal.fire('Eliminada', 'La boleta ha sido archivada.', 'success');
          this.boletas = this.boletas.filter(b => b.id !== id);
        },
        error: err => {
          Swal.fire('Error', 'No se pudo eliminar la boleta.', 'error');
        }
      });
    }
  });
}



}
