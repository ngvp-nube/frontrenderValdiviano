import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login-module').then(m => m.LoginModule)
  },
  {
    path: 'Inicio',
    component: Inicio, 
    children: [
      {
        path: 'MantenedorProductos',
        loadChildren: () =>
          import('./pages/mantenedor-productos/mantenedor-productos/mantenedor-productos-module')
            .then(m => m.MantenedorProductosModule)
      },
      {
        path: 'MantenedorUsuarios',
        loadChildren: () =>
          import('./pages/usuarios/usuarios/usuarios-module')
            .then(m => m.UsuariosModule)
      },
      {
        path: 'PuntoVenta',
        loadChildren: () =>
          import('./pages/puntoventa/puntoventa-module')
            .then(m => m.PuntoventaModule)
      },
      {
        path: 'ListaBoletas',
        loadChildren: () =>
          import('./pages/boletas/boletaslist/boletaslist-module')
            .then(m => m.BoletaslistModule)
      },
      {
        path: 'Listacodigo',
        loadChildren: () =>
          import('./pages/listacodigo/listacodigo-module')
            .then(m => m.ListacodigoModule)
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];


 

