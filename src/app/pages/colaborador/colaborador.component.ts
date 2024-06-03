
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
import { FormLayoutComponent } from '../../components/form-layout/form-layout.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GetAreaService } from '../../services/areas/getarea.service';
import { GetCargoService } from '../../services/cargos/getcargo.service';
import { GetCompanyService } from '../../services/companys/getcompany.service';
import { GetFilialService } from '../../services/filiais/getfilial.service';
import { GetSetorService } from '../../services/setores/get-setor.service';
import { GetTipoContratoService } from '../../services/tipocontratos/gettipocontrato.service';
import { CalendarModule } from 'primeng/calendar';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule, formatDate } from '@angular/common';
import { GetColaboradorService } from '../../services/colaboradores/get-colaborador.service';
import { AmbienteService } from '../../services/ambientes/ambiente.service';
import { TipoContratoService } from '../../services/tipocontratos/resgitertipocontrato.service';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SetorService } from '../../services/setores/registersetor.service';
import { ColaboradorService } from '../../services/colaboradores/registercolaborador.service';
import { RegisterCompanyService } from '../../services/companys/registercompany.service';
import { FilialService } from '../../services/filiais/registerfilial.service';
import { AreaService } from '../../services/areas/registerarea.service';
import { CargoService } from '../../services/cargos/registercargo.service';
import { Ambiente } from '../ambiente/ambiente.component';
import { Area } from '../area/area.component';
import { Cargo } from '../cargo/cargo.component';
import { Filial } from '../filial/filial.component';
import { Empresa } from '../registercompany/registercompany.component';
import { Setor } from '../setor/setor.component';
import { TipoContrato } from '../tipocontrato/tipocontrato.component';
import { switchMap, map, forkJoin } from 'rxjs';
import { DividerModule } from 'primeng/divider';

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

  tornar_avaliado: FormControl;
  tornar_avaliador: FormControl;
}
  interface imgForm{
    image: FormControl
  }
