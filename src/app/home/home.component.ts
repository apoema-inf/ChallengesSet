import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../models/user.model';

declare var M: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {

  logado: boolean = false;
  email: string;
  password: string;
  user: User = new User();

  constructor(public authService: AuthService) {
    var that = this;
    this.authService.getUser().then(function (user) {
      that.user = user as User;
    });
  }

  login() {
    if (this.email == (null || '' || undefined) ||
      this.password == (null || '' || undefined)) {
      return;
    }
    this.authService.login(this.email, this.password);
  }

  forgotPassword() {
    if (this.email == (null || '' || undefined)) {
      return;
    }
    this.authService.forgotPassword('hyagosouzza@hotmail.com');
  }

}
