import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule,RouterOutlet,RouterModule] ,
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss'
})
export class Inicio {
collapsed = false;
isLoggedIn = false;
rol : string|null = "";
User : string|null = ""

  constructor(private router: Router

  ) {}

  ngOnInit(): void {
  
   this.rol = localStorage.getItem('rol');
   this.User = localStorage.getItem('username');
   console.log("rollllll",this.rol)
     
    if (this.rol === 'Vendedor') {
        this.router.navigate(['/Inicio/PuntoVenta']);
    }
   
  }

   cerrarSesion() {
   //localStorage.clear(); // o removeItem('token'), etc.
   this.router.navigate(['/login']);
  }
 
}
