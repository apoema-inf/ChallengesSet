import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

declare var $: any;
declare var M:any;

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  user: User = new User();

  constructor(public authService: AuthService, public router: Router) {
    var that = this;
    this.authService.getUser().then(function (user) {
      if(user) {
        that.router.navigate(['/home']);
      }
    });
  }
  
  ngOnInit() {
    $('select').formSelect();

  }

  signup() {
    if(this.user.profile == (null || undefined || '') ||
    this.user.email == (null || undefined || '') ||
    this.user.senha == (null || undefined || '') ||
    this.user.nome == (null || undefined || '')) {
      return;
    }
    this.authService.signup(this.user);
  }

}
