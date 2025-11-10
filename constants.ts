import { Status, FiberStatus } from './types';

export const STATUS_OPTIONS = [
  { value: Status.Pendente, label: 'MATERIAL ENTREGUE - PENDENTE' },
  { value: Status.Finalizado, label: 'MATERIAL PAGO - FINALIZADO' },
];

export const FIBER_STATUS_OPTIONS = [
  { value: FiberStatus.EmEstoque, label: 'EM ESTOQUE' },
  { value: FiberStatus.Pago, label: 'MATERIAL PAGO' },
];
