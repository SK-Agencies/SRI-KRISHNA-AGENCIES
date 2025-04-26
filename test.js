function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const customerName = document.getElementById('customerName').value;
    const address = document.getElementById('address').value;
    const item = document.getElementById('item').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;

    // Add the content to the PDF
    doc.setFont('times', 'normal');
    doc.setFontSize(14);

    doc.text(`பெயர்: ${customerName}`, 20, 30);
    doc.text(`சமூக முகவரி: ${address}`, 20, 40);
    doc.text(`பொருள்: ${item}`, 20, 50);
    doc.text(`அளவு: ${quantity}`, 20, 60);
    doc.text(`விலை: ₹${price}`, 20, 70);
    doc.text(`மொத்தம்: ₹${(quantity * price).toFixed(2)}`, 20, 80);

    // Save the PDF
    doc.save('invoice.pdf');
}
