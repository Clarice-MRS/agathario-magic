const lista = document.querySelector("#lista-produtos");
const formulario = document.querySelector('#form-produto');

async function carregarProdutos() {

    console.log("tudo numa boa");

    const resposta = await fetch('/produtos');

    const produtos = await resposta.json();

    lista.innerHTML = '';

    produtos.forEach(produto => {

        const linha = document.createElement('tr');

        linha.innerHTML = `
            <td>${produto.id}</td>
            <td>${produto.nome}</td>
            <td>${Number(produto.preco).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'})}
            </td>
            <td>${produto.estoque}</td>
            <td></td>
        `;

        const botaoExcluir = document.createElement('button');

        botaoExcluir.textContent = 'Excluir';

        botaoExcluir.addEventListener('click', async () => {

            const resposta = await fetch(`/produtos/${produto.id}`, {
                method: 'DELETE'
            });

            if (resposta.ok) {
                carregarProdutos();
            }

        });

        lista.append(linha);

        linha.lastElementChild.append(botaoExcluir);

    });

    console.log(produtos);

}

const selectCategoria = document.querySelector('#categoria_id');

async function carregarCategorias() {

    const resposta = await fetch('/categorias');

    const categorias = await resposta.json();

    categorias.forEach(categoria => {

        const opcao = document.createElement('option');

        opcao.value = categoria.id;
        opcao.textContent = categoria.nome;

        selectCategoria.append(opcao);

    });
}

formulario.addEventListener('submit', async (e) => {

    e.preventDefault();

    const dados = Object.fromEntries(new FormData(formulario));

    dados.preco = Number(dados.preco);
    dados.estoque = Number(dados.estoque);
    dados.categoria_id = Number(dados.categoria_id);

    const resposta = await fetch('/produtos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    });

    if (resposta.ok) {
        formulario.reset();
        carregarProdutos();
        alert('Produto cadastrado com sucesso!');
    } else {
        alert('Não foi possível cadastrar o produto.');
    }

});

carregarCategorias();

carregarProdutos();