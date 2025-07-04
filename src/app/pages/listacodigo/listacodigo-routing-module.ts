import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Listacodigo } from './listacodigo';

const routes: Routes = [
  { path: '', component: Listacodigo } // importante que sea ''
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListacodigoRoutingModule { }
