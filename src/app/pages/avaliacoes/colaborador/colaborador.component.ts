import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FormLayoutComponent } from '../../../components/form-layout/form-layout.component';
import { PrimaryInputComponent } from '../../../components/primary-input/primary-input.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule, DecimalPipe, formatDate } from '@angular/common';
import { AmbienteService } from '../../../services/avaliacoesServices/ambientes/ambiente.service';
import { TipoContratoService } from '../../../services/avaliacoesServices/tipocontratos/resgitertipocontrato.service';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SetorService } from '../../../services/avaliacoesServices/setores/registersetor.service';
import { ColaboradorService } from '../../../services/avaliacoesServices/colaboradores/registercolaborador.service';
import { RegisterCompanyService } from '../../../services/avaliacoesServices/companys/registercompany.service';
import { FilialService } from '../../../services/avaliacoesServices/filiais/registerfilial.service';
import { AreaService } from '../../../services/avaliacoesServices/areas/registerarea.service';
import { CargoService } from '../../../services/avaliacoesServices/cargos/registercargo.service';
import { Ambiente } from '../ambiente/ambiente.component';
import { Area } from '../area/area.component';
import { Cargo } from '../cargo/cargo.component';
import { Filial } from '../../avaliacoes/filial/filial.component';
import { Empresa } from '../../avaliacoes/registercompany/registercompany.component';
import { Setor } from '../../avaliacoes/setor/setor.component';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { BooleanToStatusPipe } from '../../../services/avaliacoesServices/situacao/boolean-to-status.pipe';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { DatePipe, CurrencyPipe } from '@angular/common';

interface RegisterColaboradorForm {
  empresa: FormControl;
  filial: FormControl;
  area: FormControl;
  setor: FormControl;
  ambiente: FormControl;
  cargo: FormControl;
  tipocontrato: FormControl;
  data_admissao: FormControl;
  situacao: FormControl;
  genero: FormControl;
  estado_civil: FormControl;
  data_nascimento: FormControl;
  data_troca_setor: FormControl;
  data_troca_cargo: FormControl;
  data_demissao: FormControl;
  image: FormControl;
  nome: FormControl;
  username: FormControl;
  password: FormControl;
  email: FormControl;
  salario: FormControl;
  raca: FormControl;
  instrucao: FormControl;
  categoria: FormControl;
  tornar_avaliado: FormControl;
  tornar_avaliador: FormControl;
  tornar_gestor: FormControl;
  minerion_id: FormControl;
  dominio_id: FormControl;
  sgg_id: FormControl;
}
  interface imgForm{
    image: FormControl
  }
export interface Colaborador{
  setorNome: string;
  id: number;
  empresa: Empresa;
  filial: number;
  area: number;
  setor: Setor;
  ambiente: number;
  cargo: number;
  tipocontrato: string;
  data_admissao: Date;
  situacao: boolean;
  genero: string;
  estado_civil: string;
  data_nascimento: Date;
  data_troca_setor: Date;
  data_troca_cargo: Date;
  data_demissao: Date;
  image: ImageData;
  nome: string;
  user: string;
  username: string;
  password: string
  email: string;
  salario: number;
  raca: string;
  instrucao: string;
  categoria: string;
  dominio_id: number;
  minerion_id: number;
  sgg_id: number;
  tornar_avaliador: boolean;
  tornar_avaliado: boolean;
  tornar_gestor: boolean;

}
interface Genero{
  nome: string,
}
interface Estado_Civil{
  nome: string,
}
interface Raca{
  nome: string
}
interface Instrucao{
  nome: string
}
interface Categoria{
  nome: string
}
interface TipoContrato{
  nome: string
}
@Component({
  selector: 'app-colaborador',
  standalone: true,
  imports: [
    ReactiveFormsModule,FormsModule,NzUploadModule,CommonModule,DialogModule,InputNumberModule,InputSwitchModule,BooleanToStatusPipe,
    FormLayoutComponent,InputMaskModule,CalendarModule,CheckboxModule,ConfirmDialogModule,DividerModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule,
  ],
  providers:[
    MessageService,SetorService,ColaboradorService,ColaboradorService,AmbienteService,TipoContratoService,
    RegisterCompanyService,FilialService,AreaService,CargoService,ConfirmationService,
    DatePipe, CurrencyPipe
  ],
  templateUrl: './colaborador.component.html',
  styleUrl: './colaborador.component.scss'
})
export class ColaboradorComponent implements OnInit {

