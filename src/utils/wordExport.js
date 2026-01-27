// docx and saveAs are loaded globally from CDN

/**
 * Wait for CDN libraries to load with retry mechanism
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} delay - Delay between retries in ms
 */
async function waitForLibraries(maxRetries = 10, delay = 100) {
  for (let i = 0; i < maxRetries; i++) {
    if (window.docx && window.saveAs) {
      console.log('Libraries loaded successfully');
      console.log('docx structure:', Object.keys(window.docx));
      return { docx: window.docx, saveAs: window.saveAs };
    }
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  throw new Error('docx library not loaded. Please check your internet connection.');
}

/**
 * Generates Word document from form data using docx library
 * @param {Object} formData - The form data to export
 * @param {String} filename - Optional filename for the Word document
 */
export async function exportToWord(formData, filename = 'Leistungsbeschreibung.docx') {
  try {
    // Wait for libraries to be available
    const { docx, saveAs } = await waitForLibraries();

    // Check the structure of the docx object and extract classes
    let Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, UnderlineType;
    
    // Different ways the IIFE build might expose classes
    if (docx.Document) {
      // Direct access (newer versions)
      ({ Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, UnderlineType } = docx);
    } else if (docx.default && docx.default.Document) {
      // Through default export
      ({ Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, UnderlineType } = docx.default);
    } else {
      // Manual assignment for older IIFE builds
      Document = docx.Document || window.docx?.Document;
      Packer = docx.Packer || window.docx?.Packer;
      Paragraph = docx.Paragraph || window.docx?.Paragraph;
      TextRun = docx.TextRun || window.docx?.TextRun;
      HeadingLevel = docx.HeadingLevel || window.docx?.HeadingLevel;
      Table = docx.Table || window.docx?.Table;
      TableRow = docx.TableRow || window.docx?.TableRow;
      TableCell = docx.TableCell || window.docx?.TableCell;
      WidthType = docx.WidthType || window.docx?.WidthType;
      BorderStyle = docx.BorderStyle || window.docx?.BorderStyle;
      AlignmentType = docx.AlignmentType || window.docx?.AlignmentType;
      UnderlineType = docx.UnderlineType || window.docx?.UnderlineType;
    }
    
    // Verify that we have the required classes
    if (!Document || !Paragraph || !TextRun) {
      console.error('Missing required docx classes:', { Document, Paragraph, TextRun });
      console.error('Available docx properties:', Object.keys(docx));
      console.error('window.docx properties:', window.docx ? Object.keys(window.docx) : 'window.docx not found');
      throw new Error('Required docx classes not found. Please check the docx library loading.');
    }
    
    console.log('Successfully loaded docx classes');

    // Create document sections
    const sections = generateDocumentSections(formData, { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, UnderlineType });
    
    // Create Word document
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1134,    // 2cm in twips (1 inch = 1440 twips, 2cm ≈ 1134 twips)
              right: 1134,
              bottom: 1134,
              left: 1134,
            },
          },
        },
        children: sections,
      }],
    });

    // Generate and download document
    const buffer = await Packer.toBlob(doc);
    saveAs(buffer, filename);
    
    return { success: true, message: 'Word-Dokument erfolgreich exportiert!' };
  } catch (error) {
    console.error('Word Export Error:', error);
    return { success: false, message: 'Fehler beim Word-Export: ' + error.message };
  }
}

/**
 * Generates document sections for Word export
 * @param {Object} formData - The form data
 * @param {Object} docxClasses - The docx classes
 * @returns {Array} Array of document paragraphs and tables
 */
