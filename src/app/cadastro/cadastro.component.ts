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
    if (this.user.profile == null ||
      this.user.profile == undefined ||
      this.user.profile == '') {
      this.criarNotificacao("O campo 'Perfil de Usuário' deve ser informado.", "warning");
      return;
    } else if (this.user.nome == null ||
      this.user.nome == undefined ||
      this.user.nome == '') {
      this.criarNotificacao("O campo 'Nome' deve ser informado.", "warning");
      return;
    } else if (this.user.senha == null ||
      this.user.senha == undefined ||
      this.user.senha == '') {
      this.criarNotificacao("O campo 'Senha' deve ser informado.", "warning");
      return;
    } else if (this.user.email == null ||
      this.user.email == undefined ||
      this.user.email == '') {
      this.criarNotificacao("O campo 'E-mail' deve ser informado.", "warning");
      return;
    }
    this.authService.signup(this.user);
  }
}