  onUpload(event: any): void {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
  }
  empresas: Empresa[]| undefined;
  filiais: Filial[]| undefined;
  areas: Area[]| undefined;
  setores: Setor[]| undefined;
  cargos: Cargo[]| undefined;
  ambientes: Ambiente[]| undefined;
  tipocontratos: TipoContrato[]| undefined;
  generos: Genero[] | undefined;
  racas: Raca[] | undefined;
  instrucoes: Instrucao[] | undefined;
  categorias: Categoria[] | undefined;
  estados_civis: Estado_Civil[] | undefined;
  colaboradores: any[] = [];
  editForm!: FormGroup;
  imgForm!: FormGroup<imgForm>;
  editFormVisible: boolean = false;
  detalhaColaboradorVisible: boolean= false;
  loading: boolean = true;
  empresaSelecionadaId: number | null = null;
  filialSelecionadaId: number | null = null;
  areaSelecionadaId: number | null = null;
  setorSelecionadoId: number | null = null;
  ambienteSelecionadoId: number | null = null;
  cargoSelecionadoId: number | null = null;
  colaboradorDetalhes:any;

  registercolaboradorForm!: FormGroup<RegisterColaboradorForm>;
  @ViewChild('RegisterfilialForm') RegisterColaboradorForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';


  constructor(
    private router: Router,
    private messageService: MessageService,
    private registercompanyService: RegisterCompanyService,
    private filialService: FilialService,
    private colaboradorService: ColaboradorService,
    private areaService: AreaService,
    private setorService: SetorService,
    private cargoService: CargoService,
    private ambienteService: AmbienteService,
    private tipocontratoService: TipoContratoService,
    private msg: NzMessageService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private loginService: LoginService,
    private datePipe: DatePipe, 
    private currencyPipe: CurrencyPipe
  )
  
  {
    this.registercolaboradorForm = new FormGroup({
      nome: new FormControl('',[Validators.required, Validators.minLength(3)]),
      empresa: new FormControl('',),
      filial: new FormControl({ value: '', disabled: true }),  // FormControl desabilitado inicialmente
      area: new FormControl({ value: '', disabled: true }),
      setor: new FormControl({ value: '', disabled: true }),
      ambiente: new FormControl({ value: '', disabled: true }),
      cargo: new FormControl({ value: '', disabled: true }),
      tipocontrato: new FormControl('',),
      data_admissao: new FormControl('',),
      situacao: new FormControl<boolean>(true),
      genero: new FormControl('',),
      estado_civil: new FormControl('',),
      data_nascimento: new FormControl('',),
      data_troca_setor: new FormControl('',),
      data_troca_cargo: new FormControl('',),
      data_demissao: new FormControl('',),
      image: new FormControl('',),
      username: new FormControl('',),
      password: new FormControl('',),
      email: new FormControl('',),
      salario: new FormControl('',),
      raca: new FormControl('',),
      instrucao: new FormControl('',),
      categoria: new FormControl('',),
      minerion_id: new FormControl('',),
      dominio_id: new FormControl('',),
      sgg_id: new FormControl('',),
      tornar_avaliado: new FormControl<boolean>(true),
      tornar_avaliador: new FormControl<boolean>(false),
      tornar_gestor: new FormControl<boolean>(false)
   }); 
   this.editForm = this.fb.group({
    id: [''],
    nome: [''],
    empresa: [''],
    filial: [''],
    area:[''],
    setor:[''],
    ambiente:[''],
    cargo:[''],
    tipocontrato:[''],
    data_admissao:[''],
    situacao:[''],
    genero:[''],
    estado_civil:[''],
    data_nascimento:[''],  
    data_troca_setor:[''],
    data_troca_cargo:[''],
    data_demissao:[''],
    user:[''],
    username:[''],
    password:[''],
    email:[''],
    salario:[''],
    raca:[''],
    instrucao:[''],
    categoria:[''],
    dominio_id:[''],
    minerion_id:[''],
    sgg_id:[''],
    tornar_avaliador:[''],
    tornar_avaliado:[''],
    tornar_gestor:['']
,   });
   this.imgForm = new FormGroup({
    image: new FormControl('',)
   });   
 }

