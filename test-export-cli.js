#!/usr/bin/env node

/**
 * Command-line test script for PDF and Word exports
 * This script tests the export functionality in a Node.js environment
 */

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Create a minimal DOM environment for testing
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

console.log('='.repeat(80));
console.log('Testing Export Functionality - Command Line Test');
console.log('='.repeat(80));
console.log();

// Test 1: Check if CDN libraries would be available
console.log('TEST 1: Checking CDN library availability simulation');
console.log('-'.repeat(80));

// Simulate CDN libraries not being loaded
const cdnLibsAvailable = {
  jspdf: false,
  html2canvas: false,
  docx: false,
  saveAs: false
};

console.log('In a browser environment, these libraries are loaded from CDN:');
console.log(`  - jsPDF:      ${cdnLibsAvailable.jspdf ? '✓' : '✗'} Available`);
console.log(`  - html2canvas: ${cdnLibsAvailable.html2canvas ? '✓' : '✗'} Available`);
console.log(`  - docx:       ${cdnLibsAvailable.docx ? '✓' : '✗'} Available`);
console.log(`  - FileSaver:  ${cdnLibsAvailable.saveAs ? '✓' : '✗'} Available`);
console.log();

// Test 2: Check the actual CDN URLs from index.html
console.log('TEST 2: Checking CDN URLs from public/index.html');
console.log('-'.repeat(80));

const indexPath = path.join(__dirname, 'public', 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

// Extract CDN script URLs
const scriptRegex = /<script[^>]+src="([^"]+)"[^>]*>/g;
const cdnUrls = [];
let match;

while ((match = scriptRegex.exec(indexContent)) !== null) {
  cdnUrls.push(match[1]);
}

console.log('Found CDN URLs in public/index.html:');
cdnUrls.forEach((url, index) => {
  console.log(`  ${index + 1}. ${url}`);
});
console.log();

// Test 3: Validate CDN URLs
console.log('TEST 3: Validating CDN URLs (checking format and structure)');
console.log('-'.repeat(80));

const urlValidation = cdnUrls.map(url => {
  const hasHttps = url.startsWith('https://');
  const hasSRI = indexContent.includes(`integrity=`) && indexContent.includes(url);
  const hasCrossOrigin = indexContent.includes(`crossorigin=`) && indexContent.includes(url);
  
  return {
    url,
    hasHttps,
    hasSRI,
    hasCrossOrigin
  };
});

urlValidation.forEach((validation, index) => {
  console.log(`URL ${index + 1}:`);
  console.log(`  - HTTPS: ${validation.hasHttps ? '✓' : '✗'}`);
  console.log(`  - SRI Hash: ${validation.hasSRI ? '✓' : '✗'}`);
  console.log(`  - CORS: ${validation.hasCrossOrigin ? '✓' : '✗'}`);
  console.log();
});

// Test 4: Check export module structure
console.log('TEST 4: Checking export module structure');
console.log('-'.repeat(80));

const pdfExportPath = path.join(__dirname, 'src', 'utils', 'pdfExport.js');
const wordExportPath = path.join(__dirname, 'src', 'utils', 'wordExport.js');

console.log('Checking pdfExport.js:');
const pdfContent = fs.readFileSync(pdfExportPath, 'utf8');
const pdfChecks = {
  hasWindowJspdfCheck: pdfContent.includes('window.jspdf'),
  hasWindowHtml2canvasCheck: pdfContent.includes('window.html2canvas'),
  hasErrorHandling: pdfContent.includes('throw new Error'),
  hasExportFunction: pdfContent.includes('export async function exportToPDF')
};

console.log(`  - Checks for window.jspdf: ${pdfChecks.hasWindowJspdfCheck ? '✓' : '✗'}`);
console.log(`  - Checks for window.html2canvas: ${pdfChecks.hasWindowHtml2canvasCheck ? '✓' : '✗'}`);
console.log(`  - Has error handling: ${pdfChecks.hasErrorHandling ? '✓' : '✗'}`);
console.log(`  - Exports exportToPDF function: ${pdfChecks.hasExportFunction ? '✓' : '✗'}`);
console.log();

console.log('Checking wordExport.js:');
const wordContent = fs.readFileSync(wordExportPath, 'utf8');
const wordChecks = {
  hasWindowDocxCheck: wordContent.includes('window.docx'),
  hasWindowSaveAsCheck: wordContent.includes('window.saveAs'),
  hasErrorHandling: wordContent.includes('throw new Error'),
  hasExportFunction: wordContent.includes('export async function exportToWord')
};

