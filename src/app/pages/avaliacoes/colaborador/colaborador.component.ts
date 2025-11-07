import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule, CurrencyPipe, DatePipe, formatDate } from '@angular/common';
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
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { InplaceModule } from 'primeng/inplace';
import { DrawerModule } from 'primeng/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MessageModule, Message } from 'primeng/message';
import { CdkDragPlaceholder } from "@angular/cdk/drag-drop";

interface FileWithInfo {
  file: File;
  descricao: string;
}
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
  laboratorio: FormControl;
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
  empresa_detalhes: any,
  filial_detalhes: any,
  area_detalhes: any,
  ambiente_detalhes: any,
  setor_detalhes: any,
  cargo_detalhes: any;
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
  user_id: number;
  tornar_avaliador: boolean;
  tornar_avaliado: boolean;
  tornar_gestor: boolean; // upload das imagens
  laboratorio: string; 
  

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
interface Laboratorio{
  nome: string,
}
@Component({
  selector: 'app-colaborador',
  standalone: true,
  imports: [
    ReactiveFormsModule, FormsModule, NzUploadModule, CommonModule, DialogModule, 
    InputNumberModule, InputSwitchModule, BooleanToStatusPipe, InputMaskModule, 
    CalendarModule, CheckboxModule, ConfirmDialogModule, DividerModule, FloatLabelModule, 
    TableModule, InputTextModule, InputGroupModule, InputGroupAddonModule, ButtonModule, 
    ToastModule, IconFieldModule, InputIconModule, SelectModule, ToggleSwitchModule, 
    DatePickerModule, CardModule, InplaceModule, DrawerModule, NzIconModule,
],
  providers:[
    MessageService,SetorService,ColaboradorService,ColaboradorService,AmbienteService,TipoContratoService,
    RegisterCompanyService,FilialService,AreaService,CargoService,ConfirmationService,
    DatePipe, CurrencyPipe, MessageModule, InplaceModule
  ],
  animations:[
    trigger('efeitoFade',[
            transition(':enter',[
              style({ opacity: 0 }),
              animate('2s', style({ opacity:1 }))
            ])
          ]),
          trigger('efeitoZoom', [
            transition(':enter', [
              style({ transform: 'scale(0)' }),
              animate('2s', style({ transform: 'scale(1)' })),
            ]),
          ]),
          trigger('bounceAnimation', [
            transition(':enter', [
              animate('4.5s ease-out', keyframes([
                style({ transform: 'scale(0.5)', offset: 0 }),
                style({ transform: 'scale(1.2)', offset: 0.5 }),
                style({ transform: 'scale(1)', offset: 1 }),
              ])),
            ]),
          ]),
          trigger('swipeAnimation', [
            transition(':enter', [
              style({ transform: 'translateX(-100%)' }),
              animate('1.5s ease-out', style({ transform: 'translateX(0)' })),
            ]),
            transition(':leave', [
              style({ transform: 'translateX(0)' }),
              animate('1.5s ease-out', style({ transform: 'translateX(100%)' })),
            ]),
          ]),
          trigger('swipeAnimationReverse', [
            transition(':enter', [
              style({ transform: 'translateX(100%)' }),
              animate('1.5s ease-out', style({ transform: 'translateX(0)' })),
            ]),
            transition(':leave', [
              style({ transform: 'translateX(0)' }),
              animate('1.5s ease-out', style({ transform: 'translateX(100%)' })),
            ]),
          ]),
  ],
  templateUrl: './colaborador.component.html',
  styleUrl: './colaborador.component.scss'
})
export class ColaboradorComponent implements OnInit {

  onUpload(event: any): void {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
  }
  laboratorios: Laboratorio[] | undefined;
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
  colaboradorDetalhes:any;    uploadedFilesWithInfo: FileWithInfo[] = [];
    amostraId: any;
    amostraData: any = null;
    imagensExistentes: any[] = [];
    // Propriedades para visualização de imagens
    modalImagensVisible: boolean = false;
    imagensAmostra: any[] = [];
    amostraImagensSelecionada: any = null;
    imagemAtualIndex: number = 0;
    amostraDoFormulario: any = null;

  registercolaboradorForm!: FormGroup<RegisterColaboradorForm>;
  @ViewChild('RegisterfilialForm') RegisterColaboradorForm: any;
  @ViewChild('dt1') dt1!: Table;
      modalImagens: boolean = false;
    modalVisualizar: boolean = false;

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
      tornar_gestor: new FormControl<boolean>(false),
      laboratorio: new FormControl('',),

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
    user_id:[''],
    tornar_avaliador:[''],
    tornar_avaliado:[''],
    tornar_gestor:[''],
    laboratorio:['']
,   });
   this.imgForm = new FormGroup({
    image: new FormControl('',)
   });   
 }

 hasGroup(groups: string[]): boolean {
  return this.loginService.hasAnyGroup(groups);
}

 ngOnInit(): void {
  this.laboratorios =[
    { nome:'ATM'},
    { nome:'Matriz'}
  ];
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

// Método para remover arquivo da lista antes do envio
removeFile(index: number): void {
  this.uploadedFilesWithInfo.splice(index, 1);
}

// Método para capturar mudanças na descrição durante o upload
onDescricaoInput(index: number, event: Event): void {
  const target = event.target as HTMLInputElement;
  const descricao = target.value;
  
  if (this.uploadedFilesWithInfo[index]) {
    this.uploadedFilesWithInfo[index].descricao = descricao;
  }
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
    });
  }
} 
onFilialSelecionada(filial: any): void {
  const id = filial.id;
  if (id !== undefined) {
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
    });
  }
} 
onAreaSelecionada(area: any): void {
  const id = area.id;
  if (id !== undefined) {
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
    });
  }
}
onSetorSelecionado(setor: any): void {
  const id = setor.id;
  if (id !== undefined) {
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
    });
  }
}

