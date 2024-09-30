import { Routes } from '@angular/router';
import { LoginComponent } from './pages/avaliacoes/login/login.component';
import { WelcomeComponent } from './pages/avaliacoes/welcome/welcome.component';
import { CreateuserComponent } from './pages/avaliacoes/createuser/createuser.component';
import { RegisterCompanyComponent } from './pages/avaliacoes/registercompany/registercompany.component';
import { AreaComponent } from './pages/avaliacoes/area/area.component';
import { FilialComponent } from './pages/avaliacoes/filial/filial.component';
import { SetorComponent } from './pages/avaliacoes/setor/setor.component';
import { CargoComponent } from './pages/avaliacoes/cargo/cargo.component';
import { TipoContratoComponent } from './pages/avaliacoes/tipocontrato/tipocontrato.component';
import { ColaboradorComponent } from './pages/avaliacoes/colaborador/colaborador.component';
import { TipoAvaliacaoComponent } from './pages/avaliacoes/tipoavaliacao/tipoavaliacao.component';
import { AvaliadorComponent } from './pages/avaliacoes/avaliador/avaliador.component';
import { FormularioComponent } from './pages/avaliacoes/formulario/formulario.component';
import { PerguntaComponent } from './pages/avaliacoes/pergunta/pergunta.component';
import { AvaliacaoComponent } from './pages/avaliacoes/avaliacao/avaliacao.component';
import { QuestionarioComponent } from './pages/avaliacoes/questionario/questionario.component';
import { NovaliacaoComponent } from './pages/avaliacoes/novaliacao/novaliacao.component';
import { AvaliadoComponent } from './pages/avaliacoes/avaliado/avaliado.component';
import { AmbienteComponent } from './pages/avaliacoes/ambiente/ambiente.component';
import { AvaliadorAvaliadosComponent } from './pages/avaliacoes/avaliadoravaliados/avaliadoravaliados.component';
import { VincularComponent } from './pages/avaliacoes/vincular/vincular.component';
import { FeedbackComponent } from './pages/avaliacoes/feedback/feedback.component';
import { DashboardComponent } from './pages/avaliacoes/dashboard/dashboard.component';
import { InicialComponent } from './pages/avaliacoes/inicial/inicial.component';
import { ResetpsComponent } from './pages/avaliacoes/resetps/resetps.component';
import { EsqueceuSenhaComponent } from './pages/avaliacoes/esqueceusenha/esqueceusenha.component';
import { RedefinirSenhaComponent } from './pages/avaliacoes/redefinirsenha/redefinirsenha.component';
import { HistoricoComponent } from './pages/avaliacoes/historico/historico.component';
import { RelatoriosComponent } from './pages/avaliacoes/relatorios/relatorios.component';
import { HomeoperacoesComponent } from './pages/dashboardoperacoes/homeoperacoes/homeoperacoes.component';
import { HomeproducaoComponent } from './pages/dashboardoperacoes/producao/homeproducao/homeproducao.component';
import { HomebritagemComponent } from './pages/dashboardoperacoes/producao/britagem/homebritagem/homebritagem.component';
import { RebritagemComponent } from './pages/dashboardoperacoes/producao/rebritagem/rebritagem.component';
import { CalcarioComponent } from './pages/dashboardoperacoes/producao/calcario/calcario.component';
import { ProdutividadeComponent } from './pages/dashboardoperacoes/producao/produtividade/produtividade.component';

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
      { path: 'homeoperacoes',component:HomeoperacoesComponent},
      { path: 'homeoperacoes/homeproducao', component:HomeproducaoComponent },
      { path: 'homeoperacoes/homeproducao/homebritagem', component:HomebritagemComponent },
      { path: 'homeoperacoes/homeproducao/rebritagem', component:RebritagemComponent },
      { path: 'homeoperacoes/homeproducao/calcario', component:CalcarioComponent },
      { path: 'homeoperacoes/homeproducao/calcario/produtividade', component:ProdutividadeComponent },
    ],
  },
  
  //{ path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) }
];
