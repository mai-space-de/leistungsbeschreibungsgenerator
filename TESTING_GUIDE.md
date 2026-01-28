# Export Testing Guide

This guide explains how to test the PDF and Word export functionality in the Leistungsbeschreibung Generator.

## Quick Start

### 1. Command-Line Test (Fast Check)

Run this first to verify configuration:

```bash
node test-export-cli.js
```

**What it checks:**
- ✓ CDN library URLs are correct
- ✓ SRI hashes are present
- ✓ Export modules have error handling
- ✓ Build output includes CDN scripts

**Expected result:** All checks pass with green checkmarks ✓

---

### 2. Browser Test (Full Validation)

For complete testing with actual exports:

```bash
# Start development server
npm run dev
```

Then open in browser: http://localhost:8080/test-export-browser.html

**Test Steps:**
1. Click "Generate Full Test Data" - Creates sample form data
2. Click "Test PDF Export" - Downloads test PDF
3. Click "Test Word Export" - Downloads test Word document
4. Verify downloaded files open correctly and contain all data

OR click "Run Complete Test Suite" to run all tests automatically.

---

## Understanding the Tests

### CDN Library Status

The test page shows real-time status of all CDN libraries:

- **jsPDF** (✅/❌) - PDF generation library
- **html2canvas** (✅/❌) - HTML to image conversion
- **docx** (✅/❌) - Word document generation
- **FileSaver** (✅/❌) - File download functionality

All must show ✅ for exports to work.

### Test Data

**Full Test Data:**
- Includes all form fields populated
- Tests complete export functionality
- Recommended for comprehensive testing

**Minimal Test Data:**
- Only required fields
- Tests basic export functionality
- Good for quick checks

---

## Troubleshooting

### Issue: CDN Library Shows ❌

**Cause:** Library failed to load from CDN

**Solutions:**
1. Check internet connection
2. Verify CDN is not blocked by firewall/proxy
3. Check browser console for specific errors
4. Try different browser or network

### Issue: "SRI integrity check failed"

**Cause:** CDN file has been modified/updated

**Solution:**
1. Visit https://www.srihash.org/
2. Enter the CDN URL from the error
3. Generate new SRI hash
4. Update `integrity` attribute in `public/index.html`

### Issue: Export downloads but file is corrupted

**Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Browser blocking download | Check download permissions |
| Insufficient form data | Fill all required fields |
| JavaScript error | Check browser console |
| Memory limitation | Try with minimal test data |

### Issue: No download happens at all

**Check:**
1. Browser console for errors
2. Pop-up blocker is not blocking downloads
3. All CDN libraries loaded (check status indicators)
4. Test data was generated before clicking export

---

## Manual Testing in Main Application

You can also test exports in the actual application:

1. Start app: `npm run dev`
2. Navigate to http://localhost:8080
3. Fill in the form with data
4. Click "Export PDF" or "Export Word" in header
5. Verify file downloads and opens correctly

---

## Expected Test Results

### ✅ Successful Export

**PDF Export:**
```
✓ PDF Export Successful!

PDF erfolgreich exportiert!

The PDF should have downloaded to your default downloads folder.
Please open it and verify that all data fields are present and formatted correctly.
```

**Word Export:**
```
✓ Word Export Successful!

Word-Dokument erfolgreich exportiert!

The Word document should have downloaded to your default downloads folder.
Please open it in Microsoft Word or compatible software and verify all data is present.
```

### ❌ Failed Export

Common error messages:

**CDN Library Not Loaded:**
```
jsPDF library not loaded from CDN. The library may have failed to load. 
Please check your internet connection or try again later.
```

**Solution:** Refresh page and check internet connection

**JavaScript Error:**
```
PDF Export Error: Cannot read properties of undefined...
```

**Solution:** Check browser console for detailed error, ensure test data generated

---

## Automated Testing in CI/CD

You can run the command-line test in automated pipelines:

```bash
# In your CI/CD script
npm install
npm run build
node test-export-cli.js

# Exit code 0 = success, non-zero = failure
```

---

## Security Validation

The test scripts also verify security features:

✅ All CDN scripts use HTTPS
✅ All scripts have SRI integrity hashes
✅ All scripts have CORS headers
✅ No external scripts without verification

---

## Development Workflow

When modifying export functionality:

1. **Before changes:** Run tests to establish baseline
   ```bash
   node test-export-cli.js
   ```

2. **Make changes** to `src/utils/pdfExport.js` or `wordExport.js`

3. **After changes:** Run tests again
   ```bash
   npm run build
   node test-export-cli.js
   ```

4. **Browser test:** Verify actual exports work
   - Open test page
   - Run complete test suite
   - Manually verify downloaded files

5. **Production test:** Test with built version
   ```bash
   npm run build
   # Open dist/index.html in browser
   # Test exports manually
   ```

---

## File Locations

| File | Purpose | How to Run |
|------|---------|------------|
| `test-export-cli.js` | Command-line validation | `node test-export-cli.js` |
| `public/test-export-browser.html` | Browser test suite | http://localhost:8080/test-export-browser.html |
| `test-exports.html` | Original manual test page | http://localhost:8080/test-exports.html |
| `src/utils/exportTests.js` | Test data generation | Imported by test pages |
| `src/utils/exportTest.js` | Legacy test utilities | (deprecated) |

---

## Best Practices

1. **Always test after upgrading CDN libraries**
   - Update version in `public/index.html`
   - Generate new SRI hash
   - Run command-line test
   - Run browser test suite

2. **Test with different data sets**
   - Minimal data (required fields only)
   - Full data (all fields populated)
   - Edge cases (very long text, special characters)

3. **Test in multiple browsers**
   - Chrome/Edge (recommended)
   - Firefox
   - Safari
   - Mobile browsers

4. **Verify downloaded files**
   - Open in appropriate application (PDF reader, Word)
   - Check all data is present
   - Verify formatting is correct
   - Test on different operating systems

---

## Getting Help

If exports fail after following this guide:

1. Check browser console for detailed errors
2. Review CDN library status in test page
3. Verify network connectivity
4. Try with minimal test data first
5. Test in different browser
6. Check GitHub issues for similar problems

---

## Contributing Test Improvements

To improve the test suite:

1. Add new test cases to `src/utils/exportTests.js`
2. Update `test-export-browser.html` with new tests
3. Update this guide with new scenarios
4. Run all tests to verify improvements work
5. Submit pull request with test improvements

---

**Last Updated:** 2026-01-28
**Version:** 1.0
