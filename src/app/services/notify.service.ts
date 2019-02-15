import { Injectable } from '@angular/core';

declare var UIkit: any;

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor() { }

  criarNotificacao(mensagem: string, tipo: string) {
    UIkit.notification({
      message: mensagem,
      status: tipo,
      pos: 'top-right',
      timeout: 5000
    });
  }
}
