import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Desafio } from '../models/desafio.model';
import { Solver } from '../models/solver.model';
import * as firebase from 'firebase';

declare var M: any;
declare var $: any;

@Component({
  selector: 'app-desafios',
  templateUrl: './desafios.component.html',
  styleUrls: ['./desafios.component.css']
})
export class DesafiosComponent implements OnInit {

  desafios: Observable<Desafio[]>;
  solucoes: Observable<Solver[]>;
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
  statusConcluido: string = '';
  search: string = '';

  constructor(private db: AngularFirestore) {

    var that = this;
    this.user = JSON.parse(localStorage.getItem('user'));
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

  }

  ngOnInit() {
    M.AutoInit();
    $('#modalDelete').modal({
      opacity: 0.1
    });
    $('#modalComplete').modal({
      opacity: 0.1
    });
    $('.datepicker').datepicker({
      format: 'dd/mm/yyyy',
      i18n: {
        weekdaysShort: [
          'Dom',
          'Seg',
          'Ter',
          'Quar',
          'Quin',
          'Sex',
          'Sáb'
        ],
        cancel: 'Cancelar',
        months: [
          'Janeiro',
          'Fevereiro',
          'Março',
          'Abril',
          'Maio',
          'Junho',
          'Julho',
          'Agosto',
          'Setembro',
          'Outubro',
          'Novembro',
          'Dezembro'
        ],
        monthsShort: [
          'Jan',
          'Fev',
          'Mar',
          'Abr',
          'Mai',
          'Jun',
          'Jul',
          'Ago',
          'Set',
          'Out',
          'Nov',
          'Dez'
        ],
        weekdays: [
          'Domingo',
          'Segunda',
          'Terça',
          'Quarta',
          'Quinta',
          'Sexta',
          'Sábado'
        ],
        weekdaysAbbrev: ['D', 'S', 'T', 'Qa', 'Qi', 'Se', 'Sa']
      }
    });
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
    this.statusConcluido = '';
  }

  createDesafio() {
    this.desafio.prazo = $('#prazo').datepicker().val();
    this.hora = $('#h').timepicker().val();

    if (this.desafio.nome == (null || '' || undefined) ||
      this.desafio.prazo == (null || '' || undefined) ||
      this.desafio.area == (null || '' || undefined) ||
      this.hora == (null || '' || undefined) ||
      this.desafio.resumo == (null || '' || undefined)) {
      M.toast({ html: 'Preencha todos os campos obrigatório.', classes: 'rounded' });
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
      status: ''
    })
      .then(function () {
        $('#modal1').modal('close');
        M.toast({ html: 'Desafio criado com sucesso!', classes: 'rounded' });
        (document.getElementById('myForm') as HTMLFormElement).reset();
      })
      .catch(function () {
        M.toast({ html: 'Não foi possível criar o desafio', classes: 'rounded' });
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
      M.toast({ html: 'Desafio deletado com sucesso!', classes: 'rounded' });
    }).catch(function () {
      M.toast({ html: 'Não foi possível deletar o desafio', classes: 'rounded' });
    });
  }

  editDesafio() {

    this.prazo = $('#prazoEdit').datepicker().val();
    this.hora = $('#hEdit').timepicker().val();

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
        emaildemandante: this.user.email
      })
      .then(function () {
        $('#modalEdit').modal('close');
        M.toast({ html: 'Desafio editado com sucesso!', classes: 'rounded' });
      })
      .catch(function () {
        // The document probably doesn't exist.
        M.toast({ html: 'Não foi possível editar o desafio', classes: 'rounded' });
      });
  }

  getDesafioId(desafioId) {
    this.solver.idDesafio = desafioId;
  }

  enviarSolver() {

    if (this.solver.resumo == (null || '' || undefined)) {
      M.toast({ html: 'Informe a sua solução para o problema.', classes: 'rounded' });
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
        M.toast({ html: 'Solução enviada com sucesso!', classes: 'rounded' });
        (document.getElementById('formSolver') as HTMLFormElement).reset();
      })
      .catch(function () {
        M.toast({ html: 'Não foi possível enviar a solução', classes: 'rounded' });
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
        M.toast({ html: 'Desafio concluído com sucesso!', classes: 'rounded' });
      })
      .catch(function () {
        // The document probably doesn't exist.
        M.toast({ html: 'Não foi possível concluir o desafio', classes: 'rounded' });
      });

  }

  setStatusConcluido() {
    this.cleanFilters();
    this.statusConcluido = 'concluído';
  }

  reInitMaterialize() {
    M.AutoInit();
  }
}

