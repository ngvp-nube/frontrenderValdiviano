import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare var qz: any;

@Injectable({ providedIn: 'root' })
export class QzService {
  private urlFirmar = 'https://web-production-d1c8d.up.railway.app/api/firmar/';

  constructor(private http: HttpClient) {
    this.configurarSeguridad();
  }

 private configurarSeguridad() {
    // Cargar certificado público
    qz.security.setCertificatePromise(() => {
      return fetch('/assets/public-cert.pem').then(res => res.text());
    });

    // Firma digital real llamando a backend
    qz.security.setSignaturePromise((toSign: string) => {
      const token = localStorage.getItem('token') || '';

      const headers = new HttpHeaders({
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json' 
      });

  return this.http.post<{ signature: string }>(this.urlFirmar, { toSign }, { headers })
  .toPromise()
  .then(res => res?.signature ?? '')
  .catch(err => {
    console.error('Error al firmar desde backend', err);
    return '';
  });

    });
  }

  async conectar(): Promise<void> {
    if (!qz.websocket.isActive()) {
      await qz.websocket.connect();
    }
  }

  async desconectar(): Promise<void> {
    if (qz.websocket.isActive()) {
      await qz.websocket.disconnect();
    }
  }

  async obtenerImpresoras(): Promise<string[]> {
    await this.conectar();
    return await qz.printers.find();
  }

  async imprimirTexto(nombreImpresora: string, texto: string): Promise<void> {
    await this.conectar();

    const config = qz.configs.create(nombreImpresora);
    const datos = [
      { type: 'raw', format: 'plain', data: texto + '\n\n\n\n' }
    ];

    await qz.print(config, datos);
  }
}
