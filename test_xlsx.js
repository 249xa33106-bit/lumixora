const XLSX = require('xlsx');  
const wb = XLSX.utils.book_new(); const ws = XLSX.utils.aoa_to_sheet([['A','B'],['', '']]); ws['A2'].s = {fill: {fgColor: {rgb: 'FFFF0000'}}}; XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); XLSX.writeFile(wb, 'test.xlsx');  
