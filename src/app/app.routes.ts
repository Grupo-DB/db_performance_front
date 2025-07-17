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
import { FertilizanteComponent } from './pages/dashboardoperacoes/producao/fertilizante/fertilizante.component';
import { CalComponent } from './pages/dashboardoperacoes/producao/cal/cal.component';
import { ArgamassaComponent } from './pages/dashboardoperacoes/producao/argamassa/argamassa.component';
import { RaizAnaliticaComponent } from './pages/baseOrcamentaria/orcamentoBase/raiz-analitica/raiz-analitica.component';
import { HomeOrcamentoComponent } from './pages/baseOrcamentaria/orcamentoBase/home-orcamento/home-orcamento.component';
import { CentrocustopaiComponent } from './pages/baseOrcamentaria/orcamentoBase/centrocustopai/centrocustopai.component';
import { CentrocustoComponent } from './pages/baseOrcamentaria/orcamentoBase/centrocusto/centrocusto.component';
import { RaizSinteticaComponent } from './pages/baseOrcamentaria/orcamentoBase/raiz-sintetica/raiz-sintetica.component';
import { ContaContabilComponent } from './pages/baseOrcamentaria/orcamentoBase/conta-contabil/conta-contabil.component';
import { GrupoItensComponent } from './pages/baseOrcamentaria/orcamentoBase/grupo-itens/grupo-itens.component';
import { OrcamentoBaseComponent } from './pages/baseOrcamentaria/orcamentoBase/orcamento-base/orcamento-base.component';
import { RealizadoComponent } from './pages/baseOrcamentaria/orcamentoRealizado/realizado/realizado.component';
import { ProjecaoComponent } from './pages/baseOrcamentaria/dre/projecao/projecao.component';
import { ProdutoComponent } from './pages/baseOrcamentaria/dre/produto/produto.component';
import { ProjetadoComponent } from './pages/baseOrcamentaria/dre/projetado/projetado.component';
import { MapaavaliadoresComponent } from './pages/avaliacoes/mapaavaliadores/mapaavaliadores.component';
import { ComparativoavaliadoresComponent } from './pages/avaliacoes/comparativoavaliadores/comparativoavaliadores.component';
import { MapaavaliadosComponent } from './pages/avaliacoes/mapaavaliados/mapaavaliados.component';
import { EvoulucaoavaliacoesComponent } from './pages/avaliacoes/evoulucaoavaliacoes/evoulucaoavaliacoes.component';
import { RelatoriospdfComponent } from './pages/avaliacoes/relatoriospdf/relatoriospdf.component';
import { OrcamentogrupoitensComponent } from './pages/baseOrcamentaria/orcamentoGrupoItens/orcamentogrupoitens/orcamentogrupoitens.component';
import { CustoproducaoComponent } from './pages/baseOrcamentaria/dre/custoproducao/custoproducao.component';
import { IndicadorescpComponent } from './pages/baseOrcamentaria/dre/indicadorescp/indicadorescp.component';
import { CurvaComponent } from './pages/baseOrcamentaria/dre/curva/curva.component';
import { PprOrcamentoComponent } from './pages/baseOrcamentaria/dre/ppr-orcamento/ppr-orcamento.component';
import { DashControleComponent } from './pages/controleQualidade/dash-controle/dash-controle.component';
import { CalculoEnsaioComponent } from './pages/controleQualidade/calculo-ensaio/calculo-ensaio.component';
import { TipoEnsaioComponent } from './pages/controleQualidade/tipo-ensaio/tipo-ensaio.component';
import { EnsaioComponent } from './pages/controleQualidade/ensaio/ensaio.component';
import { PlanoComponent } from './pages/controleQualidade/plano/plano.component';
import { TipoAmostraComponent } from './pages/controleQualidade/tipo-amostra/tipo-amostra.component';
import { ProdutoAmostraComponent } from './pages/controleQualidade/produto-amostra/produto-amostra.component';
import { AmostraComponent } from './pages/controleQualidade/amostra/amostra.component';
import { AnaliseComponent } from './pages/controleQualidade/analise/analise.component';
import { ExpressaComponent } from './pages/controleQualidade/expressa/expressa.component';
import { VariavelComponent } from './pages/controleQualidade/variavel/variavel.component';

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
      { path: 'mapaavaliadores', component:MapaavaliadoresComponent },
      { path: 'comparativoavaliadores', component:ComparativoavaliadoresComponent },
      { path: 'mapaavaliados', component:MapaavaliadosComponent },
      { path: 'evolucaoavaliacoes', component:EvoulucaoavaliacoesComponent },
      { path: 'relatoriospdf', component:RelatoriospdfComponent },
      { path: 'homeoperacoes',component:HomeoperacoesComponent},
      { path: 'homeoperacoes/homeproducao', component:HomeproducaoComponent },
      { path: 'homeoperacoes/homeproducao/homebritagem', component:HomebritagemComponent },
      { path: 'homeoperacoes/homeproducao/rebritagem', component:RebritagemComponent },
      { path: 'homeoperacoes/homeproducao/calcario', component:CalcarioComponent },
      { path: 'homeoperacoes/homeproducao/calcario/produtividade', component:ProdutividadeComponent },
      { path: 'homeoperacoes/homeproducao/fertilizante', component:FertilizanteComponent },
      { path: 'homeoperacoes/homeproducao/cal', component:CalComponent },
      { path: 'homeoperacoes/homeproducao/argamassa', component:ArgamassaComponent },
      { path: 'baseOrcamentaria/orcamentoBase/raizAnalitica', component:RaizAnaliticaComponent },
      { path: 'baseOrcamentaria/orcamentoBase/homeOrcamento', component:HomeOrcamentoComponent },
      { path: 'baseOrcamentaria/orcamentoBase/centrocustopai', component:CentrocustopaiComponent },
      { path: 'baseOrcamentaria/orcamentoBase/centrocusto', component:CentrocustoComponent },
      { path: 'baseOrcamentaria/orcamentoBase/raizSintetica', component:RaizSinteticaComponent },
      { path: 'baseOrcamentaria/orcamentoBase/contaContabil', component:ContaContabilComponent },
      { path: 'baseOrcamentaria/orcamentoBase/grupoItens', component:GrupoItensComponent },
      { path: 'baseOrcamentaria/orcamentoBase/orcamentoBase', component:OrcamentoBaseComponent },
      { path: 'baseOrcamentaria/orcamentoRealizado/realizado', component:RealizadoComponent },
      { path: 'baseOrcamentaria/dre/projecao', component:ProjecaoComponent },
      { path: 'baseOrcamentaria/dre/produto', component:ProdutoComponent },
      { path: 'baseOrcamentaria/dre/projetado', component:ProjetadoComponent },
      { path: 'baseOrcamentaria/orcamentoGrupoItens/orcamentogrupoitens', component:OrcamentogrupoitensComponent },
      { path: 'baseOrcamentaria/dre/custoproducao', component:CustoproducaoComponent },
      { path: 'baseOrcamentaria/dre/indicadorescp', component:IndicadorescpComponent },
      { path: 'baseOrcamentaria/dre/curva', component:CurvaComponent },
      { path: 'baseOrcamentaria/dre/ppr', component:PprOrcamentoComponent },
      { path: 'controleQualidade/dashControle', component:DashControleComponent },
      { path: 'controleQualidade/calculoEnsaio', component: CalculoEnsaioComponent },
      { path: 'controleQualidade/tipoEnsaio', component: TipoEnsaioComponent },
      { path: 'controleQualidade/ensaio', component: EnsaioComponent },
      { path: 'controleQualidade/plano', component: PlanoComponent },
      { path: 'controleQualidade/tipoAmostra', component: TipoAmostraComponent },
      { path: 'controleQualidade/produtoAmostra', component: ProdutoAmostraComponent },
      { path: 'controleQualidade/amostra', component: AmostraComponent },
      { path: 'controleQualidade/analise/:id', component: AnaliseComponent },
      { path: 'controleQualidade/expressa', component: ExpressaComponent },
      { path: 'controleQualidade/variavel', component: VariavelComponent },
    ],
  },
  
  //{ path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) }
];
