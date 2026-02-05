// Use docx and FileSaver from CDN (loaded in index.html)
// DO NOT import from npm packages - this breaks the single-file webpack build
// Access via window.docx and window.saveAs globals

/**
 * Generates Word document from form data using docx library from CDN
 * @param {Object} formData - The form data to export
 * @param {String} filename - Optional filename for the Word document
 */
export async function exportToWord(formData, filename = 'Leistungsbeschreibung.docx') {
  // Check if docx library is available from CDN
  if (!window.docx) {
    throw new Error('docx library not loaded from CDN. The library may have failed to load. Please check your internet connection or try again later.');
  }
  if (!window.saveAs) {
    throw new Error('FileSaver library not loaded from CDN. The library may have failed to load. Please check your internet connection or try again later.');
  }

  // Get docx classes from window.docx
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, UnderlineType } = window.docx;
  const saveAs = window.saveAs;

  try {
    // Create document sections
    const sections = generateDocumentSections(formData, { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, UnderlineType });
    
    // Create Word document
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1417,    // 25mm in twips (25mm / 25.4mm per inch * 1440 twips per inch ≈ 1417 twips)
              right: 1417,
              bottom: 1417,
              left: 1417,
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
 * @param {Object} docxClasses - The docx library classes
 * @returns {Array} Array of document paragraphs and tables
 */
function generateDocumentSections(formData, docxClasses) {
  const { Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, UnderlineType } = docxClasses;
  const sections = [];

  // Title with bottom border effect
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: formData.projectTitle || 'Leistungsbeschreibung',
          bold: true,
          size: 32, // 16pt
          font: 'Arial',
          color: '000000',
        }),
      ],
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 6, // Thicker border to simulate 2px
          color: '0066CC',
        },
      },
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
        spacing: { after: 500 },
      })
    );
  }

  // Basic configuration with background styling
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
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: 'DDDDDD',
          },
          left: {
            style: BorderStyle.SINGLE,
            size: 12, // Thick left border to simulate 4px
            color: '0066CC',
          },
        },
        shading: {
          fill: 'F8F9FA',
        },
      })
    );

    // Create configuration table with improved styling
    const configRows = [];
    
    if (formData.serviceType) {
      configRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ 
                children: [new TextRun({ 
                  text: 'Leistungsart:', 
                  bold: true,
                  size: 20,
                  font: 'Arial'
                })] 
              })],
              width: { size: 50, type: WidthType.PERCENTAGE },
              margins: { top: 100, bottom: 100, left: 200, right: 200 },
            }),
            new TableCell({
              children: [new Paragraph({ 
                children: [new TextRun({ 
                  text: getServiceTypeText(formData.serviceType),
                  size: 20,
                  font: 'Arial'
                })] 
              })],
              width: { size: 50, type: WidthType.PERCENTAGE },
              margins: { top: 100, bottom: 100, left: 200, right: 200 },
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
              children: [new Paragraph({ 
                children: [new TextRun({ 
                  text: 'Vertragsform:', 
                  bold: true,
                  size: 20,
                  font: 'Arial'
                })] 
              })],
              width: { size: 50, type: WidthType.PERCENTAGE },
              margins: { top: 100, bottom: 100, left: 200, right: 200 },
            }),
            new TableCell({
              children: [new Paragraph({ 
                children: [new TextRun({ 
                  text: getContractFormText(formData.contractForm),
                  size: 20,
                  font: 'Arial'
                })] 
              })],
              width: { size: 50, type: WidthType.PERCENTAGE },
              margins: { top: 100, bottom: 100, left: 200, right: 200 },
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
              children: [new Paragraph({ 
                children: [new TextRun({ 
                  text: 'Ort:', 
                  bold: true,
                  size: 20,
                  font: 'Arial'
                })] 
              })],
              width: { size: 50, type: WidthType.PERCENTAGE },
              margins: { top: 100, bottom: 100, left: 200, right: 200 },
            }),
            new TableCell({
              children: [new Paragraph({ 
                children: [new TextRun({ 
                  text: formData.location,
                  size: 20,
                  font: 'Arial'
                })] 
              })],
              width: { size: 50, type: WidthType.PERCENTAGE },
              margins: { top: 100, bottom: 100, left: 200, right: 200 },
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
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
          },
          shading: {
            fill: 'F8F9FA',
          },
          margins: {
            top: 200,
            bottom: 200,
            left: 300,
            right: 300,
          },
        })
      );
    }

    sections.push(new Paragraph({ text: '', spacing: { after: 400 } }));
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
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: 'DDDDDD',
          },
        },
      })
    );

    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: formData.currentSituation,
            size: 20, // 10pt
            font: 'Arial',
            color: '333333',
          }),
        ],
        spacing: { after: 320 },
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
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: 'DDDDDD',
          },
        },
      })
    );

    // Add STLB number if available
    if (formData.stlbNumber) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'STLB-Nummer: ',
              bold: true,
              size: 20,
              font: 'Arial',
              color: '000000',
            }),
            new TextRun({
              text: formData.stlbNumber,
              size: 20,
              font: 'Arial',
              color: '333333',
            }),
          ],
          spacing: { after: 160 },
        })
      );
    }

    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: formData.serviceDefinition,
            size: 20, // 10pt
            font: 'Arial',
            color: '333333',
          }),
        ],
        spacing: { after: 320 },
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
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: 'DDDDDD',
          },
        },
      })
    );

    if (formData.startDate) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: 'Startdatum: ', 
              bold: true, 
              size: 20, 
              font: 'Arial',
              color: '000000'
            }),
            new TextRun({ 
              text: formatDate(formData.startDate), 
              size: 20, 
              font: 'Arial',
              color: '333333'
            }),
          ],
          spacing: { after: 160 },
        })
      );
    }

    if (formData.endDate) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: 'Enddatum: ', 
              bold: true, 
              size: 20, 
              font: 'Arial',
              color: '000000'
            }),
            new TextRun({ 
              text: formatDate(formData.endDate), 
              size: 20, 
              font: 'Arial',
              color: '333333'
            }),
          ],
          spacing: { after: 320 },
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
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: 'DDDDDD',
          },
        },
      })
    );

    formData.bidderRequirements.forEach(requirement => {
      if (requirement.criterion) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: requirement.criterion,
                bold: true,
                size: 20, // 10pt
                font: 'Arial',
                color: '000000',
              }),
            ],
            spacing: { before: 160, after: 120 },
          })
        );
      }
      
      // Add sub-requirements
      if (requirement.requirements && requirement.requirements.length > 0) {
        requirement.requirements.forEach(subReq => {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: '• ', // Blue bullet point
                  color: '0066CC',
                  bold: true,
                  size: 20,
                  font: 'Arial',
                }),
                new TextRun({
                  text: subReq.text || '',
                  size: 20, // 10pt
                  font: 'Arial',
                  color: '333333',
                }),
              ],
              spacing: { after: 120 },
              indent: { left: 300 }, // Indentation for list items
            })
          );
        });
      }
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
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: 'DDDDDD',
          },
        },
      })
    );

    formData.serviceRequirements.forEach(requirement => {
      if (requirement.text) {
        const textRuns = [
          new TextRun({
            text: `• ${requirement.text}`,
            bold: true,
            size: 20, // 10pt
            font: 'Arial',
          })
        ];
        
        if (requirement.criteriaType) {
          const criteriaText = requirement.criteriaType === 'A' ? 'Ausschlusskriterium' : 'Bewertungskriterium';
          let badgeText = criteriaText;
          if (requirement.criteriaType === 'B' && requirement.weight) {
            badgeText += ` (${requirement.weight}%)`;
          }

          textRuns.push(
            new TextRun({
              text: ` - `,
              size: 20,
              font: 'Arial',
              color: '333333',
            })
          );
            
          textRuns.push(
            new TextRun({
              text: badgeText,
              size: 16, // 8pt
              font: 'Arial',
              color: '666666',
              italics: true,
            })
          );
        }

        sections.push(
          new Paragraph({
            children: textRuns,
            spacing: { after: 160 },
            indent: { left: 300, hanging: 200 }, // Better indentation for list items
          })
        );
      }
    });

    sections.push(new Paragraph({ text: '', spacing: { after: 320 } }));
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
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: 'DDDDDD',
          },
        },
      })
    );

    // Create cost table
    const costRows = [
      // Header row
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ 
                text: 'Pos.', 
                bold: true, 
                color: 'FFFFFF',
                size: 18,
                font: 'Arial'
              })] 
            })],
            width: { size: 10, type: WidthType.PERCENTAGE },
            shading: { fill: '0066CC' },
          }),
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ 
                text: 'Beschreibung', 
                bold: true, 
                color: 'FFFFFF',
                size: 18,
                font: 'Arial'
              })] 
            })],
            width: { size: 40, type: WidthType.PERCENTAGE },
            shading: { fill: '0066CC' },
          }),
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ 
                text: 'Menge/Einheit', 
                bold: true, 
                color: 'FFFFFF',
                size: 18,
                font: 'Arial'
              })] 
            })],
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: { fill: '0066CC' },
          }),
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ 
                text: 'Einzelpreis (€)', 
                bold: true, 
                color: 'FFFFFF',
                size: 18,
                font: 'Arial'
              })] 
            })],
            width: { size: 15, type: WidthType.PERCENTAGE },
            shading: { fill: '0066CC' },
          }),
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ 
                text: 'Gesamtpreis (€)', 
                bold: true, 
                color: 'FFFFFF',
                size: 18,
                font: 'Arial'
              })] 
            })],
            width: { size: 15, type: WidthType.PERCENTAGE },
            shading: { fill: '0066CC' },
          }),
        ],
      }),
    ];

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

      costRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ 
                children: [new TextRun({ 
                  text: (index + 1).toString(),
                  size: 18,
                  font: 'Arial'
                })], 
                alignment: AlignmentType.RIGHT 
              })],
            }),
            new TableCell({
              children: [new Paragraph({ 
                children: [new TextRun({ 
                  text: description,
                  size: 18,
                  font: 'Arial'
                })] 
              })],
            }),
            new TableCell({
              children: [new Paragraph({ 
                children: [new TextRun({ 
                  text: String(quantity),
                  size: 18,
                  font: 'Arial'
                })], 
                alignment: AlignmentType.RIGHT 
              })],
            }),
            new TableCell({
              children: [new Paragraph({ 
                children: [new TextRun({ 
                  text: formatCurrency(row.unitPrice || 0),
                  size: 18,
                  font: 'Arial'
                })], 
                alignment: AlignmentType.RIGHT 
              })],
            }),
            new TableCell({
              children: [new Paragraph({ 
                children: [new TextRun({ 
                  text: formatCurrency(total),
                  size: 18,
                  font: 'Arial'
                })], 
                alignment: AlignmentType.RIGHT 
              })],
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
            columnSpan: 3,
            shading: { fill: 'F8F9FA' },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Gesamtsumme', bold: true, color: '000000', size: 20, font: 'Arial' })] })],
            shading: { fill: 'F8F9FA' },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: formatCurrency(totalCost), bold: true, color: '000000', size: 20, font: 'Arial' })], alignment: AlignmentType.RIGHT })],
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

    sections.push(new Paragraph({ text: '', spacing: { after: 320 } }));
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
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: 'DDDDDD',
          },
        },
      })
    );

    formData.attachments.forEach((attachment, index) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: `Anlage ${index + 1}: `, 
              bold: true, 
              size: 20, 
              font: 'Arial',
              color: '000000'
            }),
            new TextRun({ 
              text: attachment.name, 
              size: 20, 
              font: 'Arial',
              color: '333333'
            }),
          ],
          spacing: { after: 80 },
          shading: {
            fill: 'F8F9FA',
          },
          indent: { left: 200 },
          border: {
            left: { style: BorderStyle.SINGLE, size: 1, color: 'E9ECEF' },
            top: { style: BorderStyle.SINGLE, size: 1, color: 'E9ECEF' },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E9ECEF' },
            right: { style: BorderStyle.SINGLE, size: 1, color: 'E9ECEF' },
          },
        })
      );

      if (attachment.description) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ 
                text: attachment.description, 
                size: 18, 
                font: 'Arial', 
                color: '666666',
                italics: true
              }),
            ],
            spacing: { after: 160 },
            indent: { left: 400 },
          })
        );
      }
    });

    sections.push(new Paragraph({ text: '', spacing: { after: 320 } }));
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
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: 'DDDDDD',
        },
      },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: 'DDDDDD',
        },
      },
    })
  );

  if (formData.contractVolume) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ 
            text: 'Vertragsvolumen: ', 
            bold: true, 
            size: 20, 
            font: 'Arial',
            color: '000000'
          }),
          new TextRun({ 
            text: formatCurrency(formData.contractVolume), 
            size: 20, 
            font: 'Arial',
            color: '333333'
          }),
        ],
        spacing: { after: 160 },
      })
    );
  }

  if (formData.contractDuration) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ 
            text: 'Vertragslaufzeit: ', 
            bold: true, 
            size: 20, 
            font: 'Arial',
            color: '000000'
          }),
          new TextRun({ 
            text: `${formData.contractDuration} Jahr(e)`, 
            size: 20, 
            font: 'Arial',
            color: '333333'
          }),
        ],
        spacing: { after: 160 },
      })
    );
  }

  if (formData.paymentTerms) {
    const paymentText = formData.paymentTerms === 'custom' ? formData.customPaymentTerms : formData.paymentTerms;
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ 
            text: 'Zahlungsbedingungen: ', 
            bold: true, 
            size: 20, 
            font: 'Arial',
            color: '000000'
          }),
          new TextRun({ 
            text: paymentText, 
            size: 20, 
            font: 'Arial',
            color: '333333'
          }),
        ],
        spacing: { after: 160 },
      })
    );
  }

  if (formData.warrantyPeriod) {
    const warrantyText = formData.warrantyPeriod === 'custom' ? `${formData.customWarranty} Monate` : formData.warrantyPeriod;
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ 
            text: 'Gewährleistung: ', 
            bold: true, 
            size: 20, 
            font: 'Arial',
            color: '000000'
          }),
          new TextRun({ 
            text: warrantyText, 
            size: 20, 
            font: 'Arial',
            color: '333333'
          }),
        ],
        spacing: { after: 160 },
      })
    );
  }

  if (formData.contactPerson) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ 
            text: 'Ansprechperson: ', 
            bold: true, 
            size: 20, 
            font: 'Arial',
            color: '000000'
          }),
          new TextRun({ 
            text: formData.contactPerson, 
            size: 20, 
            font: 'Arial',
            color: '333333'
          }),
        ],
        spacing: { after: 160 },
      })
    );
  }

  if (formData.contactEmail) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ 
            text: 'E-Mail: ', 
            bold: true, 
            size: 20, 
            font: 'Arial',
            color: '000000'
          }),
          new TextRun({ 
            text: formData.contactEmail, 
            size: 20, 
            font: 'Arial',
            color: '333333'
          }),
        ],
        spacing: { after: 160 },
      })
    );
  }

  if (formData.contactPhone) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ 
            text: 'Telefon: ', 
            bold: true, 
            size: 20, 
            font: 'Arial',
            color: '000000'
          }),
          new TextRun({ 
            text: formData.contactPhone, 
            size: 20, 
            font: 'Arial',
            color: '333333'
          }),
        ],
        spacing: { after: 160 },
      })
    );
  }

  sections.push(new Paragraph({ text: '', spacing: { after: 320 } }));
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
  if (!value && value !== 0) return '0,00';
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function getServiceTypeText(serviceType) {
  const types = {
    'vob': 'Bauleistung (VOB)',
    'vol': 'Liefer-/Dienstleistung (VOL)'
  };
  return types[serviceType] || serviceType;
}

function getContractFormText(contractForm) {
  const forms = {
    'einzelauftrag': 'Einzelauftrag',
    'rahmenvereinbarung': 'Rahmenvereinbarung',
    'kauf': 'Kauf'
  };
  return forms[contractForm] || contractForm;
}