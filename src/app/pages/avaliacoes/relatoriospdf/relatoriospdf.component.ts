import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { KnobModule } from 'primeng/knob';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TabMenuModule } from 'primeng/tabmenu';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { Filial } from '../filial/filial.component';
import { Ambiente } from '../ambiente/ambiente.component';
import { Area } from '../area/area.component';
import { Avaliado } from '../avaliado/avaliado.component';
import { Avaliador } from '../avaliador/avaliador.component';
import { Cargo } from '../cargo/cargo.component';
import { Colaborador } from '../colaborador/colaborador.component';
import { Avaliacao } from '../novaliacao/novaliacao.component';
import { Empresa } from '../registercompany/registercompany.component';
import { Setor } from '../setor/setor.component';
import { AmbienteService } from '../../../services/avaliacoesServices/ambientes/ambiente.service';
import { AreaService } from '../../../services/avaliacoesServices/areas/registerarea.service';
import { AvaliacaoService } from '../../../services/avaliacoesServices/avaliacoes/getavaliacao.service';
import { AvaliadorService } from '../../../services/avaliacoesServices/avaliadores/registeravaliador.service';
import { AvaliadoService } from '../../../services/avaliacoesServices/avaliados/avaliado.service';
import { CargoService } from '../../../services/avaliacoesServices/cargos/registercargo.service';
import { ColaboradorService } from '../../../services/avaliacoesServices/colaboradores/registercolaborador.service';
import { RegisterCompanyService } from '../../../services/avaliacoesServices/companys/registercompany.service';
import { FilialService } from '../../../services/avaliacoesServices/filiais/registerfilial.service';
import { SetorService } from '../../../services/avaliacoesServices/setores/registersetor.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-relatoriospdf',
  imports: [
    RouterLink,TabMenuModule,FormsModule,ReactiveFormsModule,DropdownModule,MatFormFieldModule,MatSelectModule,CardModule,DividerModule,CalendarModule,
    CommonModule,NzIconModule,NzUploadModule, NzLayoutModule, NzMenuModule,RouterLink,CardModule,MultiSelectModule,ChartModule,KnobModule,NzProgressModule,
    FloatLabelModule,SelectModule,MultiSelectModule,DatePickerModule
  ],
  templateUrl: './relatoriospdf.component.html',
  styleUrl: './relatoriospdf.component.scss'
})
export class RelatoriospdfComponent {
    avaliadores: Avaliador [] | undefined;
    avaliacoes: Avaliacao [] | undefined;
    empresas: Empresa [] = [];
    avaliados: Avaliado [] | undefined;
    setores: Setor [] = [];
    colaboradores: Colaborador [] = [];
    ambientes: Ambiente [] = [];
    areas: Area [] = [];
    cargos: Cargo [] = [];
    filiais : Filial [] = [];

    avaliadoSelecionadoId: any[] = [];
    avaliadorSelecionadoId2: any[] = [];
    tipoSelecionado2: any[] = [];
    data_inicio: any[] = [];
    data_fim: any[] = [];
    filteredAvaliacoes: any[] = [];
    totalAvaliacoesAvaliador!: number;
    totalAvaliacoesAvaliado!: number;
    mediaNotaAvaliador!:number;
    mediaNotaAvaliado!:number;

    selectedEmpresas: any [] = [];
    selectedCargos: any[] = [];
    selectedSetores: any[] = [];
    selectedFiliais: any[] = [];
    selectedAreas: any[] = [];
    selectedAmbientes: any[] = [];
    filteredAvaliados: any[] = [];

    filteredHistorico: any[] = [];
    historicoAlteracao: any[] = [];
    historicoMediaGeral: any;
    historicoSalario: any [] = [];
    
  constructor(
    private loginService: LoginService,
    private areaService: AreaService,
    private filialService: FilialService,
    private ambienteService: AmbienteService,
    private avaliacaoService: AvaliacaoService,
    private registercompanyService:RegisterCompanyService,
    private avaliadoService: AvaliadoService,
    private avaliadorService: AvaliadorService,
    private colaboradorService: ColaboradorService,
    private cargoService: CargoService,
    private setorService: SetorService,
  ) {}

  ngOnInit(): void {
    this.avaliadoService.getAvaliados().subscribe(
      avaliados => {
        this.avaliados = avaliados;
      },
      error => {
        console.error('Error fetching users:',error);
      }
     );

     this.avaliadorService.getAvaliadores().subscribe(
      avaliadores => {
        this.avaliadores = avaliadores;
      },
      error => {
        console.error('Error fetching users:',error);
      }
    );

     this.registercompanyService.getCompanys().subscribe(empresas => {
      this.empresas = empresas;
    })

  }

  onEmpresaSelecionada(empresa: any): void {
    const id = this.selectedEmpresas
    if (id !== undefined) {
      console.log('Empresa selecionada ID:', id); // Log para depuração
      this.selectedEmpresas = id;
      this.filiaisByEmpresa();
      this.applyFiltersAvaliados();
      
    } else {
      console.error('O ID do avaliado é indefinido');
    }
  }

  filiaisByEmpresa(): void {
    if (this.selectedEmpresas !== null) {
      this.filialService.getFiliaisByEmpresa(this.selectedEmpresas).subscribe(data => {
        this.filiais = data;
        console.log('Filiais carregadas:', this.filiais); // Log para depuração
      });
    }
  }

  onFilialSelecionada(filial: any): void {
    const id = this.selectedFiliais
    if (id !== undefined) {
      console.log('Filial selecionada ID:', id); // Log para depuração
      this.selectedFiliais = id;
      this.areasByFilial();
      this.applyFiltersAvaliados();
    } else {
      console.error('O ID do avaliado é indefinido');
    }
  }
  areasByFilial(): void {
    if (this.selectedFiliais !== null) {
      this.areaService.getAreasByFilial(this.selectedFiliais).subscribe(data => {
        this.areas = data;
        console.log('Areas carregadas:', this.areas); // Log para depuração
      });
    }
  } 

  onAreaSelecionada(area: any): void {
    const id = this.selectedAreas;
    if (id !== undefined) {
      console.log('Area selecionada ID:', id); // Log para depuração
      this.selectedAreas = id;
      this.setoresByArea();
      this.applyFiltersAvaliados();
    } else {
      console.error('O ID do avaliado é indefinido');
    }
  }
  setoresByArea(): void {
    if (this.selectedAreas !== null) {
      this.setorService.getSetorByArea(this.selectedAreas).subscribe(data => {
        this.setores = data;
        console.log('Setores carregadas:', this.areas); // Log para depuração
      });
    }
  }
  onSetorSelecionado(setor: any): void {
    const id = this.selectedSetores;
    if (id !== undefined) {
      console.log('Ambiente selecionado ID:', id); // Log para depuração
      this.selectedSetores = id;
      this.applyFiltersAvaliados();
      this.ambientesBySetor();
    } else {
      console.error('O ID do avaliado é indefinido');
    }
  }
  ambientesBySetor(): void {
    if (this.selectedSetores !== null) {
      this.ambienteService.getAmbientesBySetor(this.selectedSetores).subscribe(data => {
        this.ambientes = data;
        console.log('Areas carregadas:', this.areas); // Log para depuração
      });
    }
  }
  onAmbienteSelecionado(setor: any): void {
    const id = this.selectedAmbientes;
    if (id !== undefined) {
      console.log('Setor selecionado ID:', id); // Log para depuração
      this.selectedAmbientes = id;
      this.cargosByAmbientes();
      this.applyFiltersAvaliados();
    } else {
      console.error('O ID do avaliado é indefinido');
    }
  }
 
  cargosByAmbientes(): void {
    if (this.selectedAmbientes !== null) {
      this.cargoService.getCargosByAmbientes(this.selectedAmbientes).subscribe(data => {
        this.cargos = data;
        console.log('Setores carregadas:', this.areas); // Log para depuração
      });
    }
  }

  loadColaboradores(): void {
    this.colaboradorService.getColaboradores().subscribe(data => {
      this.colaboradores = data;
      this.applyFilters();
    });
  }

  applyFiltersHistorico():void{
    const filters={
      avaliadoSelecionadoId:this.avaliadoSelecionadoId,
    };
    this.avaliacaoService.filterHistorico(filters).subscribe(data => {
      this.filteredHistorico = data.filtered_data_historico;
      this.historicoAlteracao = data.historico;
      this.historicoMediaGeral = data.media_geral_por_periodo;
      this.historicoSalario = data.historico_salario;
  
    },error =>{
      console.error('Error fetching data:', error);
    });
  }

  applyFiltersAvaliados():void{
    const filters={
      selectedEmpresas: this.selectedEmpresas,
      selectedFiliais: this.selectedFiliais,
      selectedAreas: this.selectedAreas,
      selectedSetores: this.selectedSetores,
      selectedAmbientes: this.selectedAmbientes,
      selectedCargos: this.selectedCargos,
    };
    this.avaliacaoService.filterDataAvaliados(filters).subscribe(data => {
      this.filteredAvaliados = data.filtered_data;
    },error => {
      console.error('Error fetching data:', error);
  });
  }

  applyFilters():void{
    const filters={
      avaliadorSelecionadoId:this.avaliadorSelecionadoId2,
      avaliadoSelecionadoId:this.avaliadoSelecionadoId,
      tipoSelecionado: this.tipoSelecionado2,
      data_inicio: this.data_inicio,
      data_fim: this.data_fim,
    };
    this.avaliacaoService.filterData(filters).subscribe(data => {
      this.filteredAvaliacoes = data.filtered_data;
      this.totalAvaliacoesAvaliador = data.total_avaliacoes;
      this.totalAvaliacoesAvaliado = data.total_avaliacoes_avaliados;
      this.mediaNotaAvaliador = data.media_geral;
      this.mediaNotaAvaliado = data.media_geral_avaliado;

    },error => {
      console.error('Error fetching data:', error);
  });
  }


  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  /**==============================PDFs======================================================= */

  generateFilteredPDF() {
    const logoBase64 = 'data:image/jpeg;base64,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RAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERBT31Tj7DeL/CqL5nVLW2tknqnH2G8X+FUXzOqWttejw303PqeoREW6giIgIiICIiAiIgL4qPaJPxD+xfa+Kj2iT8Q/sQb3rR9aaL8nj/2heVl3tFN/wBQ/sXq2j600X5PH/tC8zK45JIKcRxuds878oJ8S8zR9cOqWLouXvap/q8vxCne1T/V5fiFehmFXEi5e9qn+ry/EKd7VP8AV5fiFMwOJFy97VP9Xl+IU72qf6vL8QpmBxIuXvap/q8vxCne1T/V5fiFMwOJFztoqx2wbSTHf/2yuxDYrrMelI5o8ryGqJtWN5S6C7dtt81wqWxRtPKDu93iAXr0mJncOragbfcR/wASvepqWno4xFTRNY3zeP31hqcRERiphytAaA0eIbL9RFxLIf0I9vyv4XX75/KpgUP6Ee35X8Lr98/lUwK1t0RsIiKqRUSl1p4nNauIPOMG0Vzmis9rxMVRpYZKCCSKU07hFyve9hJMkocA7fYAjpt1VzNRMqp8GwLIsxquXudltdTXEE+yMcbnBvvkgD86qH6mdidRLZs11NucXdKm6V0dviqnHwn8oMkwPvvewrbTiIrN5Ut1mIS1wy8Tr9VZ67TjUe2tx/UewF8dfb3NMbaoMOzpImnsIPsmddt9xuOywaqfxmaE3iU03EZpIZaHNcTLaqr71b4dZTRj2zYeyfG3fcH2UfM077AGXOHDXey6/adU2U0Yip7tS8tNeKFrt+96kDqR4+R/smnybjckFResTHPXZMT1xKVERdW53O32W3VV3utXHS0VFE6eonkOzY42jdzifIAFksxrVbVPEtHMKrc5zKtMNFSANjiZsZamY78kMbftnu294AEnYAlUrzjXXi+u+llw4i6G+UmG4oK6CC0WaK3xTTVEEknJ3Zz5GEloO3hHYO6kABd2w09549NdpL/eIaiHSXB5yynpnEtbWv6EMO328mwc8jq2PlbuC4FWv15wamy/QvLcKooIKaOSyzR0rGxAMhMTOZga0DptyADbsXREV0piJ3+6k5t1h2NBdRJtVdIcXzyrdEay6UDH1gibs1tQ3wZAB4vCBWfqn/qaWZm8aR3nDKh+02PXVz44z2thqG8497+cEo/MrgLLUry3mFqzmMiIviaaKnifUVErIoo2l73v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arF7hfJGeO53GV7SfOyMsaf0Ka8T0+wXBKUUeGYhZ7JEG8pFDRxwlw/vFo3d+clUtxVY2haNKfu1w6M+p+arZ5UxXHUVrsMsu4c5s4a+vmHkbEDtH779iPuSthWlOkGCaMYxHiuCWdlJTjZ9RO8809VJtsZJX9rj/oPEAs0Rc2pq21N2laxXYUIcUf1lsP5ZL+7U3rC9TNNafUmjoaOou0tAKGV0odHEH8/M3bbqRsr8LqV0tat7bQrq1m1JiFPUVhPWt2z3Y1f6oz0k9a3bPdjV/qjPSXt/EOH/ADe0uHy+p2V7RWE9a3bPdjV/qjPST1rds92NX+qM9JPiHD/m9pPL6nZXtFYT1rds92NX+qM9JPWt2z3Y1f6oz0k+IcP+b2k8vqdle0VhPWt2z3Y1f6oz0k9a3bPdjV/qjPST4hw/5vaTy+p2V7RWLh4X8fa4Goyi4yAdoZFG3f8AavftfD1pxbnB9RSVlwcPFU1J5T+ZnKFW34loRtmf2Wjhryq9QW6vutUyitlFPVVEhAbHCwvcSfMFPmkmhVTaK2DJ8yYwVMBD6WhBDgx3ifIezceIDsUw2fHrHj8He1ktNJQx+MQRBm/vkdT+deguDiPxG2rHLSMR7t9Ph4pObdRERea6UQaEtc2fK+ZpG+W349Rt/wCvlUvrjZBBG8vZCxrnHckN2JK5FMzmcgiIoBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERB//Z'; // substitua pelo seu base64
    const doc = new jsPDF();
    const margin = 15;
    const bottomMargin = 10;
    const yPosition = margin + 10; // Adicionar espaço para a imagem do cabeçalho
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let pageNumber = 1;
    
    // Função para adicionar o número da página
    const addPageNumber = () => {
      doc.setFontSize(6);
      doc.setFont('Helvetica', 'normal');
      doc.text(`Página ${pageNumber}`, pageWidth - margin, pageHeight - bottomMargin, { align: 'right' });
    };
  
    // Adicionar a imagem no cabeçalho
    doc.addImage(logoBase64, 'PNG', margin, margin, 30, 10); // Ajuste as coordenadas e o tamanho conforme necessário
  
    // Obter a data atual
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  
  
     // Adicionar título
     doc.setFontSize(8);
     doc.setFont('Helvetica', 'bold');
     const title = 'Lista de Avaliados';
     const titleWidth = doc.getTextWidth(title);
     const titleX = (pageWidth - titleWidth) / 2; // Centralizar o texto
     //yPosition += 5; // Ajustar para a altura da imagem + espaçamento
     doc.text(title, titleX, yPosition);
     //yPosition += 0;
     // Adicionar número da página inicial
     addPageNumber();
   
    // Construir dados para a tabela
    const data = this.filteredAvaliados.map(avaliado => [
      avaliado.nome,
      avaliado.empresa_nome,
      avaliado.filial_nome,
      avaliado.area_nome,
      avaliado.ambiente_nome,
      avaliado.setor_nome,
      avaliado.cargo_nome,
      avaliado.numero_avaliacoes
    ]);
  
    // Adicionar tabela ao PDF
    autoTable(doc, {
      head: [['Nome', 'Empresa', 'Filial', 'Área', 'Ambiente', 'Setor', 'Cargo', 'Av Recebidas']],
      body: data,
      startY: margin * 2, // Iniciar a tabela abaixo do título
      margin: { left: margin, right: margin },
      styles: { fontSize: 6, cellPadding: 2 },
      headStyles: { fillColor: [0, 0, 80], textColor: 255 }, // Cor azul para o cabeçalho com texto branco
      didDrawPage: function (data) {
        // Adicionar rodapé em cada página
        
        // Adicionar número da página
        addPageNumber();
        pageNumber++; // Incrementar o número da página
      }
    });
    doc.setFontSize(6);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Data de Emissão: ${formattedDate}`, margin, doc.internal.pageSize.height - 15);
    //doc.text('Emitido por DB Manager', doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.height - 15, { align: 'center' });
  
    doc.save('avaliados_filtro.pdf');
  }

  /////////////////////////////////////////////////////////

  downloadPdf() {
    const logoBase64 = 'data:image/jpeg;base64,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RAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERBT31Tj7DeL/CqL5nVLW2tknqnH2G8X+FUXzOqWttejw303PqeoREW6giIgIiICIiAiIgL4qPaJPxD+xfa+Kj2iT8Q/sQb3rR9aaL8nj/2heVl3tFN/wBQ/sXq2j600X5PH/tC8zK45JIKcRxuds878oJ8S8zR9cOqWLouXvap/q8vxCne1T/V5fiFehmFXEi5e9qn+ry/EKd7VP8AV5fiFMwOJFy97VP9Xl+IU72qf6vL8QpmBxIuXvap/q8vxCne1T/V5fiFMwOJFztoqx2wbSTHf/2yuxDYrrMelI5o8ryGqJtWN5S6C7dtt81wqWxRtPKDu93iAXr0mJncOragbfcR/wASvepqWno4xFTRNY3zeP31hqcRERiphytAaA0eIbL9RFxLIf0I9vyv4XX75/KpgUP6Ee35X8Lr98/lUwK1t0RsIiKqRUSl1p4nNauIPOMG0Vzmis9rxMVRpYZKCCSKU07hFyve9hJMkocA7fYAjpt1VzNRMqp8GwLIsxquXudltdTXEE+yMcbnBvvkgD86qH6mdidRLZs11NucXdKm6V0dviqnHwn8oMkwPvvewrbTiIrN5Ut1mIS1wy8Tr9VZ67TjUe2tx/UewF8dfb3NMbaoMOzpImnsIPsmddt9xuOywaqfxmaE3iU03EZpIZaHNcTLaqr71b4dZTRj2zYeyfG3fcH2UfM077AGXOHDXey6/adU2U0Yip7tS8tNeKFrt+96kDqR4+R/smnybjckFResTHPXZMT1xKVERdW53O32W3VV3utXHS0VFE6eonkOzY42jdzifIAFksxrVbVPEtHMKrc5zKtMNFSANjiZsZamY78kMbftnu294AEnYAlUrzjXXi+u+llw4i6G+UmG4oK6CC0WaK3xTTVEEknJ3Zz5GEloO3hHYO6kABd2w09549NdpL/eIaiHSXB5yynpnEtbWv6EMO328mwc8jq2PlbuC4FWv15wamy/QvLcKooIKaOSyzR0rGxAMhMTOZga0DptyADbsXREV0piJ3+6k5t1h2NBdRJtVdIcXzyrdEay6UDH1gibs1tQ3wZAB4vCBWfqn/qaWZm8aR3nDKh+02PXVz44z2thqG8497+cEo/MrgLLUry3mFqzmMiIviaaKnifUVErIoo2l73v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arF7hfJGeO53GV7SfOyMsaf0Ka8T0+wXBKUUeGYhZ7JEG8pFDRxwlw/vFo3d+clUtxVY2haNKfu1w6M+p+arZ5UxXHUVrsMsu4c5s4a+vmHkbEDtH779iPuSthWlOkGCaMYxHiuCWdlJTjZ9RO8809VJtsZJX9rj/oPEAs0Rc2pq21N2laxXYUIcUf1lsP5ZL+7U3rC9TNNafUmjoaOou0tAKGV0odHEH8/M3bbqRsr8LqV0tat7bQrq1m1JiFPUVhPWt2z3Y1f6oz0k9a3bPdjV/qjPSXt/EOH/ADe0uHy+p2V7RWE9a3bPdjV/qjPST1rds92NX+qM9JPiHD/m9pPL6nZXtFYT1rds92NX+qM9JPWt2z3Y1f6oz0k+IcP+b2k8vqdle0VhPWt2z3Y1f6oz0k9a3bPdjV/qjPST4hw/5vaTy+p2V7RWLh4X8fa4Goyi4yAdoZFG3f8AavftfD1pxbnB9RSVlwcPFU1J5T+ZnKFW34loRtmf2Wjhryq9QW6vutUyitlFPVVEhAbHCwvcSfMFPmkmhVTaK2DJ8yYwVMBD6WhBDgx3ifIezceIDsUw2fHrHj8He1ktNJQx+MQRBm/vkdT+deguDiPxG2rHLSMR7t9Ph4pObdRERea6UQaEtc2fK+ZpG+W349Rt/wCvlUvrjZBBG8vZCxrnHckN2JK5FMzmcgiIoBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERB//Z'; // substitua pelo seu base64
  
  
    const doc = new jsPDF();
    const margin = 15;
    const bottomMargin = 10;
    const yPosition = margin + 10; // Adicionar espaço para a imagem do cabeçalho
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let pageNumber = 1;
  
  
    // Função para adicionar o número da página
    const addPageNumber = () => {
      doc.setFontSize(6);
      doc.setFont('Helvetica', 'normal');
      doc.text(`Página ${pageNumber}`, pageWidth - margin, pageHeight - bottomMargin, { align: 'right' });
    };
  
    // Adicionar a imagem no cabeçalho
    doc.addImage(logoBase64, 'PNG', margin, margin, 30, 10); // Ajuste as coordenadas e o tamanho conforme necessário
    
  
    // Obter a data atual
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  
    // Adicionar título
    doc.setFontSize(8);
    doc.setFont('Helvetica', 'bold');
    const title = 'Lista de Avaliadores';
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2; // Centralizar o texto
    doc.text(title, titleX, yPosition);
    
    // Adicionar número da página inicial
    addPageNumber();
  
    // Construir dados para a tabela
    const data = this.avaliadores?.map(avaliador => {
      const quantidadeAvaliados = avaliador.avaliados ? avaliador.avaliados.length : 0;
      return [
        avaliador.nome,
        avaliador.setor,
        avaliador.cargo,
        quantidadeAvaliados.toString()
      ];
    });
  
    // Adicionar tabela ao PDF
    autoTable(doc, {
      head: [['Nome', 'Setor', 'Cargo', 'Avaliados']],
      body: data,
      startY: margin * 2, // Iniciar a tabela abaixo do título
      margin: { left: margin, right: margin },
      styles: { fontSize: 6, cellPadding: 2 },
      headStyles: { fillColor: [0, 0, 80], textColor: 255 }, // Cor azul para o cabeçalho com texto branco
      didDrawPage: function (data) {
        // Adicionar rodapé em cada página
        
        // Adicionar número da página
        addPageNumber();
        pageNumber++; // Incrementar o número da página
      }
    });
    doc.setFontSize(6);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Data de Emissão: ${formattedDate}`, margin, doc.internal.pageSize.height - 15);
    //doc.text('Emitido por DB Manager', doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.height - 15, { align: 'center' });
  
