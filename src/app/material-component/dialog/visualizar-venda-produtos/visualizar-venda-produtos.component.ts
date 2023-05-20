import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-visualizar-venda-produtos',
  templateUrl: './visualizar-venda-produtos.component.html',
  styleUrls: ['./visualizar-venda-produtos.component.scss']
})

//Classe responsável por exibir os produtos de uma venda.
export class VisualizarVendaProdutosComponent implements OnInit {

  displayedColumns : string[] = ['nome', 'categoria', 'preco', 'quantidade', 'total'];
  dataSource:any;
  data:any;
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  public dialogRef :MatDialogRef<VisualizarVendaProdutosComponent>) { }

  ngOnInit() {
    this.data = this.dialogData.data;
    this.dataSource = JSON.parse(this.dialogData.data.produtoDetalhes);
    console.log(this.dialogData.data);
  }
}
