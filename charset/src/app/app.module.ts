import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { DesafiosComponent } from './desafios/desafios.component';
import { SolucionadoresComponent } from './solucionadores/solucionadores.component';
import { DemandantesComponent } from './demandantes/demandantes.component';
import { HttpClientModule } from '@angular/common/http';
import { CadastroComponent } from './cadastro/cadastro.component';

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
  { path: '',
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
    CadastroComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
