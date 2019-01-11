import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs';
import { User } from './models/user.model';
import { Router } from '@angular/router';

declare var M: any;

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;
  firebase: any;

  constructor(public firebaseAuth: AngularFireAuth, private db: AngularFirestore,
    private router: Router, ) {
    this.user = firebaseAuth.authState;
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
        console.log('Success!', value);
        (document.getElementById('cadastroForm') as HTMLFormElement).reset();
        M.toast({ html: 'Usuário cadastrado com sucesso', classes: 'rounded' });
      })
      .catch(err => {
        M.toast({ html: err.message, classes: 'rounded' });
      });
  }

  login(email: string, password: string) {
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
            that.db.collection('users').doc(value.docs[0].id).ref.get().then(documentSnapshot => {
              localStorage.setItem('user', JSON.stringify(documentSnapshot.data()));
              M.toast({ html: 'Usuário autenticado', classes: 'rounded' });
              window.location.replace('/desafios');
            })
          })
      })
      .catch(err => {
        M.toast({ html: err.message, classes: 'rounded' });
      });
  }

  logout() {
    var that = this;
    this.firebaseAuth
      .auth
      .signOut().then(function () {
        M.toast({ html: 'Usuário deslogado', classes: 'rounded' });
        localStorage.clear();
        window.location.replace('/home');
      });
  }

}