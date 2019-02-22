import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

declare var M: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {

  email: string;
  password: string;

  constructor(public authService: AuthService) {
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
    this.authService.forgotPassword(this.email);
  }

}
