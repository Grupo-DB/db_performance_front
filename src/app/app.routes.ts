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
import { AvaliadoComponent } from './pages/avaliado/avaliado.component';
import { AmbienteComponent } from './pages/ambiente/ambiente.component';
import { AvaliadorAvaliadosComponent } from './pages/avaliadoravaliados/avaliadoravaliados.component';
import { VincularComponent } from './pages/vincular/vincular.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InicialComponent } from './pages/inicial/inicial.component';
import { ResetpsComponent } from './pages/resetps/resetps.component';
import { EsqueceuSenhaComponent } from './pages/esqueceusenha/esqueceusenha.component';
import { RedefinirSenhaComponent } from './pages/redefinirsenha/redefinirsenha.component';
import { HistoricoComponent } from './pages/historico/historico.component';
import { RelatoriosComponent } from './pages/relatorios/relatorios.component';


export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path:'resetps', component:ResetpsComponent },
  { path: 'esqueceusenha', component:EsqueceuSenhaComponent },
  { path: 'redefinirsenha/:uid/:token', component:RedefinirSenhaComponent },
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
      { path: 'novaliacao', component:NovaliacaoComponent },
      { path: 'avaliado', component:AvaliadoComponent },
      { path: 'ambiente', component:AmbienteComponent },
      { path: 'avaliadoravaliados', component:AvaliadorAvaliadosComponent },
      { path: 'tipoavaliacaoavaliados', component:VincularComponent },
      { path: 'feedback', component:FeedbackComponent }, 
      { path: 'dashboard', component:DashboardComponent },
      { path: 'inicial', component:InicialComponent },
      { path: 'historico', component:HistoricoComponent },
      { path: 'relatorios', component:RelatoriosComponent },
    ],
  },
  
  //{ path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) }
];
