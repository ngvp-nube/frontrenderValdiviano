import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-listacodigo',
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './listacodigo.html',
  styleUrl: './listacodigo.scss'
})
export class Listacodigo {
 fechaSeleccionada: string = '';
productosContables: any[] = [];
totalGeneral: number = 0;

    constructor(private http: HttpClient,private api : Api) {
    
  }
ngOnInit(): void {
  //   this.api.listProducto().subscribe({
  //     next: (producto: any[]) => {
  //       console.log('res', producto);
  //       this.productos = producto;
  //     },
  //     error: err => {
  //       console.error('error', err);
  //     }
  //   });
  // }
}

generarContabilidad() {
  if (!this.fechaSeleccionada) return;

  this.api.obtenerProductosPorFecha(this.fechaSeleccionada).subscribe({
    next: (res) => {
      console.log("respuesta",res)
      this.productosContables = res.productos;
      this.totalGeneral = res.total_general;
      setTimeout(() => this.imprimirContabilidad(), 100);
    },
    error: (err) => console.error('Error al generar contabilidad', err)
  });
}

imprimirContabilidad() {
  const contenido = document.getElementById('contabilidad-imprimible')?.innerHTML;
  const ventana = window.open('', '_blank', 'width=800,height=600');

if (contenido && ventana) {
ventana.document.write(`
  <html>
    <head>
      <title>Contabilidad</title>
      <style>
        @media print {
          body {
            font-family: 'Courier New', monospace;
            font-size: 13px;
            width: 90mm; /* Aumentado para dar más espacio */
            margin: 0;
            padding: 10px;
            color: #000;
            background: #fff;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            text-align: left;
            padding: 4px 6px; /* mayor separación horizontal */
            word-break: break-word;
            color: #000;
          }
          th {
            border-bottom: 1px dashed #000;
          }
          hr {
            border: none;
            border-top: 1px dashed #000;
            margin: 8px 0;
          }
          .text-center {
            text-align: center;
          }
          .text-end {
            text-align: right;
          }
          .small {
            font-size: 11px;
          }
        }

        body {
          font-family: 'Courier New', monospace;
          font-size: 13px;
          padding: 10px;
          color: #000;
          background: #fff;
          width: 90mm;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          text-align: left;
          padding: 4px 6px;
          color: #000;
        }
        th {
          border-bottom: 1px dashed #000;
        }
        hr {
          border: none;
          border-top: 1px dashed #000;
          margin: 8px 0;
        }
      </style>
    </head>
    <body>
      ${contenido}
      <script>
        window.onload = function () {
          setTimeout(() => {
            window.print();
          }, 100);
          window.onafterprint = function () {
            window.close();
          };
        };
      </script>
    </body>
  </html>
`);
ventana.document.close();


}

}
}
