import React, { useState } from "react";

function MassaProRata() {
  const [dataInicio, setDataInicio] = useState("");
  const [dataCorte, setDataCorte] = useState("");
  const [diasProRata, setDiasProRata] = useState("");
  const [resultado, setResultado] = useState(null);

  const calcular = () => {
    const inicio = new Date(dataInicio);
    const corte = new Date(dataCorte);
    const diasFatura = (corte - inicio) / (1000 * 60 * 60 * 24);

    setResultado({
      diasFatura,
      diasProRata
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Massa de Teste ProRata</h2>
      <label>Data Início: </label>
      <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} /><br />
      <label>Data Corte: </label>
      <input type="date" value={dataCorte} onChange={e => setDataCorte(e.target.value)} /><br />
      <label>Dias ProRata: </label>
      <input type="number" value={diasProRata} onChange={e => setDiasProRata(e.target.value)} /><br />
      <button onClick={calcular}>Gerar Massa</button>
      {resultado && (
        <div>
          <h3>Fatura aberta: {resultado.diasFatura} dias</h3>
          <h3>Consumo ajustado: {resultado.diasProRata} dias</h3>
        </div>
      )}
    </div>
  );
}

export default MassaProRata;
