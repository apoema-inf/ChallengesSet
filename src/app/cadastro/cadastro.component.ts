import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

declare var UIkit: any;
declare var $: any;

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {

  user: User = new User();
  usuarioCadastro: User = new User();

  constructor(public authService: AuthService, public router: Router) {
    $.LoadingOverlay("show");
    var that = this;
    this.authService.getUser().then(function (user) {
      if (user) {
        that.router.navigate(['/home']);
        $.LoadingOverlay("hide", true);
      } else {
        $.LoadingOverlay("hide", true);
      }
    })
  }

  ngOnInit() {

  }

  criarNotificacao(mensagem: string, tipo: string) {
    UIkit.notification({
      message: mensagem,
      status: tipo,
      pos: 'top-right',
      timeout: 5000
    });
  }

  signup() {
    this.authService.signup(this.usuarioCadastro);
  }
}
