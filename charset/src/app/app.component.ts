import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
    M.AutoInit();
    $('.dropdown-trigger').dropdown({
      coverTrigger: false
    });

  }

  logout() {
    this.authService.logout();
  }
}