 hasGroup(groups: string[]): boolean {
  return this.loginService.hasAnyGroup(groups);
}

 ngOnInit(): void {
  this.estados_civis = [
    { nome: 'Solteiro(a)' },
    { nome: 'Casado(a)'  },
    { nome: 'Divorciado(a)' },
    { nome: 'Separado(a)' },
    { nome: 'Víuvo(a)'},
    { nome: 'União Estável'}
];

  this.generos =[
    { nome:'Masculino'},
    { nome:'Feminino'}
  ];

  this.racas = [
    { nome:'Branca'},
    { nome:'Preta'},
    { nome:'Parda'},
    { nome:'Indígena'},
    { nome:'Branca'},
    { nome:'Não Informado'},
  ];

  this.instrucoes = [
    { nome:'Fundamental Incompleto'},
    { nome:'Fundamental Completo'},
    { nome:'Médio Incompleto'},
    { nome:'Médio Completo'},
    { nome:'Superior Incompleto'},
    { nome:'Superior Completo'},
    { nome:'Pós-Graduação'},
  ]

  this.tipocontratos = [
    { nome:'Efetivo'},
    { nome:'Experiência'},
    { nome:'Jovem Aprendiz'},
    { nome:'Estagiário'},
    { nome:'Terceirizado'},
  ]

  this.categorias = [
    { nome:'Horista'},
    { nome:'Mensalista'},
  ]

this.loading = false;

  this.colaboradorService.getColaboradores().subscribe(
    (colaboradores: Colaborador[]) => {
      this.colaboradores = colaboradores;
    },
    error => {
      console.error('Error fetching users:', error);
    }
  );

  this.filialService.getFiliais().subscribe(
    filiais => {
      this.filiais = filiais;
       
    },
    error => {
      console.error('Error fetching users:', error);
    }
  );

  this.cargoService.getCargos().subscribe(
    cargos => {
      this.cargos = cargos;
      this.mapCargos();
    },
    error => {
      console.error('Error fetching users:', error);
    }
  );

  this.registercompanyService.getCompanys().subscribe(
    empresas => {
      this.empresas = empresas;
      this.mapEmpresas();
    },
    error => {
      console.error('Error fetching users:',error);
    }
  );

  this.setorService.getSetores().subscribe(
    setores => {
      this.setores = setores;
      this.mapSetores();
    },
    error => {
      console.error('Error fetching users:',error);
    }
  );
  this.areaService.getAreas().subscribe(
    areas => {
      this.areas = areas;
      //this.mapAreas();
    },
    error => {
      console.error('Error fetching users:',error);
    }
  );
  this.ambienteService.getAmbientes().subscribe(
    ambientes => {
      this.ambientes = ambientes;
      this.mapAmbientes();
    },
    error =>{
      console.error('Error fetching users:',error);
    }
  )
 }

