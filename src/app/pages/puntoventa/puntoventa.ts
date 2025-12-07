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
   @ViewChild('totalInput') totalInput!: ElementRef<HTMLInputElement>;
   @ViewChild('precioInput') precioInput!: ElementRef<HTMLInputElement>;

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
  this.productoForm.valueChanges.subscribe(val => {
  if (val.precio && val.cantidad && val.tipo_venta) {
    const subtotal = this.calcularTotal(val);
    this.productoForm.get('total')?.setValue(subtotal, { emitEvent: false });
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
      cantidad: cantidad,  // 👈 asegúrate de enviar solo el número
      tipo_venta: tipo,
      total: subtotal
    };
  });

  const total = detalles.reduce((acc, item) => acc + item.total, 0);

  const boleta = {
    total: total,
    productos: detalles  // ✅ nombre esperado por la API
  };

  this.api.crearBoleta(boleta).subscribe({
    next: (res) => {
      this.idboleta = res.boleta_id;
      console.log("Boleta creada con ID:", this.idboleta);

      this.imprimirapi();  // ✅ imprimir
    },
    error: (err) => {
      console.error("Error al crear boleta:", err);
    }
  });
}




imprimirBoleta(id: number) {
  console.log("idboleta ", id);
  console.log('✅ this.idboleta', this.idboleta);
  console.log("objeto ", this.productosGuardados);
  this.fechaHoraActual = new Date().toLocaleString();
  console.log("fecha", this.fechaHoraActual);

  const contenido = document.getElementById('boleta-imprimible')?.innerHTML;
  if (!contenido) return;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(`
    <html>
      <head>
        <title>Boleta</title>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            background: #fff;
            color: #000 !important;
            width: 100%;
          }
            .producto-nombre {
  font-size: 15px;           /* ✅ Más pequeño */
  font-weight: normal;       /* Opcional: menos grueso */
  overflow: hidden;
           /* Limita el ancho si es necesario */

}

            .titulo-boleta {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  color: #000 !important;
  margin-bottom: 10px;
}
          body {
            font-family: 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.6;
            width: 72mm;
            margin: 0;
            padding: 4px 2px 4px 0;
            color: #000 !important;
            font-weight: bold;
            -webkit-print-color-adjust: exact !important;
          }
          h2, p, th, td, .small {
            font-weight: bold !important;
            color: #000 !important;
          }
          h2 {
            font-size: 14px;
            margin-bottom: 8px;
            text-align: center;
          }
          p.text-end {
            text-align: right;
            font-size: 23px;          /* ✅ Agrandado */
            font-weight: bold;        /* ✅ Ya está, pero se asegura */
            color: #000 !important;   /* ✅ Negro asegurado */
            margin-top: 10px;
            border-top: 1px solid #000;  /* ✅ Línea arriba como en supermercados */
            padding-top: 6px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 8px 0;
          }
          th, td {
            padding: 2px 4px;
            border-bottom: 1px dashed #000;
          }
          th.text-start, td.text-start {
            text-align: left;
          }
          th.text-end, td.text-end {
            text-align: right;
          }
          hr {
            border: none;
            border-top: 2px dashed #000;
            margin: 8px 0;
          }
          p.text-end {
            text-align: right;
          }
          .small {
            font-size: 10px;
          }
          .corte {
            height: 40px;
          }
        </style>
      </head>
      <body>
        <div class="contenido-boleta">
          ${contenido}
        </div>
        <div class="corte"></div>
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
  doc.close();
  
}

imprimirapi() {
  if (this.productosGuardados.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Boleta vacía',
      text: 'Debe agregar al menos un producto antes de guardar la boleta.',
      confirmButtonColor: '#3085d6'
    });
    return;
  }

  const detalles = this.productosGuardados.map(prod => {
    const tipo = prod.tipo_venta.toLowerCase();
    const cantidad = (tipo === 'gramos' && prod.cantidad <= 10)
      ? prod.cantidad * 1000
      : prod.cantidad;

    const subtotal = tipo === 'gramos'
      ? Math.round(prod.precio * cantidad) / 1000
      : Math.round(prod.precio * cantidad);

    return {
      nombre: prod.nombre,
      precio: prod.precio,
      cantidad: cantidad,
      tipo_venta: tipo,
      total: subtotal
    };
  });

  const total = detalles.reduce((acc, item) => acc + item.total, 0);

  const payload = {
    venta: {
      numero: this.idboleta || 'N/A',
      fecha: new Date().toISOString(),
      direccion: "Av. Lagunillas 3166"
    },
    productos: this.productosGuardados.map(prod => ({
      nombre: prod.nombre,
      precio: prod.precio,
      cantidad: prod.tipo_venta === 'gramos' ? prod.cantidad + ' g' : prod.cantidad,
      total: Math.round(prod.total)
    })),
    total: Math.round(total)
  };
 if (Object.values(this.productoForm.value).some(v => v)) {
  Swal.fire({
  title: 'Atención',
  text: 'Tienes una venta sin ser agregada al carrito verifica la informacion.',
  icon: 'warning',
  confirmButtonText: 'OK'
});

} else {
    // ✅ Mostrar confirmación con enfoque automático en el botón
  Swal.fire({
    title: this.boletaCargadaDesdeBusqueda ? '¿Deseas reimprimir esta boleta?' : '¿Deseas imprimir la boleta?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, imprimir',
    cancelButtonText: 'No',
    didOpen: () => {
      setTimeout(() => {
        const el = document.activeElement as HTMLElement;
        if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
          el.blur();
        }

        const confirmBtn = Swal.getConfirmButton();
        if (confirmBtn) {
          confirmBtn.focus();
        }
      }, 50); // pequeño delay para asegurar que el DOM esté listo
    }
  }).then((result) => {
    if (!result.isConfirmed) return;

    // 🔁 Si es una boleta ya buscada → solo imprimir
    if (this.boletaCargadaDesdeBusqueda && this.idboleta) {
      payload.venta.numero = this.idboleta;

      this.api.crearImpresion(payload).subscribe({
        next: (res) => {
          console.log("✅ Reimpresión enviada correctamente:", res);
          Swal.fire({
            title: 'Reimpresión enviada',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            willClose: () => {
              location.reload();
            }
          });
        },
        error: (err) => {
          console.error("❌ Error al reimprimir:", err);
          Swal.fire({
            title: 'Error al reimprimir',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false
          });
        }
      });

    } else {
      // 🆕 Nueva boleta → guardar + imprimir
      const boleta = {
        total: total,
        productos: detalles
      };

      this.api.crearBoleta(boleta).subscribe({
        next: (res) => {
          this.idboleta = res.boleta_id;
          payload.venta.numero = this.idboleta;

          this.api.crearImpresion(payload).subscribe({
            next: (res) => {
              console.log("✅ Impresión enviada correctamente:", res);
              Swal.fire({
                title: 'Impresión enviada',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                willClose: () => {
                  location.reload();
                }
              });
            },
            error: (err) => {
              console.error("❌ Error al imprimir:", err);
              Swal.fire({
                title: 'Error al imprimir',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false
              });
            }
          });
        },
        error: (err) => {
          console.error("❌ Error al crear boleta:", err);
        }
      });
    }
  });
}

}


// imprimirapi() {
 


//   if (document.activeElement instanceof HTMLElement) {
//     document.activeElement.blur();
//   }
  
//   const totalRedondeado = Math.round(this.getTotalGeneral());
//   const payload = {
//     venta: {
//       numero: this.idboleta,
//       fecha: new Date().toISOString(),
//       direccion: "Av. Lagunillas 3166" // Puedes hacerlo dinámico si lo deseas
//     },
//     productos: this.productosGuardados.map(prod => ({
//       nombre: prod.nombre,
//       precio: prod.precio,
//       cantidad: prod.tipo_venta === 'gramos' ? prod.cantidad + ' g' : prod.cantidad,
//       total: prod.total
//     })),
//     total: totalRedondeado
//   };
//   console.log("paylod",payload);
  

// Swal.fire({
//   title: '¿Deseas imprimir la boleta?',
//   icon: 'question',
//   showCancelButton: true,
//   confirmButtonText: 'Sí, imprimir',
//   cancelButtonText: 'No',
//   didOpen: () => {
//   setTimeout(() => {
//     // ✅ Forzar blur de cualquier input
//     const el = document.activeElement as HTMLElement;
//     if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
//       el.blur();
//     }

//     // ✅ Ahora enfoca el botón de confirmación
//     const confirmBtn = Swal.getConfirmButton();
//     if (confirmBtn) {
//       confirmBtn.focus();
//     }
//   }, 50); // pequeño delay para que DOM esté listo
// }
// }).then((result) => {
//   if (result.isConfirmed) {
//     this.api.crearImpresion(payload).subscribe({
//       next: (res) => {
//         this.guardarBoleta();
//         console.log("idboleta",this.idboleta);
//         console.log("✅ Impresión enviada correctamente:", res);
//         Swal.fire({
//           title: 'Impresión enviada',
//           icon: 'success',
//           timer: 2000,
//           showConfirmButton: false,
//           willClose: () => {
//             // location.reload();
//           }
//         });
//       },
//       error: (err) => {
//         console.error("❌ Error al enviar impresión:", err);
//         Swal.fire({
//           title: 'Error al imprimir',
//           icon: 'error',
//           timer: 2000,
//           showConfirmButton: false
//         });
//       }
//     });
//   }
// });


// }





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
          precio: producto.precio,
          cantidad: '',
          tipo_venta: producto.tipo_venta,
          total: producto.precio
        });

        this.tipoventa = producto.tipo_venta;

        // 🚨 Caso especial: código 99 (producto "Varios")
        if (codigo === '99') {
          setTimeout(() => {
            this.precioInput?.nativeElement.focus();
            this.inputCantidad = true;
            this.inputGramos = false;
          });
          return; // 👈 evita que siga la lógica normal
        }

        // ✅ Flujo normal
        if (this.tipoventa === 'Gramos' || this.tipoventa === 'gramos') {
          this.inputGramos = true;
          this.inputCantidad = false;

          setTimeout(() => {
            this.cantidadGramos?.nativeElement.focus();
          });
        } else if (this.tipoventa === 'Unidad' || this.tipoventa === 'unidad') {
          this.inputGramos = false;
          this.inputCantidad = true;

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

    // if (cantidad % 50 !== 0) {
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Múltiplo inválido',
    //     text: 'La cantidad en gramos debe ser múltiplo de 50.'
    //   });
    //   return false;
    // }
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



// editarProducto(index: number) {
//   const prod = this.productosGuardados[index];
//   // Por ejemplo, rellenar el formulario con los datos para editar:
//   this.productoForm.patchValue({
//     nombre: prod.nombre,
//     codigo: prod.codigo,
//     precio: prod.precio,
//     cantidad: prod.cantidad,
//     //total: this.calcularTotal(prod) 
//     // otros campos...
//   });
    
//   // Guarda el índice para luego actualizar el producto en vez de agregar uno nuevo
//     this.editarIndex = index;
    
// }
editarProducto(index: number) {
  const prod = this.productosGuardados[index];
  let cantidad = prod.cantidad;

  // 👇 Normalizamos solo para mostrar en el input
  if (prod.tipo_venta === 'gramos' && cantidad > 10) {
    // Guardado está en gramos → convertimos a gramos "puros" para el input
    cantidad = cantidad; 
  } else if (prod.tipo_venta === 'gramos' && cantidad <= 10) {
    // Guardado está en kilos → convertimos a kilos
    cantidad = cantidad / 1000;
  }

  this.productoForm.patchValue({
    nombre: prod.nombre,
    codigo: prod.codigo,
    precio: prod.precio,
    cantidad: cantidad,
    tipo_venta: prod.tipo_venta
  });

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
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
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
calcularSubtotalYEnfocarTotal() {
  // 1. Obtener los valores del formulario
  const precio = this.productoForm.get('precio')?.value;
  const cantidad = this.productoForm.get('cantidad')?.value;
  const tipoVenta = this.productoForm.get('tipo_venta')?.value;

  // 2. Crear un objeto para pasar a tu método `calcularTotal()`
  const productoParaCalculo = {
    precio: precio,
    cantidad: cantidad,
    tipo_venta: tipoVenta
  };

  // 3. Calcular el subtotal del producto actual
  const subtotal = this.calcularTotal(productoParaCalculo);

  // 4. Actualizar el FormControl 'total' con el subtotal calculado
  this.productoForm.get('total')?.setValue(subtotal);

  // 5. Mover el foco al input del total para que el usuario pueda verlo
  setTimeout(() => {
    this.totalInput.nativeElement.focus();
  }, 3);
}

// ...
// Ahora, en tu método `agregarProducto()`, debes asegurarte de que
// el producto se agregue con el campo `total` ya calculado.
// Así, `getTotalGeneral()` solo tiene que sumar los totales de la lista.
agregarProducto(): void {
  if (!this.validarCantidad()) {
    return;
  }

  // Obtener el producto del formulario
  const nuevoProducto = this.productoForm.value;

  // Validar si el formulario está incompleto
  if (!nuevoProducto || !nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.cantidad) {
    Swal.fire({
      icon: 'warning',
      title: 'Producto incompleto',
      text: 'Por favor, complete los datos del producto antes de agregarlo.',
      confirmButtonColor: '#3085d6'
    });
    return;
  }

  // ✅ Calcular el total individual del producto antes de agregarlo
  const totalProducto = this.calcularTotal(nuevoProducto);
  nuevoProducto.total = totalProducto; // Asignar el total al objeto del producto
  console.log("nuevo total" ,nuevoProducto.total)
  // Lógica para agregar o editar el producto en la lista
  if (this.editarIndex !== null) {
    this.productosGuardados.splice(this.editarIndex, 1, nuevoProducto);
    this.editarIndex = null;
  } else {
    this.productosGuardados.push(nuevoProducto);
  }

  

  // Actualizar el total general de la boleta después de un cambio
  this.actualizarTotalGeneralDeBoleta();

  // Enfocar el input de código para el próximo producto
  setTimeout(() => {
    this.inputElement.nativeElement.focus();
  }, 10);
  // Resetear el formulario para el próximo producto
  this.productoForm.reset();
}

// Nuevo método para manejar la actualización del total general de la boleta
actualizarTotalGeneralDeBoleta() {
 
  const totalBoleta = this.getTotalGeneral();
  this.productoForm.get('total')?.setValue(parseFloat(totalBoleta.toFixed(2)));
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