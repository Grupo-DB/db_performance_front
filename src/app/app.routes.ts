import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { CreateuserComponent } from './pages/createuser/createuser.component';
import { RegisterCompanyComponent } from './pages/registercompany/registercompany.component';
import { AreaComponent } from './pages/area/area.component';
import { FilialComponent } from './pages/filial/filial.component';
import { SetorComponent } from './pages/setor/setor.component';
import { CargoComponent } from './pages/cargo/cargo.component';


export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'welcome', component: WelcomeComponent, 
    children: [
      { path: 'createuser', component: CreateuserComponent },
      { path: 'registercompany', component: RegisterCompanyComponent },
      { path: 'area', component: AreaComponent },
      { path: 'filial', component: FilialComponent },
      { path: 'setor', component:SetorComponent },
      { path: 'cargo', component:CargoComponent}
    ],
  },
  //{ path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) }
];