 mapEmpresas() {
  this.colaboradores.forEach(colaborador => {
    const empresa = this.empresas?.find(empresa => empresa.id === colaborador.empresa);
    if (empresa) {
      colaborador.empresaNome = empresa.nome;
    }
  });
  this.loading = false;
}
mapFiliais() {
  this.colaboradores.forEach(colaborador => {
    const filial = this.filiais?.find(filial => filial.id === colaborador.filial);
    if (filial) {
      colaborador.filialNome = filial.nome;
    }
  });
  this.loading = false;
}
mapAreas() {
  this.colaboradores.forEach(colaborador => {
    const area = this.areas?.find(area => area.id === colaborador.area);
    if (area) {
      colaborador.areaNome = area.nome;
    }
  });
  this.loading = false;
}
mapSetores() {
  this.colaboradores.forEach(colaborador => {
    const setor = this.setores?.find(setor => setor.id === colaborador.setor);
    if (setor) {
      colaborador.setorNome = setor.nome;
    }
  });
  this.loading = false;
}
mapAmbientes() {
  this.colaboradores.forEach(colaborador => {
    const ambiente = this.ambientes?.find(ambiente => ambiente.id === colaborador.ambiente);
    if (ambiente) {
      colaborador.ambienteNome = ambiente.nome;
    }
  });
  this.loading = false;
}
mapCargos() {
  this.colaboradores.forEach(colaborador => {
    const cargo = this.cargos?.find(cargo => cargo.id === colaborador.cargo);
    if (cargo) {
      colaborador.cargoNome = cargo.nome;
    }
  });
  this.loading = false;
}


getNomeEmpresa(id: number): string {
  const empresa = this.empresas?.find(emp => emp.id === id);
  return empresa ? empresa.nome : 'Empresa não encontrada';
}
getNomeFilial(id: number): string {
  const filial = this.filiais?.find(fil => fil.id === id);
  return filial ? filial.nome : 'Filial não encontrada';
}
getNomeArea(id: number): string {
  const area = this.areas?.find(are => are.id === id);
  return area ? area.nome : 'Area não encontrada';
}
getNomeSetor(id: number): string {
  const setor = this.setores?.find(setor => setor.id === id);
  return setor ? setor.nome : 'Setor não encontrada';
}
getNomeAmbiente(id: number): string {
  const ambiente = this.ambientes?.find(ambiente => ambiente.id === id);
  return ambiente ? ambiente.nome : 'Ambiente não encontrada';
}
getNomeCargo(id: number): string {
  const cargo = this.cargos?.find(carg => carg.id === id);
  return cargo ? cargo.nome : 'Cargo não encontrada';
}

onFileChange(event: any, form: FormGroup) {
  if (event.target.files.length > 0) {
    const file = event.target.files[0];
    form.patchValue({
      image: file
    });
  }
}
handleFileChange(event: any) {
  this.onFileChange(event, this.registercolaboradorForm);
  this.onFileChange(event, this.imgForm);
}
handleChange({ file, fileList }: NzUploadChangeParam): void {
  const status = file.status;
  if (status !== 'uploading') {
    console.log(file, fileList);
  }
  if (status === 'done') {
    this.msg.success(`${file.name} file uploaded successfully.`);
  } else if (status === 'error') {
    this.msg.error(`${file.name} file upload failed.`);
  }
}

onEmpresaSelecionada(empresa: any): void {
  const id = empresa.id;
  if (id !== undefined) {
    console.log('Empresa selecionada ID:', id); // Log para depuração
    this.empresaSelecionadaId = id;
    this.filiaisByEmpresa();
  } else {
    console.error('O ID do avaliado é indefinido');
  }
}
filiaisByEmpresa(): void {
  const filialControl = this.registercolaboradorForm.get('filial');
  if (filialControl) {
    filialControl.disable();
  }
  if (this.empresaSelecionadaId !== null) {
    this.filiais = [];
    this.filialService.getFiliaisByEmpresa(this.empresaSelecionadaId).subscribe(data => {
      this.filiais = data;
      if (filialControl) {
        filialControl.enable();
      }
      console.log('Filiais carregadas:', this.filiais); // Log para depuração
    });
  }
} 
onFilialSelecionada(filial: any): void {
  const id = filial.id;
  if (id !== undefined) {
    console.log('Filial selecionada ID:', id); // Log para depuração
    this.filialSelecionadaId = id;
    this.areasByFilial();
  } else {
    console.error('O ID do avaliado é indefinido');
  }
}
areasByFilial(): void {
  const areaControl = this.registercolaboradorForm.get('area');
  if (areaControl) {
    areaControl.disable();
  }
  if (this.filialSelecionadaId !== null) {
    this.areaService.getAreasByFilial(this.filialSelecionadaId).subscribe(data => {
      this.areas = data;
      if (areaControl) {
        areaControl.enable();
      }
      console.log('Areas carregadas:', this.areas); // Log para depuração
    });
  }
} 
onAreaSelecionada(area: any): void {
  const id = area.id;
  if (id !== undefined) {
    console.log('Area selecionada ID:', id); // Log para depuração
    this.areaSelecionadaId = id;
    this.setoresByArea();
  } else {
    console.error('O ID do avaliado é indefinido');
  }
}
setoresByArea(): void {
  const setorControl = this.registercolaboradorForm.get('setor');
  if (setorControl) {
    setorControl.disable();
  }
  if (this.areaSelecionadaId !== null) {
    this.setorService.getSetorByArea(this.areaSelecionadaId).subscribe(data => {
      this.setores = data;
      if (setorControl) {
        setorControl.enable();
      }
      console.log('Setores carregadas:', this.areas); // Log para depuração
    });
  }
}
onSetorSelecionado(setor: any): void {
  const id = setor.id;
  if (id !== undefined) {
    console.log('Ambiente selecionado ID:', id); // Log para depuração
    this.setorSelecionadoId = id;
    this.ambientesBySetor();
  } else {
    console.error('O ID do avaliado é indefinido');
  }
}

ambientesBySetor(): void {
  const ambienteControl = this.registercolaboradorForm.get('ambiente');
  if (ambienteControl) {
    ambienteControl.disable();
  }
  if (this.setorSelecionadoId !== null) {
    this.ambienteService.getAmbientesBySetor(this.setorSelecionadoId).subscribe(data => {
      this.ambientes = data;
      if (ambienteControl) {
        ambienteControl.enable();
      }
      console.log('Ambientes carregadas:', this.areas); // Log para depuração
    });
  }
}

onAmbienteSelecionado(ambiente: any): void {
  const id = ambiente.id;
  if (id !== undefined) {
    console.log('Ambiente selecionado ID:', id); // Log para depuração
    this.ambienteSelecionadoId = id;
    this.cargosByAmbiente();
  } else {
    console.error('O ID do avaliado é indefinido');
  }
}
cargosByAmbiente(): void {
  const cargoControl = this.registercolaboradorForm.get('cargo');
  if (cargoControl) {
    cargoControl.disable();
  }
  if (this.ambienteSelecionadoId !== null) {
    this.cargoService.getCargosByAmbientes(this.ambienteSelecionadoId).subscribe(data => {
      this.cargos = data;
      if (cargoControl) {
        cargoControl.enable();
      }
      console.log('Setores carregadas:', this.areas); // Log para depuração
    });
  }
}

onCargoSelecionado(cargo: any): void {
  const id = cargo.id;
  if (id !== undefined) {
    console.log('Cargo selecionado ID:', id); // Log para depuração
    this.cargoSelecionadoId = id;
    
  } else {
    console.error('O ID do avaliado é indefinido');
  }
}

 
clear(table: Table) {
  table.clear();
}

clearForm() {
this.registercolaboradorForm.reset();
}

filterTable() {
this.dt1.filterGlobal(this.inputValue, 'contains');
}
cleareditForm() {
  this.editForm.reset();
}

abrirModalEdicao(colaborador: Colaborador) {
  this.editFormVisible = true;
  this.editForm.patchValue({  
    id: colaborador.id,
    nome: colaborador.nome,
    empresa: colaborador.empresa,
    filial: colaborador.filial,
    area: colaborador.area,
    setor: colaborador.setor,
    ambiente: colaborador.ambiente,
    cargo: colaborador.cargo,
    tipocontrato: colaborador.tipocontrato,
    data_admissao: colaborador.data_admissao,
    situacao: colaborador.situacao,
    genero: colaborador.genero,
    estado_civil: colaborador.estado_civil,
    data_nascimento: colaborador.data_nascimento,
    data_troca_setor: colaborador.data_troca_setor,
    data_troca_cargo: colaborador.data_troca_cargo,
    data_demissao: colaborador.data_demissao,
    email: colaborador.email,
    user:colaborador.user,
    username:colaborador.username,
    password: colaborador.password,
    salario: colaborador.salario,
    raca: colaborador.raca,
    instrucao: colaborador.instrucao,
    categoria: colaborador.categoria,
    dominio_id: colaborador.dominio_id,
    minerion_id: colaborador.minerion_id,
    sgg_id: colaborador.sgg_id,
    tornar_avaliador:colaborador.tornar_avaliador,
    tornar_avaliado:colaborador.tornar_avaliado,
    tornar_gestor:colaborador.tornar_gestor
  });
}

visualizarColaboradorDetalhes(id: number) {
  this.detalhaColaboradorVisible = true;
  this.colaboradorService.getColaborador(id).subscribe(
    data => {
      // Formate as datas e o salário
      this.formatarDatas(data);
      if (data.salario) {
        data.salario = this.currencyPipe.transform(data.salario, 'BRL', 'symbol', '1.2-2');
      }
      this.colaboradorDetalhes = data;
    },
    error => {
      console.error('Erro ao buscar detalhes do colaborador:', error);
    }
  );
}

formatarDatas(obj: any) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === 'string' && value.includes('T')) {
        obj[key] = this.datePipe.transform(value, 'dd/MM/yyyy');
      } else if (typeof value === 'object' && value !== null) {
        this.formatarDatas(value); // Formatar objetos aninhados recursivamente
      }
    }
  }
}

