import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

declare var M: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {

  email: string;
  password: string;
  user: any;

  constructor(public authService: AuthService) {
    this.user = JSON.parse(localStorage.getItem('user'));

  }

  login() {
    if (this.email == (null || '' || undefined) ||
      this.password == (null || '' || undefined)) {
      M.toast({ html: 'Preencha os campos', classes: 'rounded' });
      return;
    }
    this.authService.login(this.email, this.password);
  }

  forgotPassword() {
    if (this.email == (null || '' || undefined)) {
      M.toast({ html: 'Preencha o campo email', classes: 'rounded' });
      return;
    }
    this.authService.forgotPassword('hyagosouzza@hotmail.com');
  }

}
