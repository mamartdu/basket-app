import { Routes } from '@angular/router';
import { JornadaComponent } from './components/jornada/jornada.component';
import { PartidoComponent } from './components/partido/partido.component';

export const routes: Routes = [
  { path: '', component: JornadaComponent },
  { path: 'partido/:id', component: PartidoComponent },
  { path: '**', redirectTo: '' }
];
