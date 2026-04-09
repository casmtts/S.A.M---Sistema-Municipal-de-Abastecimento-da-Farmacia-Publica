import React, { useState } from 'react';
import { Table, Input, Button, Space, Tag, Modal, message, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMedicamentos } from '../../hooks/useMedicamentos';
import { FormMedicamento } from './FormMedicamento.tsx';
import { MovimentacaoEstoque } from './MovimentacaoEstoque.tsx';
import type { ColumnsType } from 'antd/es/table';
import { MedicamentoType } from '../../types';

export const ListaMedicamentos: React.FC = () => {
  const { medicamentos, loading, atualizarEstoque, recarregar } = useMedicamentos();
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [movimentoVisible, setMovimentoVisible] = useState(false);
  const [selectedMedicamento, setSelectedMedicamento] = useState<MedicamentoType | null>(null);

  const getStatusTag = (medicamento: MedicamentoType) => {
    const isCritico = medicamento.quantidadeAtual <= medicamento.quantidadeMinima * 0.5;
    const isBaixo = medicamento.quantidadeAtual <= medicamento.quantidadeMinima;
    const isExcedente = medicamento.quantidadeAtual >= medicamento.quantidadeMaxima;
    const status = isCritico ? 'CRITICO' : isBaixo ? 'BAIXO' : isExcedente ? 'EXCEDENTE' : 'NORMAL';
    const config = {
      CRITICO: { color: 'red', text: 'Crítico' },
      BAIXO: { color: 'orange', text: 'Baixo' },
      NORMAL: { color: 'green', text: 'Normal' },
      EXCEDENTE: { color: 'blue', text: 'Excedente' }
    };
    return <Tag color={config[status].color}>{config[status].text}</Tag>;
  };

  const columns: ColumnsType<MedicamentoType> = [
    {
      title: 'Medicamento',
      dataIndex: 'nome',
      key: 'nome',
      sorter: (a: { nome: string; }, b: { nome: any; }) => a.nome.localeCompare(b.nome),
    },
    {
      title: 'Princípio Ativo',
      dataIndex: 'principioAtivo',
      key: 'principioAtivo',
    },
    {
      title: 'Estoque',
      dataIndex: 'quantidadeAtual',
      key: 'quantidadeAtual',
      sorter: (a: { quantidadeAtual: number; }, b: { quantidadeAtual: number; }) => a.quantidadeAtual - b.quantidadeAtual,
      render: (value: number, record: MedicamentoType) => (
        <Space>
          <span>{value} un.</span>
          {getStatusTag(record)}
        </Space>
      ),
    },
    {
      title: 'Mínimo',
      dataIndex: 'quantidadeMinima',
      key: 'quantidadeMinima',
      render: (value: any) => `${value} un.`,
    },
    {
      title: 'Preço Unit.',
      dataIndex: 'precoUnitario',
      key: 'precoUnitario',
      render: (value: number) => `R$ ${value.toFixed(2)}`,
    },
    {
      title: 'Validade',
      dataIndex: 'validade',
      key: 'validade',
      render: (value: string | number | Date) => new Date(value).toLocaleDateString(),
      sorter: (a: { validade: string | number | Date; }, b: { validade: string | number | Date; }) => new Date(a.validade).getTime() - new Date(b.validade).getTime(),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: MedicamentoType) => (
        <Space>
          <Button 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedMedicamento(record);
              setModalVisible(true);
            }}
          >
            Editar
          </Button>
          <Button 
            size="small" 
            type="primary"
            onClick={() => {
              setSelectedMedicamento(record);
              setMovimentoVisible(true);
            }}
          >
            Movimentar
          </Button>
          <Popconfirm
            title="Confirmar exclusão"
            description={`Deseja realmente excluir ${record.nome}?`}
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Excluir
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleDelete = async (_id: string) => {
    try {
      // Implementar deleção
      message.success('Medicamento excluído com sucesso');
      await recarregar();
    } catch (error) {
      message.error('Erro ao excluir medicamento');
    }
  };

  const filteredMedicamentos = medicamentos.filter((m: { nome: string; principioAtivo: string; }) =>
    m.nome.toLowerCase().includes(searchText.toLowerCase()) ||
    m.principioAtivo.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Buscar por nome ou princípio ativo"
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          value={searchText}
          onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSearchText(e.target.value)}
          allowClear
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedMedicamento(null);
            setModalVisible(true);
          }}
        >
          Novo Medicamento
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredMedicamentos}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />

      <Modal
        title={selectedMedicamento ? 'Editar Medicamento' : 'Novo Medicamento'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <FormMedicamento
          medicamento={selectedMedicamento}
          onSuccess={() => {
            setModalVisible(false);
            recarregar();
          }}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>

      <Modal
        title="Movimentar Estoque"
        open={movimentoVisible}
        onCancel={() => setMovimentoVisible(false)}
        footer={null}
      >
        {selectedMedicamento && (
          <MovimentacaoEstoque
            medicamento={selectedMedicamento}
            onSuccess={async (quantidade: any, tipo: any) => {
              await atualizarEstoque(selectedMedicamento.id, quantidade, tipo);
              setMovimentoVisible(false);
              message.success('Estoque atualizado com sucesso');
            }}
          />
        )}
      </Modal>
    </div>
  );
};