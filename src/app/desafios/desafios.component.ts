import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Desafio } from '../models/desafio.model';
import { Solver } from '../models/solver.model';
import * as firebase from 'firebase';
import { Area } from '../models/area.model';
import { AuthService } from '../services/auth.service';
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

  desafios: Observable<Desafio[]>;
  solucoes: Observable<Solver[]>;
  areaoptions: Observable<Area[]>;
  userEmail: string;
  user: any;
  desafio: Desafio = new Desafio();
  solver: Solver = new Solver();
  solverFound: Solver = new Solver();
  solucoesArray: string[] = [''];
  solucoesFilter: boolean = false;
  desafiosAux: Observable<Desafio[]>;
  status: string = '';
  search: string = '';
  areaFilter: string = '';
  remuneradoFilter: boolean;
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

    this.initDesafios();

    this.solucoes = db.collection('solucoes').snapshotChanges().pipe(map(

      changes => {

        return changes.map(

          a => {

            const data = a.payload.doc.data() as Solver;

            data.id = a.payload.doc.id;

            if (this.user && data.emailsolver == this.user.email)
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

  //Métodos de Controle de acesso
  isAmbos(): boolean {
    if (this.user && this.user.profile == "Ambos")
      return true;
    else
      return false;
  }

  isDemandante(): boolean {
    if (this.user && this.user.profile == "Demandante") {
      return true;
    }

    else
      return false;
  }

  isSolver(): boolean {
    if (this.user && this.user.profile == "Solucionador")
      return true;
    else
      return false;
  }
  //Fim Métodos de Controle

  initDesafios() {
    this.desafios = this.db.collection('desafios').snapshotChanges().pipe(map(

      changes => {

        return changes.map(

          a => {

            const data = a.payload.doc.data() as Desafio;

            data.id = a.payload.doc.id;
            return data;

          });
      }))

    return true;
  }

  setDesafioExcluir(id) {
    this.desafioExcluir = id;
  }

  setUserEmail() {
    this.cleanFilters();
    this.userEmail = this.user.email;
  }

  cleanFilters() {
    this.userEmail = '';
    this.status = '';
    this.areaFilter = '';
    this.remuneradoFilter = null;
    this.solucoesFilter = false;
  }

  toggleEditar() {
    this.flagEditar = false;
    this.tituloModal = 'Criar Novo Desafio';
    this.desafio = new Desafio();
  }

  createDesafio(form) {

    var that = this;

    if (form.value.remunerado == undefined) {
      this.desafio.remunerado = false;
    }

    $.LoadingOverlay("show");

    if (this.desafio.prazo == (null || '' || undefined)) {
      this.notifyService.criarNotificacao("Informe o Prazo para submissão", "warning");
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
        (document.getElementById('createForm') as HTMLFormElement).reset();
        that.notifyService.criarNotificacao("Desafio criado com sucesso.", "success");
      })
      .catch(function () {
        $.LoadingOverlay("hide");
        that.notifyService.criarNotificacao("Não foi possível criar o desafio.", "danger");
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
          that.desafio.remunerado = doc.data().remunerado;

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

  minhasSolucoes() {
    this.cleanFilters();
    this.solucoesFilter = true;
  }

  editDesafio(id) {
    var that = this;

    this.db.collection("desafios").doc(id)
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
        (document.getElementById('createForm') as HTMLFormElement).reset();
      })
      .catch(function () {
        // The document probably doesn't exist.
      });
  }

  getDesafioId(desafioId) {
    this.solver.idDesafio = desafioId;
  }

  enviarSolver() {
    var that = this;
    this.db.collection("solucoes")
      .add({
        solver: this.user.nome,
        emailsolver: this.user.email,
        resumo: this.solver.resumo,
        idDesafio: this.solver.idDesafio,
        sendAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(function () {
        that.notifyService.criarNotificacao("Solução do desafio enviado com sucesso.", "success");
        UIkit.modal('#modal-solucao-desafio').hide();
        (document.getElementById('solucaoForm') as HTMLFormElement).reset();
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

  completeDesafio(idDesafio) {
    var that = this;

    console.log(idDesafio);

    this.db.collection("desafios").doc(idDesafio)
      .update({
        status: 'concluído'
      })
      .then(function () {
        that.notifyService.criarNotificacao("Desafio concluido com sucesso.", "success");
        UIkit.modal('#modal-concluir-desafio').hide();
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
    this.remuneradoFilter = true;
  }

  setArea(string) {
    this.cleanFilters();
    this.areaFilter = string;
  }

}

