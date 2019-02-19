import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Desafio } from '../models/desafio.model';
import { Solver } from '../models/solver.model';
import * as firebase from 'firebase';
import { Area } from '../models/area.model';
import { AuthService } from '../services/auth.service';
import { Moment } from 'moment';

declare var $: any;

@Component({
  selector: 'app-desafios',
  templateUrl: './desafios.component.html',
  styleUrls: ['./desafios.component.scss']
})
export class DesafiosComponent implements OnInit {

  date: Date = new Date();
  settings = {
    bigBanner: true,
    timePicker: true,
    format: 'dd-MMM-yyyy hh:mm a z-0300',
    defaultOpen: false,
  }
  desafios: Observable<Desafio[]>;
  area2: string = "";
  solucoes: Observable<Solver[]>;
  areaoptions: Observable<Area[]>;
  userEmail: string;
  user: any;
  desafio: Desafio = new Desafio();
  hora: string;
  prazo: string;
  found: Desafio = new Desafio();
  solver: Solver = new Solver();
  solverFound: Solver = new Solver();
  solucoesArray: string[] = [''];
  solucoesFilter: boolean = false;
  status: string = '';
  search: string = '';
  area: string = '';
  remunerado: string = '';

  constructor(private db: AngularFirestore, private authService: AuthService) {

    var that = this;
    authService.getUser().then(function (user) {
      that.user = user;
    })
    this.desafios = db.collection('desafios').snapshotChanges().pipe(map(

      changes => {

        return changes.map(

          a => {

            const data = a.payload.doc.data() as Desafio;

            data.id = a.payload.doc.id;
            return data;

          });
      }));

    this.solucoes = db.collection('solucoes').snapshotChanges().pipe(map(

      changes => {

        return changes.map(

          a => {

            const data = a.payload.doc.data() as Solver;

            data.id = a.payload.doc.id;


            if (data.emailsolver == this.user.email)
              that.solucoesArray.push(data.idDesafio);

            return data;

          });
      }))

    this.areaoptions = db.collection('areaoptions').snapshotChanges().pipe(map(

      changes => {

        return changes.map(

          a => {

            const data = a.payload.doc.data() as Area;

            data.id = a.payload.doc.id;
            return data;

          });
      }))

  }

  ngOnInit() {
  }

  setUserEmail() {
    this.cleanFilters();
    this.userEmail = this.user.email;
  }

  setSolucoesFilter() {
    this.cleanFilters();
    this.solucoesFilter = true;
  }

  cleanFilters() {
    this.userEmail = '';
    this.solucoesFilter = false;
    this.status = '';
    this.area = '';
    this.remunerado = '';
  }

  createDesafio() {
    this.desafio.prazo = $('#prazo').datepicker().val();
    this.hora = $('#h').timepicker().val();
    if (this.desafio.remunerado != "Sim") {
      this.desafio.remunerado = "Não";
    }

    if (this.desafio.nome == (null || '' || undefined) ||
      this.desafio.prazo == (null || '' || undefined) ||
      this.desafio.area == (null || '' || undefined) ||
      this.hora == (null || '' || undefined) ||
      this.desafio.resumo == (null || '' || undefined)) {
      return;
    }

    var dateParts = this.desafio.prazo.split("/");
    var timeParts = this.hora.split(':');
    var timePartsWithoutPM = timeParts[1].split(' ');

    // month is 0-based, that's why we need dataParts[1] - 1
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0], +timeParts[0], +timePartsWithoutPM[0]);

    this.db.collection("desafios").add({
      nome: this.desafio.nome,
      demandante: this.user.nome,
      prazo: dateObject,
      resumo: this.desafio.resumo,
      area: this.desafio.area,
      emaildemandante: this.user.email,
      status: 'submissão',
      remunerado: this.desafio.remunerado
    })
      .then(function () {
        $('#modal1').modal('close');
        (document.getElementById('myForm') as HTMLFormElement).reset();
      })
      .catch(function () {
      });

  }

  findOne(desafioId) {
    var that = this;
    this.db.collection("desafios").doc(desafioId)
      .get().toPromise().then(function (doc) {
        if (doc.exists) {
          that.found.demandante = doc.data().demandante;
          that.found.emaildemandante = doc.data().emaildemandante;
          that.found.resumo = doc.data().resumo;
          that.found.area = doc.data().area;
          that.found.nome = doc.data().nome;
          that.prazo = doc.data().prazo.toDate().toLocaleDateString('pt-BR');
          that.hora = doc.data().prazo.toDate().toLocaleTimeString('pt-BR');
          that.found.id = doc.id;
          that.found.status = doc.data().status;
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
  }

  deleteDesafio() {
    this.db.collection("desafios").doc(this.found.id).delete().then(function () {
      $('#modalDelete').modal('close');
    }).catch(function () {
    });
  }

  editDesafio() {

    this.prazo = $('#prazoEdit').datepicker().val();
    this.hora = $('#hEdit').timepicker().val();
    if (this.found.remunerado != "Sim") {
      this.found.remunerado = "Não";
    }

    var dateParts = this.prazo.split("/");
    var timeParts = this.hora.split(':');
    var timePartsWithoutPM = timeParts[1].split(' ');

    // month is 0-based, that's why we need dataParts[1] - 1
    var dateObject = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0], +timeParts[0], +timePartsWithoutPM[0]);

    this.db.collection("desafios").doc(this.found.id)
      .update({
        nome: this.found.nome,
        demandante: this.user.nome,
        prazo: dateObject,
        resumo: this.found.resumo,
        area: this.found.area,
        emaildemandante: this.user.email,
        remunerado: this.found.remunerado
      })
      .then(function () {
        $('#modalEdit').modal('close');
      })
      .catch(function () {
        // The document probably doesn't exist.
      });
  }

  getDesafioId(desafioId) {
    this.solver.idDesafio = desafioId;
  }

  enviarSolver() {

    if (this.solver.resumo == (null || '' || undefined)) {
      return;
    }

    this.db.collection("solucoes")
      .add({
        solver: this.user.nome,
        emailsolver: this.user.email,
        resumo: this.solver.resumo,
        idDesafio: this.solver.idDesafio,
        sendAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(function () {
        $('#modalSolver').modal('close');
        (document.getElementById('formSolver') as HTMLFormElement).reset();
      })
      .catch(function () {
      });
  }

  findOneSolver(desafioId) {
    var that = this;
    this.db.collection("solucoes").ref.where("idDesafio", "==", desafioId)
      .get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          that.solverFound.resumo = doc.data().resumo;
          that.solverFound.solver = doc.data().solver;
          that.solverFound.emailsolver = doc.data().emailsolver;
          that.solverFound.sendAt = doc.data().sendAt.toDate().toLocaleDateString('pt-BR') + ' às ' +
            doc.data().sendAt.toDate().toLocaleTimeString('pt-BR');
          that.solverFound.id = doc.id;
        });

      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
  }

  completeDesafio() {
    this.db.collection("desafios").doc(this.found.id)
      .update({
        status: 'concluído'
      })
      .then(function () {
        $('#modalComplete').modal('close');
      })
      .catch(function () {
        // The document probably doesn't exist.
      });

  }

  setStatus(string) {
    this.cleanFilters();
    this.status = string;
  }

  setRemunerado() {
    this.cleanFilters();
    this.remunerado = "Sim";
  }

  setArea(string) {
    this.cleanFilters();
    this.area = string;
  }

  reInitMaterialize() {

  }
}

