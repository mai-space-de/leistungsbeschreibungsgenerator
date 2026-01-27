// Use jsPDF and html2canvas from CDN (loaded in index.html)
// DO NOT import from npm packages - this breaks the single-file webpack build
// Access via window.jspdf and window.html2canvas globals

/**
 * Generates PDF from form data using jsPDF and html2canvas from CDN
 * @param {Object} formData - The form data to export
 * @param {String} filename - Optional filename for the PDF
 */
export async function exportToPDF(formData, filename = 'Leistungsbeschreibung.pdf') {
  // Check if jsPDF and html2canvas are available from CDN
  if (!window.jspdf) {
    throw new Error('jsPDF library not loaded from CDN. The library may have failed to load. Please check your internet connection or try again later.');
  }
  if (!window.html2canvas) {
    throw new Error('html2canvas library not loaded from CDN. The library may have failed to load. Please check your internet connection or try again later.');
  }

  const { jsPDF } = window.jspdf;
  const html2canvas = window.html2canvas;

  try {
    // Create HTML content for PDF
    const htmlContent = generateHTMLContent(formData);
    
    // Generate and download PDF
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    element.style.display = 'block';
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.top = '0';
    element.style.width = '794px'; // A4 width in pixels at 96 DPI
    document.body.appendChild(element);

    // Wait for any fonts or styles to load
    await new Promise(resolve => setTimeout(resolve, 100));

    // Convert HTML to canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 794, // A4 width in pixels at 96 DPI (210mm)
      windowHeight: element.scrollHeight
    });
    
    // Calculate PDF dimensions
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    });
    
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margins = 25; // 25mm margins
    
    // Calculate content area
    const contentWidth = pageWidth - (2 * margins);
    const contentHeight = pageHeight - (2 * margins);
    
    // Convert canvas to image data
    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    
    // Calculate image dimensions to fit within content area
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * contentWidth) / canvas.width;
    
    // Calculate how many pages we need
    const totalPages = Math.ceil(imgHeight / contentHeight);
    
    // Add pages to PDF
    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage();
      }
      
      // Calculate the source y position in the image (in mm)
      const sourceY = page * contentHeight;
      
      // Position the image so that the correct portion is visible
      // We use negative y offset to show different parts of the image
      const yPosition = margins - sourceY;
      
      pdf.addImage(imgData, 'JPEG', margins, yPosition, imgWidth, imgHeight);
    }
    
    // Save PDF
    pdf.save(filename);
    
    // Clean up
    document.body.removeChild(element);
    
    return { success: true, message: 'PDF erfolgreich exportiert!' };
  } catch (error) {
    console.error('PDF Export Error:', error);
    return { success: false, message: 'Fehler beim PDF-Export: ' + error.message };
  }
}

/**
 * Generates HTML content for PDF export
 * @param {Object} formData - The form data
 * @returns {String} HTML content
 */
