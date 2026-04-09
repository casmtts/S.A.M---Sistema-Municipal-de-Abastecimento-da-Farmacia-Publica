import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, DatePicker, Space, message } from 'antd';
import { MedicamentoType } from '../../types';
import { useMedicamentos } from '../../hooks/useMedicamentos';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

interface FormMedicamentoProps {
  medicamento?: MedicamentoType | null;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormValues {
  nome: string;
  principioAtivo: string;
  concentracao?: string;
  formaFarmaceutica?: string;
  codigoBarras?: string;
  lote?: string;
  validade: Dayjs;
  quantidadeAtual?: number;
  quantidadeMinima: number;
  quantidadeMaxima?: number;
  precoUnitario: number;
  fornecedorId?: string;
}

export const FormMedicamento: React.FC<FormMedicamentoProps> = ({ medicamento, onSuccess, onCancel }) => {
  const { criarMedicamento } = useMedicamentos();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    try {
      const data = {
        ...values,
        validade: values.validade?.toDate(),
        quantidadeAtual: values.quantidadeAtual || 0,
      };
      await criarMedicamento(data);
      message.success(medicamento ? 'Medicamento atualizado!' : 'Medicamento cadastrado!');
      onSuccess();
    } catch {
      message.error('Erro ao salvar medicamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={medicamento ? {
        ...medicamento,
        validade: medicamento.validade ? dayjs(medicamento.validade) : null,
      } : {}}
    >
      <Form.Item
        name="nome"
        label="Nome do Medicamento"
        rules={[{ required: true, message: 'Campo obrigatório' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="principioAtivo"
        label="Princípio Ativo"
        rules={[{ required: true, message: 'Campo obrigatório' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="concentracao" label="Concentração">
        <Input placeholder="Ex: 500mg" />
      </Form.Item>

      <Form.Item name="formaFarmaceutica" label="Forma Farmacêutica">
        <Input placeholder="Ex: Comprimido" />
      </Form.Item>

      <Form.Item name="codigoBarras" label="Código de Barras">
        <Input />
      </Form.Item>

      <Form.Item name="lote" label="Lote">
        <Input />
      </Form.Item>

      <Form.Item
        name="validade"
        label="Data de Validade"
        rules={[{ required: true, message: 'Campo obrigatório' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="quantidadeAtual" label="Quantidade Inicial">
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="quantidadeMinima"
        label="Quantidade Mínima"
        rules={[{ required: true, message: 'Campo obrigatório' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="quantidadeMaxima" label="Quantidade Máxima">
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="precoUnitario"
        label="Preço Unitário"
        rules={[{ required: true, message: 'Campo obrigatório' }]}
      >
        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="fornecedorId" label="ID do Fornecedor">
        <Input />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {medicamento ? 'Atualizar' : 'Cadastrar'}
          </Button>
          <Button onClick={onCancel}>Cancelar</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};