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
        quantity: row.querySelector('.quantity').value,
        price: row.querySelector('.price').value,
        total: row.querySelector('.total').textContent
    }));

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
    doc.text("WEST STREET, POTTAL PUTHUR, SANGANAPURAM - 627114", 105, 30, { align: "center" });

    // Add customer details
    doc.setFontSize(14);
    doc.text(`Customer Name: ${customerName}`, 10, 50);

    // Add invoice date
    doc.text(`Invoice Date: ${invoiceDate}`, 10, 60);

    // Add table header and product details using autoTable
    const tableData = rows.map(row => [
        row.description, row.quantity, row.price, row.total
    ]);

    // Define columns for the table
    const columns = [
        { title: "Product Description", dataKey: 0 },
        { title: "Quantity", dataKey: 1 },
        { title: "Price", dataKey: 2 },
        { title: "Total", dataKey: 3 }
    ];

    // Use jsPDF AutoTable to add the table to the PDF
    doc.autoTable(columns, tableData, { startY: 70 });

    // Save as PDF
    doc.save("invoice.pdf");
});