function generateHTMLContent(formData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Leistungsbeschreibung</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 10pt;
          line-height: 1.4;
          margin: 0;
          padding: 0;
          color: #333;
        }
        
        .document-container {
          width: 100%;
          max-width: 210mm;
          margin: 0 auto;
          padding: 0;
        }
        
        .document-title {
          font-size: 16pt;
          margin-bottom: 20pt;
          text-align: center;
          font-weight: bold;
          color: #000;
          border-bottom: 2px solid #0066cc;
          padding-bottom: 10pt;
        }
        
        .vergabe-nummer {
          text-align: center;
          margin-bottom: 20pt;
          font-size: 11pt;
          color: #666;
          font-style: italic;
        }
        
        .grunddaten {
          margin-bottom: 25pt;
          padding: 15pt;
          background-color: #f8f9fa;
          border-left: 4px solid #0066cc;
        }
        
        .config-grid {
          display: table;
          width: 100%;
          margin-top: 8pt;
        }
        
        .config-row {
          display: table-row;
        }
        
        .config-cell {
          display: table-cell;
          padding: 3pt 10pt 3pt 0;
          font-size: 10pt;
          vertical-align: top;
          width: 50%;
        }
        
        .section {
          margin-bottom: 20pt;
          page-break-inside: avoid;
        }
        
        .section h2 {
          font-size: 12pt;
          margin: 16pt 0 8pt 0;
          font-weight: bold;
          color: #0066cc;
          border-bottom: 1px solid #ddd;
          padding-bottom: 4pt;
        }
        
        .section p {
          line-height: 1.6;
          text-align: justify;
          margin-bottom: 8pt;
          font-size: 10pt;
          color: #333;
        }
        
        .date-info {
          margin-bottom: 6pt;
          font-size: 10pt;
        }
        
        .date-info strong {
          color: #000;
        }
        
        .requirements-list {
          margin: 10pt 0;
          padding-left: 0;
          list-style: none;
        }
        
        .requirements-list li {
          margin-bottom: 8pt;
          padding-left: 15pt;
          position: relative;
        }
        
        .requirements-list li:before {
          content: "• ";
          color: #0066cc;
          font-weight: bold;
          position: absolute;
          left: 0;
        }
        
        .cost-table {
          width: 100%;
          border-collapse: collapse;
          margin: 10pt 0;
          font-size: 9pt;
        }
        
        .cost-table th,
        .cost-table td {
          border: 1px solid #ddd;
          padding: 6pt;
          text-align: left;
        }
        
        .cost-table th {
          background-color: #0066cc;
          color: white;
          font-weight: bold;
        }
        
        .cost-table .number {
          text-align: right;
        }
        
        .attachments-list {
          margin: 10pt 0;
        }
        
        .attachment-item {
          padding: 6pt;
          margin: 4pt 0;
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 3pt;
          font-size: 9pt;
        }
        
        .page-break {
          page-break-before: always;
        }
        
        .footer {
          margin-top: 30pt;
          padding-top: 15pt;
          border-top: 1px solid #ddd;
          font-size: 8pt;
          color: #666;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="document-container">
        ${generateDocumentContent(formData)}
      </div>
    </body>
    </html>
  `;
}

/**
 * Generates the main document content
 * @param {Object} formData - The form data
 * @returns {String} Document content HTML
 */
function generateDocumentContent(formData) {
  let content = '';

  // Title and basic info
  content += `
    <h1 class="document-title">
      ${formData.projectTitle || 'Leistungsbeschreibung'}
    </h1>
  `;

  if (formData.vergabeNr) {
    content += `
      <div class="vergabe-nummer">
        Vergabenummer: ${formData.vergabeNr}
      </div>
    `;
  }

  // Basic configuration
  if (formData.serviceType || formData.contractForm || formData.location) {
    content += `
      <section class="grunddaten">
        <h2>Grundkonfiguration</h2>
        <div class="config-grid">
    `;
    
    if (formData.serviceType) {
      content += `
        <div class="config-row">
          <div class="config-cell"><strong>Leistungsart:</strong></div>
          <div class="config-cell">${formData.serviceType}</div>
        </div>
      `;
    }
    
    if (formData.contractForm) {
      content += `
        <div class="config-row">
          <div class="config-cell"><strong>Vertragsform:</strong></div>
          <div class="config-cell">${formData.contractForm}</div>
        </div>
      `;
    }
    
    if (formData.location) {
      content += `
        <div class="config-row">
          <div class="config-cell"><strong>Ort:</strong></div>
          <div class="config-cell">${formData.location}</div>
        </div>
      `;
    }
    
    content += `
        </div>
      </section>
    `;
  }

  // Current situation
  if (formData.currentSituation) {
    content += `
      <section class="section">
        <h2>1. Ist-Zustand</h2>
        <p>${formData.currentSituation}</p>
      </section>
    `;
  }

  // Service definition
  if (formData.serviceDefinition) {
    content += `
      <section class="section">
        <h2>2. Leistungsbeschreibung</h2>
        <p>${formData.serviceDefinition}</p>
      </section>
    `;
  }

  // Service period
  if (formData.startDate || formData.endDate) {
    content += `
      <section class="section">
        <h2>3. Leistungszeitraum</h2>
    `;
    
    if (formData.startDate) {
      content += `
        <div class="date-info">
          <strong>Startdatum:</strong> ${formatDate(formData.startDate)}
        </div>
      `;
    }
    
    if (formData.endDate) {
      content += `
        <div class="date-info">
          <strong>Enddatum:</strong> ${formatDate(formData.endDate)}
        </div>
      `;
    }
    
    content += `</section>`;
  }

  // Bidder requirements
  if (formData.bidderRequirements && formData.bidderRequirements.length > 0) {
    content += `
      <section class="section">
        <h2>4. Anforderungen an den Bieter</h2>
    `;
    
    formData.bidderRequirements.forEach(requirement => {
      if (requirement.criterion) {
        content += `<h3 style="font-size: 10pt; font-weight: bold; color: #333; margin: 12pt 0 6pt 0;">${requirement.criterion}</h3>`;
      }
      if (requirement.requirements && requirement.requirements.length > 0) {
        content += `<ul class="requirements-list">`;
        requirement.requirements.forEach(subReq => {
          if (subReq.text) {
            content += `<li>${subReq.text}</li>`;
          }
        });
        content += `</ul>`;
      }
    });
    
    content += `
      </section>
    `;
  }

  // Service requirements
  if (formData.serviceRequirements && formData.serviceRequirements.length > 0) {
    content += `
      <section class="section">
        <h2>5. Leistungsanforderungen</h2>
        <ul class="requirements-list">
    `;
    
    formData.serviceRequirements.forEach(requirement => {
      if (requirement.text) {
        content += `<li><strong>${requirement.text}</strong>`;
        if (requirement.criteriaType) {
          const criteriaText = requirement.criteriaType === 'A' ? 'Ausschlusskriterium' : 'Bewertungskriterium';
          content += ` <span style="font-size: 8pt; color: #666; font-style: italic;">(${criteriaText}`;
          if (requirement.criteriaType === 'B' && requirement.weight) {
            content += `, ${requirement.weight}%`;
          }
          content += `)</span>`;
        }
        content += `</li>`;
      }
    });
    
    content += `
        </ul>
      </section>
    `;
  }

  // Cost structure
  if (formData.costRows && formData.costRows.length > 0) {
    content += `
      <section class="section">
        <h2>6. Kostenstruktur</h2>
        <table class="cost-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Beschreibung</th>
              <th>Menge/Einheit</th>
              <th>Einzelpreis (€)</th>
              <th>Gesamtpreis (€)</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    let totalCost = 0;
    formData.costRows.forEach((row, index) => {
      // Handle both old format and new format
      const description = row.service || row.description || '';
      const quantity = row.quantity || '';
      
      // Calculate total - extract numeric part from quantity string if needed
      let numericQuantity = 0;
      if (typeof quantity === 'string' && quantity) {
        const match = quantity.match(/^(\d+(?:[.,]\d+)?)/);
        numericQuantity = match ? parseFloat(match[1].replace(',', '.')) : 0;
      } else if (typeof quantity === 'number') {
        numericQuantity = quantity;
      }
      
      const total = numericQuantity * (row.unitPrice || 0);
      totalCost += total;
      
      content += `
        <tr>
          <td class="number">${index + 1}</td>
          <td>${description}</td>
          <td class="number">${String(quantity)}</td>
          <td class="number">${formatCurrency(row.unitPrice || 0)}</td>
          <td class="number">${formatCurrency(total)}</td>
        </tr>
      `;
    });
    
    content += `
            <tr>
              <th colspan="4">Gesamtsumme</th>
              <th class="number">${formatCurrency(totalCost)}</th>
            </tr>
          </tbody>
        </table>
      </section>
    `;
  }

  // Contract details (if user role is 'einkauf')
  if (formData.userRole === 'einkauf') {
    content += generateContractDetails(formData);
  }

  // Attachments
  if (formData.attachments && formData.attachments.length > 0) {
    content += `
      <section class="section">
        <h2>7. Anlagen</h2>
        <div class="attachments-list">
    `;
    
    formData.attachments.forEach((attachment, index) => {
      content += `
        <div class="attachment-item">
          <strong>Anlage ${index + 1}:</strong> ${attachment.name}<br>
          <span style="color: #666;">${attachment.description}</span>
        </div>
      `;
    });
    
    content += `
        </div>
      </section>
    `;
  }

  // Footer
  content += `
    <div class="footer">
      Erstellt am ${formatDate(new Date().toISOString().split('T')[0])} | TH Köln Leistungsbeschreibung Generator
    </div>
  `;

  return content;
}

