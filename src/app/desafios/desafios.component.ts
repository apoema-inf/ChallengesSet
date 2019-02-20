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
import { FlatpickrOptions } from 'ng2-flatpickr';
import confirmDatePlugin from 'flatpickr/dist/plugins/confirmDate/confirmDate';

import Brazilian from 'flatpickr/dist/l10n/pt.js';
import { NotifyService } from '../services/notify.service';

declare var $: any;
declare var UIkit: any;

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
  prazo: string = "";
  found: Desafio = new Desafio();
  solver: Solver = new Solver();
  solverFound: Solver = new Solver();
  solucoesArray: string[] = [''];
  solucoesFilter: boolean = false;
  status: string = '';
  search: string = '';
  area: string = '';
  remunerado: string = '';
  desafioExcluir: any;
  flagEditar: boolean;
  tituloModal: string = 'Criar Novo Desafio';

  exampleOptions: FlatpickrOptions;
  constructor(private db: AngularFirestore, private authService: AuthService, private notifyService: NotifyService) {


    var that = this;
    authService.getUser().then(function (user) {
      that.user = user;
    })

    this.exampleOptions = {
      locale: Brazilian.pt,
      enableTime: true,
      dateFormat: "d/m/Y H:i",
      plugins: [confirmDatePlugin({})],
      onChange(selectedDates) {
        that.desafio.prazo = selectedDates[0].toLocaleString('pt-BR');
      }
    };
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

  setDesafioExcluir(id) {
    this.desafioExcluir = id;
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

  toggleEditar() {
    (document.getElementById("nao") as HTMLInputElement).checked = true;
    this.flagEditar = false;
    this.tituloModal = 'Criar Novo Desafio';
    this.desafio = new Desafio();
  }

  createDesafio() {
    $.LoadingOverlay("show");

    if (this.desafio.remunerado != "Sim") {
      this.desafio.remunerado = "Não";
    }

    if (this.desafio.nome == (null || '' || undefined) ||
      this.desafio.prazo == (null || '' || undefined) ||
      this.desafio.area == (null || '' || undefined) ||
      this.desafio.resumo == (null || '' || undefined)) {
      this.notifyService.criarNotificacao("Informe os campos", "warning");
      $.LoadingOverlay("hide");
      return;
    }

    this.db.collection("desafios").add({
      nome: this.desafio.nome,
      demandante: this.user.nome,
      prazo: this.desafio.prazo,
      resumo: this.desafio.resumo,
      area: this.desafio.area,
      emaildemandante: this.user.email,
      status: 'submissão',
      remunerado: this.desafio.remunerado
    })
      .then(function () {
        UIkit.modal('#modal-criar-novo').hide();
        $.LoadingOverlay("hide");
      })
      .catch(function () {
        $.LoadingOverlay("hide");
      });

  }

  findOne(desafioId) {
    var that = this;
    this.flagEditar = true;
    if (this.flagEditar) {
      this.tituloModal = 'Editar Desafio';
    }

    this.db.collection("desafios").doc(desafioId)
      .get().toPromise().then(function (doc) {
        if (doc.exists) {
          that.desafio.demandante = doc.data().demandante;
          that.desafio.emaildemandante = doc.data().emaildemandante;
          that.desafio.resumo = doc.data().resumo;
          that.desafio.area = doc.data().area;
          that.desafio.nome = doc.data().nome;
          that.desafio.prazo = doc.data().prazo;
          that.desafio.id = doc.id;
          that.desafio.status = doc.data().status;
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
  }

  deleteDesafio() {
    var that = this;
    this.db.collection("desafios").doc(this.desafioExcluir).delete().then(function () {
      that.notifyService.criarNotificacao("Desafio deletado com sucesso.", "success");
      UIkit.modal('#modal-deletar-desafio').hide();
    }).catch(function () {
      that.notifyService.criarNotificacao("Ocorreu um erro ao excluir o desafio", "danger");
      UIkit.modal('#modal-deletar-desafio').hide();
    });
  }

  editDesafio() {
    var that = this;

    if (this.desafio.remunerado != "Sim") {
      this.desafio.remunerado = "Não";
    }

    this.db.collection("desafios").doc(this.desafio.id)
      .update({
        nome: this.desafio.nome,
        demandante: this.user.nome,
        prazo: this.desafio.prazo,
        resumo: this.desafio.resumo,
        area: this.desafio.area,
        emaildemandante: this.user.email,
        remunerado: this.desafio.remunerado
      })
      .then(function () {
        that.notifyService.criarNotificacao("Desafio editado com sucesso.", "success");
        UIkit.modal('#modal-criar-novo').hide();
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

}

