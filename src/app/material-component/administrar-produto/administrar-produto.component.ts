import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProdutoService } from 'src/app/services/produto.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ProdutoComponent } from '../dialog/produto/produto.component';

@Component({
  selector: 'app-administrar-produto',
  templateUrl: './administrar-produto.component.html',
  styleUrls: ['./administrar-produto.component.scss']
})

//Essa classe é responsável por exibir a tela de administração de produtos.
export class AdministrarProdutoComponent implements OnInit {

  displayedColumns: string[] = ['nome', 'categoriaNome', 'descricao', 'preco', 'edit'];
  dataSource:any;
  // length1:any;
  responseMessage:any;

  constructor(private produtoService: ProdutoService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  //Essa função é responsável por exibir os produtos, utilizando o serviço de produto para fazer a requisição.

  tableData(){
    this.produtoService.getProdutos().subscribe((response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
    },(error:any)=>{
      this.ngxService.stop();
      console.log(error.error?.Mensagem);
      if(error.error?.Mensagem){
        this.responseMessage = error.error?.Mensagem;
      }
      else{
        this.responseMessage = GlobalConstants.erroGenerico;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  //Filtro de pesquisa de produtos.

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  //Essa função é responsável por exibir o dialog de adicionar produto, dialog que seria o formulário de adicionar produto.
  handleAddAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Adicionar'
    };
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(ProdutoComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAddProduto.subscribe((response)=>{
      this.tableData();
    })
  }

  //Essa função é responsável por exibir o dialog de editar produto.
  handleEditAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Editar',
      data:values
    };
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(ProdutoComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onEditProduto.subscribe((response)=>{
      this.tableData();
    })
  }

  //Essa função é responsável por exibir o dialog de excluir produto.

  handleExcluirAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data ={
      Mensagem: 'excluir '+values.nome,
      confirmation:true
    }
    const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.ngxService.start();
      this.excluirProduto(values.id);
      dialogRef.close();
    })
  }
  excluirProduto(id:any){
    this.produtoService.excluir(id).subscribe((response:any)=>{
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = response?.Mensagem;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    },(error:any)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.Mensagem){
        this.responseMessage = error.error?.Mensagem;
      }
      else{
        this.responseMessage = GlobalConstants.erroGenerico;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  //Essa função é responsável por exibir o dialog de editar status do produto, marcando como ativo ou inativo.

  onChange(status:any, id:any){
    this.ngxService.start();
    var data = {
      status: status.toString(),
      id:id
    }
    this.produtoService.editarStatus(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.responseMessage = response?.Mensagem;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    },(error:any)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.Mensagem){
        this.responseMessage = error.error?.Mensagem;
      }
      else{
        this.responseMessage = GlobalConstants.erroGenerico;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

}
