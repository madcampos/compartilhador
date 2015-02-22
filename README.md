Compartilhador de arquivos
===

Compartilhador de arquivos para o trabalho de Sistemas Distribuidos utilizando um modelo descentralizado baseado no padrão de projeto pub/sub.

Requisitos
---

1. troca de arquivos entre clientes.
2. compartilhar informações entre os servidores, de modo que um arquivo publicado por um `cliente a`, conectado a um `servidor b` seja visto por um `cliente d` em um `servidor c`.
3. configurações/regras de negócio contendo o tamanho mínimo das partes dos arquivos, etc.

Executando
---

Para executar o código é necessário baixar o programa [io.js](https://iojs.org/).
Após a instalação, descompacte a pasta do projeto e execute os seguintes comandos:
```
$ npm install
$ iojs --harmony --harmony_arrays --harmony_array_includes [nome do arquivo]
```
Substitua `nome do arquivo` por um dos módulos do sistema: cliente, servidor, super-servidor.
