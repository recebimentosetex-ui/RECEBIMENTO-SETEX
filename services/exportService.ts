declare const XLSX: any;

export const exportReleasesToExcel = (releases, fileName) => {
  const worksheetData = releases.map(release => ({
    'ID': release.displayId || '',
    'MATERIAL': release.material, 'OPERADOR': release.operador, 'RUA': release.rua,
    'LOCAL DE ENTREGA': release.localDeEntrega, 'DATA': release.data, 'STATUS': release.status, 'SM': release.sm,
  }));
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Liberações');
  worksheet['!cols'] = [{ wch: 10 }, { wch: 30 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 30 }, { wch: 15 }];
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportFiberStockToExcel = (stock, fileName) => {
  const worksheetData = stock.map(item => ({
    'ID': item.displayId || '',
    'MATERIAL': item.material, 'LOTE': item.lote, 'QTD': item.qtd, 'PRATELEIRA': item.prateleira,
    'RUA': item.rua, 'SALA': item.sala, 'STATUS': item.status, 'SM': item.sm,
  }));
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Estoque de Fibras');
  worksheet['!cols'] = [
      { wch: 10 }, { wch: 30 }, { wch: 20 }, { wch: 10 }, { wch: 15 }, 
      { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 15 }
  ];
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};