/**
 * Basic test file for export utilities
 * This file can be used to test the PDF and Word export functionality
 */

import { exportToPDF } from './pdfExport.js';
import { exportToWord } from './wordExport.js';

// Test data that mimics the form structure
const testFormData = {
  // User Role and Basic Data (Step 1)
  userRole: 'einkauf',
  projectTitle: 'Test Leistungsbeschreibung',
  vergabeNr: 'TEST-2024-001',
  serviceType: 'IT-Dienstleistung',
  contractForm: 'Einzelauftrag',
  location: 'TH Köln, Campus Gummersbach',
  currentSituation: 'Die TH Köln benötigt eine neue Softwarelösung für die Verwaltung von Leistungsbeschreibungen.',
  
  // Service Definition (Step 2)
  stlbNumber: 'IT-001',
  serviceDefinition: 'Entwicklung einer webbasierten Anwendung zur automatischen Generierung von Leistungsbeschreibungen mit Vue.js Frontend und entsprechender Export-Funktionalität für PDF und Word-Dokumente.',
  startDate: '2024-01-15',
  endDate: '2024-12-31',
  
  // Bidder Requirements (Step 3)
  bidderRequirements: [
    { description: 'Mindestens 5 Jahre Erfahrung in der Webentwicklung' },
    { description: 'Nachgewiesene Expertise in Vue.js und modernen JavaScript-Frameworks' },
    { description: 'Erfahrung in der Entwicklung von Dokumenten-Export-Funktionen' },
    { description: 'ISO 27001 Zertifizierung oder vergleichbarer Sicherheitsstandard' }
  ],
  
  // Service Requirements (Step 4)
  serviceRequirements: [
    { description: 'Responsive Design für Desktop und mobile Geräte' },
    { description: 'PDF-Export mit professionellem Layout' },
    { description: 'Word-Export im .docx Format' },
    { description: 'Lokaler Storage für Datenpersistierung' },
    { description: 'Mehrsprachigkeit (Deutsch als Hauptsprache)' },
    { description: 'Barrierefreie Benutzeroberfläche nach WCAG 2.1' }
  ],
  
  // Cost Structure (Step 5)
  costRows: [
    {
      description: 'Frontend-Entwicklung (Vue.js)',
      quantity: 40,
      unit: 'Stunden',
      unitPrice: 85.00
    },
    {
      description: 'Backend-Integration',
      quantity: 20,
      unit: 'Stunden',
      unitPrice: 90.00
    },
    {
      description: 'Export-Funktionalität (PDF/Word)',
      quantity: 15,
      unit: 'Stunden',
      unitPrice: 95.00
    },
    {
      description: 'Testing und Dokumentation',
      quantity: 10,
      unit: 'Stunden',
      unitPrice: 75.00
    }
  ],
  
  // Contract Details (Step 6) - for Einkauf users
  contractVolume: 8675.00,
  contractDuration: 1,
  contractTerms: 'Standard-Geschäftsbedingungen der TH Köln',
  paymentTerms: '30 Tage netto nach Rechnungserhalt',
  customPaymentTerms: '',
  warrantyPeriod: '12 Monate',
  customWarranty: 12,
  contactPerson: 'Max Mustermann',
  contactEmail: 'max.mustermann@th-koeln.de',
  contactPhone: '+49 2261 8196-0',
  guidelinesUnderstood: true,
  equalTreatment: true,
  transparency: true,
  
  // Attachments (Step 7)
  attachments: [
    {
      name: 'Lastenheft_v1.0.pdf',
      description: 'Detailliertes Lastenheft mit allen technischen Anforderungen'
    },
    {
      name: 'UI_Mockups.zip',
      description: 'Benutzeroberflächen-Entwürfe und Wireframes'
    },
    {
      name: 'Sicherheitsanforderungen.docx',
      description: 'Spezifische Sicherheitsanforderungen und Compliance-Richtlinien'
    }
  ]
};

/**
 * Test PDF export functionality
 */
export async function testPDFExport() {
  console.log('Testing PDF export...');
  try {
    const result = await exportToPDF(testFormData, 'Test_Leistungsbeschreibung.pdf');
    console.log('PDF Export Result:', result);
    return result;
  } catch (error) {
    console.error('PDF Export Test Failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Test Word export functionality
 */
export async function testWordExport() {
  console.log('Testing Word export...');
  try {
    const result = await exportToWord(testFormData, 'Test_Leistungsbeschreibung.docx');
    console.log('Word Export Result:', result);
    return result;
  } catch (error) {
    console.error('Word Export Test Failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Test both export functions
 */
export async function testAllExports() {
  console.log('Running all export tests...');
  
  const pdfResult = await testPDFExport();
  const wordResult = await testWordExport();
  
  const results = {
    pdf: pdfResult,
    word: wordResult,
    allSuccessful: pdfResult.success && wordResult.success
  };
  
  console.log('All Export Tests Completed:', results);
  return results;
}

/**
 * Test with minimal data
 */
export async function testMinimalExport() {
  const minimalData = {
    projectTitle: 'Minimal Test',
    userRole: 'fachbereich',
    serviceDefinition: 'Eine einfache Testbeschreibung für die Export-Funktionalität.',
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  };
  
  console.log('Testing exports with minimal data...');
  
  const pdfResult = await exportToPDF(minimalData, 'Minimal_Test.pdf');
  const wordResult = await exportToWord(minimalData, 'Minimal_Test.docx');
  
  return {
    pdf: pdfResult,
    word: wordResult,
    allSuccessful: pdfResult.success && wordResult.success
  };
}

// Auto-run tests when this module is imported in development
if (process.env.NODE_ENV === 'development') {
  console.log('Export test utilities loaded. Use testAllExports() to run all tests.');
}

// Export test data for external use
export { testFormData };