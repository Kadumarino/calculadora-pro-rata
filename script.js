// Elementos do DOM
const form = document.getElementById('proRataForm');
const resultadoDiv = document.getElementById('resultado');
const btnCopiar = document.getElementById('btnCopiar');

// Função para aplicar máscara de data DD/MM/YYYY
function aplicarMascaraData(input) {
    // Guarda posição do cursor
    const cursorPos = input.selectionStart;
    const valorAnterior = input.value;
    
    // Remove tudo exceto dígitos
    let apenasDigitos = input.value.replace(/\D/g, '');
    
    // Limita a 8 dígitos (DDMMAAAA)
    apenasDigitos = apenasDigitos.substring(0, 8);
    
    // Formata progressivamente
    let valorFormatado = '';
    if (apenasDigitos.length > 0) {
        valorFormatado = apenasDigitos.substring(0, 2); // DD
    }
    if (apenasDigitos.length >= 3) {
        valorFormatado += '/' + apenasDigitos.substring(2, 4); // MM
    }
    if (apenasDigitos.length >= 5) {
        valorFormatado += '/' + apenasDigitos.substring(4, 8); // AAAA
    }
    
    input.value = valorFormatado;
    
    // Ajusta cursor: se adicionou caractere, move cursor para frente
    if (valorFormatado.length > valorAnterior.length) {
        input.setSelectionRange(cursorPos + 1, cursorPos + 1);
    } else {
        input.setSelectionRange(cursorPos, cursorPos);
    }
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
    const diaCorteInput = document.getElementById('diaCorte').value.trim();
    const diasProRataInput = document.getElementById('diasProRata').value.trim();
    const dataVencimentoInput = document.getElementById('dataVencimento').value.trim();

    // Validações obrigatórias
    if (!diaCorteInput || !diasProRataInput) {
        alert('Por favor, preencha Dia de Corte e Dias de Pró-Rata.');
        return;
    }

    const diaCorte = parseInt(diaCorteInput);
    if (isNaN(diaCorte) || diaCorte < 1 || diaCorte > 31) {
        alert('Dia de Corte deve ser entre 1 e 31.');
        return;
    }

    const diasProRata = parseInt(diasProRataInput);
    if (isNaN(diasProRata) || diasProRata < 1) {
        alert('Informe um número válido de dias de pró-rata.');
        return;
    }

    // Validar data de vencimento (opcional)
    let dataVencimento = null;
    if (dataVencimentoInput) {
        dataVencimento = new Date(dataVencimentoInput + 'T00:00:00');
        if (isNaN(dataVencimento.getTime())) {
            alert('Data de Vencimento inválida.');
            return;
        }
    }

    // Calcular data de corte completa baseada no dia e no vencimento (ou hoje)
    const dataCorte = calcularDataCorte(diaCorte, dataVencimento);

    // CÁLCULO: Data de Backdate = Data de Corte - (Dias - 1)
    // Por quê -1? Porque o dia de corte conta como um dos dias de pró-rata
    const dataBackdate = new Date(dataCorte);
    dataBackdate.setDate(dataBackdate.getDate() - (diasProRata - 1));

    // Exibir resultado
    mostrarResultado(dataBackdate, dataCorte, dataVencimento, diasProRata);
}

// Função para calcular data de corte completa baseada no dia
function calcularDataCorte(diaCorte, dataVencimento) {
    // Se tiver vencimento, usar como referência
    if (dataVencimento) {
        const ano = dataVencimento.getFullYear();
        const mes = dataVencimento.getMonth();
        
        // Criar data de corte no mesmo mês/ano do vencimento
        let dataCorte = new Date(ano, mes, diaCorte);
        
        // Se a data de corte for depois do vencimento, voltar um mês
        if (dataCorte > dataVencimento) {
            dataCorte = new Date(ano, mes - 1, diaCorte);
        }
        
        return dataCorte;
    }
    
    // Sem vencimento, usar o próximo dia de corte a partir de hoje
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    let dataCorte = new Date(hoje.getFullYear(), hoje.getMonth(), diaCorte);
    
    // Se o dia de corte já passou este mês, pegar o próximo
    if (dataCorte <= hoje) {
        dataCorte = new Date(hoje.getFullYear(), hoje.getMonth() + 1, diaCorte);
    }
    
    return dataCorte;
}

// Função para calcular status da fatura
function calcularStatusFatura(dataCorte, dataVencimento) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const corte = new Date(dataCorte);
    corte.setHours(0, 0, 0, 0);
    
    const vencimento = new Date(dataVencimento);
    vencimento.setHours(0, 0, 0, 0);
    
    const diasAteVencimento = Math.floor((vencimento - hoje) / (1000 * 60 * 60 * 24));
    
    let status, statusClass;
    
    if (hoje < corte) {
        status = '⏳ Em aberto (antes do corte)';
        statusClass = 'status-aberto';
    } else if (hoje >= corte && hoje < vencimento) {
        status = '📋 Em aberto (aguardando vencimento)';
        statusClass = 'status-aberto';
    } else if (hoje >= vencimento) {
        status = '❌ Vencida';
        statusClass = 'status-vencida';
    }
    
    return { status, statusClass, diasAteVencimento };
}

// Função para exibir o resultado
function mostrarResultado(dataBackdate, dataCorte, dataVencimento, diasProRata) {
    // Preencher campos de exibição
    document.getElementById('displayBackdate').textContent = formatarDataBR(dataBackdate);
    document.getElementById('displayCorte').textContent = formatarDataBR(dataCorte);
    
    if (dataVencimento) {
        document.getElementById('displayVencimento').textContent = formatarDataBR(dataVencimento);
    } else {
        document.getElementById('displayVencimento').textContent = '-';
    }
    
    document.getElementById('displayDias').textContent = `${diasProRata} dias`;
    document.getElementById('displayPeriodo').textContent = 
        `${formatarDataBR(dataBackdate)} a ${formatarDataBR(dataCorte)}`;

    // Calcular e exibir status da fatura (se vencimento informado)
    if (dataVencimento) {
        const { status, statusClass, diasAteVencimento } = calcularStatusFatura(dataCorte, dataVencimento);
        const statusElement = document.getElementById('displayStatus');
        statusElement.textContent = status;
        statusElement.className = 'value ' + statusClass;
        
        // Exibir dias até/desde vencimento
        let textoVencimento;
        if (diasAteVencimento > 0) {
            textoVencimento = `${diasAteVencimento} dias para vencer`;
        } else if (diasAteVencimento === 0) {
            textoVencimento = 'Vence hoje';
        } else {
            textoVencimento = `${Math.abs(diasAteVencimento)} dias vencida`;
        }
        document.getElementById('displayDiasVencimento').textContent = textoVencimento;
    } else {
        document.getElementById('displayStatus').textContent = '-';
        document.getElementById('displayDiasVencimento').textContent = '-';
    }

    // Atualizar explicação
    document.getElementById('backdateTexto').textContent = formatarDataBR(dataBackdate);
    document.getElementById('diasTexto').textContent = diasProRata;
    document.getElementById('corteTexto').textContent = formatarDataBR(dataCorte);

    // Armazenar data de backdate para cópia
    btnCopiar.dataset.dataBackdate = formatarDataISO(dataBackdate);

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
    // Exemplo padrão baseado no cenário do usuário:
    // Dia de corte: 3, 10 dias de pró-rata, Vencimento: 13/06/2026
    document.getElementById('diaCorte').value = '3';
    document.getElementById('diasProRata').value = '10';
    document.getElementById('dataVencimento').value = '2026-06-13';
});
