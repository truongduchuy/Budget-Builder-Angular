import { Routes } from '@angular/router';
import { BudgetBuilderComponent } from '../components/budget-builder/budget-builder.component';

export const routes: Routes = [
    { path: '', redirectTo: '/budget-builder', pathMatch: 'full' },
    { path: 'budget-builder', component: BudgetBuilderComponent },
];
