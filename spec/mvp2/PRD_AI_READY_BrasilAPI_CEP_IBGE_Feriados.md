# AI-READY PRD - Portal de Consultas BrasilAPI (CEP, IBGE e Feriados)

## 1. Visão Geral

Desenvolver uma aplicação Angular 20 utilizando Bootstrap 5 para consumo de serviços públicos da BrasilAPI.

O sistema será composto por três módulos independentes:

1. Consulta de CEP
2. Consulta de Municípios IBGE
3. Consulta de Feriados Nacionais

---

## 2. Stack Obrigatória

- Angular 20+
- TypeScript Strict
- Bootstrap 5
- RxJS
- Angular HttpClient
- Reactive Forms
- Standalone Components

---

## 3. Arquitetura

```text
src/app/
├── pages/
│   ├── consulta-cep/
│   ├── consulta-ibge/
│   └── consulta-feriados/
│
├── components/
│   ├── loading/
│   ├── error-message/
│   ├── resultado-cep/
│   ├── resultado-ibge/
│   └── resultado-feriados/
│
├── services/
│   ├── cep.service.ts
│   ├── ibge.service.ts
│   └── feriados.service.ts
│
├── models/
│   ├── cep.model.ts
│   ├── municipio.model.ts
│   └── feriado.model.ts
│
└── shared/
```

---

# MÓDULO 1 - CONSULTA DE CEP

## Objetivo

Consultar endereços a partir do CEP.

## Endpoint

```http
GET /cep/v2/{cep}
```

## User Story

### US-CEP-01

Como usuário
Quero informar um CEP
Para localizar um endereço.

## Campos de Entrada

- CEP

## Regras

- Aceitar CEP com máscara
- Aceitar CEP sem máscara
- Validar exatamente 8 dígitos
- Limpar máscara automaticamente

## Dados Exibidos

- CEP
- Estado (UF)
- Cidade
- Bairro
- Rua
- Latitude
- Longitude

## Casos de Teste

### CT-CEP-01

Dado um CEP válido
Quando consultar
Então o endereço deve ser exibido.

### CT-CEP-02

Dado um CEP inválido
Quando consultar
Então deve exibir erro.

---

# MÓDULO 2 - CONSULTA IBGE

## Objetivo

Consultar municípios por unidade federativa.

## Endpoint

```http
GET /ibge/municipios/v1/{uf}
```

## User Story

### US-IBGE-01

Como usuário
Quero selecionar uma UF
Para visualizar os municípios correspondentes.

## Campos de Entrada

- UF

## Dados Exibidos

- Código IBGE
- Nome do Município

## Funcionalidades

- Pesquisa por UF
- Busca local na lista
- Ordenação alfabética

## Casos de Teste

### CT-IBGE-01

Dada a UF SP
Quando consultar
Então os municípios devem ser exibidos.

### CT-IBGE-02

Dada uma UF inválida
Quando consultar
Então deve exibir erro.

---

# MÓDULO 3 - FERIADOS NACIONAIS

## Objetivo

Consultar feriados nacionais por ano.

## Endpoint

```http
GET /feriados/v1/{ano}
```

## User Story

### US-FER-01

Como usuário
Quero informar um ano
Para visualizar os feriados.

## Campos de Entrada

- Ano
- UF (opcional)

## Dados Exibidos

- Data
- Nome
- Tipo
- Nome Completo (quando disponível)

## Funcionalidades

- Consulta por ano
- Consulta por ano e UF
- Agrupamento por mês
- Destaque do próximo feriado

## Casos de Teste

### CT-FER-01

Dado um ano válido
Quando consultar
Então os feriados devem ser exibidos.

### CT-FER-02

Dado um ano inválido
Quando consultar
Então deve exibir erro.

---

## Modelos TypeScript

### CEP

```typescript
export interface CepModel {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  latitude?: string;
  longitude?: string;
}
```

### Município

```typescript
export interface Municipio {
  nome: string;
  codigo_ibge: string;
}
```

### Feriado

```typescript
export interface Feriado {
  date: string;
  name: string;
  type: string;
  fullName?: string;
}
```

---

## Requisitos Não Funcionais

- Interface responsiva
- Bootstrap 5
- Loading para todas as consultas
- Tratamento global de erros
- Código tipado
- Serviços isolados
- Componentização

---

## Definição de Pronto

- Build sem erros
- TypeScript Strict
- Responsivo
- Bootstrap configurado
- Consumo da BrasilAPI funcional
- README criado
- Testes unitários básicos

---

## Prompt Final para Claude Code

Analise integralmente este PRD.

Crie uma aplicação Angular 20 utilizando:

- Standalone Components
- Bootstrap 5
- TypeScript Strict
- Angular HttpClient
- Reactive Forms
- RxJS

Implemente os módulos:

1. Consulta CEP
2. Consulta Municípios IBGE
3. Consulta Feriados

Crie:

- Rotas Angular
- Services
- Models
- Components
- Templates HTML
- SCSS
- Loading
- Tratamento de erros
- Responsividade
- README

Forneça todos os arquivos completos.

Não utilize pseudocódigo.
