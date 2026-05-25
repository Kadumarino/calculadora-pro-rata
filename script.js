// Elementos do DOM
const form = document.getElementById('proRataForm');
const resultadoDiv = document.getElementById('resultado');
const btnCopiar = document.getElementById('btnCopiar');

// Função para aplicar máscara de data DD/MM/YYYY
function aplicarMascaraData(input) {
    let valor = input.value.replace(/\D/g, ''); // Remove não-dígitos
    
    if (valor.length >= 2) {
        valor = valor.substring(0, 2) + '/' + valor.substring(2);
    }
    if (valor.length >= 5) {
        valor = valor.substring(0, 5) + '/' + valor.substring(5, 9);
    }
    
    input.value = valor;
}

// Função para converter DD/MM/YYYY para objeto Date
function converterDataBRParaDate(dataBR) {
    const partes = dataBR.split('/');
    if (partes.length !== 3) return null;
    
    const dia = parseInt(partes[0]);
    const mes = parseInt(partes[1]) - 1; // Mês começa em 0
    const ano = parseInt(partes[2]);
    
    if (isNaN(dia) || isNaN(mes) || isNaN(ano)) return null;
    if (dia < 1 || dia > 31) return null;
    if (mes < 0 || mes > 11) return null;
    if (ano < 1900 || ano > 2100) return null;
    
    return new Date(ano, mes, dia);
}

// Função para validar formato de data
function validarFormatoData(dataBR) {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/;
    return regex.test(dataBR);
}

// Função para formatar data no padrão brasileiro
function formatarDataBR(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// Função para formatar data no padrão ISO (YYYY-MM-DD)
function formatarDataISO(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

// Função principal de cálculo
function calcularDataBackdate(event) {
    event.preventDefault();

    // Capturar valores do formulário
    const dataCriacaoInput = document.getElementById('dataCriacao').value.trim();
    const dataCorteInput = document.getElementById('dataCorte').value.trim();
    const diasProRataInput = document.getElementById('diasProRata').value.trim();

    // Validar data de corte (obrigatória)
    if (!dataCorteInput) {
        alert('Por favor, informe a Data de Corte.');
        return;
    }

    if (!validarFormatoData(dataCorteInput)) {
        alert('Formato inválido na Data de Corte. Use DD/MM/YYYY');
        return;
    }

    const dataCorte = converterDataBRParaDate(dataCorteInput);
    if (!dataCorte) {
        alert('Data de Corte inválida.');
        return;
    }

    // MODO 1: Data de Criação informada -> Calcular dias de consumo
    if (dataCriacaoInput) {
        if (!validarFormatoData(dataCriacaoInput)) {
            alert('Formato inválido na Data de Criação. Use DD/MM/YYYY');
            return;
        }

        const dataCriacao = converterDataBRParaDate(dataCriacaoInput);
        if (!dataCriacao) {
            alert('Data de Criação inválida.');
            return;
        }

        if (dataCriacao >= dataCorte) {
            alert('A Data de Criação deve ser anterior à Data de Corte.');
            return;
        }

        // Calcular dias de consumo
        const diasConsumo = Math.floor((dataCorte - dataCriacao) / (1000 * 60 * 60 * 24));
        
        mostrarResultado(dataCriacao, dataCorte, diasConsumo, 'validacao');
    }
    // MODO 2: Dias de Pró-Rata informados -> Calcular data de criação/backdate
    else if (diasProRataInput) {
        const diasProRata = parseInt(diasProRataInput);
        
        if (isNaN(diasProRata) || diasProRata < 1) {
            alert('Informe um número válido de dias.');
            return;
        }

        // Calcular data de backdate
        const dataBackdate = new Date(dataCorte);
        dataBackdate.setDate(dataBackdate.getDate() - diasProRata);

        mostrarResultado(dataBackdate, dataCorte, diasProRata, 'calculo');
    }
    else {
        alert('Preencha a Data de Criação OU os Dias de Pró-Rata.');
    }
}

// Função para exibir o resultado
function mostrarResultado(dataCriacao, dataCorte, dias, modo) {
    // Preencher campos de exibição
    document.getElementById('displayCriacao').textContent = formatarDataBR(dataCriacao);
    document.getElementById('displayCorte').textContent = formatarDataBR(dataCorte);
    document.getElementById('displayDias').textContent = `${dias} dias`;
    document.getElementById('displayPeriodo').textContent = 
        `${formatarDataBR(dataCriacao)} a ${formatarDataBR(dataCorte)}`;

    // Atualizar explicação baseada no modo
    const explicacao = document.getElementById('explicacaoTexto');
    if (modo === 'validacao') {
        explicacao.innerHTML = `
            A massa criada em <strong>${formatarDataBR(dataCriacao)}</strong> 
            terá <strong>${dias} dias</strong> de consumo 
            até a data de corte (<strong>${formatarDataBR(dataCorte)}</strong>).
        `;
    } else {
        explicacao.innerHTML = `
            Faça o backdate da massa em <strong>${formatarDataBR(dataCriacao)}</strong> 
            para ter exatamente <strong>${dias} dias</strong> de consumo 
            até a data de corte (<strong>${formatarDataBR(dataCorte)}</strong>).
        `;
    }

    // Armazenar data de criação para cópia
    btnCopiar.dataset.dataBackdate = formatarDataISO(dataCriacao);

    // Mostrar resultado com animação
    resultadoDiv.classList.remove('hidden');
    resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Função para copiar data de backdate
function copiarDataBackdate() {
    const dataBackdate = btnCopiar.dataset.dataBackdate;

    if (!dataBackdate) {
        alert('Nenhuma data para copiar!');
        return;
    }

    // Copiar para clipboard
    navigator.clipboard.writeText(dataBackdate)
        .then(() => {
            // Feedback visual
            const textoOriginal = btnCopiar.textContent;
            btnCopiar.textContent = '✅ Copiado!';
            btnCopiar.classList.add('copiado');

            setTimeout(() => {
                btnCopiar.textContent = textoOriginal;
                btnCopiar.classList.remove('copiado');
            }, 2000);
        })
        .catch(err => {
            console.error('Erro ao copiar:', err);
            alert('Erro ao copiar. Data de backdate: ' + dataBackdate);
        });
}

// Event listeners
form.addEventListener('submit', calcularDataBackdate);
btnCopiar.addEventListener('click', copiarDataBackdate);

// Definir valores padrão
window.addEventListener('DOMContentLoaded', () => {
    // Exemplo padrão: Data de corte em 05/03/2026
    const dataCorteExemplo = new Date(2026, 2, 5); // 05/03/2026
    document.getElementById('dataCorte').value = formatarDataBR(dataCorteExemplo);
    
    // Exemplo padrão: 5 dias de pró-rata
    document.getElementById('diasProRata').value = '5';
    
    // Adicionar listeners para máscara de data
    const inputCriacao = document.getElementById('dataCriacao');
    const inputCorte = document.getElementById('dataCorte');
    
    inputCriacao.addEventListener('input', (e) => aplicarMascaraData(e.target));
    inputCorte.addEventListener('input', (e) => aplicarMascaraData(e.target));
    
    // Limpar o outro campo quando um for preenchido
    document.getElementById('dataCriacao').addEventListener('input', function() {
        if (this.value.length > 0) {
            document.getElementById('diasProRata').value = '';
        }
    });
    
    document.getElementById('diasProRata').addEventListener('input', function() {
        if (this.value.length > 0) {
            document.getElementById('dataCriacao').value = '';
        }
    });
});
