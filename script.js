document.getElementById('addRow').addEventListener('click', () => {
    const table = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    const row = table.insertRow();
    row.innerHTML = `
        <td><input type="text" placeholder="Description" class="description"></td>
        <td><input type="number" placeholder="Qty" class="quantity" min="1"></td>
        <td><input type="number" placeholder="Price" class="price" min="0.01" step="0.01"></td>
        <td class="total">0.00</td>
    `;
});

document.getElementById('productTable').addEventListener('input', (e) => {
    if (e.target.classList.contains('quantity') || e.target.classList.contains('price')) {
        const row = e.target.closest('tr');
        const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
        const price = parseFloat(row.querySelector('.price').value) || 0;
        row.querySelector('.total').textContent = (quantity * price).toFixed(2);
    }
});

document.getElementById('generateInvoice').addEventListener('click', () => {
    const customerName = document.getElementById('customerName').value;
    const invoiceDate = document.getElementById('invoiceDate').value || new Date().toISOString().split('T')[0]; // Default to today's date if empty
    const rows = Array.from(document.querySelectorAll('#productTable tbody tr')).map(row => ({
        description: row.querySelector('.description').value,
        quantity: parseFloat(row.querySelector('.quantity').value) || 0,
        price: parseFloat(row.querySelector('.price').value) || 0,
        total: parseFloat(row.querySelector('.total').textContent) || 0
    }));

    const grandTotal = rows.reduce((sum, row) => sum + row.total, 0); // Calculate grand total

    const { jsPDF } = window.jspdf;

    // Create a new PDF document
    const doc = new jsPDF();

    // Set company name style (blue, bold, larger font)
    doc.setFontSize(24);  // Larger font size for company name
    doc.setTextColor(0, 0, 255);  // Blue color
    doc.setFont("helvetica", "bold");  // Bold font style
    doc.text("SRI KRISHNA AGENCIES", 105, 20, { align: "center" });

    // Reset font color and style for other details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);  // Black color for address
    doc.setFont("helvetica", "normal");

    // Add company address
    doc.text("NORTH STREET, POTTAL PUTHUR, SANGANAPURAM - 627114", 105, 30, { align: "center" });

    // Add customer details
    doc.setFontSize(14);
    doc.text(`Customer Name: ${customerName}`, 10, 50);

    // Add invoice date
    doc.text(`Invoice Date: ${invoiceDate}`, 10, 60);

    // Prepare table data with the grand total row
    const tableData = rows.map(row => [
        row.description, 
        row.quantity, 
        `${row.price.toFixed(2)}`, 
        `${row.total.toFixed(2)}`
    ]);

    // Add grand total as a final row
    tableData.push([
        "", // Empty for Description column
        "", // Empty for Quantity column
        "Grand Total", // Label in Price column
        `RS: ${grandTotal.toFixed(2)}` // Value in Total column
    ]);

    // Define columns for the table
    const columns = [
        { title: "Product Description", dataKey: 0 },
        { title: "Quantity", dataKey: 1 },
        { title: "Price", dataKey: 2 },
        { title: "Total", dataKey: 3 }
    ];

    // Use jsPDF AutoTable to add the table to the PDF
    doc.autoTable(columns, tableData, {
        startY: 70,
        margin: { right: 10 },
        theme: 'grid',
        bodyStyles: {
            textColor: [0, 0, 0], // Black text for body
        },
        didParseCell: (data) => {
            if (data.row.index === tableData.length - 1) { // Check if it's the last row (Grand Total)
                data.cell.styles.fontStyle = 'bold';
                if (data.column.index === 3) { // Grand Total value column
                    data.cell.styles.textColor = [0, 128, 0]; // Green color for total amount
                }
            }
        }
    });

    // Save as PDF
    doc.save(`${customerName}`+'_bill.pdf');
});
