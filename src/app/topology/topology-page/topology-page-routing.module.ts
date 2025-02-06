import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopologyPageComponent } from './topology-page.component';

const routes: Routes = [
    {
        path: '',
        component: TopologyPageComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TopologyPageRoutingModule {
}
