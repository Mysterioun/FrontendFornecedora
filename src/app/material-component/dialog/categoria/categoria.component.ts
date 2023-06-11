import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoriaService } from 'src/app/services/categoria.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})

//Classe responsável por adicionar e editar categorias que serão utilizadas para classificar os produtos.
export class CategoriaComponent implements OnInit {

  onAddCategoria = new EventEmitter();
  onEditCategoria = new EventEmitter();
  categoriaForm: any = FormGroup; 
  dialogAction: any = "Adicionar";
  action:any = "Adicionar";

  responseMessage: any;
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private formBuilder: FormBuilder,
  private categoriaService: CategoriaService,
  public dialogRef: MatDialogRef<CategoriaComponent>,
  private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.categoriaForm = this.formBuilder.group({
      nome:[null,[Validators.required]]
    });
    if(this.dialogData.action === 'Editar'){
      this.dialogAction = "Editar";
      this.action = "Editar"
      this.categoriaForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit(){
    if(this.dialogAction === 'Editar'){
      this.edit();
    }
    else{
      this.add();
    }
  }

  //Essa função é responsável por adicionar uma categoria, utilizando o serviço categoriaService.

  add(){
    var formData = this.categoriaForm.value;
    var data ={
      nome: formData.nome
    }

    this.categoriaService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddCategoria.emit();
      this.responseMessage = response.Mensagem;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    },(error)=>{
      this.dialogRef.close();
      console.error(error);
      if(error.error?.Mensagem){
        this.responseMessage = error.error?.Mensagem;
      }
      else{
        this.responseMessage = GlobalConstants.erroGenerico;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }

  //Essa função é responsável por editar uma categoria, utilizando o serviço categoriaService.
 
  edit(){
    var formData = this.categoriaForm.value;
    var data ={
      id:this.dialogData.data.id,
      nome: formData.nome
    }

    this.categoriaService.editar(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddCategoria.emit();
      this.responseMessage = response.Mensagem;
      console.log;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    },(error)=>{
      this.dialogRef.close();
      console.error(error);
      if(error.error?.Mensagem){
        this.responseMessage = error.error?.Mensagem;
      }
      else{
        this.responseMessage = GlobalConstants.erroGenerico;
        
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });

  }

}
