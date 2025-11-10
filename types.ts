export const Status = {
  Pendente: 'MATERIAL ENTREGUE - PENDENTE',
  Finalizado: 'MATERIAL PAGO - FINALIZADO',
};

export const FiberStatus = {
  EmEstoque: 'EM ESTOQUE',
  Pago: 'MATERIAL PAGO',
};

// Fix: Add a global declaration for window.google to resolve TypeScript errors.
declare global {
  interface Window {
    google: any;
  }
}
