# Leistungsbeschreibungsgenerator

A Vue.js-based application for generating procurement service specifications (Leistungsbeschreibungen) for TH Köln.

## Overview

This application provides a step-by-step wizard to create comprehensive service specifications for German procurement processes. It supports both construction services (VOB) and supply/service contracts (VOL).

## Important: CDN Dependencies ⚠️

**CRITICAL:** This application is built to produce a **single HTML file** containing all necessary code. To achieve this, external libraries MUST be loaded from CDN sources, NOT from npm packages.

### Why CDN Instead of NPM?

The project uses webpack to create a single, self-contained HTML file with all JavaScript and CSS inlined. However, some libraries (docx, FileSaver, jsPDF, html2canvas) are too large or have compatibility issues when bundled directly into the webpack output. 

**DO NOT** convert these CDN dependencies to npm package imports, as this will:
- ❌ Break the single-file build process
- ❌ Cause webpack bundling errors
- ❌ Result in a non-functional application

### CDN Libraries Used

The following libraries are loaded via a custom CDN in `public/index.html`:

1. **FileSaver.js** (v2.0.5) - For saving Word documents
   - CDN: `https://www.code-navigator.dev/libs/filesaver.js/2.0.5/FileSaver.min.js`
   - Global: `window.saveAs`
   - SRI Hash: `sha384-PlRSzpewlarQuj5alIadXwjNUX+2eNMKwr0f07ShWYLy8B6TjEbm7ZlcN/ScSbwy`

2. **docx** (v9.5.1) - For generating Word documents
   - CDN: `https://www.code-navigator.dev/libs/docx/9.5.1/docx.min.js`
   - Global: `window.docx`
   - SRI Hash: `sha384-HWC8sFPgg/WYrr43jIR6e0YIKgPkS3VLdteGgh9MFlUet3xdAVEM8YS69xP4Puse`

3. **jsPDF** (v2.5.2) - For PDF generation
   - CDN: `https://www.code-navigator.dev/libs/jspdf/2.5.2/jspdf.min.js`
   - Global: `window.jspdf`
   - SRI Hash: `sha384-en/ztfPSRkGfME4KIm05joYXynqzUgbsG5nMrj/xEFAHXkeZfO3yMK8QQ+mP7p1/`

4. **html2canvas** (v1.4.1) - For rendering HTML to canvas for PDF generation
   - CDN: `https://www.code-navigator.dev/libs/html2canvas/1.4.1/html2canvas.min.js`
   - Global: `window.html2canvas`
   - SRI Hash: `sha384-ZZ1pncU3bQe8y31yfZdMFdSpttDoPmOZg2wguVK9almUodir1PghgT0eY7Mrty8H`

#### Security Considerations

✅ **Security Implemented:** All CDN script tags include Subresource Integrity (SRI) hashes and CORS attributes for enhanced security:

- All libraries include `integrity` attribute with SHA-384 hash
- All scripts include `crossorigin="anonymous"` attribute
- SRI hashes ensure that scripts cannot be tampered with during transit
- If CDN files with SRI hashes are modified, the browser will refuse to execute them
- Our custom CDN provides consistent SRI hashes for all dependencies
- **CORS Support:** The CDN server MUST allow CORS for the SRI check to work. See `cdn/README.md` for server configuration instructions.

To update SRI hashes when upgrading library versions:
1. Generate new SRI hashes (found in `cdn/manifest.json` after generating the CDN folder)
2. Update the `integrity` attribute in `public/index.html`
3. Rebuild with `npm run build`

### How It Works

1. CDN libraries are loaded via `<script>` tags in `public/index.html`
2. Webpack is configured to exclude these libraries from bundling via `externals` configuration
3. Export utilities (`src/utils/wordExport.js`, `src/utils/pdfExport.js`) access libraries via global `window` objects
4. During production build, webpack inlines all application code into a single HTML file

### Making Changes

If you need to update export functionality:

