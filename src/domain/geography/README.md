# Fundação geográfica — Angola

Este domínio representa a estrutura territorial administrativa usada para localizar explorações, parcelas, observações de campo e dados ambientais.

## Divisão político-administrativa

A primeira versão regista as 21 províncias e as respectivas sedes indicadas no artigo 2.º da Lei n.º 14/24, de 5 de Setembro. A nova divisão entrou em vigor em 1 de Janeiro de 2025.

A estrutura legal nacional é:
- 21 províncias;
- 326 municípios;
- 378 comunas.

O registo de software contém, nesta fase, as 21 províncias. As contagens de municípios e comunas são metadados de referência, não registos individuais.

## Códigos territoriais oficiais

Os códigos oficiais das 21 províncias foram transcritos do anexo da Lei n.º 8/25, de 16 de Setembro, publicado no Diário da República, I Série, n.º 176.

O código provincial completo usado neste domínio combina:
- o prefixo nacional `AO`;
- o identificador alfabético provincial de três letras;
- o número sequencial provincial definido no anexo.

Exemplo: Cabinda = `AOCDA01`.

Os IDs como `ao-huila` continuam a ser identificadores internos estáveis do Pambala. Não são códigos territoriais oficiais. Os códigos dos municípios e comunas ainda não foram importados.

A transcrição de dados administrativos deve ser confrontada com o PDF do Diário da República. Uma transcrição HTML secundária consultada durante a verificação apresentava divergência no número da comuna de Paredes (Quibaxe, Bengo); o PDF do diploma apresenta o código de comuna `02` e o código alfanumérico `AOBGO040202`. Por isso, a transcrição secundária não é usada como fonte de verdade.

## Proveniência

1. Assembleia Nacional, Lei n.º 14/24, de 5 de Setembro — Diário da República, I Série, n.º 171. Artigos 2.º e 3.º.
   https://c2a.portais.gov.ao/uploads/LEI_14_24_5_de_SETEMBRO_LEI_DA_DPA_043a0de85f.pdf
2. Ministério das Relações Exteriores, comunicação institucional sobre a entrada em vigor da nova divisão em 1 de Janeiro de 2025.
   https://brasil.mirex.gov.ao/web/noticias/nova-divisao-politica-administrativa
3. INE, Resultados Definitivos do Recenseamento Geral da População e Habitação 2024, Novembro de 2025. A análise foi ajustada à nova divisão político-administrativa.
   https://www.ine.gov.ao/Arquivos/arquivosCarregados/Carregados/Publicacao_638992698392586291.pdf
4. Assembleia Nacional, Lei n.º 8/25, de 16 de Setembro — Diário da República, I Série, n.º 176, incluindo o Anexo sobre a Codificação Nacional.
   https://files.lex.ao/assembleia-nacional/2025/lei-n-o-8-25-de-16-de-setembro/download/lei-n-o-8-25-de-16-de-setembro_assembleia-nacional_lex-ao.pdf

## Limites desta versão

- Não contém municípios, comunas ou localidades individualizados.
- Não contém geometrias, limites, áreas, centroides ou coordenadas.
- Não representa zonas agroecológicas nem classes de aptidão agrícola.
- Não se deve inferir equivalência entre uma província administrativa e uma região agroecológica.
- Alterações futuras à divisão administrativa devem ser versionadas; não se deve sobrescrever silenciosamente o histórico territorial.

## Próximos passos

1. Transcrever e testar os códigos oficiais dos 326 municípios e 378 comunas.
2. Validar contagens, unicidade de códigos, relações pai-filho e consistência entre o código hierárquico e o código alfanumérico publicado.
3. Obter geometrias administrativas verificáveis e documentar sistema de referência espacial, escala, data e licença.
4. Modelar zonas agroecológicas num domínio separado, com fonte, metodologia e resolução espacial próprias.
