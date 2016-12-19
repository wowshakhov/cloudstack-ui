import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, LoginGuard } from './shared/services';
import { LoginComponent } from './auth/login.component';

import { VmListComponent } from './vm/vm-list.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [
      LoginGuard
    ]
  },
  {
    path: 'instances',
    component: VmListComponent,
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: '**',
    redirectTo: '/instances',
  }
];

export const routing = RouterModule.forRoot(routes);
