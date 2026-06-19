// Elementos do DOM
const form = document.getElementById('proRataForm');
const resultadoDiv = document.getElementById('resultado');

// ─── Utilitários de data ───────────────────────────────────────────────────

function formatarDataBR(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function formatarDataISO(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

function diffDias(dataInicio, dataFim) {
    const ms = dataFim - dataInicio;
    return Math.round(ms / (1000 * 60 * 60 * 24));
}

// ─── Cálculo principal ────────────────────────────────────────────────────

function calcularBackdates(event) {
    event.preventDefault();

    const dataInicioInput  = document.getElementById('dataInicioCiclo').value;
    const dataFimInput     = document.getElementById('dataFimCiclo').value;
    const diasProRataInput = document.getElementById('diasProRata').value.trim();

    if (!dataInicioInput || !dataFimInput) {
        alert('Por favor, informe as datas de início e fim do ciclo.');
        return;
    }

    const diasProRata = parseInt(diasProRataInput);
    if (isNaN(diasProRata) || diasProRata < 1) {
        alert('Informe um número válido de dias de pró-rata.');
        return;
    }

    const dataInicio = new Date(dataInicioInput + 'T00:00:00');
    const dataFim    = new Date(dataFimInput    + 'T00:00:00');

    if (dataFim <= dataInicio) {
        alert('A data de fim do ciclo deve ser depois do início.');
        return;
    }

    const totalDiasCiclo = diffDias(dataInicio, dataFim);

    if (diasProRata > totalDiasCiclo) {
        alert(`Os dias de pró-rata (${diasProRata}) não podem ser maiores que o ciclo total (${totalDiasCiclo} dias).`);
        return;
    }

    // ─── Fórmula do teste de mesa ──────────────────────────────────────
    // Passo 1: Backdate de Migração = fim do ciclo (corte)
    // Passo 2: Backdate de Nascimento = fim do ciclo − diasProRata
    //   Ex: 15/04 − 15 = 31/03  →  de 31/03 até 15/04 = 15 dias ✓
    const backdateMigracao   = new Date(dataFim);
    const backdateNascimento = new Date(dataFim);
    backdateNascimento.setDate(backdateNascimento.getDate() - diasProRata);

    mostrarResultado(dataInicio, dataFim, backdateMigracao, backdateNascimento, diasProRata, totalDiasCiclo);
}

// ─── Exibição ─────────────────────────────────────────────────────────────

function mostrarResultado(dataInicio, dataFim, backdateMigracao, backdateNascimento, diasProRata, totalDiasCiclo) {
    // Passo 1
    document.getElementById('displayBackdateMigracao').textContent = formatarDataBR(backdateMigracao);
    document.getElementById('btnCopiarMigracao').dataset.valor = formatarDataISO(backdateMigracao);

    // Passo 2
    document.getElementById('displayBackdateNascimento').textContent = formatarDataBR(backdateNascimento);
    document.getElementById('btnCopiarNascimento').dataset.valor = formatarDataISO(backdateNascimento);

    // ─── Teste de Mesa ────────────────────────────────────────────────
    document.getElementById('tmCiclo').textContent =
        `${formatarDataBR(dataInicio)} → ${formatarDataBR(dataFim)}`;

    document.getElementById('tmTotalDias').textContent = `${totalDiasCiclo} dias`;

    document.getElementById('tmFormula').textContent =
        `Fim do ciclo (${formatarDataBR(dataFim)}) − ${diasProRata} dias = ${formatarDataBR(backdateNascimento)}`;

    document.getElementById('tmBackdate').textContent = formatarDataBR(backdateNascimento);

    // Prova: de nascimento até fim do ciclo = diffDias
    const diasVerificados = diffDias(backdateNascimento, dataFim);
    document.getElementById('tmPeriodo').textContent =
        `${formatarDataBR(backdateNascimento)} → ${formatarDataBR(dataFim)}`;
    document.getElementById('tmDias').textContent = `${diasVerificados} dias ✓`;

    // Explicação rodapé
    document.getElementById('explicacaoTexto').innerHTML =
        `<strong>Passo 1:</strong> Backdate para <strong>${formatarDataBR(backdateMigracao)}</strong> — execute a migração (= fim do ciclo).<br>` +
        `<strong>Passo 2:</strong> Backdate para <strong>${formatarDataBR(backdateNascimento)}</strong> — cliente nasce aqui.<br>` +
        `Prova: ${formatarDataBR(backdateNascimento)} → ${formatarDataBR(dataFim)} = <strong>${diasVerificados} dias</strong> de pró-rata na fatura.`;

    // Mostrar resultado
    resultadoDiv.classList.remove('hidden');
    resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ─── Copiar para clipboard ────────────────────────────────────────────────

function copiarValor(btn) {
    const valor = btn.dataset.valor;
    if (!valor) return;

    navigator.clipboard.writeText(valor)
        .then(() => {
            const textoOriginal = btn.textContent;
            btn.textContent = '✅ Copiado!';
            btn.classList.add('copiado');
            setTimeout(() => {
                btn.textContent = textoOriginal;
                btn.classList.remove('copiado');
            }, 2000);
        })
        .catch(() => {
            alert('Data: ' + valor);
        });
}

// ─── Event listeners ──────────────────────────────────────────────────────

form.addEventListener('submit', calcularBackdates);

document.getElementById('btnCopiarMigracao').addEventListener('click', function () {
    copiarValor(this);
});

document.getElementById('btnCopiarNascimento').addEventListener('click', function () {
    copiarValor(this);
});

// Valores padrão — exemplo do teste de mesa: ciclo 14/03 → 15/04, 15 dias
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('dataInicioCiclo').value = '2026-03-14';
    document.getElementById('dataFimCiclo').value    = '2026-04-15';
    document.getElementById('diasProRata').value     = '15';
});

