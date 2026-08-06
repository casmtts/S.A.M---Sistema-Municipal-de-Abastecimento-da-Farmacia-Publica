# S.A.M. — Sistema Municipal de Abastecimento

Uma demonstração frontend de um sistema de gestão de medicamentos para redes públicas de saúde que está sendo utilizado porém mais atualizado do que este projeto. Essa versão foi pensada para apresentação a recrutadores: mostra uma experiência SaaS completa, responsiva e com fluxos operacionais realistas.

## O que a demonstração inclui

- Dashboard com indicadores, gráfico de consumo, alertas e pedidos recentes.
- Gestão de estoque com busca, cadastro, edição, exclusão e movimentação de itens.
- Gestão do fluxo de pedidos, fornecedores, unidades de saúde e usuários.
- Relatórios com filtros e ações de exportação simuladas.
- Login demonstrativo com acesso rápido e nenhum dado real.

## Executar localmente

```bash
cd frontend
npm install
npm run dev
```

Abra o endereço informado pelo Vite e selecione **Entrar na demonstração**.

## Arquitetura da demo

O showcase funciona exclusivamente no navegador. Os dados de medicamentos, pedidos e cadastros são mockados e as operações CRUD atualizam o estado da interface em tempo de execução. Ao atualizar a página, a aplicação volta automaticamente ao cenário inicial, garantindo uma demonstração consistente.

Não é necessário configurar API, banco de dados, variáveis de ambiente ou credenciais.

## Tecnologias

- React + TypeScript + Vite
- Material UI
- Recharts
