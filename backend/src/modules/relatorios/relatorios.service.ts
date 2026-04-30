import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import * as puppeteer from 'puppeteer';
import { formatadores } from '../../common/utils/formatadores.util';
import { RelatorioOptionsDto, TipoRelatorio, FormatoRelatorio } from './dto/relatorio-option.dto';

@Injectable()
export class RelatoriosService {
  constructor(private prisma: PrismaService) {}

  async gerarRelatorio(options: RelatorioOptionsDto): Promise<{ buffer: Buffer; contentType: string; filename: string }> {
    let dados: any[];
    let titulo: string;
    let colunas: any[];

    switch (options.tipo) {
      case TipoRelatorio.MEDICAMENTOS:
        const medicamentos = await this.getDadosMedicamentos();
        dados = medicamentos.dados;
        titulo = 'Relatório de Medicamentos';
        colunas = medicamentos.colunas;
        break;
      case TipoRelatorio.PEDIDOS:
        const pedidos = await this.getDadosPedidos(options);
        dados = pedidos.dados;
        titulo = 'Relatório de Pedidos';
        colunas = pedidos.colunas;
        break;
      case TipoRelatorio.MOVIMENTACOES:
        const movimentacoes = await this.getDadosMovimentacoes(options);
        dados = movimentacoes.dados;
        titulo = 'Relatório de Movimentações';
        colunas = movimentacoes.colunas;
        break;
      case TipoRelatorio.FORNECEDORES:
        const fornecedores = await this.getDadosFornecedores();
        dados = fornecedores.dados;
        titulo = 'Relatório de Fornecedores';
        colunas = fornecedores.colunas;
        break;
      case TipoRelatorio.UNIDADES:
        const unidades = await this.getDadosUnidades();
        dados = unidades.dados;
        titulo = 'Relatório de Unidades de Saúde';
        colunas = unidades.colunas;
        break;
      case TipoRelatorio.USUARIOS:
        const usuarios = await this.getDadosUsuarios();
        dados = usuarios.dados;
        titulo = 'Relatório de Usuários';
        colunas = usuarios.colunas;
        break;
      default:
        throw new Error('Tipo de relatório não suportado');
    }

    const dataGeracao = formatadores.data(new Date());
    const horaGeracao = new Date().toLocaleTimeString('pt-BR');
    const nomeArquivo = `${titulo.replace(/\s/g, '_')}_${dataGeracao.replace(/\//g, '-')}`;

    if (options.formato === FormatoRelatorio.EXCEL) {
      const buffer = await this.gerarExcel(dados, colunas, titulo, dataGeracao, horaGeracao);
      return {
        buffer,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        filename: `${nomeArquivo}.xlsx`,
      };
    } else {
      const buffer = await this.gerarPDFComPuppeteer(dados, colunas, titulo, dataGeracao, horaGeracao);
      return {
        buffer,
        contentType: 'application/pdf',
        filename: `${nomeArquivo}.pdf`,
      };
    }
  }

  // ==================== GERAR PDF COM PUPPETEER ====================

