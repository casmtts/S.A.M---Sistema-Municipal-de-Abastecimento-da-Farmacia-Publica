export const gerarTemplateHTML = (
  titulo: string,
  colunas: { header: string; key: string; width?: number }[],
  dados: any[],
  dataGeracao: string,
  horaGeracao: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${titulo}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Helvetica', 'Arial', sans-serif;
          font-size: 12px;
          line-height: 1.4;
          color: #333;
          padding: 20px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #4472C4;
        }
        
        .header h1 {
          color: #4472C4;
          font-size: 24px;
          margin-bottom: 5px;
        }
        
        .header p {
          color: #666;
          font-size: 11px;
        }
        
        .info {
          margin-bottom: 20px;
          padding: 10px;
          background-color: #f5f5f5;
          border-radius: 5px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        
        th {
          background-color: #4472C4;
          color: white;
          padding: 10px 8px;
          text-align: center;
          font-weight: bold;
          border: 1px solid #356aa0;
        }
        
        td {
          padding: 8px;
          border: 1px solid #ddd;
          text-align: left;
        }
        
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        
        .footer {
          text-align: right;
          font-size: 10px;
          color: #999;
          margin-top: 20px;
          padding-top: 10px;
          border-top: 1px solid #ddd;
        }
        
        .total-registros {
          margin-top: 10px;
          padding: 8px;
          background-color: #e8f0fe;
          border-radius: 4px;
          text-align: right;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${titulo}</h1>
        <p>Gerado em: ${dataGeracao} às ${horaGeracao}</p>
      </div>
      
      <div class="info">
        <p><strong>Data de geração:</strong> ${dataGeracao}</p>
        <p><strong>Horário:</strong> ${horaGeracao}</p>
        <p><strong>Total de registros:</strong> ${dados.length}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            ${colunas.map(col => `<th>${col.header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${dados.map(item => `
            <tr>
              ${colunas.map(col => `<td>${item[col.key] || '-'}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="total-registros">
        Total de registros: ${dados.length}
      </div>
      
      <div class="footer">
        <p>Sistema de Abastecimento Municipal - SAM</p>
        <p>Documento gerado automaticamente</p>
      </div>
    </body>
    </html>
  `;
};