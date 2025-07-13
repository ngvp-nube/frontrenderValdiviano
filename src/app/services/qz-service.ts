import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QzService {
qz: any;
  constructor() { 
    this.init();
  }

  
  init() {
    if (!this.qz.websocket.isActive()) {
      this.qz.websocket.connect().catch(console.error);
    }
  }

   async printRaw(data: string, printerName = 'Nombre de tu impresora') {
    try {
      const config = this.qz.configs.create(printerName); // Usa nombre real
      const printData = [
        {
          type: 'raw',
          format: 'plain',
          data: data,
        },
      ];
      await this.qz.print(config, printData);
    } catch (err) {
      console.error('Error al imprimir con QZ:', err);
    }
  }

  disconnect() {
    this.qz.websocket.disconnect();
  }
}
