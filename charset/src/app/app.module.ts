import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgPipesModule} from 'ngx-pipes';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { DesafiosComponent } from './desafios/desafios.component';
import { SolucionadoresComponent } from './solucionadores/solucionadores.component';
import { DemandantesComponent } from './demandantes/demandantes.component';
import { HttpClientModule } from '@angular/common/http';
import { CadastroComponent } from './cadastro/cadastro.component';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth-guard.service';
import { ContaComponent } from './conta/conta.component';

//import { AuthService } from './auth.service';
const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home' }
  },
  {
    path: 'desafios',
    component: DesafiosComponent,
    data: { title: 'Desafios' }
  },
  {
    path: 'minha-conta',
    component: ContaComponent,
    data: { title: 'Desafios' },
    canActivate: [AuthGuard]
  },
  {
    path: 'solucionadores',
    component: SolucionadoresComponent,
    data: { title: 'Solucionadores' }
  },
  {
    path: 'demandantes',
    component: DemandantesComponent,
    data: { title: 'Demandantes' }
  },
  {
    path: 'cadastro',
    component: CadastroComponent,
    data: { title: 'Cadastro' }
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DesafiosComponent,
    SolucionadoresComponent,
    DemandantesComponent,
    CadastroComponent,
    ContaComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes),
    BrowserModule,
    NgPipesModule,
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
