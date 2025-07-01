import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Boletaslist } from './boletaslist';

const routes: Routes = [
  { path: '', component: Boletaslist } // importante que sea ''
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoletaslistRoutingModule { }
