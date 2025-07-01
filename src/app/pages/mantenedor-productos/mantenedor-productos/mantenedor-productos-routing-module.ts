import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MantenedorProductos } from './mantenedor-productos';

const routes: Routes = [
  { path: '', component: MantenedorProductos }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenedorProductosRoutingModule { }
