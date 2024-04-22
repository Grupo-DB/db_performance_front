import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ColaboradorResponse } from '../../types/colaborador-response';

@Injectable({
  providedIn: 'root'
})
export class RegisterColaboradorService {
  private apiUrl = 'http://localhost:8000/management/registercolaborador/';
  constructor(private  httpClient: HttpClient, private router: Router) { }

  // registercolaborador(
  //   nome: string, 
  //   empresa: string, 
  //   filial: string,
  //   area:string,
  //   setor:string,
  //   cargo:string,
  //   tipocontrato: string,
  //   data_admissao: Date | null, // Alteração aqui para aceitar null
  //   situacao: boolean | null,
  //   genero: string | null,
  //   estado_civil: string | null,
  //   data_nascimento: Date | null, // Alteração aqui para aceitar null
  //   data_troca_setor: Date | null, // Alteração aqui para aceitar null
  //   data_troca_cargo: Date | null, // Alteração aqui para aceitar null
  //   data_demissao: Date | null, // Alteração aqui para aceitar null
  //   image: any
  // ){
  //   // Verifica se os campos de data são null e substitui por null se estiverem vazios
  //   if (!data_admissao) {
  //     data_admissao = null;
  //   }
  //   if (!situacao) {
  //     situacao = null;
  //   }
  //   if (!genero) {
  //     genero = null;
  //   }

  //   if (!estado_civil) {
  //     estado_civil = null;
  //   }
  //   if (!data_nascimento) {
  //     data_nascimento = null;
  //   }
  //   if (!data_troca_setor) {
  //     data_troca_setor = null;
  //   }
  //   if (!data_troca_cargo) {
  //     data_troca_cargo = null;
  //   }
  //   if (!data_demissao) {
  //     data_demissao = null;
  //   }
   
    registercolaborador(formData: FormData) {
      return this.httpClient.post<ColaboradorResponse>(this.apiUrl, formData).pipe(
        tap(() => {
          this.router.navigate(['/dashboard']);
        })
      );
    }
  }




//     return this.httpClient.post<ColaboradorResponse>(this.apiUrl,{
//       nome,
//       empresa,
//       filial,
//       area,
//       setor,
//       cargo,
//       tipocontrato,
//       data_admissao,
//       situacao,
//       genero,
//       estado_civil,
//       data_nascimento,
//       data_troca_setor,
//       data_troca_cargo,
//       data_demissao,
//       image
//     },).pipe(
//       tap(() => {
//         this.router.navigate(['/dashboard']);
//       })
//     );
//   }   
// }