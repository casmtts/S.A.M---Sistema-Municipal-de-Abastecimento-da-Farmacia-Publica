# 🏥 Sistema de Abastecimento de Medicamentos - Rede Municipal

Sistema completo para gerenciamento de abastecimento de medicamentos da rede municipal de saúde, permitindo controle de estoque, gestão de pedidos e monitoramento de suprimentos.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Usar](#como-usar)
- [API Endpoints](#api-endpoints)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🎯 Sobre o Projeto

O **Sistema de Abastecimento de Medicamentos** foi desenvolvido para otimizar a gestão de medicamentos na rede municipal de saúde, garantindo que unidades de saúde nunca fiquem desabastecidas e que os recursos sejam utilizados de forma eficiente.

### Problemas que Soluciona:
- ❌ Falta de visibilidade do estoque em tempo real
- ❌ Compras emergenciais sem planejamento
- ❌ Medicamentos vencendo em estoque
- ❌ Processos manuais e sujeitos a erros

### Nossa Solução:
- ✅ Dashboard com alertas de estoque baixo
- ✅ Controle de validade dos medicamentos
- ✅ Pedidos automatizados baseados em pontos de reposição
- ✅ Relatórios gerenciais para tomada de decisão

## ✨ Funcionalidades

### Módulo de Estoque
- 📦 Cadastro e gestão de medicamentos
- 🔄 Controle de entrada e saída
- ⚠️ Alertas automáticos de estoque baixo
- 📊 Histórico de movimentações

### Módulo de Pedidos
- 🛒 Solicitação de compras
- ✅ Fluxo de aprovação
- 🚚 Acompanhamento de entregas
- 📅 Planejamento de reposição

### Módulo de Relatórios
- 📈 Gráficos de consumo
- 📊 Previsão de demanda
- 💰 Análise de custos
- 📄 Exportação de dados

### Módulo de Unidades
- 🏥 Cadastro de unidades de saúde
- 📍 Transferência entre unidades
- 👥 Gestão de responsáveis

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Ant Design** - Componentes UI
- **Axios** - Requisições HTTP
- **React Query** - Gerenciamento de estado
- **Recharts** - Gráficos e visualizações

### Backend (planejado)
- **Node.js** 
- **PostgreSQL** - Banco de dados
- **NESTJS** - ORM
- **JWT** - Autenticação

### DevOps
- **Docker** - Containerização
- **GitHub Actions** - CI/CD

## 📋 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) (opcional)

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/sistema-abastecimento-medicamentos.git
cd sistema-abastecimento-medicamentos
2. Instale as dependências
bash
cd frontend
npm install
3. Configure as variáveis de ambiente
Crie um arquivo .env na raiz do frontend:

env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001
4. Inicie o servidor de desenvolvimento
bash
npm start
O aplicativo estará disponível em http://localhost:3000

5. Build para produção
bash
npm run build
📁 Estrutura do Projeto
text
sistema-abastecimento-medicamentos/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   ├── Estoque/
│   │   │   ├── Pedidos/
│   │   │   └── Layout/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── Relatorios.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── auth.ts
│   │   ├── hooks/
│   │   │   ├── useMedicamentos.ts
│   │   │   └── useAuth.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── formatadores.ts
│   │   │   └── validadores.ts
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── backend/ (em desenvolvimento)
├── database/
│   └── migrations/
├── docker-compose.yml
└── .gitignore
💻 Como Usar
Acesso Inicial
Login no Sistema

Use as credenciais fornecidas pelo administrador

Ou registre-se como novo usuário (primeiro acesso)

Dashboard Principal

Visão geral do estoque

Alertas de medicamentos com estoque baixo

Pedidos pendentes

Gráficos de consumo

Fluxos Principais
📦 Gerenciar Estoque
Acesse o menu "Estoque"

Cadastre novos medicamentos

Registre entradas e saídas

Monitore validades

🛒 Solicitar Pedidos
Vá em "Pedidos" → "Novo Pedido"

Selecione medicamentos e quantidades

Envie para aprovação

Acompanhe o status

📊 Gerar Relatórios
Menu "Relatórios"

Escolha tipo de relatório

Selecione período

Exporte em PDF/Excel

🔌 API Endpoints
Medicamentos
http
GET    /api/medicamentos          # Lista todos medicamentos
GET    /api/medicamentos/:id      # Busca medicamento específico
POST   /api/medicamentos          # Cadastra novo medicamento
PUT    /api/medicamentos/:id      # Atualiza medicamento
DELETE /api/medicamentos/:id      # Remove medicamento
Pedidos
http
GET    /api/pedidos               # Lista pedidos
POST   /api/pedidos               # Cria novo pedido
PUT    /api/pedidos/:id/status    # Atualiza status
Estoque
http
GET    /api/estoque/alertas       # Lista alertas de estoque
POST   /api/estoque/movimentacao  # Registra movimentação
🧪 Testes
bash
# Executar testes unitários
npm test

# Executar testes com coverage
npm test -- --coverage

# Executar testes e2e
npm run test:e2e
📦 Deploy
Build Docker
bash
# Build da imagem
docker build -t farmacia-frontend .

# Executar container
docker run -p 3000:3000 farmacia-frontend
Deploy em Produção
Configure as variáveis de ambiente no servidor

Execute npm run build

Sirva a pasta build com nginx ou similar

Exemplo configuração Nginx:

nginx
server {
    listen 80;
    server_name farmacia.saude.gov.br;
    
    location / {
        root /var/www/farmacia-frontend/build;
        try_files $uri /index.html;
    }
}
🤝 Contribuição
Contribuições são o que fazem a comunidade open source um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será muito apreciada.

Faça um Fork do projeto

Crie uma Branch para sua Feature (git checkout -b feature/AmazingFeature)

Commit suas mudanças (git commit -m 'Add some AmazingFeature')

Push para a Branch (git push origin feature/AmazingFeature)

Abra um Pull Request

Padrões de Código
Use TypeScript para todo código novo

Siga o padrão de commits convencionais

Mantenha testes para novas funcionalidades

Documente componentes complexos

📝 Licença
Distribuído sob a licença MIT. Veja LICENSE para mais informações.

📞 Contato
Equipe de Desenvolvimento - contatocsmpm@gmail.com

Link do Projeto: https://github.com/casmtts/sistema-abastecimento-medicamentos
