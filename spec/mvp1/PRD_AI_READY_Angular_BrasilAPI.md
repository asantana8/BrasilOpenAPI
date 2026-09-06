# AI-READY PRD - Consulta de CNPJ com Angular 20 + Bootstrap 5

## Objetivo
Desenvolver uma SPA em Angular para consulta de CNPJ utilizando a BrasilAPI.

## Diretrizes para IA
Este documento é a fonte única de verdade. Não substituir tecnologias, padrões ou arquitetura descritos.

## Stack Obrigatória
- Angular 20+
- TypeScript
- Bootstrap 5
- RxJS
- Angular HttpClient
- Reactive Forms
- Standalone Components

## Escopo MVP
- Consulta por CNPJ
- Loading
- Tratamento de erros
- Exibição de dados da empresa
- Responsividade

## Arquitetura
```text
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
├── models/
├── shared/
└── environments/
```

## User Stories

### US-01
Como usuário
Quero informar um CNPJ
Para consultar dados empresariais.

### Critérios
- Campo obrigatório
- Aceitar máscara
- Aceitar apenas CNPJ válido

### US-02
Como usuário
Quero visualizar os dados da empresa
Para validar informações cadastrais.

### Critérios
- Exibir razão social
- Nome fantasia
- Situação cadastral
- Endereço
- Telefones
- Sócios

## Fluxo Principal
```text
Página Inicial
 ↓
Digitar CNPJ
 ↓
Buscar
 ↓
Loading
 ↓
BrasilAPI
 ↓
Resultado
```

## Contrato da API
GET https://brasilapi.com.br/api/cnpj/v1/{cnpj}

## Modelo TypeScript
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
 qsa: Socio[];
}
```

## Componentes
### CnpjFormComponent
Responsável pela entrada e validação.

### EmpresaCardComponent
Exibe dados cadastrais.

### SociosListComponent
Lista sócios.

### LoadingComponent
Spinner bootstrap.

### ErrorMessageComponent
Mensagens amigáveis.

## Layout Bootstrap
```text
Container
 ├─ Card Consulta
 ├─ Card Dados Gerais
 ├─ Card Endereço
 └─ Card Sócios
```

## Casos de Teste
### CT-01
Dado um CNPJ válido
Quando buscar
Então exibir dados.

### CT-02
Dado um CNPJ inválido
Quando buscar
Então exibir erro.

### CT-03
Dado falha da API
Quando buscar
Então exibir indisponibilidade.

## Responsividade
- Mobile < 768px
- Tablet 768-991px
- Desktop > 992px

## Definição de Pronto
- Build sem erros
- Tipagem TypeScript
- Bootstrap aplicado
- Responsivo
- Integração BrasilAPI funcional
- README criado

## Prompt Final para Claude Code

Analise integralmente este PRD.

Crie uma aplicação Angular 20 utilizando Standalone Components e Bootstrap 5.

Implemente todos os requisitos descritos.

Gere:
- Estrutura completa do projeto
- Angular Services
- Models TypeScript
- Reactive Forms
- HTML
- SCSS
- Integração BrasilAPI
- Tratamento de erros
- Responsividade
- README

Forneça código completo de todos os arquivos.
Não utilize pseudocódigo.
