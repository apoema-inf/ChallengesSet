import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'charset';

  ngOnInit() {
    $(document).ready(function () {
      $('.sidenav').sidenav();
      $(document).scroll(function () {
        var $nav = $(".nav-wrapper");
        $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
      });
    });

  }

  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
