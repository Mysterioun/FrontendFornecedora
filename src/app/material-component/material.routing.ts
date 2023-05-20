import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouteGuardService } from '../services/route-guard.service';
import { AdministrarCategoriaComponent } from './administrar-categoria/administrar-categoria.component';
import { AdministrarPedidoComponent } from './administrar-pedido/administrar-pedido.component';
import { AdministrarProdutoComponent } from './administrar-produto/administrar-produto.component';
import { VisualizarVendaComponent } from './visualizar-venda/visualizar-venda.component';


//Responsável por definir as rotas dos componentes, e também por definir o papel de cada usuário, distinguindo entre admin e cliente.

export const MaterialRoutes: Routes = [
    {
        path: "categoria",
        component: AdministrarCategoriaComponent,
        canActivate: [RouteGuardService],
        data:{
            expectedRole: ['admin']
        }
    },
    {
        path: "produto",
        component: AdministrarProdutoComponent,
        canActivate: [RouteGuardService],
        data:{
            expectedRole: ['admin']
        }
    },
    {
        path: "pedido",
        component: AdministrarPedidoComponent,
        canActivate: [RouteGuardService],
        data:{
            expectedRole: ['admin','cliente']
        }
    },
    {
        path: "venda",
        component: VisualizarVendaComponent,
        canActivate: [RouteGuardService],
        data:{
            expectedRole: ['admin','cliente']
        }
    }
];
