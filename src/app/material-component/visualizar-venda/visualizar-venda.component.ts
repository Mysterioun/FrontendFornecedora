import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { VendaService } from 'src/app/services/venda.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { VisualizarVendaProdutosComponent } from '../dialog/visualizar-venda-produtos/visualizar-venda-produtos.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-visualizar-venda',
  templateUrl: './visualizar-venda.component.html',
  styleUrls: ['./visualizar-venda.component.scss']
})

//Essa classe é responsável por exibir a tela de visualização de vendas.
export class VisualizarVendaComponent implements OnInit {


  displayedColumns: string[]=['nome','email', 'numeroContato', 'metodoPagamento', 'total', 'view'];
  dataSource: any;
  responseMessage:any;

  constructor(private vendaService:VendaService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData(){
    this.vendaService.getVendas().subscribe((response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
    },(error:any)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.erroGenerico;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  //Filtro de pesquisa de vendas.
  
  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  handleViewAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data:values
    }
    dialogConfig.width = "100%";
    const dialogRef = this.dialog.open(VisualizarVendaProdutosComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
  }

  //Função responsável por exibir o dialog de confirmação de exclusão de venda, dialog que seria um pop-up.

  handleExcluirAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data={
      message:'excluir a venda de '+values.nome,
      confirmation:true
    };
    const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.ngxService.start();
      this.excluirVenda(values.id);
      dialogRef.close();
    })
  }

  //Função responsável por excluir a venda.

  excluirVenda(id:any){
    this.vendaService.excluir(id).subscribe((response:any)=>{
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,"success");
    },(error:any)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.erroGenerico;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  //Função responsável por exibir o dialog de confirmação de download de venda, dialog que seria um pop-up.
  downloadReportAction(values:any){
    this.ngxService.start();
    var data ={
      nome: values.nome,
      email: values.email,
      uuid: values.uuid,
      numeroContato: values.numeroContato,
      metodoPagamento: values.metodoPagamento,
      totalAmount: values.total.toString(),
      produtoDetalhes: values.produtoDetalhes
    }
    this.downloadFile(values.uuid, data);
  }

  //Função responsável por fazer o download do recibo da venda.
  downloadFile(fileName:string, data:any){
    this.vendaService.getPdf(data).subscribe((response)=>{
      saveAs(response,fileName+'.pdf');
      this.ngxService.stop();
    })
  }
}
