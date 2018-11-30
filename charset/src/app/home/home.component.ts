import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  dado:any;

  user:any;
  senha:any;

  constructor(private _servicoLogin : LoginService) { }

  ngOnInit() {
  }

  getDados() {
    this._servicoLogin.getDados().subscribe(dados => {
      this.dado = dados;
      console.log(this.dado);
    })
  }

}
