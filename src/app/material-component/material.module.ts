import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialRoutes } from './material.routing';
import { MaterialModule } from '../shared/material-module';
import { VisualizarVendaProdutosComponent } from './dialog/visualizar-venda-produtos/visualizar-venda-produtos.component';
import { ConfirmationComponent } from './dialog/confirmation/confirmation.component';
import { AdministrarCategoriaComponent } from './administrar-categoria/administrar-categoria.component';
import { CategoriaComponent } from './dialog/categoria/categoria.component';
import { AdministrarProdutoComponent } from './administrar-produto/administrar-produto.component';
import { ProdutoComponent } from './dialog/produto/produto.component';
import { AdministrarPedidoComponent } from './administrar-pedido/administrar-pedido.component';
import { VisualizarVendaComponent } from './visualizar-venda/visualizar-venda.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MaterialRoutes),
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule
  ],
  providers: [],
  declarations: [
    VisualizarVendaProdutosComponent,
    ConfirmationComponent,
    AdministrarCategoriaComponent,
    CategoriaComponent,
    AdministrarProdutoComponent,
    ProdutoComponent,
    AdministrarPedidoComponent,
    VisualizarVendaComponent
  ]
})
export class MaterialComponentsModule {}
