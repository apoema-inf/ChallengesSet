import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {

  email: string;
  password: string;

  constructor(public authService: AuthService) { }

  login() {
    this.authService.login(this.email, this.password);
  }

}