function generateDocumentSections(formData, docxClasses) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, UnderlineType } = docxClasses;
  const sections = [];

  // Title
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: formData.projectTitle || 'Leistungsbeschreibung',
          bold: true,
          size: 32, // 16pt
          font: 'Arial',
        }),
      ],
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  // Vergabe number
  if (formData.vergabeNr) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Vergabenummer: ${formData.vergabeNr}`,
            italics: true,
            size: 22, // 11pt
            font: 'Arial',
            color: '666666',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );
  }

  // Basic configuration
  if (formData.serviceType || formData.contractForm || formData.location) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Grundkonfiguration',
            bold: true,
            size: 24, // 12pt
            font: 'Arial',
            color: '0066CC',
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 320, after: 160 },
      })
    );

    // Create configuration table
    const configRows = [];
    
    if (formData.serviceType) {
      configRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Leistungsart:', bold: true })] })],
              width: { size: 50, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: formData.serviceType })] })],
              width: { size: 50, type: WidthType.PERCENTAGE },
            }),
          ],
        })
      );
    }

    if (formData.contractForm) {
      configRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Vertragsform:', bold: true })] })],
              width: { size: 50, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: formData.contractForm })] })],
              width: { size: 50, type: WidthType.PERCENTAGE },
            }),
          ],
        })
      );
    }

    if (formData.location) {
      configRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Ort:', bold: true })] })],
              width: { size: 50, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: formData.location })] })],
              width: { size: 50, type: WidthType.PERCENTAGE },
            }),
          ],
        })
      );
    }

    if (configRows.length > 0) {
      sections.push(
        new Table({
          rows: configRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1 },
            left: { style: BorderStyle.SINGLE, size: 1 },
            right: { style: BorderStyle.SINGLE, size: 1 },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
            insideVertical: { style: BorderStyle.SINGLE, size: 1 },
          },
        })
      );
    }

    sections.push(new Paragraph({ text: '', spacing: { after: 240 } }));
  }

  // Current situation
  if (formData.currentSituation) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '1. Ist-Zustand',
            bold: true,
            size: 24, // 12pt
            font: 'Arial',
            color: '0066CC',
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 320, after: 160 },
      })
    );

    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: formData.currentSituation,
            size: 20, // 10pt
            font: 'Arial',
          }),
        ],
        spacing: { after: 240 },
        alignment: AlignmentType.JUSTIFIED,
      })
    );
  }

  // Service definition
  if (formData.serviceDefinition) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '2. Leistungsbeschreibung',
            bold: true,
            size: 24, // 12pt
            font: 'Arial',
            color: '0066CC',
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 320, after: 160 },
      })
    );

    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: formData.serviceDefinition,
            size: 20, // 10pt
            font: 'Arial',
          }),
        ],
        spacing: { after: 240 },
        alignment: AlignmentType.JUSTIFIED,
      })
    );
  }

  // Service period
  if (formData.startDate || formData.endDate) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '3. Leistungszeitraum',
            bold: true,
            size: 24, // 12pt
            font: 'Arial',
            color: '0066CC',
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 320, after: 160 },
      })
    );

    if (formData.startDate) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Startdatum: ', bold: true, size: 20, font: 'Arial' }),
            new TextRun({ text: formatDate(formData.startDate), size: 20, font: 'Arial' }),
          ],
          spacing: { after: 120 },
        })
      );
    }

    if (formData.endDate) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Enddatum: ', bold: true, size: 20, font: 'Arial' }),
            new TextRun({ text: formatDate(formData.endDate), size: 20, font: 'Arial' }),
          ],
          spacing: { after: 240 },
        })
      );
    }
  }

  // Bidder requirements
  if (formData.bidderRequirements && formData.bidderRequirements.length > 0) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '4. Anforderungen an den Bieter',
            bold: true,
            size: 24, // 12pt
            font: 'Arial',
            color: '0066CC',
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 320, after: 160 },
      })
    );

    formData.bidderRequirements.forEach(requirement => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${requirement.description}`,
              size: 20, // 10pt
              font: 'Arial',
            }),
          ],
          spacing: { after: 120 },
        })
      );
    });

    sections.push(new Paragraph({ text: '', spacing: { after: 120 } }));
  }

  // Service requirements
  if (formData.serviceRequirements && formData.serviceRequirements.length > 0) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '5. Leistungsanforderungen',
            bold: true,
            size: 24, // 12pt
            font: 'Arial',
            color: '0066CC',
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 320, after: 160 },
      })
    );

    formData.serviceRequirements.forEach(requirement => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${requirement.description}`,
              size: 20, // 10pt
              font: 'Arial',
            }),
          ],
          spacing: { after: 120 },
        })
      );
    });

    sections.push(new Paragraph({ text: '', spacing: { after: 120 } }));
  }

  // Cost structure
  if (formData.costRows && formData.costRows.length > 0) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '6. Kostenstruktur',
            bold: true,
            size: 24, // 12pt
            font: 'Arial',
            color: '0066CC',
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 320, after: 160 },
      })
    );

    // Create cost table
    const costRows = [
      // Header row
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Pos.', bold: true, color: 'FFFFFF' })] })],
            width: { size: 10, type: WidthType.PERCENTAGE },
            shading: { fill: '0066CC' },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Beschreibung', bold: true, color: 'FFFFFF' })] })],
            width: { size: 40, type: WidthType.PERCENTAGE },
            shading: { fill: '0066CC' },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Menge', bold: true, color: 'FFFFFF' })] })],
            width: { size: 12, type: WidthType.PERCENTAGE },
            shading: { fill: '0066CC' },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Einheit', bold: true, color: 'FFFFFF' })] })],
            width: { size: 13, type: WidthType.PERCENTAGE },
            shading: { fill: '0066CC' },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Einzelpreis (€)', bold: true, color: 'FFFFFF' })] })],
            width: { size: 12, type: WidthType.PERCENTAGE },
            shading: { fill: '0066CC' },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Gesamtpreis (€)', bold: true, color: 'FFFFFF' })] })],
            width: { size: 13, type: WidthType.PERCENTAGE },
            shading: { fill: '0066CC' },
          }),
        ],
      }),
    ];

    let totalCost = 0;
    formData.costRows.forEach((row, index) => {
      const total = row.quantity * row.unitPrice;
      totalCost += total;

      costRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: (index + 1).toString() })], alignment: AlignmentType.RIGHT })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: row.description })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: row.quantity.toString() })], alignment: AlignmentType.RIGHT })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: row.unit })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: formatCurrency(row.unitPrice) })], alignment: AlignmentType.RIGHT })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: formatCurrency(total) })], alignment: AlignmentType.RIGHT })],
            }),
          ],
        })
      );
    });

    // Total row
    costRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: '', bold: true })] })],
            columnSpan: 5,
            shading: { fill: 'F8F9FA' },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Gesamtsumme', bold: true })] })],
            shading: { fill: 'F8F9FA' },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: formatCurrency(totalCost), bold: true })], alignment: AlignmentType.RIGHT })],
            shading: { fill: 'F8F9FA' },
          }),
        ],
      })
    );

    sections.push(
      new Table({
        rows: costRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1 },
          bottom: { style: BorderStyle.SINGLE, size: 1 },
          left: { style: BorderStyle.SINGLE, size: 1 },
          right: { style: BorderStyle.SINGLE, size: 1 },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
          insideVertical: { style: BorderStyle.SINGLE, size: 1 },
        },
      })
    );

    sections.push(new Paragraph({ text: '', spacing: { after: 240 } }));
  }

  // Contract details (if user role is 'einkauf')
  if (formData.userRole === 'einkauf') {
    const contractSections = generateContractDetails(formData, docxClasses);
    sections.push(...contractSections);
  }

  // Attachments
  if (formData.attachments && formData.attachments.length > 0) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '7. Anlagen',
            bold: true,
            size: 24, // 12pt
            font: 'Arial',
            color: '0066CC',
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 320, after: 160 },
      })
    );

    formData.attachments.forEach((attachment, index) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Anlage ${index + 1}: `, bold: true, size: 20, font: 'Arial' }),
            new TextRun({ text: attachment.name, size: 20, font: 'Arial' }),
          ],
          spacing: { after: 60 },
        })
      );

      if (attachment.description) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: attachment.description, size: 18, font: 'Arial', color: '666666' }),
            ],
            spacing: { after: 120 },
          })
        );
      }
    });

    sections.push(new Paragraph({ text: '', spacing: { after: 240 } }));
  }

  // Footer
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Erstellt am ${formatDate(new Date().toISOString().split('T')[0])} | TH Köln Leistungsbeschreibung Generator`,
          size: 16, // 8pt
          font: 'Arial',
          color: '666666',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 480 },
      border: {
        top: { style: BorderStyle.SINGLE, size: 1 },
      },
    })
  );

  return sections;
}

/**
 * Generates contract details sections for procurement users
 * @param {Object} formData - The form data
 * @returns {Array} Array of contract detail paragraphs
 */
function generateContractDetails(formData, docxClasses) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, UnderlineType } = docxClasses;
  const sections = [];

  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Vertragsdetails',
          bold: true,
          size: 24, // 12pt
          font: 'Arial',
          color: '0066CC',
        }),
      ],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 320, after: 160 },
    })
  );

  if (formData.contractVolume) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Vertragsvolumen: ', bold: true, size: 20, font: 'Arial' }),
          new TextRun({ text: formatCurrency(formData.contractVolume), size: 20, font: 'Arial' }),
        ],
        spacing: { after: 120 },
      })
    );
  }

  if (formData.contractDuration) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Vertragslaufzeit: ', bold: true, size: 20, font: 'Arial' }),
          new TextRun({ text: `${formData.contractDuration} Jahr(e)`, size: 20, font: 'Arial' }),
        ],
        spacing: { after: 120 },
      })
    );
  }

  if (formData.paymentTerms) {
    const paymentText = formData.paymentTerms === 'custom' ? formData.customPaymentTerms : formData.paymentTerms;
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Zahlungsbedingungen: ', bold: true, size: 20, font: 'Arial' }),
          new TextRun({ text: paymentText, size: 20, font: 'Arial' }),
        ],
        spacing: { after: 120 },
      })
    );
  }

  if (formData.warrantyPeriod) {
    const warrantyText = formData.warrantyPeriod === 'custom' ? `${formData.customWarranty} Monate` : formData.warrantyPeriod;
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Gewährleistung: ', bold: true, size: 20, font: 'Arial' }),
          new TextRun({ text: warrantyText, size: 20, font: 'Arial' }),
        ],
        spacing: { after: 120 },
      })
    );
  }

  if (formData.contactPerson) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Ansprechperson: ', bold: true, size: 20, font: 'Arial' }),
          new TextRun({ text: formData.contactPerson, size: 20, font: 'Arial' }),
        ],
        spacing: { after: 120 },
      })
    );
  }

  if (formData.contactEmail) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'E-Mail: ', bold: true, size: 20, font: 'Arial' }),
          new TextRun({ text: formData.contactEmail, size: 20, font: 'Arial' }),
        ],
        spacing: { after: 120 },
      })
    );
  }

  if (formData.contactPhone) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Telefon: ', bold: true, size: 20, font: 'Arial' }),
          new TextRun({ text: formData.contactPhone, size: 20, font: 'Arial' }),
        ],
        spacing: { after: 120 },
      })
    );
  }

  sections.push(new Paragraph({ text: '', spacing: { after: 240 } }));
  return sections;
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