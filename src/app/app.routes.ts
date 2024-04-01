import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CadastrarComponent } from './pages/cadastrar/cadastrar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path:"login",
        component: LoginComponent
    },
    {
        path:"cadastrar",
        component: CadastrarComponent

    },
    {
        path:"dashboard",
        component: DashboardComponent

    }
];
