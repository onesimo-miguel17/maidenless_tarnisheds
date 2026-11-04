# Biblioteca de culturas

Cada cultura é um registo independente, tipado por `CropProfile`. Intervalos numéricos podem ser `null` enquanto não houver evidência técnica suficiente. Não preencher lacunas com valores inventados.

Estados de evidência:
- `verified`: sustentado por fonte técnica identificada e validado para o contexto indicado.
- `general-guidance`: orientação geral, não necessariamente específica para Angola.
- `pending-validation`: dado ainda em investigação; não deve influenciar avaliações.

A biblioteca inicial prevista inclui milho, feijão comum, mandioca, amendoim, sorgo e batata-doce.

## Avaliação inicial de compatibilidade

`assessCropAgainstSoil` faz uma primeira comparação conservadora entre o pH medido e o intervalo de referência da cultura. Não calcula uma pontuação artificial nem transforma dados desconhecidos em incompatibilidades.

Estados possíveis:
- `provisional-match`: o pH conhecido está dentro do intervalo de referência utilizável. Não significa que a cultura esteja globalmente recomendada.
- `review-required`: o pH conhecido está fora do intervalo de referência; é necessária avaliação técnica.
- `insufficient-data`: não há medição de pH ou intervalo de referência com evidência utilizável.

Nesta fase, textura, drenagem, água, clima, época de plantio, fertilidade e maneio são explicitamente identificados como factores ainda não avaliados. A avaliação não substitui aconselhamento agronómico nem validação local.
