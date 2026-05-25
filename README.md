# 📊 Calculadora Pro-Rata

Ferramenta web para calcular a data de backdate ideal em massa de testes de sistemas de faturamento, com análise de status da fatura.

## 🎯 Objetivo

Calcular a **data de backdate** necessária para que uma massa de testes tenha exatamente **X dias de consumo**, considerando o dia de corte e a data de vencimento da fatura.

## 🚀 Como usar

1. Abra o arquivo `index.html` no seu navegador
2. Informe o **dia de corte** (apenas o dia: 1-31)
3. Informe a **data de vencimento** (DD/MM/YYYY)
4. Escolha uma das opções:
   - **Validar massa existente**: Informe a data de criação para calcular dias de consumo
   - **Calcular backdate**: Informe os dias de pró-rata desejados
5. Veja o resultado com status da fatura

## 💡 Exemplo

**Entrada:**
- Dia de Corte: 5
- Data de Vencimento: 10/03/2026
- Dias de Pró-Rata: 5 dias

**Resultado:**
- Data de Criação/Backdate: **28/02/2026**
- Data de Corte: **05/03/2026**
- Período: 28/02/2026 a 05/03/2026
- Status: **Em aberto** / **Vencida** (calculado com base na data atual)
- Dias até/desde vencimento

## 🎨 Funcionalidades

✅ **Cálculo Bidirecional**
- Validar massa existente (informa data de criação → calcula dias)
- Calcular backdate (informa dias desejados → calcula quando criar)

✅ **Dia de Corte Simplificado**
- Apenas o dia do mês (1-31)
- Calculado automaticamente baseado no vencimento

✅ **Status da Fatura**
- ⏳ Em aberto (antes/depois do corte)
- ❌ Vencida (passou do vencimento)
- Dias até vencer ou dias vencida

✅ **Interface Intuitiva**
- Máscara automática DD/MM/YYYY
- Validação de dados
- Campos mutuamente exclusivos
- Botão para copiar data de backdate

## 📁 Estrutura

- `index.html` - Interface principal
- `styles.css` - Estilos visuais
- `script.js` - Lógica de cálculo
- `src/MassaProRata.java` - Implementação em Java (referência)
- `src/MassaProRata.jsx` - Componente React (referência)
- `.github/copilot/prorata-tester.agent.md` - Agente Copilot customizado

## 🛠️ Tecnologias

- HTML5
- CSS3 (design moderno e responsivo)
- JavaScript vanilla (sem dependências)
