import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';

export interface Producto {
 
  nombre: string;
  codigo: string;
  peso_kg: number;
  precio: number;
  cantidad: number;
  // Agrega aquí otros campos que tenga tu modelo
}
@Injectable({
  providedIn: 'root'
})
export class Api {
 private apiUrl = 'https://web-production-d1c8d.up.railway.app/api/producto/';
  private loginUrl = 'https://web-production-d1c8d.up.railway.app/api/login/';
  private searchnUrl = 'https://web-production-d1c8d.up.railway.app/api/producto';
  private urlboleta = 'https://web-production-d1c8d.up.railway.app/api/boleta/';
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();
  constructor(private http: HttpClient) { }

  
  // Agregar un producto
  addProducto(producto: Producto): Observable<Producto> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json' });

    return this.http.post<Producto>(this.apiUrl, producto, {headers});
  }

    // buscar un producto
  // searchProducto(prcodigooducto: string): Observable<Producto> {
  //   const token = localStorage.getItem('token')
  //   const headers = new HttpHeaders({
  //   'Authorization': `Token ${token}`,
  //   'Content-Type': 'application/json' });

  //   return this.http.get<Producto>(this.apiUrl, {headers});
  // }

  searchProducto(codigo: string): Observable<Producto> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  });

  return this.http.get<Producto>(`${this.searchnUrl}/${codigo}/`, { headers });
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  
login(username: string, password: string): Observable<any> {
  const body = { username, password };
  return this.http.post(this.loginUrl, body);
}


  logeado() {
    // Aquí va la lógica real, por ahora:
    this.loggedIn.next(true);
  }

  logout() {
    this.loggedIn.next(false);
  }

  crearBoleta(boleta: any): Observable<any> {
    const headers= new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    });
  return this.http.post(this.urlboleta, boleta, {headers});
}

 ListBoleta(): Observable<any> {
    const headers= new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    });
  return this.http.get(this.urlboleta, {headers});
}



}
