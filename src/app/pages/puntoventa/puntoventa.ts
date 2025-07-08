import { HttpClient } from '@angular/common/http';
import { Component , ViewChild, AfterViewInit, ElementRef, HostListener} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';
import { BuscarProductoModal } from '../../buscar-producto-modal/buscar-producto-modal';



@Component({
  selector: 'app-puntoventa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule ,BuscarProductoModal],

  templateUrl: './puntoventa.html',
  styleUrl: './puntoventa.scss'
})
export class Puntoventa {
   @ViewChild('Codigo',) inputElement!: ElementRef;
   @ViewChild('btnImprimir') btnImprimir!: ElementRef<HTMLButtonElement>;
   @ViewChild('cantidadGramos', { static: false }) cantidadGramos!: ElementRef<HTMLInputElement>;
   @ViewChild('cantidadUnidad', { static: false }) cantidadUnidad!: ElementRef<HTMLInputElement>;


  modalVisible = false;
  readyToEnfocarCantidad = false;
  inputGramos =true;
  inputCantidad =false;


  @ViewChild('inputVenta') inputVenta!: ElementRef;
  fechaHoraActual = "";
  tipoventa = "";
  productoForm!: FormGroup;
  editarIndex: number | null = null;
  productosGuardados: any[] = [];
  productoSeleccionado = {
    nombre: '',
    precio: '',
    codigo: '',
    peso_kg:''
  };


  constructor(private fb: FormBuilder, private http: HttpClient,private api : Api) {
    
  }
  ngOnInit(): void {
    
  
  this.productoForm = this.fb.group({
      codigo: [''],
      nombre: [''],
      precio: [''],
      cantidad: [''],
      tipo_venta: [''],
      total: ['']
    });
    this.buscarProductoPorCodigo();
    
       window.addEventListener('message', (event) => {
    if (event.data === 'imprimir-completado') {
      this.guardarBoleta();
    }
  });
  
   
  }
  ngAfterViewInit() {
  setTimeout(() => {
    this.inputElement.nativeElement.focus();
    this.readyToEnfocarCantidad = true;
  }, 10); // aseguramos que el DOM esté renderizado
}


guardarBoleta() {
  const detalles = this.productosGuardados.map(prod => {
    const tipo = prod.tipo_venta.toLowerCase(); // <- aseguras minúscula
    const cantidad = (tipo === 'gramos' && prod.cantidad <= 10)
  ? prod.cantidad * 1000  // Convertir kilos a gramos
  : prod.cantidad;

const subtotal = tipo === 'gramos'
  ? (prod.precio * cantidad) / 1000
  : (prod.precio * cantidad);


    return {
      nombre: prod.nombre,
      precio: prod.precio,
      cantidad: prod.cantidad,
      tipo_venta: tipo,
      total: subtotal
    };
  });

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
  console.log("fecha",this.fechaHoraActual  )


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
            font-size: 13px;
            width: 72mm;
            margin: 0;
            padding: 8px 8px 30px 8px;
            line-height: 1.6;
            color: #000 !important; /* ⬅️ texto negro */
            background: #fff !important;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
            color: #000 !important;
          }

          th, td {
            text-align: left;
            padding: 4px 0;
            word-break: break-word;
            color: #000 !important;
            border-color: #000 !important;
          }

          th {
            border-bottom: 1px solid #000; /* ⬅️ línea negra sólida */
          }

          hr {
            border: none;
            border-top: 1px solid #000; /* ⬅️ línea sólida negra */
            margin: 12px 0;
          }

          .text-center {
            text-align: center;
          }

          .text-end {
            text-align: right;
          }

          .small {
            font-size: 12px;
            line-height: 1.5;
            color: #000 !important;
          }
        }

        /* Para pantalla (opcional) */
        body {
          background: #fff;
          color: #000;
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
          tipo_venta: producto.tipo_venta,
          total: producto.precio
        });
        this.tipoventa = producto.tipo_venta
      if (this.tipoventa === 'Gramos' || this.tipoventa === 'gramos') {
  this.inputGramos = true;
  this.inputCantidad = false;

  // Esperar al DOM para que el input esté presente
  setTimeout(() => {
    this.cantidadGramos?.nativeElement.focus();
  });
} else if (this.tipoventa === 'Unidad' || this.tipoventa === 'unidad') {
  this.inputGramos = false;
  this.inputCantidad = true;

  // Esperar al DOM para que el input esté presente
  setTimeout(() => {
    this.cantidadUnidad?.nativeElement.focus();
  });
}

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
this.enfocarCantidad();

 
}


calcularTotal(prod: any): number {

  
let cantidad = prod.cantidad;

  if (prod.tipo_venta === 'Gramos') {
    // Si la cantidad es ≤ 10 se asume que es en kilos y se convierte a gramos
    if (cantidad <= 10) {
      cantidad = cantidad * 1000;
    }
    return Math.round((prod.precio * cantidad) / 1000);
  }
 
   // Tipo "Unidad"
  return Math.round(prod.precio * cantidad);


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
  return this.productosGuardados.reduce((acum, prod) => {
    let cantidad = prod.cantidad;

    if (prod.tipo_venta === 'Gramos' && cantidad <= 10) {
      cantidad *= 1000; // convertir de kilos a gramos
    }

    const totalProd = prod.tipo_venta === 'Gramos'
      ? (prod.precio * cantidad) / 1000
      : (prod.precio * cantidad);

    return acum + totalProd;
  }, 0);
}







@HostListener('window:keydown', ['$event'])
  manejarTecla(event: KeyboardEvent) {
    if (event.key === 'F2') {
      event.preventDefault(); // evita comportamiento por defecto del navegador (opcional)
      this.btnImprimir.nativeElement.click(); // simula clic al botón
    }else if (event.key === 'F1'){
       event.preventDefault(); // evita abrir ayuda del navegador
    this.abrirModalProductos();
    }
  }


// @HostListener('window:keydown', ['$event'])
// manejarTeclaModal(event: KeyboardEvent) {
//   if (event.key === 'F1') {
//     event.preventDefault(); // evita abrir ayuda del navegador
//     this.abrirModalProductos();
//   }
// }



enfocarCantidad() {

  setTimeout(() => {
   
    if (this.cantidadGramos) {
      this.inputCantidad =false;
      this.inputGramos =true;
      this.cantidadGramos?.nativeElement.focus();
      
    
    } else if (this.cantidadUnidad) {
      this.inputGramos =false;
      this.inputCantidad =true;
      this.cantidadUnidad?.nativeElement.focus();
      
      
    }
  },3);
}

abrirModalProductos() {
  this.modalVisible = true;
}

onProductoSeleccionado(producto: any) {
  this.productoSeleccionado = { ...producto };
  this.modalVisible = false;
}

}
