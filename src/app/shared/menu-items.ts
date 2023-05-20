import { state } from "@angular/animations";
import { Injectable } from "@angular/core";

export interface Menu{
    state:string;
    name:string;
    type:string;
    icon:string;
    role:string;

}

const MENUITEMS = [

    {state: 'dashboard', name: 'Dashboard', type: 'link', icon: 'dashboard', role: ''},
    {state: 'categoria', name: 'Administrar Categoria', type: 'link', icon: 'category', role: 'admin'},
    {state: 'produto', name: 'Administrar Produto', type: 'link', icon: 'inventory_2', role: 'admin'},
    {state: 'pedido', name: 'Administrar Pedido', type: 'link', icon: 'shopping_cart', role: ''},
    {state: 'venda', name: 'Visualizar Venda', type: 'link', icon: 'backup_table', role: ''}


]

@Injectable()
export class MenuItems{
    getMenuitem(): Menu[]{
        return MENUITEMS;
    }
}