/**
 * Generates contract details section for procurement users
 * @param {Object} formData - The form data
 * @returns {String} Contract details HTML
 */
function generateContractDetails(formData) {
  let content = `
    <section class="section">
      <h2>Vertragsdetails</h2>
  `;

  if (formData.contractVolume) {
    content += `
      <div class="date-info">
        <strong>Vertragsvolumen:</strong> ${formatCurrency(formData.contractVolume)}
      </div>
    `;
  }

  if (formData.contractDuration) {
    content += `
      <div class="date-info">
        <strong>Vertragslaufzeit:</strong> ${formData.contractDuration} Jahr(e)
      </div>
    `;
  }

  if (formData.paymentTerms) {
    const paymentText = formData.paymentTerms === 'custom' ? formData.customPaymentTerms : formData.paymentTerms;
    content += `
      <div class="date-info">
        <strong>Zahlungsbedingungen:</strong> ${paymentText}
      </div>
    `;
  }

  if (formData.warrantyPeriod) {
    const warrantyText = formData.warrantyPeriod === 'custom' ? `${formData.customWarranty} Monate` : formData.warrantyPeriod;
    content += `
      <div class="date-info">
        <strong>Gewährleistung:</strong> ${warrantyText}
      </div>
    `;
  }

  if (formData.contactPerson) {
    content += `
      <div class="date-info">
        <strong>Ansprechperson:</strong> ${formData.contactPerson}
      </div>
    `;
  }

  if (formData.contactEmail) {
    content += `
      <div class="date-info">
        <strong>E-Mail:</strong> ${formData.contactEmail}
      </div>
    `;
  }

  if (formData.contactPhone) {
    content += `
      <div class="date-info">
        <strong>Telefon:</strong> ${formData.contactPhone}
      </div>
    `;
  }

  content += `</section>`;
  return content;
}

/**
 * Formats date string to German format
 * @param {String} dateString - ISO date string
 * @returns {String} Formatted date
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE');
}

/**
 * Formats currency value
 * @param {Number} value - Currency value
 * @returns {String} Formatted currency
 */
function formatCurrency(value) {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}