onAmbienteSelecionado(ambiente: any): void {
  const id = ambiente.id;
  if (id !== undefined) {
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
    });
  }
}

onCargoSelecionado(cargo: any): void {
  const id = cargo.id;
  if (id !== undefined) {
    this.cargoSelecionadoId = id;
    
  } else {
    console.error('O ID do avaliado é indefinido');
  }
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
  
  const dataAdmissao = colaborador.data_admissao
  ? new Date(colaborador.data_admissao)
  : null;

  const dataNascimento = colaborador.data_nascimento
  ? new Date(colaborador.data_nascimento)
  : null;

  const dataTrocaSetor = colaborador.data_troca_setor
  ? new Date(colaborador.data_troca_setor)
  : null;

  const dataTrocaCargo = colaborador.data_troca_cargo
  ? new Date(colaborador.data_troca_cargo)
  : null;

  const dataDemissao = colaborador.data_demissao
  ? new Date(colaborador.data_demissao)
  : null;

  this.editForm.patchValue({  
    id: colaborador.id,
    nome: colaborador.nome,
    empresa: colaborador.empresa_detalhes.id,
    filial: colaborador.filial_detalhes.id,
    area: colaborador.area_detalhes.id,
    setor: colaborador.setor_detalhes.id,
    ambiente: colaborador.ambiente_detalhes.id,
    cargo: colaborador.cargo_detalhes.id,
    tipocontrato: colaborador.tipocontrato,
    data_admissao: dataAdmissao,
    situacao: colaborador.situacao,
    genero: colaborador.genero,
    estado_civil: colaborador.estado_civil,
    data_nascimento: dataNascimento,
    data_troca_setor: dataTrocaSetor,
    data_troca_cargo: dataTrocaCargo,
    data_demissao: dataDemissao,
    email: colaborador.email,
    user:colaborador.user,
    username:colaborador.username,
    password: colaborador.password,
    salario:colaborador.salario,
    //salario: parseFloat(colaborador.salario.toString().replace(/\./g, '').replace(',', '.')),
    raca: colaborador.raca,
    instrucao: colaborador.instrucao,
    categoria: colaborador.categoria,
    dominio_id: colaborador.dominio_id,
    minerion_id: colaborador.minerion_id,
    sgg_id: colaborador.sgg_id,
    user_id: colaborador.user_id,
    tornar_avaliador:colaborador.tornar_avaliador,
    tornar_avaliado:colaborador.tornar_avaliado,
    tornar_gestor:colaborador.tornar_gestor,
    laboratorio:colaborador.laboratorio
  });
}

visualizarColaboradorDetalhes(id: number) {
  this.detalhaColaboradorVisible = true;
  this.colaboradorService.getColaborador(id).subscribe(
    data => {
      // Formate as datas e o salário
      this.formatarDatas(data);
      this.colaboradorDetalhes = data;
      data.salario = this.formatSalary(data.salario);
      console.log(data);
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
      if (typeof value === 'string' && this.isDate(value)) {
        obj[key] = this.datePipe.transform(value, 'dd/MM/yyyy');
      } else if (typeof value === 'object' && value !== null) {
        this.formatarDatas(value); // Formatar objetos aninhados recursivamente
      }
    }
  }
}

isDate(value: string): boolean {
  return !isNaN(Date.parse(value));
}

isNumber(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

formatSalary(salary: any): number {
  if (typeof salary === 'string') {
    // Substitua a vírgula por ponto
    salary = salary.replace(',', '.');
  }
  // Converte para número com 2 casas decimais
  const valorNumerico = Number(parseFloat(salary).toFixed(2));

  // Se a conversão falhar, retorna 0 para evitar erros
  return isNaN(valorNumerico) ? 0 : valorNumerico;
}

saveEdit(){
    const colaboradorId = this.editForm.value.id;
    const empresaId = this.editForm.value.empresa;
    const filialId = this.editForm.value.filial;
    const areaId = this.editForm.value.area;
    const setorId = this.editForm.value.setor;
    const ambienteId = this.editForm.value.ambiente;
    const cargoId = this.editForm.value.cargo;
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
      data_admissao: this.editForm.value.data_admissao,
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
      situacao:this.editForm.value.situacao,
      laboratorio:this.editForm.value.laboratorio
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
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Colaborador excluído com sucesso!!', life: 1000 });
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
customRequest = (item: any): any => {
  // Marca como sucesso imediatamente sem afetar a UI
  setTimeout(() => {
    item.onSuccess({}, item.file, {});
  }, 0);
  
  return { unsubscribe: () => {} };
};
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
    formData.append('tornar_avaliador',this.registercolaboradorForm.value.tornar_avaliador);
    formData.append('tornar_gestor', this.registercolaboradorForm.value.tornar_gestor)
    formData.append('laboratorio', this.registercolaboradorForm.value.laboratorio)

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

