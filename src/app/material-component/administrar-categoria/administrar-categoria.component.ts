import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoriaService } from 'src/app/services/categoria.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CategoriaComponent } from '../dialog/categoria/categoria.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-administrar-categoria',
  templateUrl: './administrar-categoria.component.html',
  styleUrls: ['./administrar-categoria.component.scss']
})

//Essa classe é responsável por exibir a tela de administração de categorias.

export class AdministrarCategoriaComponent implements OnInit {

  displayedColumns: string[] = ['nome', 'edit'];
  dataSource:any;
  responseMessage: any;

  constructor(private categoriaService: CategoriaService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  //Essa função é responsável por exibir as categorias, utilizando o serviço de categoria para fazer a requisição.
  
  tableData(){ 
    this.categoriaService.getCategorias().subscribe((response: any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
    },(error:any)=>{
      this.ngxService.stop();
      console.log(error.error?.message);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.erroGenerico;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  //Essa função é responsável por filtrar as categorias.

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  //Função responsável por exibir o dialog de adicionar categoria, dialog seria uma espécie de modal, que é exibido em cima da tela atual, como um popup.

  handleAddAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data={
      action: 'Add'
    };
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(CategoriaComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCategoria.subscribe((response)=>{
      this.tableData();
    })
  }

  //Função responsável por exibir o dialog de editar categoria.
  
  handleEditAction(values: any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data={
      action: 'Edit',
      data: values
    };
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(CategoriaComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCategoria.subscribe((response)=>{
      this.tableData();
    })
  }

  //Função responsável por exibir o dialog de excluir categoria.

  handleExcluirAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data ={
      message: 'excluir '+values.nome,
      confirmation:true
    }
    const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.ngxService.start();
      this.excluirCategoria(values.id);
      dialogRef.close();
    })
  }
  
  excluirCategoria(id:any){
    this.categoriaService.excluir(id).subscribe((response:any)=>{
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    },(error:any)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.erroGenerico;
      }
     // this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

}
