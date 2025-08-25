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
  tipo_venta:string;
  // Agrega aquí otros campos que tenga tu modelo
}
@Injectable({
  providedIn: 'root'
})
export class Api {
  private apiUrl = 'http://192.168.1.100:8000/api/producto/';
    private loginUrl = 'http://192.168.1.100:8000/api/login/';
    private searchnUrl = 'http://192.168.1.100:8000/api/producto';
    private urlboleta = 'http://192.168.1.100:8000/api/boleta/';
    private urlConabilidad = 'http://192.168.1.100:8000/contabilidad/total/?';
    private urldeleteBoleta = 'http://192.168.1.100:8000/api/boletas/eliminar/';
    private urlsearchBoleta = 'http://192.168.1.100:8000/boletas/';
    private urlconta = 'http://192.168.1.100:8000';
//   private apiUrl = 'http://localhost:8000/api/producto/';
// private loginUrl = 'http://localhost:8000/api/login/';
// private searchnUrl = 'http://localhost:8000/api/producto';
// private urlboleta = 'http://localhost:8000/api/boleta/';
// private urlConabilidad = 'http://localhost:8000/contabilidad/total/?';
// private urldeleteBoleta = 'http://localhost:8000/api/boletas/eliminar/';
// private urlsearchBoleta = 'http://localhost:8000/boletas/';
// private urlconta = 'http://localhost:8000';


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

obtenerProductosPorFecha(fecha: string) {
      const headers= new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }); 
  return this.http.get<any>(this.urlconta+ `/api/productos-por-fecha/?fecha=${fecha}`,{headers});
}


 ListBoleta(): Observable<any> {
    const headers= new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    });
  return this.http.get(this.urlboleta, {headers});
}

GetContabilidadTotal(fecha: string): Observable<any> {
    const headers= new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    });
  return this.http.get(`${this.urlConabilidad}fecha=${fecha}`,{headers});
}




  // list productos
  listProducto(): Observable<any> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json' });

    return this.http.get<any>(this.apiUrl, {headers});
  }


eliminarBoleta(boleta_id : number): Observable<any> {
  const headers= new HttpHeaders({
    'Authorization': `Token ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });
  const body = { boleta_id };
  return this.http.post(this.urldeleteBoleta, body, {headers});
}

actualizarProducto(codigo: string, data: any) {
  const headers= new HttpHeaders({
    'Authorization': `Token ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });
  return this.http.put<any>(this.urlconta+`/producto-actualizar/${codigo}/`, data, {headers});
}
deleteProducto(codigo: string) {
  const headers= new HttpHeaders({
    'Authorization': `Token ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });
  return this.http.delete<any>(this.urlconta+`/api/producto/eliminar/${codigo}/`,{headers});
}

searchboletaforcode(codigo: string) {
  const headers= new HttpHeaders({
    'Authorization': `Token ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });
  return this.http.get(this.urlsearchBoleta+`${codigo}/`,{headers});
}
}
