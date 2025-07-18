import { HttpClient } from '@angular/common/http';
import { Component , ViewChild, AfterViewInit, ElementRef, HostListener, ChangeDetectorRef} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';
import { BuscarProductoModal } from '../../buscar-producto-modal/buscar-producto-modal';
import Swal from 'sweetalert2';
import { QzService } from '../../services/ImpresoraService';



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

  numeroBoleta: string = '';
  boletaCargadaDesdeBusqueda: boolean = false;

  modalVisible = false;
  boleta: any;
  readyToEnfocarCantidad = false;
  inputGramos =true;
  inputCantidad =false;


  @ViewChild('inputVenta') inputVenta!: ElementRef;
  fechaHoraActual = "";
  tipoventa = "";
  idboleta: number=0
  productoForm!: FormGroup;
  editarIndex: number | null = null;
  productosGuardados: any[] = [];
  productoSeleccionado = {
    nombre: '',
    precio: '',
    codigo: '',
    peso_kg:'',
    tipo_venta:''
  };


  constructor(private fb: FormBuilder, private http: HttpClient,private api : Api,private QzService: QzService
    ,private cdr: ChangeDetectorRef
  ) {
    
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
  if (this.productosGuardados.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Boleta vacía',
      text: 'Debe agregar al menos un producto antes de guardar la boleta.',
      confirmButtonColor: '#3085d6'
    });
    return;
  }

  if (this.boletaCargadaDesdeBusqueda) {
    // ✅ Reimpresión de boleta ya existente, no se guarda, solo imprime
    this.imprimirBoleta();
    this.boletaCargadaDesdeBusqueda = false; // Limpiar estado
    return;
  }

  // ✅ Crear boleta normalmente
  const detalles = this.productosGuardados.map(prod => {
    const tipo = prod.tipo_venta.toLowerCase();
    const cantidad = (tipo === 'gramos' && prod.cantidad <= 10)
      ? prod.cantidad * 1000
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

  this.api.crearBoleta(boleta).subscribe(res => {
    this.idboleta = res['id'];
    this.cdr.detectChanges();

    setTimeout(() => {
      this.imprimirBoleta();
    }, 200);
  });
}


// imprimirBoleta(id : number) {
//   console.log("idboleta ", id);
//     console.log('✅ this.idboleta', this.idboleta);
//   console.log("objeto ", this.productosGuardados);
//   this.fechaHoraActual = new Date().toLocaleString();
//   console.log("fecha", this.fechaHoraActual);

//   const contenido = document.getElementById('boleta-imprimible')?.innerHTML;
//   if (!contenido) return;

//   const ventana = window.open('', '_blank', 'width=800,height=600');
//   if (!ventana) return;

//   ventana.document.write(`
//     <html>
//     <head>
//       <title>Boleta</title>
//       <style>
//         html, body {
//           margin: 0;
//           padding: 0;
//           background: #fff;
//           color: #000 !important;
//           width: 100%;
//         }

//         body {
//           font-family: 'Courier New', monospace;
//           font-size: 12px;
//           line-height: 1.4;
//           width: 72mm; /* Ajustado a impresora térmica */
//           margin: 0 auto;
//           padding: 8px;
//           color: #000 !important;
//           font-weight: bold; /* ✅ Negrita global */
//           -webkit-print-color-adjust: exact !important;
//         }

//         h2 {
//           font-size: 14px;
//           margin-bottom: 8px;
//           text-align: center;
//           color: #000 !important;
//           font-weight: bold;
//         }

//         p {
//           margin: 4px 0;
//           text-align: center;
//           color: #000 !important;
//           font-weight: bold;
//         }

//         table {
//           width: 100%;
//           border-collapse: collapse;
//           margin: 8px 0;
//           color: #000 !important;
//         }

//         th, td {
//           padding: 2px 4px;
//           border-bottom: 1px dashed #000;
//           color: #000 !important;
//           font-weight: bold; /* ✅ Negrita en tabla */
//         }

//         th.text-start, td.text-start {
//           text-align: left;
//         }

//         th.text-end, td.text-end {
//           text-align: right;
//         }

//         hr {
//           border: none;
//           border-top: 1px dashed #000;
//           margin: 8px 0;
//         }

//         p.text-end {
//           text-align: right;
//           color: #000 !important;
//           font-weight: bold;
//         }

//         .small {
//           font-size: 10px;
//           color: #000 !important;
//           font-weight: bold;
//         }

//         .corte {
//           height: 40px;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="contenido-boleta">
//         ${contenido}
//       </div>
//       <div class="corte"></div>
//       <script>
//         window.onload = function () {
//           setTimeout(() => {
//             window.print();
//           }, 100);
//           window.onafterprint = function () {
//             window.opener.postMessage('imprimir-completado', '*');
//             window.close();
//           };
//         };
//       </script>
//     </body>
//     </html>
//   `);

//   ventana.document.close();
// }



async imprimirBoleta() {
  try {
    const impresoras = await this.QzService.obtenerImpresoras();
    console.log('Impresoras disponibles:', impresoras);

    const texto = `
      FERRETERÍA ANGEL
      -----------------------
      2x Martillo         $500
      1x Clavos           $200
      -----------------------
      TOTAL:              $700
    `;

    await this.QzService.imprimirTexto('\\\\Cajacentral\\SLK-TL210', texto);
    console.log('✅ Impresión enviada');
  } catch (error) {
    console.error('❌ Error al imprimir:', error);
  }
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

  if (prod.tipo_venta === 'gramos') {
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
  if (!this.validarCantidad()) {
    return;
  }

  const nuevoProducto = this.productoForm.value;

  // Validamos que el formulario no esté vacío
  if (!nuevoProducto || !nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.cantidad) {
    Swal.fire({
      icon: 'warning',
      title: 'Producto incompleto',
      text: 'Por favor, complete los datos del producto antes de agregarlo.',
      confirmButtonColor: '#3085d6'
    });
    return;
  }

  console.log("✅ Producto a agregar:", nuevoProducto);

  if (this.editarIndex !== null) {
    this.productosGuardados.splice(this.editarIndex, 1);
    this.productosGuardados.push(nuevoProducto);
    this.editarIndex = null;
  } else {
    this.productosGuardados.push(nuevoProducto);
  }

  this.productoForm.reset();
}

// validarCantidad(): boolean {
//   const cantidad = this.productoForm.get('cantidad')?.value;

//   if (this.tipoventa === 'gramos') {
//     // Validar que sea un número positivo
//     if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
//       alert("Ingrese una cantidad válida en gramos.");
//       return false;
//     }

//     // Si es tipo gramos, permitir solo múltiplos de 50 o 100
//     if (cantidad % 50 !== 0) {
//       alert("La cantidad en gramos debe ser múltiplo de 50.");
//       return false;
//     }

//     // (Opcional) Puedes convertir si alguien pone 1, 2, 3 => a gramos reales
//     if (cantidad < 10) {
//       alert("¿Quiso decir gramos o kilos? Por favor, ingrese en gramos (Ej: 250, 500).");
//       return false;
//     }
//   }

//   if (this.inputCantidad) {
//     // Validar enteros positivos para unidades
//     if (!Number.isInteger(cantidad) || cantidad <= 0) {
//       alert("Ingrese una cantidad válida en unidades.");
//       return false;
//     }
//   }

//   return true;
// }
validarCantidad(): boolean {
  let cantidad = this.productoForm.get('cantidad')?.value;

  if (this.tipoventa === 'gramos') {
    if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Cantidad inválida',
        text: 'Ingrese una cantidad válida en gramos o kilos.'
      });
      return false;
    }

    if (cantidad < 10) {
      cantidad = cantidad * 1000;
      this.productoForm.get('cantidad')?.setValue(cantidad);

      // Swal.fire({
      //   icon: 'info',
      //   title: 'Conversión automática',
      //   text: `Se ha convertido a gramos: ${cantidad}g.`
      // });
    }

    if (cantidad % 50 !== 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Múltiplo inválido',
        text: 'La cantidad en gramos debe ser múltiplo de 50.'
      });
      return false;
    }
  }

  if (this.tipoventa === 'unidad') {
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Cantidad inválida',
        text: 'Ingrese una cantidad válida en unidades.'
      });
      return false;
    }
  }

  return true;
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

    if (prod.tipo_venta === 'gramos' && cantidad <= 10) {
      cantidad *= 1000; // convertir de kilos a gramos
    }

    const totalProd = prod.tipo_venta === 'gramos'
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

buscarBoleta(id: string) {
  if (!id) return;

  this.api.searchboletaforcode(id).subscribe({
    next: (res: any) => {
      this.idboleta = res.id;
      this.fechaHoraActual = res.fecha;
      this.boletaCargadaDesdeBusqueda = true; // ✅ ← Activamos la bandera

      this.productosGuardados = res.detalles.map((item: any) => ({
        codigo: item.codigo || '',
        nombre: item.nombre,
        precio: Number(item.precio),
        cantidad: Number(item.cantidad),
        tipo_venta: item.tipo_venta,
        total: Number(item.total)
      }));

      this.numeroBoleta = "";
    },
    error: (err) => {
      console.error('Error al buscar boleta:', err);
      this.boletaCargadaDesdeBusqueda = false;
    }
  });
}



}