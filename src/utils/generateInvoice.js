import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateInvoice = (orderTrack, products, companyInfo = {}) => {
  try {
    const doc = new jsPDF();
    const order = orderTrack[0];
    if (!order) {
      alert("No order data available");
      return;
    }
 

    const formatDate = (str) => {
      if (!str) return "N/A";

      const normalized = str.replace(/\sat\s/, " ");
      const parsed = Date.parse(normalized);
      if (isNaN(parsed)) {
       
        return "Invalid Date";
      }
      return new Date(parsed).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const safeText = (text, x, y, options) => {
      try {
        const txt = String(text || "");
        const xx = typeof x === "number" ? x : 0;
        const yy = typeof y === "number" ? y : 0;
        if (options) doc.text(txt, xx, yy, options);
        else doc.text(txt, xx, yy);
      } catch (e) {
        console.warn("safeText error:", text, x, y, e);
      }
    };

    const checkPageBreak = (currentY, requiredSpace = 20) => {
      const pageH = doc.internal.pageSize.height;
      if (currentY + requiredSpace > pageH - 40) {
        doc.addPage();
        return 20;
      }
      return currentY;
    };

    const company = {
      name: String(companyInfo.name || "KING CART"),
      address: String(
        companyInfo.address || "123 Business Street, City, State 12345"
      ),
      phone: String(companyInfo.phone || "(555) 123-4567"),
      email: String(companyInfo.email || "kingcart.ecom@gmail.com"),
      website: String(companyInfo.website || "www.kingcart.com"),
      logo: companyInfo.logo || null,
    };

    const pageW = doc.internal.pageSize.width;
    const pageH = doc.internal.pageSize.height;
    const margin = 15;

    doc.setFillColor(245, 247, 250);
    doc.rect(0, 0, pageW, 70, "F");

    if (company.logo) {
      try {
        doc.addImage(company.logo, "PNG", margin, 15, 35, 35);
      } catch (e) {
        console.warn("Could not add logo:", e);
      }
    }
    const infoX = company.logo ? margin + 45 : margin;

    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    safeText(company.name, infoX, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    safeText(company.address, infoX, 35);
    safeText(`Phone: ${company.phone} | Email: ${company.email}`, infoX, 42);
    safeText(`Website: ${company.website}`, infoX, 49);

    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(59, 130, 246);
    safeText("INVOICE", pageW - margin, 25, { align: "right" });

    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.rect(pageW - 65, 35, 50, 30, "FD");

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    safeText("Invoice #:", pageW - 60, 42);
    safeText("Order ID:", pageW - 60, 48);
    safeText("Date:", pageW - 60, 54);
    safeText("Status:", pageW - 60, 60);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    safeText(`INV-${order._id?.slice(-8) || "N/A"}`, pageW - 20, 42, {
      align: "right",
    });
    safeText(`${order._id?.slice(-12) || "N/A"}`, pageW - 20, 48, {
      align: "right",
    });
    safeText(formatDate(order.date), pageW - 20, 54, { align: "right" });

    const status = order.cancel
      ? "Cancelled"
      : order.status3
      ? "Delivered"
      : order.status2
      ? "Shipped"
      : "Processing";
    const statusColor = order.cancel
      ? [239, 68, 68]
      : order.status3
      ? [34, 197, 94]
      : order.status2
      ? [59, 130, 246]
      : [251, 146, 60];
    doc.setTextColor(...statusColor);
    safeText(status, pageW - 20, 60, { align: "right" });

    doc.setFillColor(248, 250, 252);
    doc.rect(margin, 85, pageW - 2 * margin, 40, "F");

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    safeText("BILL TO:", margin + 5, 95);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);

    safeText(order.deliveryDetails.name, margin + 5, 105);

    safeText(`Mobile: ${order.deliveryDetails.mobile}`, margin + 5, 112);

    safeText(
      `${order.deliveryDetails.address}, ${order.deliveryDetails.city}, ${order.deliveryDetails.state} - ${order.deliveryDetails.pinncode}`,
      margin + 5,
      119
    );

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    safeText("ORDER TIMELINE:", margin, 145);

    let timelineY = 155;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const timeline = [
      {
        cond: order.status,
        label: "Order Placed",
        date: order.date,
        color: [34, 197, 94],
      },
      {
        cond: order.status2,
        label: "Order Shipped",
        date: order.shipedDate,
        color: [59, 130, 246],
      },
      {
        cond: order.status3,
        label: "Order Delivered",
        date: order.deliveredDate,
        color: [34, 197, 94],
      },
      {
        cond: order.cancel,
        label: "Order Cancelled",
        date: order.canceledTime,
        color: [239, 68, 68],
      },
    ];

    timeline.forEach(({ cond, label, date, color }) => {
      if (cond) {
        doc.setTextColor(...color);
        safeText(cond !== order.cancel ? "✓" : "✗", margin, timelineY);
        doc.setTextColor(51, 65, 85);
        safeText(label, margin + 10, timelineY);
        doc.setTextColor(107, 114, 128);
        safeText(formatDate(date), margin + 60, timelineY);
        timelineY += 12;
      }
    });

    const tableY = Math.max(timelineY + 20, 190);
    const rows = products.map((p, i) => [
      i + 1,
      String(p.product?.Name || "Unknown Product"),
      p.quantity || 1,
      `Rs. ${formatCurrency(p.product?.Price || 0)}`,
      `Rs. ${formatCurrency((p.product?.Price || 0) * (p.quantity || 1))}`,
    ]);

    doc.autoTable({
      head: [["#", "Product Name", "Qty", "Price", "Total"]],
      body: rows,
      startY: tableY,
      theme: "grid",
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        fontSize: 10,
        textColor: [51, 65, 85],
        cellPadding: 5,
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: {
        overflow: "linebreak",
        cellPadding: 6,
        lineColor: [203, 213, 225],
        lineWidth: 0.5,
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 15 },
        1: { halign: "left", cellWidth: 90 },
        2: { halign: "center", cellWidth: 20 },
        3: { halign: "right", cellWidth: 30 },
        4: { halign: "right", cellWidth: 30 },
      },
      margin: { left: margin, right: margin },
    });

    const subtotal = parseFloat(order.subtotal) || calculateSubtotal(products);
    const couponDiscount = parseFloat(order.couponDiscount) || 0;
    const taxRate = parseFloat(order.taxRate) || 0;
    const taxAmount = (subtotal - couponDiscount) * (taxRate / 100);
    const shippingFee = parseFloat(order.shippingFee) || 0;
    const finalTotal = subtotal - couponDiscount + taxAmount + shippingFee;

    const totalsY = doc.lastAutoTable.finalY + 15;
    const totals = [["Subtotal", `Rs. ${formatCurrency(subtotal)}`]];
    if (couponDiscount > 0)
      totals.push([
        "Coupon Discount",
        `- Rs. ${formatCurrency(couponDiscount)}`,
      ]);
    if (taxAmount > 0)
      totals.push([`Tax (${taxRate}%)`, `Rs. ${formatCurrency(taxAmount)}`]);
    if (shippingFee > 0)
      totals.push(["Shipping Fee", `Rs. ${formatCurrency(shippingFee)}`]);
    totals.push(["TOTAL", `Rs. ${formatCurrency(finalTotal)}`]);

    doc.autoTable({
      body: totals,
      startY: totalsY,
      theme: "plain",
      styles: {
        fontSize: 11,
        cellPadding: 5,
        textColor: [51, 65, 85],
        lineColor: [203, 213, 225],
        lineWidth: 0.3,
      },
      columnStyles: {
        0: { halign: "left", cellWidth: pageW - 2 * margin - 55 },
        1: { halign: "right", cellWidth: 55 },
      },
      margin: { left: margin, right: margin },
      didParseCell: (data) => {
        if (data.row.index === totals.length - 1) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fontSize = 14;
          data.cell.styles.textColor = [59, 130, 246];
          data.cell.styles.fillColor = [239, 246, 255];
          data.cell.styles.lineWidth = 1;
        }
        if (
          data.cell.text[0]?.includes("Coupon Discount") ||
          data.cell.text[0]?.includes("- Rs.")
        ) {
          data.cell.styles.textColor = [34, 197, 94];
          data.cell.styles.fontStyle = "bold";
        }
      },
    });

    let termsY = doc.lastAutoTable.finalY + 25;

    termsY = checkPageBreak(termsY, 60);

    doc.setFillColor(249, 250, 251);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.rect(margin, termsY - 5, pageW - 2 * margin, 55, "FD");

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    safeText("Terms & Conditions", margin + 5, termsY + 5);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);

    const terms = [
      "1. All sales are final unless otherwise stated in our return policy.",
      "2. Returns must be initiated within 7 days of delivery with original packaging.",
      "3. Refunds will be processed within 5-7 business days after approval.",
      "4. Damaged items must be reported within 24 hours of delivery.",
      "5. For support, contact us at " +
        company.email +
        " or " +
        company.phone +
        ".",
    ];

    let currentTermY = termsY + 15;
    terms.forEach((term, index) => {
      const lines = doc.splitTextToSize(term, pageW - 2 * margin - 15);
      lines.forEach((line, lineIndex) => {
        safeText(line, margin + 5, currentTermY);
        if (lineIndex < lines.length - 1) currentTermY += 7;
      });
      currentTermY += 8;
    });

    const footerY = pageH - 25;
    doc.setFillColor(59, 130, 246);
    doc.rect(0, footerY - 5, pageW, 30, "F");

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    safeText("Thank you for your business!", margin, footerY + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    safeText(
      "For any queries, please contact our customer support team.",
      margin,
      footerY + 12
    );

    doc.setTextColor(255, 255, 255);
    safeText(
      `Generated: ${formatDate(
        new Date().toString()
      )} ${new Date().toLocaleTimeString()}`,
      pageW - margin,
      footerY + 5,
      { align: "right" }
    );
    safeText(
      `Invoice #: INV-${order._id?.slice(-8) || "N/A"}`,
      pageW - margin,
      footerY + 12,
      { align: "right" }
    );

    const fileName = `Invoice_${order._id?.slice(-8) || "Order"}_${formatDate(
      order.date
    ).replace(/[^a-zA-Z0-9]/g, "-")}.pdf`;
    doc.save(fileName);
    alert("Invoice generated successfully!");
  } catch (error) {
    console.error("Error generating invoice:", error);
    alert("Error generating invoice. Please try again.");
  }
};

const formatCurrency = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return "0";
  return num % 1 === 0
    ? num.toLocaleString("en-IN")
    : num.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
};

const calculateSubtotal = (products) =>
  products.reduce(
    (sum, p) => sum + (p.product?.Price || 0) * (p.quantity || 1),
    0
  );