saveEdit(){
    const colaboradorId = this.editForm.value.id;
    const empresaId = this.editForm.value.empresa.id;
    const filialId = this.editForm.value.filial.id;
    const areaId = this.editForm.value.area.id;
    const setorId = this.editForm.value.setor.id;
    const ambienteId = this.editForm.value.ambiente.id;
    const cargoId = this.editForm.value.cargo.id;
    const tipocontratoNome = this.editForm.value.tipocontrato.nome;
    const generoNome = this.editForm.value.genero.nome;
    const estado_civilNome = this.editForm.value.estado_civil.nome;
    const racaNome = this.editForm.value.raca.nome;
    const instrucaoNome = this.editForm.value.instrucao.nome;
    const categoriaNome = this.editForm.value.categoria.nome; 
    const dadosAtualizados: Partial<Colaborador> = {
      nome: this.editForm.value.nome,
      empresa: empresaId,
      filial: filialId,
      area: areaId,
      setor: setorId,
      ambiente: ambienteId,
      cargo: cargoId,
      tipocontrato: tipocontratoNome,
      genero: generoNome,
      estado_civil: estado_civilNome,
      data_nascimento: this.editForm.value.data_nascimento,
      data_troca_setor: this.editForm.value.data_troca_setor,
      data_troca_cargo: this.editForm.value.data_troca_cargo,
      data_demissao: this.editForm.value.data_demissao,
      username: this.editForm.value.username,
      password: this.editForm.value.password,
      email: this.editForm.value.email,
      salario: this.editForm.value.salario,
      raca: racaNome,
      instrucao: instrucaoNome,
      categoria: categoriaNome,
      dominio_id: this.editForm.value.dominio_id,
      minerion_id: this.editForm.value.minerion_id,
      sgg_id: this.editForm.value.sgg_id,
      tornar_avaliador: this.editForm.value.tornar_avaliador,
      tornar_avaliado: this.editForm.value.tornar_avaliado,
      tornar_gestor: this.editForm.value.tornar_gestor,
      situacao:this.editForm.value.situacao
    };
    
  

    this.colaboradorService.editColaborador(colaboradorId, dadosAtualizados).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Colaborador atualizado com sucesso!' });
        setTimeout(() => {
         window.location.reload(); // Atualiza a página após a exclusão
        }, 1000); // Tempo em milissegundos (1 segundo de atraso)
      },
      error: (err) => {
        console.error('Login error:', err); 
      
        if (err.status === 401) {
          this.messageService.add({ severity: 'error', summary: 'Timeout!', detail: 'Sessão expirada! Por favor faça o login com suas credenciais novamente.' });
        } else if (err.status === 403) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Acesso negado! Você não tem autorização para realizar essa operação.' });
        } else if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Falha!', detail: 'Erro interno, comunicar o administrador do sistema.' });
        } 
    }
    });

}
updateImage() {
  if(this.imgForm.valid) {
    const colaboradorId = this.editForm.value.id;
    const formDataImg = new FormData();
    const image = this.imgForm.get('image')?.value; // Use 'editForm' em vez de 'registercolaboradorForm'
    if (image) {
      formDataImg.append('image', image);
    }
      this.colaboradorService.updateColaboradorImage(colaboradorId, formDataImg).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Imagem atualizada com sucesso!' });
          setTimeout(() => {
            window.location.reload(); // Atualiza a página após a atualização
          }, 1000); // Tempo em milissegundos (2 segundos de atraso)
        },
        error: (err) => {
          if (err.status === 403) {
            this.messageService.add({ severity: 'error', summary: 'Erro de autorização!', detail: 'Você não tem permissão para realizar esta ação.', life: 2000 });
          } 
        }
      });
    }
}

