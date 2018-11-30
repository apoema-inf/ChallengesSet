import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { User } from '../models/user.model';

declare var $: any;
declare var M:any;

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
  providers: [UserService]
})
export class CadastroComponent implements OnInit {

  user: User = new User();
  users: User[];

  constructor(private userService: UserService) { }

  ngOnInit() {
    $('select').formSelect();
    this.userService.getUsers()
      .subscribe(data => {
        this.users = data;
      });
  }

  createUser(): void {

    if(this.user.email == null || this.user.senha == null) {
      M.toast({html: 'Os campos email e senha devem ser preenchidos!', classes: 'rounded'});
      return;
    }
    for (let i in this.users) {
      if(this.users[i].email == this.user.email) {
        M.toast({html: 'Já existe um usuário cadastrado com este email.', classes: 'rounded'});
        return;
      }
    }
    if(this.user.profile === undefined) {
      this.user.profile = 0;
    }
    this.userService.createUser(this.user)
      .subscribe(data => {
        M.toast({html: 'Usuário criado com sucesso', classes: 'rounded'});
        this.user.nome = '';
        this.user.senha = '';
        this.user.email = '';
      });

  };
}
