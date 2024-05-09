import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { CreateuserComponent } from './pages/createuser/createuser.component';
import { RegisterCompanyComponent } from './pages/registercompany/registercompany.component';
import { AreaComponent } from './pages/area/area.component';
import { FilialComponent } from './pages/filial/filial.component';
import { SetorComponent } from './pages/setor/setor.component';
import { CargoComponent } from './pages/cargo/cargo.component';
import { TipoContratoComponent } from './pages/tipocontrato/tipocontrato.component';
import { ColaboradorComponent } from './pages/colaborador/colaborador.component';
import { TipoAvaliacaoComponent } from './pages/tipoavaliacao/tipoavaliacao.component';
import { AvaliadorComponent } from './pages/avaliador/avaliador.component';
import { FormularioComponent } from './pages/formulario/formulario.component';
import { PerguntaComponent } from './pages/pergunta/pergunta.component';
import { AvaliacaoComponent } from './pages/avaliacao/avaliacao.component';
import { QuestionarioComponent } from './pages/questionario/questionario.component';
import { NovaliacaoComponent } from './pages/novaliacao/novaliacao.component';


export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'welcome', component: WelcomeComponent, 
    children: [
      { path: 'createuser', component: CreateuserComponent },
      { path: 'registercompany', component: RegisterCompanyComponent },
      { path: 'area', component: AreaComponent },
      { path: 'filial', component: FilialComponent },
      { path: 'setor', component:SetorComponent },
      { path: 'cargo', component:CargoComponent },
      { path: 'tipocontrato', component:TipoContratoComponent },
      { path: 'colaborador', component:ColaboradorComponent },
      { path: 'tipoavaliacao', component:TipoAvaliacaoComponent },
      { path: 'avaliador', component:AvaliadorComponent },
      { path: 'formulario', component: FormularioComponent },
      { path: 'pergunta', component: PerguntaComponent },
      { path: 'questionario', component: QuestionarioComponent },
      { path: 'avaliacao', component:AvaliacaoComponent },
      { path: 'novaliacao', component:NovaliacaoComponent }  
    ],
  },
  //{ path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) }
];
