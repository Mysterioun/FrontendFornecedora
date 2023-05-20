export class GlobalConstants{


    //Mensagem
    public static erroGenerico: string = "Algo deu errado. Tente mais tarde.";

    public static acessoNaoAutorizado: string = "Você não possui autorização para acessar essa pagina.";

    public static produtoExisteErro: string = "Produto já existe!";

    public static produtoAdicionado: string = "Produto adicionado com sucesso";


    //Regex

    public static nomeRegex: string = "[a-zA-Z0-9 ]*";
    public static emailRegex: string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";
    public static numeroContatoRegex: string = "^[0-9() -]{0,15}$";

    //Variavel

    public static error: string = "error";


}