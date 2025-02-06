import { RouterModule, Routes } from '@angular/router';
import { SentinelAuthGuardWithLogin, SentinelNegativeAuthGuard } from '@sentinel/auth/guards';
import { SentinelAuthProviderListComponent } from '@sentinel/auth/components';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: 'topology',
        loadChildren: () => import('./topology/topology-page/topology-page.module').then((m) => m.TopologyPageModule),
        canActivate: [SentinelAuthGuardWithLogin],
    },
    {
        path: '',
        redirectTo: 'topology',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: SentinelAuthProviderListComponent,
        canActivate: [SentinelNegativeAuthGuard],
    },
    {
        path: '**',
        redirectTo: 'topology',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: false })],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