- ✅ **DO**: Keep using CDN libraries accessed via `window` globals
- ✅ **DO**: Update CDN versions in `public/index.html` if needed
- ✅ **DO**: Update webpack `externals` configuration if adding new CDN libraries
- ❌ **DON'T**: Add docx, file-saver, jspdf, or html2canvas to package.json dependencies
- ❌ **DON'T**: Import these libraries using ES6 `import` statements (they must be accessed via `window.*`)
- ❌ **DON'T**: Modify the CDN script tags or remove SRI integrity hashes

## Testing Export Functionality

The project includes comprehensive testing tools for PDF and Word export functionality:

### Command-Line Test Script

Run automated checks to verify CDN configuration and export module structure:

```bash
node test-export-cli.js
```

This script validates:
- CDN library URLs and SRI hashes
- Export module error handling
- File structure and configuration
- Build output (dist/index.html)

### Browser-Based Test Suite

For interactive testing of actual export functionality:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the test page:
   ```
   http://localhost:8080/test-export-browser.html
   ```

Or build the project and open `test-export-browser.html` directly in a browser.

The browser test suite provides:
- **CDN Library Status** - Real-time verification that all libraries loaded
- **Test Data Generation** - Creates comprehensive test data automatically
- **PDF Export Testing** - Downloads and verifies PDF generation
- **Word Export Testing** - Downloads and verifies Word document generation
- **Complete Test Suite** - Runs all tests sequentially with detailed results

### Manual Testing

You can also test exports manually in the main application:

1. Run `npm run dev` or `npm run build`
2. Open the application in a browser
3. Fill in the form with test data
4. Click "Export PDF" or "Export Word" buttons
5. Verify downloaded files contain all data

### Troubleshooting Export Issues

**Issue: "jsPDF library not loaded from CDN"**
- Check internet connection
- Verify CDN is accessible (not blocked by firewall/proxy)
- Check browser console for CORS or SRI errors

**Issue: "docx library not loaded from CDN"**
- Same as above - check network and CDN accessibility

**Issue: SRI integrity check fails**
- CDN file may have been updated
- Regenerate SRI hash: https://www.srihash.org/
- Update `integrity` attribute in `public/index.html`

**Issue: Export downloads but file is empty/corrupted**
- Check browser console for JavaScript errors
- Ensure all form fields are properly filled
- Try with minimal test data first

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

This will start a development server at http://localhost:8080

## Production Build

```bash
npm run build
```

This creates a single, self-contained HTML file in the `dist/` directory:
- `dist/index.html` - The complete application (HTML + CSS + JavaScript inline)
- `dist/app.js.LICENSE.txt` - License information

The generated `index.html` file can be deployed as-is, with no additional files or dependencies required (except internet access for CDN resources).

## Features

- 6-step wizard for creating service specifications
- Support for VOB (construction) and VOL (supply/service) contracts
- Live document preview
- Export to PDF and Word formats
- Validation and inline error messages
- Responsive design

## Project Structure

```
src/
├── App.vue                          # Main application component
├── main.js                          # Application entry point
├── components/
│   ├── HeaderBar.vue               # Application header with export buttons
│   ├── StepNavigation.vue          # Step navigation with validation
│   ├── DocumentPreview.vue         # Live document preview
│   └── steps/                      # Individual form steps
│       ├── UserRoleStep.vue        # Step 1: User role and basic data
│       ├── ServiceDefinitionStep.vue  # Step 2: Service definition
│       ├── BidderRequirementsStep.vue # Step 3: Bidder requirements
│       ├── ServiceRequirementsStep.vue # Step 4: Service requirements
│       ├── CostStructureStep.vue   # Step 5: Cost structure
│       └── ContractDetailsStep.vue # Step 6: Contract details (Einkauf only)
└── utils/
    ├── wordExport.js              # Word document export (uses CDN docx)
    └── pdfExport.js               # PDF export (uses CDN jsPDF and html2canvas)
```

## Technologies

- **Vue.js 3** - Frontend framework
- **Webpack 5** - Build tool with custom inline plugin
- **Babel** - JavaScript transpilation
- **docx** (CDN) - Word document generation
- **FileSaver.js** (CDN) - File download functionality
- **jsPDF** (CDN) - PDF generation
- **html2canvas** (CDN) - HTML to canvas rendering for PDF

## License

See LICENSE file for details.
