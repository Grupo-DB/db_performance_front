
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MessageService } from 'primeng/api';
import { GetAreaService } from '../../services/areas/getarea.service';
import { GetCargoService } from '../../services/cargos/getcargo.service';
import { GetCompanyService } from '../../services/companys/getcompany.service';
import { GetFilialService } from '../../services/filiais/getfilial.service';
import { GetSetorService } from '../../services/setores/get-setor.service';
import { RegisterTipoContratoService } from '../../services/tipocontratos/resgitertipocontrato.service';
import { GetTipoContratoService } from '../../services/tipocontratos/gettipocontrato.service';
import { RegisterColaboradorService } from '../../services/colaboradores/registercolaborador.service';
import { CalendarModule } from 'primeng/calendar';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { format } from 'date-fns';
import { CheckboxModule } from 'primeng/checkbox';
import { formatDate } from '@angular/common';
import { GetColaboradorService } from '../../services/colaboradores/get-colaborador.service';

interface RegisterColaboradorForm{
  empresa: FormControl,
  filial: FormControl,
  area: FormControl,
  setor: FormControl,
  cargo: FormControl,
  tipocontrato: FormControl,
  data_admissao:FormControl,
  situacao: FormControl,
  genero: FormControl,
  estado_civil: FormControl,
  data_nascimento: FormControl,
  data_troca_setor: FormControl,
  data_troca_cargo: FormControl,
  data_demissao: FormControl,
  image: FormControl

  nome: FormControl
}
interface Company{
  nome: string
}
interface Filial{
  nome: string
}
interface Area{
  nome: string
}
interface Setor{
  nome: string
}
interface Cargo{
  nome: string
}
interface TipoContrato{
  nome: string
}
interface Genero{
  nome: string,
  
}
interface Estado_Civil{
  nome: string,
  code: string
}
interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-colaborador',
  standalone: true,
  imports: [
    ReactiveFormsModule,FormsModule,NzUploadModule,
    FormLayoutComponent,InputMaskModule,CalendarModule,CheckboxModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule,
  ],
  providers:[
    MessageService,GetSetorService,RegisterColaboradorService,GetColaboradorService,
    GetCompanyService,GetFilialService,GetAreaService,GetCargoService
  ],
  templateUrl: './colaborador.component.html',
  styleUrl: './colaborador.component.scss'
})
export class ColaboradorComponent implements OnInit {

  onUpload(event: any): void {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
  }

  companys: Company[]| undefined;
  filiais: Filial[]| undefined;
  areas: Area[]| undefined;
  setores: Setor[]| undefined;
  cargos: Cargo[]| undefined;
  tipocontratos: TipoContrato[]| undefined;
  generos: Genero[] | undefined;
  estados_civis: Estado_Civil[] | undefined;
  colaboradores: any[] = [];

  registercolaboradorForm!: FormGroup<RegisterColaboradorForm>;
  @ViewChild('RegisterfilialForm') RegisterColaboradorForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';


  constructor(
    private router: Router,
    private messageService: MessageService,
    private getcompanyService: GetCompanyService,
    private getfilialService: GetFilialService,
    private registercolaboradorService: RegisterColaboradorService,
    private getareaService: GetAreaService,
    private getsetorService: GetSetorService,
    private getcargoService: GetCargoService,
    private getcolaboradorService: GetColaboradorService,
    private gettipocontratoService: GetTipoContratoService,
    private msg: NzMessageService,
    
  )
  
  {
    this.registercolaboradorForm = new FormGroup({
      nome: new FormControl('',[Validators.required, Validators.minLength(3)]),
      empresa: new FormControl('',),
      filial: new FormControl('',),
      area: new FormControl('',),
      setor: new FormControl('',),
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

   }); 

 }

 ngOnInit(): void {
  this.estados_civis = [
    { nome: 'Solteiro(a)', code: 'SOL' },
    { nome: 'Casado(a)', code: 'CAS' },
    { nome: 'Divorciado(a)', code: 'DIV' },
    { nome: 'Separado(a)', code: 'SEP' },
    { nome: 'Viuvo(a)', code:'VIU'}
];

this.generos =[
  { nome:'Masculino'},
  { nome:'Feminino'}
];
 
this.getcolaboradorService.getColaboradores().subscribe(
  colaboradores => {
    this.colaboradores = colaboradores;
  },
  error => {
    console.error('Error fetching users:', error);
  }
);

  this.getfilialService.getFiliais().subscribe(
    filiais => {
      this.filiais = filiais;
    },
    error => {
      console.error('Error fetching users:', error);
    }
  );

  this.gettipocontratoService.getTipocontratos().subscribe(
    tipocontratos => {
      this.tipocontratos = tipocontratos;
    },
    error => {
      console.error('Error fetching users:', error);
    }
  );

  this.getcargoService.getCargos().subscribe(
    cargos => {
      this.cargos = cargos;
    },
    error => {
      console.error('Error fetching users:', error);
    }
  );

  this.getcompanyService.getCompanys().subscribe(
    companys => {
      this.companys = companys;
    },
    error => {
      console.error('Error fetching users:',error);
    }
  );

  this.getsetorService.getSetores().subscribe(
    setores => {
      this.setores = setores;
    },
    error => {
      console.error('Error fetching users:',error);
    }
  );
  this.getareaService.getAreas().subscribe(
    areas => {
      this.areas = areas;
    },
    error => {
      console.error('Error fetching users:',error);
    }
  );

 }
onFileChange(event:any) {
    
  if (event.target.files.length > 0) {
    const file = event.target.files[0];
    this.registercolaboradorForm.patchValue({
      image: file
    });
  }
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
 
clear(table: Table) {
  table.clear();
}

clearForm() {
this.registercolaboradorForm.reset();
}

filterTable() {
this.dt1.filterGlobal(this.inputValue, 'contains');
}



submit() {
  if (this.registercolaboradorForm.valid) {
    //const dataFormatadaad = format(this.registercolaboradorForm.value.data_admissao, 'yyyy-MM-dd');
    //const dataFormatadanasc = format(this.registercolaboradorForm.value.data_demissao, 'yyyy-MM-dd');
    //const dataFormatadatc = format(this.registercolaboradorForm.value.data_troca_cargo, 'yyyy-MM-dd');
    //const dataFormatadast = format(this.registercolaboradorForm.value.data_troca_setor, 'yyyy-MM-dd');
    //const dataFormatadadm = format(this.registercolaboradorForm.value.data_demissao, 'yyyy-MM-dd');
    const empresaId = this.registercolaboradorForm.value.empresa.id;
    const filialId = this.registercolaboradorForm.value.filial.id;
    const areaId = this.registercolaboradorForm.value.area.id;
    const setorId = this.registercolaboradorForm.value.setor.id;
    const cargoId = this.registercolaboradorForm.value.cargo.id;
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

    
    // Add a imagem ao FormData
    const image = this.registercolaboradorForm.get('image')?.value;
    if (image) {
      formData.append('image', image);
    }

    this.registercolaboradorService.registercolaborador(formData).subscribe({
      next: () => this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Colaborador registrado com sucesso!' }),
      error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro ao registrar colaborador. Por favor, revise os dados e tente novamente.' }), 
    });
  } else {
    this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' });
  }
}

navigate(){
  this.router.navigate(["dashboard"])
}

}

