import React, { useState } from 'react';
import { Radio, InputNumber, Button, Space, Typography, Alert } from 'antd';
import { MedicamentoType } from '../../types';

const { Text } = Typography;

interface MovimentacaoEstoqueProps {
  medicamento: MedicamentoType;
  onSuccess: (quantidade: number, tipo: 'ENTRADA' | 'SAIDA') => void;
}

export const MovimentacaoEstoque: React.FC<MovimentacaoEstoqueProps> = ({ medicamento, onSuccess }) => {
  const [tipo, setTipo] = useState<'ENTRADA' | 'SAIDA'>('ENTRADA');
  const [quantidade, setQuantidade] = useState<number>(1);
  const [error, setError] = useState<string>('');

  const handleSubmit = () => {
    if (quantidade <= 0) {
      setError('Quantidade deve ser maior que zero');
      return;
    }

    if (tipo === 'SAIDA' && quantidade > medicamento.quantidadeAtual) {
      setError(`Estoque insuficiente. Disponível: ${medicamento.quantidadeAtual} unidades`);
      return;
    }

    setError('');
    onSuccess(quantidade, tipo);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Text strong>Medicamento:</Text> {medicamento.nome}<br />
        <Text strong>Estoque atual:</Text> {medicamento.quantidadeAtual} unidades
      </div>

      <div style={{ marginBottom: 16 }}>
        <Radio.Group 
          value={tipo} 
          onChange={(e) => setTipo(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="ENTRADA">Entrada</Radio.Button>
          <Radio.Button value="SAIDA">Saída</Radio.Button>
        </Radio.Group>
      </div>

      {error && (
        <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />
      )}

      <div style={{ marginBottom: 16 }}>
        <InputNumber
          min={1}
          value={quantidade}
          onChange={(value) => setQuantidade(value || 0)}
          style={{ width: '100%' }}
          placeholder="Quantidade"
        />
      </div>

      <Space>
        <Button type="primary" onClick={handleSubmit}>
          Confirmar
        </Button>
      </Space>
    </div>
  );
};