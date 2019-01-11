import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-conta',
  templateUrl: './conta.component.html',
  styleUrls: ['./conta.component.css']
})
export class ContaComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService) {
    this.user = JSON.parse(localStorage.getItem('user'));
   }

  ngOnInit() {
  }

  redefinirSenha() {
    this.authService.forgotPassword(this.user.email);
  }

}
