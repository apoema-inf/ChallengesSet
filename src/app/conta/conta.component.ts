import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conta',
  templateUrl: './conta.component.html',
  styleUrls: ['./conta.component.scss']
})
export class ContaComponent implements OnInit {
  user: User = new User();

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

}
