import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs';
import { User } from './models/user.model';
import { Router } from '@angular/router';

declare var UIkit: any;

@Injectable()
export class AuthService {
  user: User = new User();
  firebase: any;

  constructor(public firebaseAuth: AngularFireAuth, private db: AngularFirestore,
    private router: Router) {
  }

  criarNotificacao(mensagem: string, tipo: string) {
    UIkit.notification({
      message: mensagem,
      status: tipo,
      pos: 'top-right',
      timeout: 5000
    });
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
        that.criarNotificacao("<span uk-icon=\'icon: check\'></span> Cadastro criado com sucesso!", "success");
        (document.getElementById('cadastroForm') as HTMLFormElement).reset();
      })
      .catch(err => {
        that.criarNotificacao("<span uk-icon=\'icon: ban\'></span>" + err.message, "danger");
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
            //that.db.collection('users').doc(value.docs[0].id).ref.get().then(documentSnapshot => {
              window.location.replace('/desafios');
            //})
          })
      })
      .catch(err => {
      });
  }

  logout() {
    var that = this;
    this.firebaseAuth
      .auth
      .signOut().then(function () {
        window.location.replace('/home');
      });
  }

  forgotPassword(email) {

    this.firebaseAuth.auth.sendPasswordResetEmail(email).then(function () {
    }).catch(function (error) {
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
          // No user is signed in.
        }
      });
    });
  }

}
