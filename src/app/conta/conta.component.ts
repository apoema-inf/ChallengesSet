import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-conta',
  templateUrl: './conta.component.html',
  styleUrls: ['./conta.component.scss']
})
export class ContaComponent implements OnInit {
  user: User = new User();
  editando: boolean[] = [false, false, false];
  constructor(private authService: AuthService, private router: Router) {
    var that = this;
    this.authService.getUser().then(function (user) {
      if(!user) {
        that.router.navigate(['/home']);
      } else {
        that.user = user as User;
      }
    });
  }

  ngOnInit() {

  }

  redefinirSenha() {
    this.authService.forgotPassword(this.user.email);
  }

  private set_mode(input: string, mode:string, color: string) {
    $('#' + input + 'Edit').prop('text', mode);
    $('#' + input + 'Edit').css('color', color);
  }

  private salvarModo(input: string) {
    this.set_mode(input, 'editar', '#3880ff');
    $('#' + input).addClass('pulse');
  }

  private editarModo(input: string) {
    this.set_mode(input, 'salvar', '#10dc60');
    $('#' + input).removeClass('pulse');
  }

  editar(input: string) {
    switch(input) {
      case 'nome': this.editando[0] = !this.editando[0];
        $('#' + input).prop('readonly', !this.editando[0]);
        this.editando[0] ? this.editarModo(input) : this.salvarModo(input);
        break;
      case 'email': this.editando[1] = !this.editando[1];
        $('#' + input).prop('readonly', !this.editando[1]);
        this.editando[1] ? this.editarModo(input) : this.salvarModo(input);
        break;
      case 'profile': this.editando[2] = !this.editando[2];
        $('#' + input).prop('disabled', !this.editando[2]);
        this.editando[2] ? this.editarModo(input) : this.salvarModo(input);
        break;
    }
  }

}
