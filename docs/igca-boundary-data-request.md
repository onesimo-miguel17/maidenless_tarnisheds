# Pedido institucional de dados geoespaciais — IGCA

> **Estado:** minuta para revisão e envio pela equipa Pambala.  
> **Destinatário sugerido:** info@igca.gov.ao  
> **Assunto sugerido:** Solicitação de informação geoespacial oficial — limites administrativos de Angola

## Minuta de email

Exmos. Senhores,

A equipa do projeto **Pambala — Agricultural Intelligence Platform**, desenvolvido no âmbito do NASA Space Apps Challenge 2026, vem por este meio solicitar orientação sobre a disponibilidade e as condições de acesso a dados geoespaciais oficiais da República de Angola.

O projeto procura apoiar a análise agrícola através da combinação responsável de informação de solos, dados climáticos da NASA e estatísticas agrícolas oficiais. Para evitar atribuições geográficas incorretas, pretendemos utilizar exclusivamente limites administrativos cuja origem, versão e autoridade responsável possam ser confirmadas.

Neste sentido, agradecíamos que nos pudessem informar sobre a disponibilidade dos seguintes dados, em versão compatível com a divisão político-administrativa em vigor:

1. Limites das **21 províncias**;
2. Limites dos **326 municípios**;
3. Limites das **378 comunas**, caso estejam disponíveis.

Se possível, solicitamos os dados num dos seguintes formatos: GeoPackage, Shapefile ou GeoJSON. Em alternativa, agradecemos a indicação de um serviço geográfico oficial documentado, como WFS, OGC API Features ou ArcGIS REST.

Para assegurar a correta utilização técnica e institucional dos dados, gostaríamos também de obter, se disponíveis:

- Nome oficial do conjunto de dados, entidade produtora e contacto técnico responsável;
- Data de publicação, versão e data da última atualização;
- Sistema de referência de coordenadas, datum, unidades e parâmetros de transformação;
- Escala de origem, resolução ou precisão posicional e limitações conhecidas;
- Códigos oficiais e nomenclatura das unidades administrativas;
- Termos de utilização, licença, regras de atribuição e autorização para reutilização ou redistribuição;
- Confirmação de conformidade com a Lei n.º 14/24, de 5 de Setembro, e eventuais retificações ou alterações posteriores;
- Caso exista, uma tabela oficial de correspondência entre a divisão administrativa histórica de 18 províncias e a divisão atual de 21 províncias, relevante para interpretar séries estatísticas anteriores.

Os dados serão utilizados para contextualização geográfica e investigação aplicada. Não pretendemos substituir a cartografia oficial nem publicar limites como oficiais sem a devida confirmação da entidade competente. Até à validação da fonte e das condições de utilização, manteremos desativada qualquer atribuição automática de província ou município a partir de coordenadas.

Caso o IGCA não disponibilize diretamente estes dados, agradeceríamos a indicação da instituição ou serviço público competente a que deveremos dirigir o pedido.

Agradecemos desde já a atenção e a orientação que nos possam prestar.

Com os melhores cumprimentos,

**Equipa Pambala**  
NASA Space Apps Challenge 2026  
Angola

---

## Checklist antes do envio

- [ ] Confirmar quem será o contacto institucional responsável pelo envio.
- [ ] Acrescentar uma breve apresentação da equipa, se necessário.
- [ ] Confirmar se o pedido deve ser dirigido ao IGCA ou encaminhado por outro canal institucional.
- [ ] Enviar para info@igca.gov.ao apenas após revisão e autorização da equipa.
- [ ] Guardar a resposta, anexos, metadados e condições de licença no repositório, sem publicar dados de contacto pessoais.
- [ ] Não integrar os limites na aplicação até validar proveniência, licença, CRS, geometria e consistência com a divisão legal em vigor.

## Critérios técnicos de aceitação dos dados

A receção de um ficheiro não equivale à sua aprovação. Antes de qualquer integração:

1. Confirmar formalmente a entidade produtora, proveniência, versão e licença.
2. Confirmar cobertura e contagem esperada das unidades administrativas, sem assumir que a contagem por si só prova validade.
3. Validar CRS, datum, unidades e transformações necessárias.
4. Verificar geometrias inválidas, duplicados, lacunas, sobreposições e elementos fora do território.
5. Comparar nomes, códigos e organização com a legislação e documentação oficial.
6. Testar pontos em fronteiras e zonas costeiras; resultados ambíguos devem exigir revisão.
7. Documentar limitações, data de validade e atribuição exigida pela licença.

**Regra de produto:** até à conclusão desta validação, coordenadas podem ser usadas para consultar dados climáticos, mas não para atribuir automaticamente uma província, município ou comuna.
