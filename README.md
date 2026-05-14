<p align="center">
  <img src="public/logo.png" alt="Unicity Logo" width="80" />
</p>

<h1 align="center">🏙️ Unicity — Frontend</h1>

<p align="center">
  Plataforma cidadã para registro e acompanhamento de ocorrências urbanas em Caraguatatuba/SP.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.2-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white" />
</p>

---

## 📋 Sobre o Projeto

O **Unicity** é uma aplicação web desenvolvida como **Projeto Integrador** que conecta cidadãos à gestão pública da cidade de **Caraguatatuba – SP**. A plataforma permite que moradores registrem ocorrências urbanas — como buracos, problemas de iluminação, alagamentos, questões de segurança e limpeza — geolocalizando-as diretamente em um mapa interativo.

O objetivo é criar um canal direto e transparente entre a população e os órgãos responsáveis, promovendo a **participação cidadã** e facilitando a identificação e resolução de problemas na infraestrutura urbana.

### 🎯 Principais Funcionalidades

- **🗺️ Mapa Interativo** — Visualização de todas as ocorrências em um mapa com marcadores coloridos por categoria (Infraestrutura, Segurança, Limpeza, Trânsito e Outros), utilizando Leaflet.
- **📝 Registro de Ocorrências** — Formulário completo para relatar problemas urbanos com título, descrição, categoria, localização via mapa e upload de imagem.
- **📊 Dashboard Pessoal** — Painel do usuário logado com visão geral das suas denúncias, filtros por categoria e busca.
- **💬 Comentários e Respostas** — Sistema de comentários por ocorrência, permitindo discussão e acompanhamento entre cidadãos.
- **🔐 Autenticação** — Sistema de login e cadastro de usuários para controle de acesso.
- **📱 Design Responsivo** — Interface totalmente adaptável para desktop, tablet e dispositivos móveis.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|---|---|---|
| **React** | 19.2 | Biblioteca para construção da interface |
| **Vite** | 8.0 | Bundler e servidor de desenvolvimento |
| **Tailwind CSS** | 4.2 | Framework CSS utilitário para estilização |
| **React Router DOM** | 7.14 | Roteamento SPA (Single Page Application) |
| **Leaflet / React-Leaflet** | 1.9 / 5.0 | Mapas interativos |
| **Lucide React** | 1.8 | Biblioteca de ícones |

---

## 📁 Estrutura do Projeto

```
city-frontend/
├── public/                      # Arquivos estáticos (logo, imagens)
├── src/
│   ├── assets/                  # Recursos internos (imagens, SVGs)
│   ├── components/              # Componentes reutilizáveis
│   │   ├── layout/
│   │   │   ├── AuthLayout.jsx   # Layout para páginas de autenticação
│   │   │   ├── Footer.jsx       # Rodapé da aplicação
│   │   │   ├── Header.jsx       # Navbar com menu responsivo
│   │   │   └── MainLayout.jsx   # Layout principal (Header + Footer)
│   │   ├── DenunciaCard.jsx     # Card de ocorrência reutilizável
│   │   └── MapPopup.jsx         # Popup estilizado do mapa
│   ├── pages/                   # Páginas da aplicação
│   │   ├── Home.jsx             # Página inicial / Landing page
│   │   ├── Login.jsx            # Tela de login
│   │   ├── Register.jsx         # Tela de cadastro
│   │   ├── Dashboard.jsx        # Painel do usuário
│   │   ├── Map.jsx              # Mapa de ocorrências
│   │   ├── Report.jsx           # Formulário de registro de ocorrência
│   │   ├── OccurrenceDetails.jsx # Detalhes e comentários da ocorrência
│   │   └── NotFound.jsx         # Página 404
│   ├── routes/
│   │   └── AppRoutes.jsx        # Definição de todas as rotas
│   ├── services/
│   │   └── api.js               # Funções de comunicação com o backend
│   ├── utils/                   # Funções utilitárias
│   ├── index.css                # Estilos globais e tema Tailwind
│   ├── main.jsx                 # Ponto de entrada da aplicação
│   └── App.jsx                  # Componente raiz
├── package.json
├── vite.config.js
└── README.md
```

---

## 🗺️ Rotas da Aplicação

| Rota | Página | Acesso |
|---|---|---|
| `/` | Home (Landing Page) | Público |
| `/login` | Login | Público |
| `/cadastro` | Cadastro | Público |
| `/dashboard` | Dashboard do Usuário | Autenticado |
| `/mapa` | Mapa de Ocorrências | Público |
| `/relatar` | Registrar Ocorrência | Autenticado |
| `/ocorrencia/:id` | Detalhes da Ocorrência | Público |
| `*` | Página 404 | Público |

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [npm](https://www.npmjs.com/) (v9 ou superior)
- Backend da aplicação rodando em `http://localhost:3000` (ver repositório `city-backend`)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/city-frontend.git

# 2. Acesse a pasta do projeto
cd city-frontend

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em **http://localhost:5173**

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento (Vite) |
| `npm run build` | Gera a build de produção |
| `npm run preview` | Visualiza a build de produção localmente |
| `npm run lint` | Executa o ESLint para verificação de código |

---

## 🎨 Design System

O projeto utiliza um **design system** consistente definido no `index.css`:

| Token | Valor | Uso |
|---|---|---|
| `--color-primary` | `#4237E0` | Cor principal (botões, destaques) |
| `--color-secondary` | `#1D3D94` | Cor secundária |
| `--color-tertiary` | `#5A9AE7` | Cor terciária |
| `--color-success` | `#34C759` | Sucesso / Categoria Limpeza |
| `--color-warning` | `#ECBD02` | Aviso / Categoria Trânsito |
| `--color-danger` | `#FF0202` | Erro / Categoria Segurança |
| `--font-title` | `Oswald` | Títulos e headings |
| `--font-text` | `Roboto` | Textos e parágrafos |

---

## 👥 Equipe de Desenvolvimento

| Nome | Papel |
|---|---|
| **Luiz Gustavo** | Desenvolvedor |
| **Jean Brito** | Desenvolvedor |
| **Reinan** | Desenvolvedor |
| **João** | Desenvolvedor |

---

## 📄 Licença

Este projeto foi desenvolvido como parte do **Projeto Integrador** para fins acadêmicos.

---

<p align="center">
  Feito pela equipe <strong>Unicity</strong>
</p>
