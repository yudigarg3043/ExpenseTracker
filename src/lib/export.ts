import * as XLSX from 'xlsx';

export const exportToExcel = (transactions: any[], categories: any[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    transactions.map(t => ({
      Date: new Date(t.date).toLocaleDateString(),
      Type: t.type.toUpperCase(),
      Category_Source: t.category,
      Description: t.description || '',
      Amount: t.amount,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
  XLSX.writeFile(workbook, 'ExpenseTracker_Export.xlsx');
};
