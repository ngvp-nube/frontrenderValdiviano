import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-puntoventa',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './puntoventa.html',
  styleUrl: './puntoventa.scss'
})
export class Puntoventa {
  

  
  fechaHoraActual = "";

  productoForm!: FormGroup;
  editarIndex: number | null = null;
  productosGuardados: any[] = [];


  constructor(private fb: FormBuilder, private http: HttpClient,private api : Api) {
    
  }
  ngOnInit(): void {
    
  
  this.productoForm = this.fb.group({
      codigo: [''],
      nombre: [''],
      precio: [''],
      cantidad: [''],
      descripcion: [''],
      total: ['']
    });
    this.buscarProductoPorCodigo();
     this.calcularTotal();
       window.addEventListener('message', (event) => {
    if (event.data === 'imprimir-completado') {
      this.guardarBoleta();
    }
  });
  }


guardarBoleta() {
  const detalles = this.productosGuardados.map(prod => ({
    nombre: prod.nombre,
    precio: prod.precio,
    cantidad: prod.cantidad,
    total: (prod.precio * prod.cantidad) / 1000  // suponiendo que "cantidad" viene en gramos
  }));

  const total = detalles.reduce((acc, item) => acc + item.total, 0);

  const boleta = {
    total: total,
    detalles: detalles
  };

  this.api.crearBoleta(boleta).subscribe({
    next: res => console.log('✅ Boleta guardada exitosamente', res),
    error: err => console.error('❌ Error al guardar la boleta', err)
  }); 
}


imprimirBoleta() {

  


  console.log("objeto ", this.productosGuardados);
  this.fechaHoraActual = new Date().toLocaleString();

  const contenido = document.getElementById('boleta-imprimible')?.innerHTML;
  if (!contenido) return;

  const ventana = window.open('', '_blank', 'width=800,height=600');
  if (!ventana) return;

ventana.document.write(`
  <html>
    <head>
      <title>Boleta</title>
      <style>
        @media print {
          body {
            font-family: 'Courier New', monospace;
            font-size: 10px;
            width: 58mm; /* ancho típico de impresora térmica */
            margin: 0;
            padding: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            text-align: left;
            padding: 2px 0;
            word-break: break-word;
          }
          th {
            border-bottom: 1px dashed #000;
          }
          hr {
            border: none;
            border-top: 1px dashed #000;
            margin: 5px 0;
          }
          .text-center {
            text-align: center;
          }
          .text-end {
            text-align: right;
          }
          .small {
            font-size: 9px;
          }
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
            window.opener.postMessage('imprimir-completado', '*');
            window.close();
          };
        };
      </script>
    </body>
  </html>
`);

  ventana.document.close();
}



buscarProductoPorCodigo(): void {
  console.log('Ejecutando buscarProductoPorCodigo');
  const codigo = this.productoForm.get('codigo')?.value;
  console.log('Código ingresado:', codigo);

  if (codigo) {
    this.api.searchProducto(codigo).subscribe({
      next: producto => {
        console.log('Producto encontrado', producto);
        this.productoForm.patchValue({
          nombre: producto.nombre,
          precio: producto.precio ,
          cantidad: '',
          total: producto.precio
        });
      },
      error: err => {
        console.error('Producto no encontrado', err);
        this.productoForm.patchValue({
          nombre: '',
          precio: '',
          stock: '',
          descripcion: '',
          total: ''
        });
      }
    });
  }
}


calcularTotal(): void {
  const precio = this.productoForm.get('precio')?.value;
  console.log("precio",precio)
  const cantidadGramos = this.productoForm.get('cantidad')?.value;

  if (precio && cantidadGramos) {
    const total = (cantidadGramos / 1000) * precio;
    this.productoForm.patchValue({
      total: Math.round(total)
    });
    console.log(`Total calculado: $${total}`);
  } else {
    console.log("Faltan datos para calcular el total");
  }
}
agregarProducto(): void {
  const nuevoProducto = this.productoForm.value;

  if (this.editarIndex !== null) {
    // 🗑️ Elimina el producto antiguo
    this.productosGuardados.splice(this.editarIndex, 1);
    // ➕ Agrega el producto actualizado
    this.productosGuardados.push(nuevoProducto);
    this.editarIndex = null;
  } else {
    // ➕ Agrega un producto nuevo normalmente
    this.productosGuardados.push(nuevoProducto);
  }

  // Limpia el formulario
  this.productoForm.reset();
}
editarProducto(index: number) {
  const prod = this.productosGuardados[index];
  // Por ejemplo, rellenar el formulario con los datos para editar:
  this.productoForm.patchValue({
    nombre: prod.nombre,
    codigo: prod.codigo,
    precio: prod.precio,
    cantidad: prod.cantidad,
    // otros campos...
  });
  // Guarda el índice para luego actualizar el producto en vez de agregar uno nuevo
    this.editarIndex = index;
}

eliminarProducto(index: number) {
  this.productosGuardados.splice(index, 1);
}

getTotalGeneral(): number {
  return this.productosGuardados.reduce((acumulador, prod) => {
    return acumulador + (prod.precio * prod.cantidad / 1000);
  }, 0);
}





}
