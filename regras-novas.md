Estrutura da rede
===

Supser servidor
---

1. Um `super servidor` que tem somente a função de manter a lista de `servidores` atualizada. Qualquer parte que requeira esta lista deve requerer ao `super servidor`.
2. `servidores` que desejem conectar devem fornecer uma chave unica de identificação para se autenticar ao `super servidor`.

Servidor
---

1. `Servidores` que mantem a lista de arquivos sincronizada entre eles e envia somente o diff da lista para os outros `servidores`, com o arquivo (nome e md5) e os usuários que possuem ele

Cliente
---

1. Verifica atualização de arquivos em uma pasta, caso haja alterações notifica o `servidor`.
2. Mantem uma conexão aberta com o `servidor`, atualizada via long pooling (?)
3. Divide os arquivos em pedaços de 64kb (dados + cabeçalho http + etc = 1pck tcp) (~56kb) e cria o hash md5 das partes
4. Publica para o `servidor`: lista de arquivos, as partes dos arquivos, os hashs, nome dos arquivos e hash do arquivo completo
5. Recebe requisições do `frontend` (tuneladas pelo `servidor`) para enviar arquivos para aconexão aberta pelo `frontend`

Frontend
---

1. Pega a lista de `servidores` do `super servidor` e se conecta ao `servidor` mais próximo via ping e geolocalização
2. Realiza atualizações no cache de arquivos conforme requisição do usuário e na primeira execução (possivel divisão da lista como um arquivo a ser compartilhado)
3. Abre uma conexão (UPnP?) para receber as partes do arquivo buscado, notifica o `servidor` que deseja fazer o download do arquivo e recebe a lista das partes do arquivo e `clientes` que possuem este arquivo. O `servidor` notifica os clientes que o `frontend` deseja fazer o download do arquivo e estes então se conectam ao `frontend` para a troca de arquivos.

Troca de arquivos
---

1. `Frontend` realiza busca em seu cache local e encontra o arquivo
2. `Frontend` notifica o `servidor` que deseja baixar um arquivo e envia o hash desse arquivo para o `servidor`
3. `Servidor` envia lista de `clientes`, partes e hash das partes para o `frontend`
4. `Servidor` notifica `clientes` que o `frontend` deseja daixar um arquivo e envia o hash deste arquivo para os `clientes`
5. `Clientes` estabelecem conexão com o `frontend` para saber qual parte do arquivo ele deseja
6. `Clientes` enviam parte desejada para o `frontend`

Caso o `cliente` esteja conectado a outro `servidor`, o `servidor` inicial notifica outro para que este notifique o `cliente`

Estrutura de comunicação
===

As transferências entre as partes podem ser feitas através de diffs temporais, e/ou versões dos arquivos

Entradas de cache do frontend
---

```json
{
	"names": ["Nome do arquivo", "Nome alternativo"],
	"hash": "<MD5 hash>"
}
```

A busca é realizada dentro da lista de nomes por meio da entrada do usuário como uma substring do nome.


Entradas de cache no servidor
---

```json
{
	"names": ["Nome do arquivo", "Nome alternativo"],
	"hash": "<MD5 hash>",
	"parts": ["<MD5 hash>"]
}
```
O cache de arquivos atualiza por blocos a cada hora (?)

Entradas de clientes conectados ao servidor
---

```json
{
	"address": "<Endereço do cliente>",
	"server": "<Endereço do servidor>",
	"files": ["<MD5 hash>"]
}
```
O cache de clientes atualiza por blocos a cada minuto (?)

Entradas de servidores conectados ao super-servidor
---
```json
{
	"address": "<Endereço do servidor>",
	"region": "<Região do servidor>",
	"metadata": ["<Flags do servidor>"]
}
```

Mensagem de conexão com o super-servidor
---
```json
{
	"address": "<Endereço do servidor>",
	"key": "<Chave de autenticação do servidor>",
	"region': "<Região do servidor>",
	"intent": "<Intenção do servidor>",
	"metadata": ["<Flags do servidor>"]
}
```