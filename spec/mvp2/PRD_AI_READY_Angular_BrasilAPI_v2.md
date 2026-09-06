# AI-READY PRD - Consulta de CNPJ com Angular 20 + Bootstrap 5

## Objetivo
Desenvolver uma SPA em Angular para consulta de CNPJ utilizando a BrasilAPI.

## Diretrizes para IA
Este documento é a fonte única de verdade do projeto.
Não substituir tecnologias, arquitetura, padrões ou regras de negócio descritos neste documento.

## Stack Obrigatória
- Angular 20+
- TypeScript (Strict Mode)
- Bootstrap 5
- RxJS
- Angular HttpClient
- Reactive Forms
- Standalone Components

## Escopo MVP
- Consulta por CNPJ
- Loading
- Tratamento de erros
- Exibição dos dados da empresa
- Classificação da esfera administrativa
- Responsividade

## Arquitetura

src/app/
├── pages/
│   └── consulta-cnpj/
├── components/
│   ├── cnpj-form/
│   ├── empresa-card/
│   ├── socios-list/
│   ├── loading/
│   └── error-message/
├── services/
│   ├── brasil-api.service.ts
│   └── classificacao-esfera.service.ts
├── models/
│   ├── empresa.model.ts
│   ├── socio.model.ts
│   └── esfera-administrativa.enum.ts
├── shared/
└── environments/

## User Stories

### US-01
Como usuário
Quero informar um CNPJ
Para consultar dados empresariais.

Critérios:
- Campo obrigatório
- Aceitar máscara
- Validar entrada

### US-02
Como usuário
Quero visualizar os dados da empresa
Para validar informações cadastrais.

Critérios:
- Razão social
- Nome fantasia
- Situação cadastral
- Endereço
- Telefones
- Sócios

### US-03
Como usuário
Quero visualizar a esfera administrativa estimada da entidade
Para entender sua natureza organizacional.

Critérios:
- Exibir classificação calculada
- Identificar como estimativa
- Não apresentar como dado oficial

## Fluxo Principal
Página Inicial
→ Digitar CNPJ
→ Buscar
→ Loading
→ Consulta BrasilAPI
→ Exibição do Resultado

## Contrato da API
GET https://brasilapi.com.br/api/cnpj/v1/{cnpj}

## Modelos TypeScript

```typescript
export interface Socio {
  nome_socio: string;
  qualificacao_socio: string;
}

export interface Empresa {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  descricao_situacao_cadastral: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  ddd_telefone_1: string;
  email: string;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  natureza_juridica?: string;
  codigo_natureza_juridica?: number;
  ente_federativo_responsavel?: string;
  qsa: Socio[];
}
```

## Regras de Negócio

### RN-001 Classificação da Esfera Administrativa

A BrasilAPI não fornece oficialmente a esfera administrativa da entidade.

A classificação deve ser tratada como inferência.

Exibir na interface:

"Esfera Administrativa (estimada)"

### Enum

```typescript
export enum EsferaAdministrativa {
  FEDERAL = 'Federal',
  ESTADUAL = 'Estadual',
  MUNICIPAL = 'Municipal',
  PRIVADA = 'Privada',
  NAO_IDENTIFICADA = 'Não Identificada'
}
```

### Fontes para Inferência

- natureza_juridica
- codigo_natureza_juridica
- ente_federativo_responsavel
- razao_social
- municipio
- uf

### Regras Municipais

- Prefeitura Municipal
- Câmara Municipal
- Fundo Municipal
- Secretaria Municipal
- Autarquia Municipal

### Regras Estaduais

- Governo do Estado
- Secretaria de Estado
- Tribunal de Justiça
- Assembleia Legislativa
- Polícia Civil
- Polícia Militar

### Regras Federais

- Ministério
- Receita Federal
- Universidade Federal
- Instituto Federal
- Polícia Federal
- Banco Central
- INSS
- Senado Federal
- Câmara dos Deputados

### Regras Privadas

- Sociedade Empresária
- Empresário Individual
- Associação Privada
- Fundação Privada
- Cooperativa
- MEI

### Casos Ambíguos

Retornar:

NAO_IDENTIFICADA

### Casos Especiais

- Petrobras
- Caixa Econômica Federal
- Serpro
- Dataprev
- Embrapa
- Empresas Públicas
- Sociedades de Economia Mista

Na dúvida retornar:

NAO_IDENTIFICADA

## Componentes

### CnpjFormComponent
Entrada e validação.

### EmpresaCardComponent
Exibição dos dados empresariais.

### SociosListComponent
Lista de sócios.

### LoadingComponent
Spinner Bootstrap.

### ErrorMessageComponent
Mensagens amigáveis.

## Serviços

### BrasilApiService

Responsável por:
- Integração com API
- Tratamento HTTP
- Conversão de respostas

### ClassificacaoEsferaService

Responsável por:
- Classificar esfera administrativa
- Centralizar regras de negócio
- Permitir expansão futura

Nenhum componente deve conter lógica de classificação.

## Layout Bootstrap

Container
├─ Card Consulta
├─ Card Dados Gerais
├─ Card Endereço
├─ Card Sócios
└─ Card Classificação Administrativa

## Casos de Teste

### CT-01
CNPJ válido deve retornar dados.

### CT-02
CNPJ inválido deve exibir erro.

### CT-03
Falha da API deve exibir indisponibilidade.

### CT-04
Prefeitura Municipal deve retornar MUNICIPAL.

### CT-05
Ministério deve retornar FEDERAL.

### CT-06
Empresa privada deve retornar PRIVADA.

### CT-07
Dados insuficientes devem retornar NAO_IDENTIFICADA.

## Responsividade
- Mobile < 768px
- Tablet 768px até 991px
- Desktop > 992px

## Definição de Pronto
- Build sem erros
- TypeScript Strict
- Bootstrap aplicado
- Responsivo
- Integração funcional
- Testes unitários
- README criado

## Prompt Final para Claude Code

Analise integralmente este PRD.

Este documento é a única fonte de verdade do projeto.

Crie uma aplicação Angular 20 utilizando:

- Standalone Components
- Bootstrap 5
- TypeScript Strict
- Reactive Forms
- Angular HttpClient
- RxJS

Implemente:

- Consulta CNPJ
- Loading
- Tratamento de erros
- Responsividade
- Classificação da esfera administrativa
- Testes unitários
- README

Crie obrigatoriamente:

- BrasilApiService
- ClassificacaoEsferaService

Mantenha toda regra de negócio em services.

Forneça todos os arquivos completos.

Não utilize pseudocódigo.
