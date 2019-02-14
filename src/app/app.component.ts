import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'charset';
  user: any;

  constructor(public authService: AuthService) {
    if (authService.user) {
      this.user = JSON.parse(localStorage.getItem('user'));
      console.log(this.user);
    }
  }

  ngOnInit() {
  }

  reInitMaterialize() {
    $('#dropdown-user').dropdown('open');
  }

  logout() {
    this.authService.logout();
  }
}