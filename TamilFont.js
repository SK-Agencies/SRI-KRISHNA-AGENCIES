document.getElementById('generateInvoice').addEventListener('click', () => {
    const customerName = "வாடிக்கையாளர் பெயர்: மனைவா";
    const invoiceDate = "அருமை நாள்: 2024-11-20";

    const rows = [
        { description: "பொருள் 1", quantity: 2, price: 50, total: 100 },
        { description: "பொருள் 2", quantity: 1, price: 100, total: 100 },
    ];

    const grandTotal = rows.reduce((sum, row) => sum + row.total, 0);

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add Tamil font
    doc.addFileToVFS("TamilFont.ttf", tamilFontBase64); // Add Base64 font data
    doc.addFont("TamilFont.ttf", "TamilFont", "normal");
    doc.setFont("TamilFont");

    // Add Tamil content
    doc.setFontSize(16);
    doc.text(customerName, 10, 20);
    doc.text(invoiceDate, 10, 30);

    // Prepare table data
    const tableData = rows.map(row => [
        row.description, 
        row.quantity, 
        row.price.toFixed(2), 
        row.total.toFixed(2)
    ]);

    // Add grand total row
    tableData.push(["", "", "மொத்தம்", grandTotal.toFixed(2)]);

    const columns = [
        { title: "பொருள்", dataKey: 0 },
        { title: "அளவு", dataKey: 1 },
        { title: "விலை", dataKey: 2 },
        { title: "மொத்தம்", dataKey: 3 }
    ];

    doc.autoTable(columns, tableData, {
        startY: 50,
        margin: { right: 10 },
        theme: 'grid',
        bodyStyles: {
            font: "TamilFont",
            textColor: [0, 0, 0],
        },
        didParseCell: (data) => {
            if (data.row.index === tableData.length - 1) {
                data.cell.styles.fontStyle = 'bold';
            }
        }
    });

    // Save as PDF
    doc.save("invoice_tamil.pdf");
});