excluirColaborador(id: number) {
  this.confirmationService.confirm({
    message: 'Tem certeza que deseja excluir este Colaborador?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    acceptLabel: 'Sim',
    rejectLabel: 'Cancelar',
    acceptButtonStyleClass: 'p-button-info',
    rejectButtonStyleClass: 'p-button-secondary',
    accept: () => {
      this.colaboradorService.deleteColaborador(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Filial excluída com sucesso!!', life: 1000 });
          setTimeout(() => {
            window.location.reload(); // Atualiza a página após a exclusão
          }, 1000); // Tempo em milissegundos (1 segundo de atraso)
        },
        error: (err) => {
          if (err.status === 403) {
            this.messageService.add({ severity: 'error', summary: 'Erro de autorização!', detail: 'Você não tem permissão para realizar esta ação.', life: 2000 });
          } 
        }
      });
    },
    reject: () => {
      this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Exclusão Cancelada', life: 1000 });
    }
  });
}

submit() {
  if (this.registercolaboradorForm.valid) {
    const empresaId = this.registercolaboradorForm.value.empresa.id;
    const filialId = this.registercolaboradorForm.value.filial.id;
    const areaId = this.registercolaboradorForm.value.area.id;
    const setorId = this.registercolaboradorForm.value.setor.id;
    const cargoId = this.registercolaboradorForm.value.cargo.id;
    const ambienteId = this.registercolaboradorForm.value.ambiente.id;
    const tipocontratoNome = this.registercolaboradorForm.value.tipocontrato.nome;
    const generoNome = this.registercolaboradorForm.value.genero.nome;
    const estado_civilNome = this.registercolaboradorForm.value.estado_civil.nome;
    const racaNome = this.registercolaboradorForm.value.raca.nome;
    const instrucaoNome = this.registercolaboradorForm.value.instrucao.nome;
    const categoriaNome = this.registercolaboradorForm.value.categoria.nome;

    const formData = new FormData();

    let situacao = this.registercolaboradorForm.value.situacao;

// Verifique explicitamente se o valor é null ou undefined
    if (situacao === null || situacao === undefined) {
    situacao = 0; // ou qualquer valor padrão que você queira
}

    // Verificar e formatar a data de admissão
    let dataFormatadaad = '';
    const dataAdmissaoValue = this.registercolaboradorForm.value.data_admissao;
    if (dataAdmissaoValue instanceof Date && !isNaN(dataAdmissaoValue.getTime())) {
      dataFormatadaad = formatDate(dataAdmissaoValue, 'yyyy-MM-dd', 'en-US');
    }

    // Verificar e formatar a data de nascimento
    let dataFormatadanasc = '';
    const dataNascimentoValue = this.registercolaboradorForm.value.data_nascimento;
    if (dataNascimentoValue instanceof Date && !isNaN(dataNascimentoValue.getTime())) {
      dataFormatadanasc = formatDate(dataNascimentoValue, 'yyyy-MM-dd', 'en-US');
    }

    // Verificar e formatar a data de troca de setor
    let dataFormatadast = '';
    const dataTrocaSetorValue = this.registercolaboradorForm.value.data_troca_setor;
    if (dataTrocaSetorValue instanceof Date && !isNaN(dataTrocaSetorValue.getTime())) {
      dataFormatadast = formatDate(dataTrocaSetorValue, 'yyyy-MM-dd', 'en-US');
    }

    // Verificar e formatar a data de troca de cargo
    let dataFormatadatc = '';
    const dataTrocaCargoValue = this.registercolaboradorForm.value.data_troca_cargo;
    if (dataTrocaCargoValue instanceof Date && !isNaN(dataTrocaCargoValue.getTime())) {
      dataFormatadatc = formatDate(dataTrocaCargoValue, 'yyyy-MM-dd', 'en-US');
    }

    // Verificar e formatar a data de demissão
    let dataFormatadadm = '';
    const dataDemissaoValue = this.registercolaboradorForm.value.data_demissao;
    if (dataDemissaoValue instanceof Date && !isNaN(dataDemissaoValue.getTime())) {
      dataFormatadadm = formatDate(dataDemissaoValue, 'yyyy-MM-dd', 'en-US');
    }


    formData.append('nome', this.registercolaboradorForm.value.nome);
    formData.append('empresa', empresaId);
    formData.append('filial', filialId);
    formData.append('area', areaId);
    formData.append('setor', setorId);
    formData.append('ambiente', ambienteId);
    formData.append('cargo', cargoId);
    formData.append('tipocontrato', tipocontratoNome || null);
    formData.append('data_admissao', dataFormatadaad || '');
    formData.append('situacao', situacao.toString());
    formData.append('genero', generoNome || null)
    formData.append('estado_civil', estado_civilNome || null);
    formData.append('data_nascimento', dataFormatadanasc || '');
    formData.append('data_troca_setor', dataFormatadast || '');
    formData.append('data_troca_cargo', dataFormatadatc || '');
    formData.append('data_troca_demissao', dataFormatadadm || '');
    formData.append('username', this.registercolaboradorForm.value.username);
    formData.append('password', this.registercolaboradorForm.value.password);
    formData.append('email', this.registercolaboradorForm.value.email);
    formData.append('salario', this.registercolaboradorForm.value.salario);
    formData.append('raca', racaNome || null);
    formData.append('instrucao', instrucaoNome || null);
    formData.append('categoria', categoriaNome || null);
    formData.append('minerion_id',this.registercolaboradorForm.value.minerion_id);
    formData.append('dominio_id',this.registercolaboradorForm.value.dominio_id);
    formData.append('sgg_id',this.registercolaboradorForm.value.sgg_id);
    formData.append('tornar_avaliado', this.registercolaboradorForm.value.tornar_avaliado);
    formData.append('tornar_avaliador', this.registercolaboradorForm.value.tornar_avaliador);
    formData.append('tornar_gestor', this.registercolaboradorForm.value.tornar_gestor)

    // Add a imagem ao FormData
    const image = this.registercolaboradorForm.get('image')?.value;
    if (image) {
      formData.append('image', image);
    }

    this.colaboradorService.registercolaborador(formData).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Colaborador registrado com sucesso!' });
        setTimeout(() => {
          window.location.reload(); // Atualiza a página após o registro
       }, 1000); // Tempo em milissegundos (1 segundo de atraso)
      },
      error: (err) => {
        console.error('Login error:', err); 
      
        if (err.status === 401) {
          this.messageService.add({ severity: 'error', summary: 'Timeout!', detail: 'Sessão expirada! Por favor faça o login com suas credenciais novamente.' });
        } else if (err.status === 403) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Acesso negado! Você não tem autorização para realizar essa operação.' });
        } else if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro no login. Por favor, tente novamente.' });
        } 
      }
    });
  }
}
}

