import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Puntoventa } from './puntoventa';

const routes: Routes = [
  { path: '', component: Puntoventa }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PuntoventaRoutingModule { }
