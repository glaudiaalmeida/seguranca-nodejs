const { Router } = require('express')
const ProdutoController = require('../controllers/produtoController')
const roles = require('../middleware/roles')

const router = Router()

router
  .post('/produto', ProdutoController.cadastrarProduto)
  .get('/produto', ProdutoController.buscarTodosProdutos) //permissoes(["editar"]),  => permissoes is not defined(erro terminal)
  .get('/produto/id/:id', ProdutoController.buscarProdutoPorId)
  .delete('/produto/id/:id', ProdutoController.deletarProdutoPorId)
  .put('/produto/id/:id', ProdutoController.editarProduto)

module.exports = router;