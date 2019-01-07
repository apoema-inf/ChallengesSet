import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DesafiosService {

  desafios: Observable<any>;

  constructor(private db: AngularFirestore) {
    var that = this;
    
  }

  getDesafios() {

  }
}
