import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Desafio } from '../models/desafio.model';
import { Observable } from 'rxjs';

declare var M: any;

@Component({
  selector: 'app-desafios-comum',
  templateUrl: './desafios-comum.component.html',
  styleUrls: ['./desafios-comum.component.css']
})
export class DesafiosComumComponent implements OnInit {
  desafios: Observable<Desafio[]>;
  statusConcluido: string;

  constructor(private db: AngularFirestore) {
    var that = this;
    this.desafios = db.collection('desafios').snapshotChanges().pipe(map(

      changes => {

        return changes.map(

          a => {

            const data = a.payload.doc.data() as Desafio;

            data.id = a.payload.doc.id;
            return data;

          });
      }));
  }

  ngOnInit() {
    M.AutoInit();
  }

  cleanFilters() {
    this.statusConcluido = '';
  }

  setStatusConcluido() {
    this.cleanFilters();
    this.statusConcluido = 'concluído';
  }

}
