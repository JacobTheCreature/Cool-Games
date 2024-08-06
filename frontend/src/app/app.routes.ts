import { Routes } from '@angular/router';
import { GameframeComponent } from './modules/gameframe/gameframe.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: 'game-frame/:id',
        component: GameframeComponent
    },
    {
        path: '',
        component: DashboardComponent
    }
];