console.log(`  - Checks for window.docx: ${wordChecks.hasWindowDocxCheck ? '✓' : '✗'}`);
console.log(`  - Checks for window.saveAs: ${wordChecks.hasWindowSaveAsCheck ? '✓' : '✗'}`);
console.log(`  - Has error handling: ${wordChecks.hasErrorHandling ? '✓' : '✗'}`);
console.log(`  - Exports exportToWord function: ${wordChecks.hasExportFunction ? '✓' : '✗'}`);
console.log();

// Test 5: Identify potential issues
console.log('TEST 5: Identifying potential issues');
console.log('-'.repeat(80));

const issues = [];

// Check if dist/index.html has the CDN scripts
const distIndexPath = path.join(__dirname, 'dist', 'index.html');
if (fs.existsSync(distIndexPath)) {
  const distContent = fs.readFileSync(distIndexPath, 'utf8');
  
  const hasJspdf = distContent.includes('jspdf');
  const hasHtml2canvas = distContent.includes('html2canvas');
  const hasDocx = distContent.includes('docx');
  const hasFileSaver = distContent.includes('FileSaver');
  
  if (!hasJspdf) {
    issues.push('dist/index.html is missing jsPDF CDN script');
  }
  if (!hasHtml2canvas) {
    issues.push('dist/index.html is missing html2canvas CDN script');
  }
  if (!hasDocx) {
    issues.push('dist/index.html is missing docx CDN script');
  }
  if (!hasFileSaver) {
    issues.push('dist/index.html is missing FileSaver CDN script');
  }
  
  console.log('Checking dist/index.html:');
  console.log(`  - Has jsPDF CDN: ${hasJspdf ? '✓' : '✗'}`);
  console.log(`  - Has html2canvas CDN: ${hasHtml2canvas ? '✓' : '✗'}`);
  console.log(`  - Has docx CDN: ${hasDocx ? '✓' : '✗'}`);
  console.log(`  - Has FileSaver CDN: ${hasFileSaver ? '✓' : '✗'}`);
  console.log();
} else {
  issues.push('dist/index.html does not exist - run npm run build first');
  console.log('  ✗ dist/index.html not found - run npm run build');
  console.log();
}

// Summary
console.log('='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));

if (issues.length === 0) {
  console.log('✓ All checks passed! The CDN libraries are properly configured.');
  console.log();
  console.log('The export functionality should work correctly in a browser environment.');
  console.log('The libraries are loaded from CDN and accessed via window.* globals.');
} else {
  console.log('✗ Found issues:');
  issues.forEach((issue, index) => {
    console.log(`  ${index + 1}. ${issue}`);
  });
  console.log();
  console.log('Recommendations:');
  console.log('  1. Run "npm run build" to generate dist/index.html');
  console.log('  2. Ensure webpack.config.js properly includes CDN scripts');
  console.log('  3. Test in a browser to verify CDN loading');
}

console.log('='.repeat(80));

// Test 6: Create test recommendations
console.log('TEST 6: Testing Recommendations');
console.log('-'.repeat(80));
console.log();
console.log('To test the actual export functionality:');
console.log();
console.log('1. Build the project:');
console.log('   npm run build');
console.log();
console.log('2. Open dist/index.html in a browser');
console.log('   - Or run: npm run dev and open http://localhost:8080');
console.log();
console.log('3. Fill in the form with test data');
console.log();
console.log('4. Click "Export PDF" and "Export Word" buttons');
console.log();
console.log('5. Verify that:');
console.log('   ✓ PDF downloads successfully');
console.log('   ✓ Word document downloads successfully');
console.log('   ✓ Both files contain all form data');
console.log('   ✓ Formatting is correct and consistent');
console.log();
console.log('For automated testing, open test-exports.html in a browser:');
console.log('   file://' + path.join(__dirname, 'test-exports.html'));
console.log();
console.log('Common Issues and Solutions:');
console.log('-'.repeat(80));
console.log();
console.log('Issue: "jsPDF library not loaded from CDN"');
console.log('Solution: Check internet connection and try again. CDN may be blocked.');
console.log();
console.log('Issue: "docx library not loaded from CDN"');
console.log('Solution: Check internet connection. Verify CDN URLs are accessible.');
console.log();
console.log('Issue: Export button does nothing');
console.log('Solution: Check browser console for errors. Ensure all CDN scripts loaded.');
console.log();
console.log('Issue: SRI integrity check fails');
console.log('Solution: CDN file may have changed. Update SRI hash in public/index.html');
console.log('  Generate new SRI hash: https://www.srihash.org/');
console.log();
console.log('='.repeat(80));

// Exit with appropriate code
process.exit(issues.length === 0 ? 0 : 1);