  private async gerarPDFComPuppeteer(
    dados: any[],
    colunas: any[],
    titulo: string,
    dataGeracao: string,
    horaGeracao: string
  ): Promise<Buffer> {
    const html = this.gerarTemplateHTML(titulo, colunas, dados, dataGeracao, horaGeracao);
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        landscape: true,
        printBackground: true,
        margin: {
          top: '1cm',
          right: '1cm',
          bottom: '1cm',
          left: '1cm',
        },
      });
      
      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }

  private gerarTemplateHTML(
    titulo: string,
    colunas: { header: string; key: string; width?: number }[],
    dados: any[],
    dataGeracao: string,
    horaGeracao: string
  ): string {
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
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
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
  }

  // ==================== MÉTODOS DE DADOS ====================

  private async getDadosMedicamentos() {
    const medicamentos = await this.prisma.medicamento.findMany({
      orderBy: { nome: 'asc' },
    });

    const dados = medicamentos.map(m => ({
      Nome: m.nome,
      'Princípio Ativo': m.principioAtivo,
      Concentração: m.concentracao || '-',
      'Forma Farmacêutica': m.formaFarmaceutica || '-',
      Estoque: `${m.quantidadeAtual} un.`,
      Mínimo: `${m.quantidadeMinima} un.`,
      'Preço Unitário': formatadores.moeda(m.precoUnitario),
      Validade: formatadores.data(m.validade),
      Status: m.quantidadeAtual <= m.quantidadeMinima ? '⚠️ Baixo' : '✅ Normal',
    }));

    const colunas = [
      { header: 'Nome', key: 'Nome', width: 30 },
      { header: 'Princípio Ativo', key: 'Princípio Ativo', width: 30 },
      { header: 'Concentração', key: 'Concentração', width: 15 },
      { header: 'Forma Farmacêutica', key: 'Forma Farmacêutica', width: 20 },
      { header: 'Estoque', key: 'Estoque', width: 12 },
      { header: 'Mínimo', key: 'Mínimo', width: 10 },
      { header: 'Preço Unitário', key: 'Preço Unitário', width: 15 },
      { header: 'Validade', key: 'Validade', width: 12 },
      { header: 'Status', key: 'Status', width: 10 },
    ];

    return { dados, colunas };
  }

  private async getDadosPedidos(options: RelatorioOptionsDto) {
    const where: any = {};
    
    if (options.status && options.status !== 'todos') {
      where.status = options.status;
    }
    
    if (options.dataInicio && options.dataFim) {
      where.dataSolicitacao = {
        gte: new Date(options.dataInicio),
        lte: new Date(options.dataFim),
      };
    }

    const pedidos = await this.prisma.pedido.findMany({
      where,
      include: {
        medicamento: true,
        solicitante: { select: { nome: true } },
      },
      orderBy: { dataSolicitacao: 'desc' },
    });

    const dados = pedidos.map(p => ({
      Medicamento: p.medicamentoNome,
      'Qtd. Solicitada': `${p.quantidadeSolicitada} un.`,
      'Qtd. Entregue': `${p.quantidadeEntregue} un.`,
      'Data Solicitação': formatadores.data(p.dataSolicitacao),
      'Data Prevista': formatadores.data(p.dataPrevistaEntrega),
      'Data Entrega': p.dataEntregaReal ? formatadores.data(p.dataEntregaReal) : '-',
      Status: this.getStatusPedidoLabel(p.status),
      'Valor Total': formatadores.moeda(p.valorTotal),
      Solicitante: p.solicitante?.nome || '-',
    }));

    const colunas = [
      { header: 'Medicamento', key: 'Medicamento', width: 30 },
      { header: 'Qtd. Solicitada', key: 'Qtd. Solicitada', width: 15 },
      { header: 'Qtd. Entregue', key: 'Qtd. Entregue', width: 15 },
      { header: 'Data Solicitação', key: 'Data Solicitação', width: 15 },
      { header: 'Data Prevista', key: 'Data Prevista', width: 12 },
      { header: 'Data Entrega', key: 'Data Entrega', width: 12 },
      { header: 'Status', key: 'Status', width: 12 },
      { header: 'Valor Total', key: 'Valor Total', width: 15 },
      { header: 'Solicitante', key: 'Solicitante', width: 20 },
    ];

    return { dados, colunas };
  }

  private async getDadosMovimentacoes(options: RelatorioOptionsDto) {
    const where: any = {};
    
    if (options.dataInicio && options.dataFim) {
      where.data = {
        gte: new Date(options.dataInicio),
        lte: new Date(options.dataFim),
      };
    }

    const movimentacoes = await this.prisma.movimentacao.findMany({
      where,
      include: {
        medicamento: { select: { nome: true } },
        responsavel: { select: { nome: true } },
      },
      orderBy: { data: 'desc' },
    });

    const dados = movimentacoes.map(m => ({
      Data: formatadores.data(m.data),
      Hora: new Date(m.data).toLocaleTimeString('pt-BR'),
      Medicamento: m.medicamentoNome,
      Tipo: this.getTipoMovimentacaoLabel(m.tipo),
      Quantidade: `${m.quantidade} un.`,
      Responsável: m.responsavelNome,
      Documento: m.documentoReferencia || '-',
      Observação: m.observacao || '-',
    }));

    const colunas = [
      { header: 'Data', key: 'Data', width: 12 },
      { header: 'Hora', key: 'Hora', width: 10 },
      { header: 'Medicamento', key: 'Medicamento', width: 30 },
      { header: 'Tipo', key: 'Tipo', width: 12 },
      { header: 'Quantidade', key: 'Quantidade', width: 12 },
      { header: 'Responsável', key: 'Responsável', width: 25 },
      { header: 'Documento', key: 'Documento', width: 15 },
      { header: 'Observação', key: 'Observação', width: 30 },
    ];

    return { dados, colunas };
  }

  private async getDadosFornecedores() {
    const fornecedores = await this.prisma.fornecedor.findMany({
      orderBy: { nome: 'asc' },
    });

    const dados = fornecedores.map(f => ({
      Nome: f.nome,
      CNPJ: f.cnpj,
      Contato: f.contato || '-',
      Telefone: formatadores.telefone(f.telefone || ''),
      Email: f.email || '-',
      Cidade: f.cidade || '-',
      UF: f.uf || '-',
      Status: f.ativo ? '✅ Ativo' : '❌ Inativo',
    }));

    const colunas = [
      { header: 'Nome', key: 'Nome', width: 30 },
      { header: 'CNPJ', key: 'CNPJ', width: 18 },
      { header: 'Contato', key: 'Contato', width: 20 },
      { header: 'Telefone', key: 'Telefone', width: 15 },
      { header: 'Email', key: 'Email', width: 25 },
      { header: 'Cidade', key: 'Cidade', width: 20 },
      { header: 'UF', key: 'UF', width: 5 },
      { header: 'Status', key: 'Status', width: 10 },
    ];

    return { dados, colunas };
  }

  private async getDadosUnidades() {
    const unidades = await this.prisma.unidadeSaude.findMany({
      orderBy: { nome: 'asc' },
    });

    const dados = unidades.map(u => ({
      Nome: u.nome,
      Código: u.codigo,
      Tipo: u.tipo,
      Responsável: u.responsavel || '-',
      Telefone: formatadores.telefone(u.telefone || ''),
      Cidade: u.cidade || '-',
      UF: u.uf || '-',
      Status: u.ativo ? '✅ Ativo' : '❌ Inativo',
    }));

    const colunas = [
      { header: 'Nome', key: 'Nome', width: 35 },
      { header: 'Código', key: 'Código', width: 12 },
      { header: 'Tipo', key: 'Tipo', width: 15 },
      { header: 'Responsável', key: 'Responsável', width: 25 },
      { header: 'Telefone', key: 'Telefone', width: 15 },
      { header: 'Cidade', key: 'Cidade', width: 20 },
      { header: 'UF', key: 'UF', width: 5 },
      { header: 'Status', key: 'Status', width: 10 },
    ];

    return { dados, colunas };
  }

  private async getDadosUsuarios() {
    const usuarios = await this.prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        role: true,
        ativo: true,
        cargo: true,
        createdAt: true,
      },
      orderBy: { nome: 'asc' },
    });

    const dados = usuarios.map(u => ({
      Nome: u.nome,
      Email: u.email,
      CPF: formatadores.cpf(u.cpf),
      Perfil: this.getRoleLabel(u.role),
      Cargo: u.cargo || '-',
      Status: u.ativo ? '✅ Ativo' : '❌ Inativo',
      'Data Cadastro': formatadores.data(u.createdAt),
    }));

    const colunas = [
      { header: 'Nome', key: 'Nome', width: 30 },
      { header: 'Email', key: 'Email', width: 30 },
      { header: 'CPF', key: 'CPF', width: 15 },
      { header: 'Perfil', key: 'Perfil', width: 15 },
      { header: 'Cargo', key: 'Cargo', width: 20 },
      { header: 'Status', key: 'Status', width: 10 },
      { header: 'Data Cadastro', key: 'Data Cadastro', width: 12 },
    ];

    return { dados, colunas };
  }

  // ==================== GERADOR DE EXCEL ====================

  private async gerarExcel(dados: any[], colunas: any[], titulo: string, dataGeracao: string, horaGeracao: string): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(titulo.substring(0, 31));

    worksheet.mergeCells('A1', `${this.getColumnLetter(colunas.length)}1`);
    const titleCell = worksheet.getCell('A1');
    titleCell.value = titulo;
    titleCell.font = { size: 16, bold: true, name: 'Calibri' };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.mergeCells('A2', `${this.getColumnLetter(colunas.length)}2`);
    const dateCell = worksheet.getCell('A2');
    dateCell.value = `Gerado em: ${dataGeracao} às ${horaGeracao}`;
    dateCell.font = { size: 10, italic: true, name: 'Calibri' };
    dateCell.alignment = { horizontal: 'center' };

    worksheet.addRow([]);

    const headerRow = worksheet.addRow(colunas.map(c => c.header));
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Calibri' };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 25;

    dados.forEach((item, index) => {
      const row = worksheet.addRow(colunas.map(c => item[c.key] || '-'));
      row.alignment = { vertical: 'middle' };
      row.height = 20;
      
      if (index % 2 === 1) {
        row.eachCell(cell => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
        });
      }
    });

    colunas.forEach((col, idx) => {
      worksheet.getColumn(idx + 1).width = col.width;
      worksheet.getColumn(idx + 1).alignment = { vertical: 'middle' };
    });

    worksheet.eachRow(row => {
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    worksheet.views = [{ state: 'frozen', ySplit: 3 }];

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private getColumnLetter(columnCount: number): string {
    let result = '';
    let n = columnCount;
    while (n > 0) {
      n--;
      result = String.fromCharCode(65 + (n % 26)) + result;
      n = Math.floor(n / 26);
    }
    return result;
  }

  // ==================== UTILITÁRIOS ====================

  private getStatusPedidoLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDENTE: '⏳ Pendente',
      APROVADO: '✅ Aprovado',
      EM_ANALISE: '🔍 Em Análise',
      ENVIADO: '📦 Enviado',
      ENTREGUE: '🎯 Entregue',
      CANCELADO: '❌ Cancelado',
    };
    return labels[status] || status;
  }

  private getTipoMovimentacaoLabel(tipo: string): string {
    const labels: Record<string, string> = {
      ENTRADA: '📥 Entrada',
      SAIDA: '📤 Saída',
      DISPENSA: '💊 Dispensa',
    };
    return labels[tipo] || tipo;
  }

  private getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      ADMIN: '👑 Administrador',
      GESTOR: '📊 Gestor',
      FARMACEUTICO: '💊 Farmacêutico',
      ATENDENTE: '🏥 Atendente',
      CONSULTOR: '📈 Consultor',
    };
    return labels[role] || role;
  }
}