    doc.save('avaliadores.pdf');
  }



  gerarRelatorioPDF() {
    const logoBase64 = 'data:image/jpeg;base64,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RAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERBT31Tj7DeL/CqL5nVLW2tknqnH2G8X+FUXzOqWttejw303PqeoREW6giIgIiICIiAiIgL4qPaJPxD+xfa+Kj2iT8Q/sQb3rR9aaL8nj/2heVl3tFN/wBQ/sXq2j600X5PH/tC8zK45JIKcRxuds878oJ8S8zR9cOqWLouXvap/q8vxCne1T/V5fiFehmFXEi5e9qn+ry/EKd7VP8AV5fiFMwOJFy97VP9Xl+IU72qf6vL8QpmBxIuXvap/q8vxCne1T/V5fiFMwOJFztoqx2wbSTHf/2yuxDYrrMelI5o8ryGqJtWN5S6C7dtt81wqWxRtPKDu93iAXr0mJncOragbfcR/wASvepqWno4xFTRNY3zeP31hqcRERiphytAaA0eIbL9RFxLIf0I9vyv4XX75/KpgUP6Ee35X8Lr98/lUwK1t0RsIiKqRUSl1p4nNauIPOMG0Vzmis9rxMVRpYZKCCSKU07hFyve9hJMkocA7fYAjpt1VzNRMqp8GwLIsxquXudltdTXEE+yMcbnBvvkgD86qH6mdidRLZs11NucXdKm6V0dviqnHwn8oMkwPvvewrbTiIrN5Ut1mIS1wy8Tr9VZ67TjUe2tx/UewF8dfb3NMbaoMOzpImnsIPsmddt9xuOywaqfxmaE3iU03EZpIZaHNcTLaqr71b4dZTRj2zYeyfG3fcH2UfM077AGXOHDXey6/adU2U0Yip7tS8tNeKFrt+96kDqR4+R/smnybjckFResTHPXZMT1xKVERdW53O32W3VV3utXHS0VFE6eonkOzY42jdzifIAFksxrVbVPEtHMKrc5zKtMNFSANjiZsZamY78kMbftnu294AEnYAlUrzjXXi+u+llw4i6G+UmG4oK6CC0WaK3xTTVEEknJ3Zz5GEloO3hHYO6kABd2w09549NdpL/eIaiHSXB5yynpnEtbWv6EMO328mwc8jq2PlbuC4FWv15wamy/QvLcKooIKaOSyzR0rGxAMhMTOZga0DptyADbsXREV0piJ3+6k5t1h2NBdRJtVdIcXzyrdEay6UDH1gibs1tQ3wZAB4vCBWfqn/qaWZm8aR3nDKh+02PXVz44z2thqG8497+cEo/MrgLLUry3mFqzmMiIviaaKnifUVErIoo2l73v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arF7hfJGeO53GV7SfOyMsaf0Ka8T0+wXBKUUeGYhZ7JEG8pFDRxwlw/vFo3d+clUtxVY2haNKfu1w6M+p+arZ5UxXHUVrsMsu4c5s4a+vmHkbEDtH779iPuSthWlOkGCaMYxHiuCWdlJTjZ9RO8809VJtsZJX9rj/oPEAs0Rc2pq21N2laxXYUIcUf1lsP5ZL+7U3rC9TNNafUmjoaOou0tAKGV0odHEH8/M3bbqRsr8LqV0tat7bQrq1m1JiFPUVhPWt2z3Y1f6oz0k9a3bPdjV/qjPSXt/EOH/ADe0uHy+p2V7RWE9a3bPdjV/qjPST1rds92NX+qM9JPiHD/m9pPL6nZXtFYT1rds92NX+qM9JPWt2z3Y1f6oz0k+IcP+b2k8vqdle0VhPWt2z3Y1f6oz0k9a3bPdjV/qjPST4hw/5vaTy+p2V7RWLh4X8fa4Goyi4yAdoZFG3f8AavftfD1pxbnB9RSVlwcPFU1J5T+ZnKFW34loRtmf2Wjhryq9QW6vutUyitlFPVVEhAbHCwvcSfMFPmkmhVTaK2DJ8yYwVMBD6WhBDgx3ifIezceIDsUw2fHrHj8He1ktNJQx+MQRBm/vkdT+deguDiPxG2rHLSMR7t9Ph4pObdRERea6UQaEtc2fK+ZpG+W349Rt/wCvlUvrjZBBG8vZCxrnHckN2JK5FMzmcgiIoBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERB//Z'; // substitua pelo seu base64
  
    const doc = new jsPDF();
    const margin = 15;
    const bottomMargin = 10;
    let yPosition = margin + 10; // Adicionar espaço para a imagem do cabeçalho
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let pageNumber = 1;
    
    // Função para adicionar o número da página
    const addPageNumber = () => {
      doc.setFontSize(6);
      doc.setFont('Helvetica', 'normal');
      doc.text(`Página ${pageNumber}`, pageWidth - margin, pageHeight - bottomMargin, { align: 'right' });
    };
    
   
    const checkPageHeight = (currentY: number, tableHeight: number) => {
      if (currentY + tableHeight > pageHeight - bottomMargin) {
        doc.addPage();
        yPosition = margin; // Reiniciar a posição vertical no topo da nova página
        addPageNumber();
        pageNumber++;
      }
    };
    
    // Adicionar a imagem no cabeçalho
    doc.addImage(logoBase64, 'PNG', margin, margin, 30, 10); // Ajuste as coordenadas e o tamanho conforme necessário
    
    // Obter a data atual
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  
    // Configurações iniciais
  
  // Função para formatar a data
  const formatDate = (isoDateString: any) => {
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };
  
   // Definição da função antes do uso
   const formatDate2 = (date: Date) => {
    // código de formatação
    return 'data formatada';
  };
  
  // Agora usamos a função após sua definição
  const dataFormatada = formatDate2(new Date());
  
    let finalYPosition = 180; // Declarar a variável  
  doc.setFontSize(8);
  doc.setFont('Helvetica', 'bold');
  const title = 'Informações do Colaborador';
  const titleWidth = doc.getTextWidth(title);
  const titleX = (pageWidth - titleWidth) / 2; // Centralizar o texto
  doc.text(title, titleX, yPosition);
  yPosition += 20; // Ajustar a posição vertical
  
  // Adicionar número da página inicial
  addPageNumber();
  
  
  //const margin = 20;
  //const pageHeight = doc.internal.pageSize.height;
  //let yPosition = margin;
  
  // Define as posições X para as duas colunas
  const xPositionLeft = margin;
  const xPositionRight = margin + 120; // Ajuste conforme necessário
  
  this.filteredHistorico.forEach(avaliado => {
   // yPosition = margin; // Reinicia yPosition para cada avaliado
  
    // Coluna da esquerda
    doc.setFont('Helvetica', 'bold');
    doc.text('Nome: ', xPositionLeft, yPosition);
    doc.setFont('Helvetica', 'normal');
    doc.text(avaliado.nome, xPositionLeft + 15, yPosition);
  
    yPosition += 8;
    doc.setFont('Helvetica', 'bold');
    doc.text('Empresa: ', xPositionLeft, yPosition);
    doc.setFont('Helvetica', 'normal');
    doc.text(avaliado.empresa_nome, xPositionLeft + 15, yPosition);
  
    yPosition += 8;
    doc.setFont('Helvetica', 'bold');
    doc.text('Filial: ', xPositionLeft, yPosition);
    doc.setFont('Helvetica', 'normal');
    doc.text(avaliado.filial_nome, xPositionLeft + 15, yPosition);
  
    yPosition += 8;
    doc.setFont('Helvetica', 'bold');
    doc.text('Área: ', xPositionLeft, yPosition);
    doc.setFont('Helvetica', 'normal');
    doc.text(avaliado.area_nome, xPositionLeft + 15, yPosition);
  
    yPosition += 8;
    doc.setFont('Helvetica', 'bold');
    doc.text('Cargo: ', xPositionLeft, yPosition);
    doc.setFont('Helvetica', 'normal');
    doc.text(avaliado.cargo_nome, xPositionLeft + 15, yPosition);
  
    yPosition += 8;
    doc.setFont('Helvetica', 'bold');
    doc.text('Setor: ', xPositionLeft, yPosition);
    doc.setFont('Helvetica', 'normal');
    doc.text(avaliado.setor_nome, xPositionLeft + 15, yPosition);
  
    yPosition += 8;
    doc.setFont('Helvetica', 'bold');
    doc.text('Ambiente: ', xPositionLeft, yPosition);
    doc.setFont('Helvetica', 'normal');
    doc.text(avaliado.ambiente_nome, xPositionLeft + 15, yPosition);
  
    // Coluna da direita
    yPosition = margin + 30; // Reinicia yPosition para a coluna da direita
  
    
  
    //yPosition += 8;
    doc.setFont('Helvetica', 'bold');
    doc.text('Salário: ', xPositionRight, yPosition);
    doc.setFont('Helvetica', 'normal');
    doc.text(`R$ ${avaliado.salario}`, xPositionRight + 25, yPosition);
  
    yPosition += 8;
    doc.setFont('Helvetica', 'bold');
    doc.text('Data Nascimento: ', xPositionRight, yPosition);
    doc.setFont('Helvetica', 'normal');
    doc.text(formatDate(avaliado.data_nascimento), xPositionRight + 25, yPosition);
  
    yPosition += 8;
    doc.setFont('Helvetica', 'bold');
    doc.text('Data Admissão: ', xPositionRight, yPosition);
    doc.setFont('Helvetica', 'normal');
    doc.text(formatDate(avaliado.data_admissao), xPositionRight + 25, yPosition);
  
    yPosition += 8;
    doc.setFont('Helvetica', 'bold');
    doc.text('Estado Civil: ', xPositionRight, yPosition);
    doc.setFont('Helvetica', 'normal');
    doc.text(avaliado.estado_civil, xPositionRight + 25, yPosition);
  
    yPosition += 8;
    doc.setFont('Helvetica', 'bold');
    doc.text('Formação: ', xPositionRight, yPosition);
    doc.setFont('Helvetica', 'normal');
    doc.text(avaliado.instrucao, xPositionRight + 25, yPosition);
  
    yPosition += 8;
    doc.setFont('Helvetica', 'bold');
    doc.text('Gênero: ', xPositionRight, yPosition);
    doc.setFont('Helvetica', 'normal');
    doc.text(avaliado.genero, xPositionRight + 25, yPosition);
  
    yPosition += 8;
    doc.setFont('Helvetica', 'bold');
    doc.text('Av Recebidas: ', xPositionRight, yPosition);
    doc.setFont('Helvetica', 'normal');
    doc.text(`${avaliado.numero_avaliacoes}`, xPositionRight + 25, yPosition);
  
    //yPosition += 8; // Espaço extra entre cada colaborador
  
    // // Verificar se precisa adicionar uma nova página
    // if (yPosition > pageHeight - 20) { 
    //   doc.addPage();
    //   yPosition = margin;
    // }
  });
   
  yPosition = finalYPosition - 70 ;
    
    // Adicionar título para a seção de histórico
    doc.setFontSize(8);
    doc.setFont('Helvetica', 'bold');
    const historicoTitle = 'Histórico de Alterações';
    const historicoTitleWidth = doc.getTextWidth(historicoTitle);
    const historicoTitleX = (pageWidth - historicoTitleWidth) / 2;
    doc.text(historicoTitle, historicoTitleX, yPosition);
    yPosition += 10; // Ajustar a posição vertical
    
    // Verificar se há espaço suficiente antes de adicionar a próxima tabela
    checkPageHeight(yPosition, 20); // Substitua "40" pelo valor aproximado da altura da próxima tabela
    
    
  
    // Construir dados para a tabela de histórico
    const dataHistorico = this.historicoAlteracao.map(historico => [
      historico.campo_alterado,
      historico.campo_alterado.toLowerCase().includes('salario') ? `R$ ${parseFloat(historico.valor_antigo).toFixed(2)}` : historico.valor_antigo,
      historico.campo_alterado.toLowerCase().includes('salario') ? `R$ ${parseFloat(historico.valor_novo).toFixed(2)}` : historico.valor_novo,
      historico.usuario_id,
      formatDate(historico.data_alteracao),
    ]);
    
    // Adicionar tabela de histórico ao PDF
    autoTable(doc, {
      head: [['Campo Alterado', 'Valor Antigo', 'Valor Novo', 'Usuario_Id', 'Data da Alteração']],
      body: dataHistorico,
      startY: yPosition,
      margin: { left: margin, right: margin },
      styles: { fontSize: 6, cellPadding: 2 },
      headStyles: { fillColor: [0, 0, 80], textColor: 255 }, // Cor azul para o cabeçalho com texto branco
      didDrawPage: function (data) {
        // Adicionar rodapé em cada página
       // addPageNumber();
       // pageNumber++; // Incrementar o número da página
      },
      didDrawCell: function (data) {
        if (data.section === 'body' && data.row.index === data.table.body.length - 1) {
          finalYPosition = data.cell.y + data.cell.height;
        }
      }
    });
    
    // Ajustar a posição vertical após a tabela de histórico
    yPosition = finalYPosition + 10;
    
    // Adicionar título para a seção de histórico de médias
    doc.setFontSize(8);
    doc.setFont('Helvetica', 'bold');
    const historicoMediasTitle = 'Histórico Média Geral nas Avaliações';
    const historicoMediasTitleWidth = doc.getTextWidth(historicoMediasTitle);
    const historicoMediasTitleX = (pageWidth - historicoMediasTitleWidth) / 2;
    doc.text(historicoMediasTitle, historicoMediasTitleX, yPosition);
    yPosition += 10; // Ajustar a posição vertical
    
    // Verificar se há espaço suficiente antes de adicionar a próxima tabela
    checkPageHeight(yPosition, 40); // Substitua "40" pelo valor aproximado da altura da próxima tabela
    
    // Construir dados para a tabela de evolução das médias gerais
    const evolucaoMediaGeral = this.historicoMediaGeral;
    const dataEvolucaoMediaGeral = Object.keys(evolucaoMediaGeral).map(periodo => [
      periodo, evolucaoMediaGeral[periodo].toString()
    ]);
    
    // Adicionar tabela de evolução das médias ao PDF
    autoTable(doc, {
      head: [['Periodo','Nota']],
      body: dataEvolucaoMediaGeral,
      startY: yPosition,
      margin: { left: margin, right: margin },
      styles: { fontSize: 6, cellPadding: 2 },
      headStyles: { fillColor: [0, 0, 80], textColor: 255 }, // Cor azul para o cabeçalho com texto branco
      didDrawPage: function (data) {
        // Adicionar rodapé em cada página
        //addPageNumber();
        //pageNumber++; // Incrementar o número da página
      },
      didDrawCell: function (data) {
        if (data.section === 'body' && data.row.index === data.table.body.length - 1) {
          finalYPosition = data.cell.y + data.cell.height;
        }
      }
    });
    
    // Ajustar a posição vertical após a tabela de histórico de médias
    yPosition = finalYPosition + 10;
    
    // Adicionar título para a seção de histórico salarial
    doc.setFontSize(8);
    doc.setFont('Helvetica', 'bold');
    const historicoTitleSal = 'Histórico Salarial';
    const historicoTitleSalWidth = doc.getTextWidth(historicoTitleSal);
    const historicoTitleSalX = (pageWidth - historicoTitleSalWidth) / 2;
    doc.text(historicoTitleSal, historicoTitleSalX, yPosition);
    yPosition += 10; // Ajustar a posição vertical
    
    // Verificar se há espaço suficiente antes de adicionar a próxima tabela
    checkPageHeight(yPosition, 10); // Substitua "40" pelo valor aproximado da altura da próxima tabela
    
    // Construir dados para a tabela de histórico salarial
    const dataHistoricoSal = this.historicoSalario.map(historico => [
      historico.campo_alterado,
      historico.campo_alterado.toLowerCase().includes('salario') ? `R$ ${parseFloat(historico.valor_antigo).toFixed(2)}` : historico.valor_antigo,
      historico.campo_alterado.toLowerCase().includes('salario') ? `R$ ${parseFloat(historico.valor_novo).toFixed(2)}` : historico.valor_novo,
      historico.usuario_id,
      formatDate(historico.data_alteracao),
    ]);
    
    // Adicionar tabela de histórico salarial ao PDF
    autoTable(doc, {
      head: [['Campo Alterado', 'Valor Antigo', 'Valor Novo', 'Usuario_Id', 'Data da Alteração']],
      body: dataHistoricoSal,
      startY: yPosition,
      margin: { left: margin, right: margin },
      styles: { fontSize: 6, cellPadding: 2 },
      headStyles: { fillColor: [0, 0, 80], textColor: 255 }, // Cor azul para o cabeçalho com texto branco
      didDrawPage: function (data) {
        // Adicionar rodapé em cada página
        addPageNumber();
        pageNumber++; // Incrementar o número da página
      },
      didDrawCell: function (data) {
        if (data.section === 'body' && data.row.index === data.table.body.length - 1) {
          finalYPosition = data.cell.y + data.cell.height;
        }
      }
    });
  
    doc.setFontSize(6);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Data de Emissão: ${formattedDate}`, margin, doc.internal.pageSize.height - 15);
    
    // Download do arquivo PDF gerado
    doc.save(`relatorio_avaliados_${formattedDate}.pdf`);
  
  }







}
