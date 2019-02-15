import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'firebase';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  logado: boolean = false;

  constructor(private authService: AuthService) {
    var that = this;
   }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
  }

}
