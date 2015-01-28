Regras de negócio do compartilhador
===

Frontend
---

### Assina Servidor
- Recebe uma lista de arquivos

### Publica para cliente
- Envia arquivos (nome e md5) e localizações

### Publica para Servidor
- Envia pedido de atualização de lista de arquivos
- Envia pedido de arquivos não-encontrados no cache, na busca expadida

Cliente
---

### Assina Frontend
- Receber arquivos (nome e md5) e localizações

### Assina Servidor
- Recebe pedido de atualização de arquivos
- Envia lista de arquivos disponíveis

### Assina Cliente
- Recebe parte de arquivo

### Publica para Servidor
- Envia atualização da lista de arquivos

### Publica para Cliente
- Envia parte de arquivos

Servidor
---

### Assina Cliente
- Recebe atualização da lista de arquivos

### Assina Frontend
- Recebe pedido de atualização de lista de arquivos

### Publica para Frontend
- Envia atualização de lista de arquivos
- Envia localização de arquivo ou erro

### Publica para Cliente
- Envia pedido de atualização de lista de arquivos
- Envia pedido de busca de arquivos