export interface Colaborador{
  id: number;
  empresa: Empresa;
  filial: number;
  area: number;
  setor: number;
  ambiente: number;
  cargo: number;
  tipocontrato: number;
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
  username: string;
  password: string
  tornar_avaliador: boolean;
  tornar_avaliado: boolean;
}
interface Genero{
  nome: string,
}
interface Estado_Civil{
  nome: string,
}
@Component({
  selector: 'app-colaborador',
  standalone: true,
  imports: [
    ReactiveFormsModule,FormsModule,NzUploadModule,CommonModule,DialogModule,
    FormLayoutComponent,InputMaskModule,CalendarModule,CheckboxModule,ConfirmDialogModule,DividerModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule,
  ],
  providers:[
    MessageService,SetorService,ColaboradorService,ColaboradorService,AmbienteService,TipoContratoService,
    RegisterCompanyService,FilialService,AreaService,CargoService,ConfirmationService
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
  estados_civis: Estado_Civil[] | undefined;
  colaboradores: any[] = [];
  editForm!: FormGroup;
  imgForm!: FormGroup<imgForm>;
  editFormVisible: boolean = false;
  
  empresaSelecionadaId: number | null = null;
  filialSelecionadaId: number | null = null;
  areaSelecionadaId: number | null = null;
  setorSelecionadoId: number | null = null;
  ambienteSelecionadoId: number | null = null;
  cargoSelecionadoId: number | null = null;

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
  )
  
  {
    this.registercolaboradorForm = new FormGroup({
      nome: new FormControl('',[Validators.required, Validators.minLength(3)]),
      empresa: new FormControl('',),
      filial: new FormControl('',),
      area: new FormControl('',),
      setor: new FormControl('',),
      ambiente: new FormControl('',),
      cargo: new FormControl('',),
      tipocontrato: new FormControl('',),
      data_admissao: new FormControl('',),
      situacao: new FormControl('',),
      genero: new FormControl('',),
      estado_civil: new FormControl('',),
      data_nascimento: new FormControl('',),
      data_troca_setor: new FormControl('',),
      data_troca_cargo: new FormControl('',),
      data_demissao: new FormControl('',),
      image: new FormControl('',),
      username: new FormControl('',),
      password: new FormControl('',),
      tornar_avaliado: new FormControl('',),
      tornar_avaliador: new FormControl('',)
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
    username:[''],
    password:[''],
    tornar_avaliador:[''],
    tornar_avaliado:['']
,   });
   this.imgForm = new FormGroup({
    image: new FormControl('',)
   });   
 }

 ngOnInit(): void {
  this.estados_civis = [
    { nome: 'Solteiro(a)' },
    { nome: 'Casado(a)'  },
    { nome: 'Divorciado(a)' },
    { nome: 'Separado(a)' },
    { nome: 'Viuvo(a)'}
];

this.generos =[
  { nome:'Masculino'},
  { nome:'Feminino'}
];
 
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

  this.tipocontratoService.getTiposContratos().subscribe(
    tipocontratos => {
      this.tipocontratos = tipocontratos;
    },
    error => {
      console.error('Error fetching users:', error);
    }
  );

  this.cargoService.getCargos().subscribe(
    cargos => {
      this.cargos = cargos;
    },
    error => {
      console.error('Error fetching users:', error);
    }
  );

  this.registercompanyService.getCompanys().subscribe(
    empresas => {
      this.empresas = empresas;
    },
    error => {
      console.error('Error fetching users:',error);
    }
  );

  this.setorService.getSetores().subscribe(
    setores => {
      this.setores = setores;
    },
    error => {
      console.error('Error fetching users:',error);
    }
  );
  this.areaService.getAreas().subscribe(
    areas => {
      this.areas = areas;
    },
    error => {
      console.error('Error fetching users:',error);
    }
  );
  this.ambienteService.getAmbientes().subscribe(
    ambientes => {
      this.ambientes = ambientes;
    },
    error =>{
      console.error('Error fetching users:',error);
    }
  )
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
  const setor = this.setores?.find(set => set.id === id);
  return setor ? setor.nome : 'Setor não encontrada';
}
getNomeAmbiente(id: number): string {
  const ambiente = this.ambientes?.find(amb => amb.id === id);
  return ambiente ? ambiente.nome : 'Ambiente não encontrada';
}
getNomeCargo(id: number): string {
  const cargo = this.cargos?.find(carg => carg.id === id);
  return cargo ? cargo.nome : 'Cargo não encontrada';
}
getNomeTipoContrato(id: number): string {
  const tipocontrato = this.tipocontratos?.find(tipocontrato => tipocontrato.id === id);
  return tipocontrato ? tipocontrato.nome : 'Tipo de contrato não encontrado';
}
// onFileChange(event:any) {
    
//   if (event.target.files.length > 0) {
//     const file = event.target.files[0];
//     this.registercolaboradorForm.patchValue({
//       image: file
//     });
//   }
// }




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
  if (this.empresaSelecionadaId !== null) {
    this.filialService.getFiliaisByEmpresa(this.empresaSelecionadaId).subscribe(data => {
      this.filiais = data;
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
  if (this.filialSelecionadaId !== null) {
    this.areaService.getAreasByFilial(this.filialSelecionadaId).subscribe(data => {
      this.areas = data;
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
  if (this.areaSelecionadaId !== null) {
    this.setorService.getSetorByArea(this.areaSelecionadaId).subscribe(data => {
      this.setores = data;
      console.log('Setores carregadas:', this.areas); // Log para depuração
    });
  }
}

onSetorSelecionado(setor: any): void {
  const id = setor.id;
  if (id !== undefined) {
    console.log('Setor selecionado ID:', id); // Log para depuração
    this.setorSelecionadoId = id;
    this.ambientesBySetor();
  } else {
    console.error('O ID do avaliado é indefinido');
  }
}
ambientesBySetor(): void {
  if (this.setorSelecionadoId !== null) {
    this.ambienteService.getAmbientesBySetor(this.setorSelecionadoId).subscribe(data => {
      this.ambientes = data;
      console.log('Setores carregadas:', this.areas); // Log para depuração
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
  if (this.ambienteSelecionadoId !== null) {
    this.cargoService.getCargosByAmbiente(this.ambienteSelecionadoId).subscribe(data => {
      this.cargos = data;
      console.log('Setores carregadas:', this.areas); // Log para depuração
    });
  }
}

onCargoSelecionado(cargo: any): void {
  const id = cargo.id;
  if (id !== undefined) {
    console.log('Cargo selecionado ID:', id); // Log para depuração
    this.cargoSelecionadoId = id;
    this.tiposContratosByCargo();
  } else {
    console.error('O ID do avaliado é indefinido');
  }
}
tiposContratosByCargo(): void {
  if (this.cargoSelecionadoId !== null) {
    this.tipocontratoService.getTiposContratosByCargo(this.cargoSelecionadoId).subscribe(data => {
      this.tipocontratos = data;
      console.log('Setores carregadas:', this.areas); // Log para depuração
    });
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
    username:colaborador.username,
    password: colaborador.password,
    tornar_avaliador:colaborador.tornar_avaliador,
    tornar_avaliado:colaborador.tornar_avaliado
  });
}
saveEdit(){
    const colaboradorId = this.editForm.value.id;
    const empresaId = this.editForm.value.empresa.id;
    const filialId = this.editForm.value.filial.id;
    const areaId = this.editForm.value.area.id;
    const setorId = this.editForm.value.setor.id;
    const ambienteId = this.editForm.value.ambiente.id;
    const cargoId = this.editForm.value.cargo.id;
    const tipocontratoId = this.editForm.value.tipocontrato.id;
    const generoNome = this.editForm.value.genero.nome;
    const estado_civilNome = this.editForm.value.estado_civil.nome; 
    const dadosAtualizados: Partial<Colaborador> = {
      nome: this.editForm.value.nome,
      empresa: empresaId,
      filial: filialId,
      area: areaId,
      setor: setorId,
      ambiente: ambienteId,
      cargo: cargoId,
      tipocontrato: tipocontratoId,
      genero: generoNome,
      estado_civil: estado_civilNome,
      data_nascimento: this.editForm.value.data_nascimento,
      data_troca_setor: this.editForm.value.data_troca_setor,
      data_troca_cargo: this.editForm.value.data_troca_cargo,
      data_demissao: this.editForm.value.data_demissao,
      username: this.editForm.value.username,
      password: this.editForm.value.password,
      tornar_avaliador: this.editForm.value.tornar_avaliador,
      tornar_avaliado: this.editForm.value.tornar_avaliado
    };
    
  

    this.colaboradorService.editColaborador(colaboradorId, dadosAtualizados).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Colaborador atualizado com sucesso!' });
        //setTimeout(() => {
         //window.location.reload(); // Atualiza a página após a exclusão
        //}, 2000); // Tempo em milissegundos (1 segundo de atraso)
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro ao atualizar o colaborador.' });
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
          }, 2000); // Tempo em milissegundos (2 segundos de atraso)
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro ao atualizar a imagem.' });
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
    acceptButtonStyleClass: 'p-button-success',
    rejectButtonStyleClass: 'p-button-danger',
    accept: () => {
      this.colaboradorService.deleteColaborador(id).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Colaborador excluído com sucesso!',life:4000 });
        setTimeout(() => {
          window.location.reload(); // Atualiza a página após a exclusão
        }, 2000); // Tempo em milissegundos (1 segundo de atraso)
      });
    },
    reject: () => {
      this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Exclusão Cancelada', life: 3000 });
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
    const tipocontratoId = this.registercolaboradorForm.value.tipocontrato.id;
    const generoNome = this.registercolaboradorForm.value.genero.nome;
    const estado_civilNome = this.registercolaboradorForm.value.estado_civil.nome;
    const formData = new FormData();

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
    formData.append('tipocontrato', tipocontratoId);
    formData.append('data_admissao', dataFormatadaad || '');
    formData.append('situacao', this.registercolaboradorForm.value.situacao || null);
    formData.append('genero', generoNome || null)
    formData.append('estado_civil', estado_civilNome || null);
    formData.append('data_nascimento', dataFormatadanasc || '');
    formData.append('data_troca_setor', dataFormatadast || '');
    formData.append('data_troca_cargo', dataFormatadatc || '');
    formData.append('data_troca_demissao', dataFormatadadm || '');
    formData.append('username', this.registercolaboradorForm.value.username);
    formData.append('password', this.registercolaboradorForm.value.password);
    formData.append('tornar_avaliado', this.registercolaboradorForm.value.tornar_avaliado);
    formData.append('tornar_avaliador', this.registercolaboradorForm.value.tornar_avaliador)
    // if (this.registercolaboradorForm.value.user) {
    //   formData.append('user.username', this.registercolaboradorForm.value.user.username);
    //   formData.append('user.password', this.registercolaboradorForm.value.user.password);
    // }

    // Add a imagem ao FormData
    const image = this.registercolaboradorForm.get('image')?.value;
    if (image) {
      formData.append('image', image);
    }

    this.colaboradorService.registercolaborador(formData).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Colaborador registrado com sucesso!' });
        //setTimeout(() => {
          //window.location.reload(); // Atualiza a página após o registro
       // }, 1000); // Tempo em milissegundos (1 segundo de atraso)
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }), 
    })
  }
}
}

