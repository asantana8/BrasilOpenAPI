# BrasilAPI SIREQ

SPA em Angular para consulta de dados cadastrais de empresas na Receita Federal, via [BrasilAPI](https://brasilapi.com.br/), prototipando a inteligência de classificação de esfera administrativa a ser reaproveitada na gestão de entidades devedoras do SIREQ. Desenvolvida conforme `spec/mvp1/PRD_AI_READY_Angular_BrasilAPI.md` e `spec/mvp2/PRD_AI_READY_Angular_BrasilAPI_v2.md`.

## Stack

- Angular 20 (Standalone Components, sem NgModules)
- TypeScript em modo `strict`
- Bootstrap 5.3 (via npm, apenas CSS — não há dependência de JS/Popper)
- Reactive Forms
- Angular HttpClient + RxJS
- Karma / Jasmine para testes unitários

## Pré-requisitos

- Node.js 20+ (testado com Node 22)
- npm 10+

## Instalação

```bash
npm install
```

## Executando em desenvolvimento

```bash
npm start
```

Acesse `http://localhost:4200` para o portal de consultas. A consulta legada de CNPJ continua disponível em `http://localhost:4200/cnpj`.

## Build de produção

```bash
npm run build
```

Os artefatos são gerados em `dist/brasilapi-sireq/`. O build de produção usa `src/app/environments/environment.prod.ts` (com `production: true` e a mesma URL base da BrasilAPI).

## Testes unitários

```bash
npm test
```

Cobrem:
- `cnpj.validator.spec.ts` — validação de CNPJ (obrigatoriedade, quantidade de dígitos, sequência repetida, dígito verificador módulo 11).
- `cnpj.util.spec.ts` — sanitização e máscara progressiva de CNPJ.
- `brasil-api.service.spec.ts` — integração HTTP mockada com `HttpTestingController`, cobrindo sucesso e os erros 400/404/429/500/rede.
- `classificacao-esfera.service.spec.ts` — inferência de esfera administrativa (CT-04 a CT-07 do PRD v2).
- `app.spec.ts` — bootstrap do componente raiz.

## Estrutura do projeto

## Portal de consultas (mvp2)

A rota inicial reúne três consultas independentes definidas em `spec/mvp2/PRD_AI_READY_BrasilAPI_CEP_IBGE_Feriados.md`:

- **CEP** — consulta endereço por CEP, aceitando máscara e exibindo coordenadas quando retornadas.
- **Municípios IBGE** — consulta por UF, com filtro local por nome e código IBGE.
- **Feriados** — consulta por ano, com destaque do próximo feriado e classificação por tipo.

Os módulos usam `CepService`, `IbgeService` e `FeriadosService`, com timeout de 15 segundos e mensagens de erro amigáveis. O acesso ao CNPJ foi preservado separadamente em `/cnpj`, sem acoplamento ao portal.

```text
src/app/
├── pages/
│   ├── portal-consultas/              # CEP, municípios e feriados (mvp2)
│   └── consulta-cnpj/                 # Consulta empresarial em /cnpj
├── components/
│   ├── cnpj-form/                     # Formulário reativo com máscara e validação
│   ├── empresa-card/                  # Cards de "Dados Gerais" e "Endereço"
│   ├── socios-list/                   # Lista de sócios (QSA)
│   ├── loading/                       # Spinner Bootstrap
│   └── error-message/                 # Alertas de erro
├── services/
│   ├── brasil-api.service.ts          # Integração HTTP do CNPJ
│   ├── cep.service.ts                 # Consulta de endereços
│   ├── ibge.service.ts                # Consulta de municípios
│   ├── feriados.service.ts            # Consulta de feriados
│   └── classificacao-esfera.service.ts # Inferência da esfera administrativa (RN-001)
├── models/
│   ├── empresa.model.ts
│   ├── socio.model.ts
│   ├── cnpj-error.model.ts
│   └── esfera-administrativa.enum.ts
├── shared/
│   ├── validators/cnpj.validator.ts   # Validator de CNPJ (dígito verificador)
│   └── utils/cnpj.util.ts             # Sanitização e máscara de CNPJ
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```

## Integração com a BrasilAPI

- Endpoint: `GET https://brasilapi.com.br/api/cnpj/v1/{cnpj}` (URL configurada em `environment.apiUrl`, nunca hardcoded no service).
- O CNPJ é sanitizado (máscara removida) antes da requisição.
- Timeout de 15s (RxJS `timeout`) para evitar loading indefinido.
- Mapeamento de erros HTTP para mensagens amigáveis, validado contra o comportamento real da API:

| Status HTTP | Situação real observada | Tipo de erro | Mensagem exibida |
|---|---|---|---|
| 400 | CNPJ malformado ou dígito verificador inválido | `FORMATO_INVALIDO` | "CNPJ informado é inválido." |
| 404 | CNPJ com formato válido, mas não cadastrado na Receita | `CNPJ_NAO_ENCONTRADO` | "CNPJ não encontrado na base da Receita Federal." |
| 429 | Limite de requisições da BrasilAPI atingido | `LIMITE_REQUISICOES` | "Limite de consultas à BrasilAPI atingido..." |
| 0 / timeout | Sem conexão ou tempo de resposta excedido | `SEM_CONEXAO` | "Não foi possível se conectar..." / "A consulta demorou demais..." |
| Demais (5xx) | Indisponibilidade do serviço | `SERVICO_INDISPONIVEL` | "O serviço da BrasilAPI está indisponível..." |

> Na prática, o caso 400 raramente chega ao service, pois o `cnpjValidator()` já bloqueia o envio de um CNPJ com dígito verificador inválido no próprio formulário — o mapeamento existe como defesa em profundidade.

## Classificação da esfera administrativa (RN-001, PRD v2)

A BrasilAPI **não** informa oficialmente a esfera administrativa de uma entidade — por isso a UI sempre rotula o dado como "Esfera Administrativa (estimada)". A inferência é centralizada no `ClassificacaoEsferaService` (nenhum componente contém essa lógica) e segue esta ordem de prioridade:

1. **`natureza_juridica`** (fonte oficial da Receita): palavras-chave identificam diretamente Municipal (`Município`/`Municipal`), Estadual (`Estadual`/`Estado`/`Distrito Federal`) ou Federal (`Federal`/`União`).
2. Naturezas jurídicas reconhecidamente privadas (`Sociedade Empresária`, `Empresário Individual`, `Cooperativa` etc.) ou `opcao_pelo_mei` → `PRIVADA`.
3. Naturezas jurídicas ambíguas quanto ao ente controlador — `Empresa Pública` e `Sociedade de Economia Mista` (ex.: Petrobras, Caixa Econômica Federal, Serpro, Dataprev, Embrapa) — retornam sempre `NAO_IDENTIFICADA`, mesmo que a razão social sugira uma esfera, pois o controle acionário pode ser federal, estadual ou municipal.
4. Quando `natureza_juridica` está ausente, a razão social/nome fantasia é varrida por termos característicos de cada esfera (ex.: "Prefeitura Municipal", "Tribunal de Justiça", "Ministério").
5. Sem nenhum sinal reconhecido → `NAO_IDENTIFICADA`.

## Validação de CNPJ

Implementada em `cnpj.validator.ts` sem dependências externas:
1. Exige exatamente 14 dígitos (após remover a máscara).
2. Rejeita sequências de dígitos repetidos (ex.: `00000000000000`).
3. Confere os dois dígitos verificadores pelo algoritmo módulo 11 oficial da Receita Federal.

A máscara (`00.000.000/0000-00`) é aplicada progressivamente enquanto o usuário digita (`cnpj.util.ts`), sem lib de terceiros. **Limitação conhecida**: como a máscara é reaplicada a cada tecla via `setValue`, o cursor volta para o fim do campo a cada dígito digitado — comportamento aceitável para um campo de tamanho fixo curto, mas que exigiria uma implementação de preservação de posição do cursor (ou uma lib dedicada de máscara) para ficar perfeito.

## Decisões de modelagem (além do PRD)

O PRD define um modelo `Empresa`/`Socio` mínimo. Para não quebrar a tipagem em runtime, esses modelos foram estendidos com campos opcionais (`?`) que existem na resposta real da BrasilAPI mas não estavam no contrato original do PRD (ex.: `ddd_telefone_2`, `porte`, `capital_social`, `cnpj_cpf_do_socio`). Nenhum campo do PRD foi removido ou renomeado — a extensão é estritamente aditiva.

## Responsividade

Layout construído com o grid do Bootstrap 5, sem media queries customizadas:
- **Mobile (< 768px)**: cards e formulário empilhados em coluna única.
- **Tablet/Desktop (≥ 768px / ≥ 992px)**: cards de "Dados Gerais" e "Endereço" lado a lado (`col-lg-6`).

## Qualidade e limitações conhecidas

- `npm audit` reporta 2 vulnerabilidades moderadas em dependências transitivas do Karma (`qs`/`body-parser`), usadas apenas pelo test runner em desenvolvimento — não afetam o bundle de produção.
- Build de produção gera ~492 kB iniciais (dentro do orçamento de 500 kB definido em `angular.json`), majoritariamente CSS do Bootstrap.
