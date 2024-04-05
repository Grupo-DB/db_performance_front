import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CreateuserComponent } from './pages/createuser/createuser.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';

export const routes: Routes = [
    {
        path:"login",
        component: LoginComponent
    },
    {
        path:"cadastrar",
        component: CreateuserComponent

    },
    {
        path:"dashboard",
        component: DashboardComponent

    },
    {
        path:"welcome",
        component: WelcomeComponent

    }
];
