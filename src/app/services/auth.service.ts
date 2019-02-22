import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { NotifyService } from './notify.service';
import { Observable } from 'rxjs';

declare var $: any;

@Injectable()
export class AuthService {
  user: User = new User();
  userObservable: Observable<firebase.User>;
  firebase: any;

  constructor(public firebaseAuth: AngularFireAuth, private db: AngularFirestore,
    private router: Router, private notifyService: NotifyService) {
    this.userObservable = firebaseAuth.authState;
  }

  signup(user: User) {
    var that = this;
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(user.email, user.senha)
      .then(value => {
        that.db.collection('users').add({
          nome: user.nome,
          email: user.email,
          profile: user.profile
        })
        that.notifyService.criarNotificacao("<span uk-icon=\'icon: check\'></span> Cadastro criado com sucesso!", "success");
        (document.getElementById('cadastroForm') as HTMLFormElement).reset();
      })
      .catch(err => {
        that.notifyService.criarNotificacao("<span uk-icon=\'icon: ban\'></span>" + err.message, "danger");
      });
  }

  login(email: string, password: string) {
    $.LoadingOverlay("show");
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(function () {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        return firebase.auth().signInWithEmailAndPassword(email, password);
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
      });
    var that = this;
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        that.db.collection('users', ref => ref.where('email', '==', email))
          .get()
          .toPromise()
          .then((value) => {
            //that.db.collection('users').doc(value.docs[0].id).ref.get().then(documentSnapshot => {
            that.router.navigate(['/desafios']);
            that.notifyService.criarNotificacao("<span uk-icon=\'icon: check\'></span> Logado com sucesso!", "primary");
            $.LoadingOverlay("hide");
            //})
          })
      })
      .catch(err => {
        $.LoadingOverlay("hide");
        switch (err.message) {
          case "The password is invalid or the user does not have a password.": {
            that.notifyService.criarNotificacao("A senha é inválida ou o usuário não existe.", "warning");
            break;
          }
          case "There is no user record corresponding to this identifier. The user may have been deleted.": {
            that.notifyService.criarNotificacao("Usuário não encontrado.", "warning");
            break;
          }
          default: {
            that.notifyService.criarNotificacao(err.message, "warning");
          }
        }
      });
  }

  logout() {
    $.LoadingOverlay("show");
    var that = this;
    this.firebaseAuth
      .auth
      .signOut().then(function () {
        that.router.navigate(['/home']);
        $.LoadingOverlay("hide");
        that.notifyService.criarNotificacao("<span uk-icon=\'icon: check\'></span> Deslogado com sucesso!", "primary");
      });
  }

  forgotPassword(email) {
    var that = this;
    this.firebaseAuth.auth.sendPasswordResetEmail(email).then(function () {
      that.notifyService.criarNotificacao("E-mail enviado para " + email, "primary");
    }).catch(function (err) {
      switch (err.message) {
        case "There is no user record corresponding to this identifier. The user may have been deleted.": {
          that.notifyService.criarNotificacao("Usuário não encontrado.", "warning");
          break;
        }
        default: {
          that.notifyService.criarNotificacao(err.message, "warning");
        }
      }
    });
  }

  getUser() {
    var that = this;

    return new Promise(function (resolve, reject) {
      that.firebaseAuth.auth.onAuthStateChanged(function (user) {
        if (user) {
          that.db.collection("users").ref.where("email", "==", user.email)
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data().nome);
                that.user.id = doc.id;
                that.user.email = doc.data().email;
                that.user.nome = doc.data().nome;
                that.user.profile = doc.data().profile;
                resolve(that.user);
              });
            })
            .catch(function (error) {
              reject(error);
            });
        } else {
          resolve(null);
        }
      });
    });
  }

}
