import { Injectable } from '@angular/core';

declare var qz: any;

@Injectable({ providedIn: 'root' })
export class QzService {
  constructor() {}

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
