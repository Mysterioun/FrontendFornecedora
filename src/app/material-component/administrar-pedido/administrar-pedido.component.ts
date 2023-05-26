import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoriaService } from 'src/app/services/categoria.service';
import { VendaService } from 'src/app/services/venda.service';
import { ProdutoService } from 'src/app/services/produto.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import Inputmask from 'inputmask'
import { UsuarioService } from 'src/app/services/usuario.service';
import { RouteGuardService } from 'src/app/services/route-guard.service';


@Component({
  selector: 'app-administrar-pedido',
  templateUrl: './administrar-pedido.component.html',
  styleUrls: ['./administrar-pedido.component.scss']
})

//Essa classe é responsável por administrar o pedido do cliente, ou seja, adicionar produtos, remover produtos, calcular o total e gerar o pdf.
export class AdministrarPedidoComponent implements OnInit {

  displayedColumns: string[] = ['nome', 'categoria', 'preco', 'quantidade', 'total', 'edit'];
  dataSource:any = [];
  administrarPedidoForm:any = FormGroup;
  categorias:any = [];
  produtos:any = [];
  usuario: any;
  preco:any;
  totalAmount:number = 0;
  responseMessage:any;

  constructor(private formBuilder: FormBuilder,
    private categoriaService: CategoriaService,
    private produtoService: ProdutoService,
    private usuarioService: UsuarioService,
    private snackbarService: SnackbarService,
    private routeService: RouteGuardService,
    private vendaService: VendaService,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.getCategorias();
    this.getUsuarioPeloId(6);
    this.administrarPedidoForm = this.formBuilder.group({
      nome:[null, [Validators.required,Validators.pattern(GlobalConstants.nomeRegex)]],
      email: [null, [Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      numeroContato: [null, [Validators.required,Validators.pattern(GlobalConstants.numeroContatoRegex)]],
      metodoPagamento:[null,[Validators.required]],
      produto: [null, [Validators.required]],
      categoria: [null, [Validators.required]],
      quantidade: [null, [Validators.required]],
      preco: [null, [Validators.required]],
      total: [0, [Validators.required]]
    });
    this.aplicarMascaraTelefone()
  }

  //Essa função é responsável filtrar as categorias de produtos.
  getCategorias(){
    this.categoriaService.getFiltrandoCategorias().subscribe((response:any)=>{
      this.ngxService.stop();
      this.categorias = response;
    },(error:any)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.Mensagem){
        this.responseMessage = error.error?.Mensagem;
      }
      else{
        this.responseMessage = GlobalConstants.erroGenerico;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  //Essa função é responsável por filtrar os produtos, atraves da categoria selecionada.
  getProdutosPelaCategoria(value:any){ 
    this.produtoService.getProdutosPelaCategoria(value.id).subscribe((response:any)=>{
      this.produtos = response;
      this.administrarPedidoForm.controls['preco'].setValue('');
      this.administrarPedidoForm.controls['quantidade'].setValue('');
      this.administrarPedidoForm.controls['total'].setValue(0);
    },(error:any)=>{
      console.log(error);
      if(error.error?.Mensagem){
        this.responseMessage = error.error?.Mensagem;
      }
      else{
        this.responseMessage = GlobalConstants.erroGenerico;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  //Essa função é responsável por recuperar os dados do produto selecionado.
  getProdutoDetalhes(value:any){
    this.produtoService.getPeloId(value.id).subscribe((response:any)=>{
      this.preco = response.preco;
      this.administrarPedidoForm.controls['preco'].setValue(response.preco);
      this.administrarPedidoForm.controls['quantidade'].setValue('1');
      this.administrarPedidoForm.controls['total'].setValue(this.preco * 1);    
    },(error:any)=>{
      console.log(error);
      if(error.error?.Mensagem){
        this.responseMessage = error.error?.Mensagem;
      }
      else{
        this.responseMessage = GlobalConstants.erroGenerico;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    }) 
  }

  //Essa função é resposavel por setar a quantidade de produtos e o total.
  setQuantidade(value:any){
    var temp = this.administrarPedidoForm.controls['quantidade'].value;
    if(temp > 0){
      this.administrarPedidoForm.controls['total'].setValue(this.administrarPedidoForm.controls['quantidade'].value * this.administrarPedidoForm.controls['preco'].value);
    }
    else if(temp != ''){
      this.administrarPedidoForm.controls['quantidade'].setValue('1');
      this.administrarPedidoForm.controls['total'].setValue(this.administrarPedidoForm.controls['quantidade'].value * 
        this.administrarPedidoForm.controls['preco'].value);
    }
  }

  validateProdutoAdd(){
    if(this.administrarPedidoForm.controls['total'].value === 0 || this.administrarPedidoForm.controls['total'].value === null || 
      this.administrarPedidoForm.controls['quantidade'].value <= 0){
        return true;
    }
    else{
      return false;
    }
  }
  validateSubmit(){
   if(this.totalAmount === 0 || this.administrarPedidoForm.controls['nome'].value === null || this.administrarPedidoForm.controls['email'].value === null || 
   this.administrarPedidoForm.controls['numeroContato'].value === null || this.administrarPedidoForm.controls['metodoPagamento'].value === null){
    return true;
   }   
   else{
    return false;
   }
  }

  //Funcção responsável por adicionar os produtos na tabela.

  add(){
    var formData = this.administrarPedidoForm.value;
    var produtoNome = this.dataSource.find((e: {id:number}) => e.id === formData.produto.id);
    if(produtoNome === undefined){
      this.totalAmount = this.totalAmount + formData.total;
      this.dataSource.push({id:formData.produto.id, nome:formData.produto.nome, categoria:formData.categoria.nome, quantidade:formData.quantidade, preco:formData.preco, total:formData.total});
      this.dataSource = [...this.dataSource];
      this.snackbarService.openSnackBar(GlobalConstants.produtoAdicionado,"success");
    }
    else{
      this.snackbarService.openSnackBar(GlobalConstants.produtoExisteErro, GlobalConstants.error);
    }
  }

  //Função responsável por excluir oo produto da tabela.

  handleExcluirAction(value:any, element:any){
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value, 1);
    this.dataSource = [...this.dataSource];
  }

  submitAction(){
    var formData = this.administrarPedidoForm.value;
    var data = {
      nome: formData.nome,
      email: formData.email,
      numeroContato: formData.numeroContato,
      metodoPagamento: formData.metodoPagamento,
      totalAmount: this.totalAmount.toString(),
      produtoDetalhes: JSON.stringify(this.dataSource) 
    }

    this.ngxService.start();
    this.vendaService.gerarReport(data).subscribe((response:any)=>{
      this.downloadFile(response?.uuid);
      this.administrarPedidoForm.reset();
      this.dataSource = [];
      this.totalAmount = 0;
    },(error:any)=>{
      console.log(error);
      if(error.error?.Mensagem){
        this.responseMessage = error.error?.Mensagem;
      }
      else{
        this.responseMessage = GlobalConstants.erroGenerico;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  //Essa função é responsável por fazer o download do arquivo pdf, referente ao pedido.
  downloadFile(fileName: string){
    var data = {
      uuid: fileName
    }
    this.vendaService.getPdf(data).subscribe((response:any)=>{
      saveAs(response,fileName + '.pdf');
      this.ngxService.stop();
    })
  }

  aplicarMascaraTelefone() {
    const telefoneInput = document.getElementById('numeroContato') as HTMLInputElement;
    const telefoneMask = Inputmask('(99) 99999-9999');
    telefoneMask.mask(telefoneInput);
  }

  //Essa função é responsável por recuperar os dados do usuário logado.
  getUsuarioPeloId(id: any){
    this.usuarioService.getPeloId(id).subscribe((response:any)=>{
      this.usuario = response;
      this.administrarPedidoForm.controls['nome'].setValue(this.usuario.nome);
      this.administrarPedidoForm.controls['email'].setValue(this.usuario.email);
      this.administrarPedidoForm.controls['numeroContato'].setValue(this.usuario.numeroContato);
    },(error:any)=>{
      console.log(error);
      if(error.error?.Mensagem){
        this.responseMessage = error.error?.Mensagem;
      }
      else{
        this.responseMessage = GlobalConstants.erroGenerico;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })

  }

}
