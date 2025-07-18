import { Injectable } from '@angular/core';

declare var qz: any;

@Injectable({ providedIn: 'root' })
export class QzService {
  constructor() {
    qz.security.setCertificatePromise(() => Promise.resolve(null));
    qz.security.setSignaturePromise(() => Promise.resolve(null));
  }
  private async firmarDigitalmente() {
  qz.security.setCertificatePromise(() => {
    return fetch('/assets/public-cert.pem')
      .then(res => res.text());
  });

  qz.security.setSignaturePromise((toSign: string) => {
    return fetch('/assets/private-key.pem') // NO recomendado en producción real, solo para test.
      .then(res => res.text())
      .then(privateKey => {
        const crypto = window.crypto || (window as any).msCrypto;
        // Aquí deberías usar un sistema real de firma. Para demo, se retorna vacío.
        return ''; // ⚠️ Esto necesita ser reemplazado por una firma válida con tu backend o WebAssembly
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
