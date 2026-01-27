# Leistungsbeschreibungsgenerator

A Vue.js-based application for generating procurement service specifications (Leistungsbeschreibungen) for TH Köln.

## Overview

This application provides a step-by-step wizard to create comprehensive service specifications for German procurement processes. It supports both construction services (VOB) and supply/service contracts (VOL).

## Important: CDN Dependencies ⚠️

**CRITICAL:** This application is built to produce a **single HTML file** containing all necessary code. To achieve this, external libraries MUST be loaded from CDN sources, NOT from npm packages.

### Why CDN Instead of NPM?

The project uses webpack to create a single, self-contained HTML file with all JavaScript and CSS inlined. However, some libraries (docx, FileSaver, html2pdf.js) are too large or have compatibility issues when bundled directly into the webpack output. 

**DO NOT** convert these CDN dependencies to npm package imports, as this will:
- ❌ Break the single-file build process
- ❌ Cause webpack bundling errors
- ❌ Result in a non-functional application

### CDN Libraries Used

The following libraries are loaded via CDN in `public/index.html`:

1. **FileSaver.js** (v2.0.5) - For saving Word documents
   - CDN: `https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js`
   - Global: `window.saveAs`

2. **docx** (v9.5.1) - For generating Word documents
   - CDN: `https://unpkg.com/docx@9.5.1/build/index.js`
   - Global: `window.docx`

3. **html2pdf.js** (v0.10.2) - For PDF generation
   - CDN: `https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js`
   - Global: `window.html2pdf`

#### Security Considerations

**Note:** The CDN script tags currently do not include Subresource Integrity (SRI) hashes. This is a known limitation. For improved security in production environments, consider:

1. Adding `integrity` and `crossorigin` attributes to the script tags
2. Generating SRI hashes using tools like https://www.srihash.org/
3. Hosting the libraries locally instead of using CDN (though this breaks the single-file HTML goal)
4. Using a trusted CDN with strong security practices

The trade-off here is between the single-file HTML requirement and enhanced security via SRI verification.

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
- ❌ **DON'T**: Add docx, file-saver, or html2pdf.js to package.json dependencies
- ❌ **DON'T**: Import these libraries using ES6 `import` statements
- ❌ **DON'T**: Remove the `externals` configuration from webpack.config.js

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
    └── pdfExport.js               # PDF export (uses CDN html2pdf)
```

## Technologies

- **Vue.js 3** - Frontend framework
- **Webpack 5** - Build tool with custom inline plugin
- **Babel** - JavaScript transpilation
- **docx** (CDN) - Word document generation
- **FileSaver.js** (CDN) - File download functionality
- **html2pdf.js** (CDN) - PDF generation

## License

See LICENSE file for details.
