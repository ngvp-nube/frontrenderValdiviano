import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PuntoventaRoutingModule } from './puntoventa-routing-module';
import { ReactiveFormsModule } from '@angular/forms';
import { BuscarProductoModal } from '../../buscar-producto-modal/buscar-producto-modal';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PuntoventaRoutingModule,
    ReactiveFormsModule,
    BuscarProductoModal
  ]
})
export class PuntoventaModule { }
