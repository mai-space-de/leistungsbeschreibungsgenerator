# Export-Funktionalität - Dokumentation

## Überblick

Die Leistungsbeschreibung Generator App verfügt über integrierte Export-Funktionen für PDF und Word-Dokumente. Diese Funktionalität nutzt moderne JavaScript-Bibliotheken, um professionelle Dokumente direkt im Browser zu erstellen.

## Verwendete Bibliotheken

- **PDF-Export**: `jsPDF` v2.5.2 and `html2canvas` v1.4.1
- **Word-Export**: `docx` v9.5.1
- **Datei-Download**: `file-saver` v2.0.5

## Funktionen

### PDF-Export

**Datei**: `src/utils/pdfExport.js`

Der PDF-Export konvertiert die Formulardaten in ein professionell formatiertes HTML-Dokument und erstellt daraus eine PDF-Datei.

**Features:**
- A4-Format mit korrekten Seitenrändern (25mm)
- Professionelles Layout mit TH Köln Branding
- Automatische Seitenumbrüche
- Strukturierte Abschnitte mit Nummerierung
- Tabellen für Kostenstrukturen
- Responsive Formatierung

**Verwendung:**
```javascript
import { exportToPDF } from './utils/pdfExport.js';

const result = await exportToPDF(formData, 'Leistungsbeschreibung.pdf');
if (result.success) {
  console.log('PDF erfolgreich erstellt');
} else {
  console.error('Fehler:', result.message);
}
```

### Word-Export

**Datei**: `src/utils/wordExport.js`

Der Word-Export erstellt ein natives .docx-Dokument mit strukturiertem Inhalt und professioneller Formatierung.

**Features:**
- Native .docx-Formatierung
- Strukturierte Überschriften und Absätze
- Tabellen mit Border-Styling
- Konsistente Schriftarten (Arial)
- Automatische Nummerierung der Abschnitte
- Professionelles Layout

**Verwendung:**
```javascript
import { exportToWord } from './utils/wordExport.js';

const result = await exportToWord(formData, 'Leistungsbeschreibung.docx');
if (result.success) {
  console.log('Word-Dokument erfolgreich erstellt');
} else {
  console.error('Fehler:', result.message);
}
```

## Integration in HeaderBar.vue

Die Export-Funktionen werden über Buttons in der HeaderBar-Komponente ausgelöst:

```vue
<button @click="$emit('export-pdf')" class="btn btn-success">
  Export PDF
</button>
<button @click="$emit('export-word')" class="btn btn-success">
  Export Word
</button>
```

## Integration in App.vue

Die Haupt-App-Komponente behandelt die Export-Events:

```javascript
async exportPDF() {
  try {
    const filename = this.generateFilename('pdf');
    const result = await exportToPDF(this.formData, filename);
    
    if (result.success) {
      this.showSuccess('PDF erfolgreich exportiert!');
    } else {
      this.showError(result.message);
    }
  } catch (error) {
    this.showError('Fehler beim PDF-Export: ' + error.message);
  }
}

async exportWord() {
  try {
    const filename = this.generateFilename('docx');
    const result = await exportToWord(this.formData, filename);
    
    if (result.success) {
      this.showSuccess('Word-Dokument erfolgreich exportiert!');
    } else {
      this.showError(result.message);
    }
  } catch (error) {
    this.showError('Fehler beim Word-Export: ' + error.message);
  }
}
```

## Automatische Dateinamen-Generierung

Das System generiert automatisch beschreibende Dateinamen basierend auf:
- Projekttitel (bereinigt von Sonderzeichen)
- Vergabenummer (falls vorhanden)
- Aktuelles Datum (YYYYMMDD Format)

**Beispiel**: `IT_Projekt_Softwareentwicklung_PROJ-2024-001_20241215.pdf`

## Dokumentenstruktur

Beide Export-Formate folgen einer konsistenten Struktur:

1. **Dokumententitel** - Projekttitel aus formData.projectTitle
2. **Vergabenummer** - Falls vorhanden
3. **Grundkonfiguration** - Leistungsart, Vertragsform, Ort
4. **Ist-Zustand** - Aktuelle Situation
5. **Leistungsbeschreibung** - Detaillierte Beschreibung der Leistung
6. **Leistungszeitraum** - Start- und Enddatum
7. **Anforderungen an den Bieter** - Liste der Bieter-Anforderungen
8. **Leistungsanforderungen** - Liste der Service-Anforderungen
9. **Kostenstruktur** - Tabelle mit Positionen und Preisen
10. **Vertragsdetails** - (nur für Einkauf-Benutzer)
11. **Anlagen** - Liste der Anhänge
12. **Fußzeile** - Erstellungsdatum und Generator-Info

## Benutzerrollenbasierte Inhalte

Das System berücksichtigt die Benutzerrolle bei der Dokumentenerstellung:

- **Fachbereich**: Grundlegende Leistungsbeschreibung ohne Vertragsdetails
- **Einkauf**: Vollständige Dokumentation inklusive Vertragsdetails, Kontaktinformationen und rechtlichen Bestätigungen

## Fehlerbehandlung

Beide Export-Funktionen implementieren umfassende Fehlerbehandlung:

```javascript
{
  success: boolean,    // Erfolg oder Fehler
  message: string      // Beschreibende Nachricht
}
```

**Häufige Fehlerquellen:**
- Browser-Kompatibilitätsprobleme
- Speicher-Limitierungen bei großen Dokumenten
- Fehlende oder korrupte Formulardaten

## Browser-Kompatibilität

**PDF-Export (jsPDF + html2canvas):**
- Chrome: ✅ Vollständig unterstützt
- Firefox: ✅ Vollständig unterstützt
- Safari: ✅ Unterstützt (iOS 12+)
- Edge: ✅ Vollständig unterstützt

**Word-Export (docx):**
- Alle modernen Browser ✅
- Benötigt File API und Blob-Unterstützung
- IE11: ⚠️ Eingeschränkt (mit Polyfills)

## Performance-Überlegungen

**PDF-Export:**
- Rendering kann bei komplexen Layouts länger dauern
- Speicherverbrauch proportional zur Dokumentgröße
- Empfohlene maximale Seitenzahl: 50

**Word-Export:**
- Sehr effizient auch bei großen Dokumenten
- Geringerer Speicherverbrauch als PDF
- Keine praktischen Größenlimits

## Anpassungen und Erweiterungen

### Layout-Anpassungen

**PDF-Styling anpassen:**
```javascript
// In pdfExport.js, generateHTMLContent()
const options = {
  margin: [25, 25, 25, 25], // Seitenränder in mm
  format: 'a4',
  orientation: 'portrait'
};
```

**Word-Styling anpassen:**
```javascript
// In wordExport.js, neue TextRun-Eigenschaften
new TextRun({
  text: 'Text',
  size: 24,        // Schriftgröße in halben Punkten
  font: 'Arial',   // Schriftart
  color: '0066CC', // Farbe in Hex
  bold: true       // Fettschrift
})
```

### Neue Abschnitte hinzufügen

1. Erweitern Sie die `formData`-Struktur in App.vue
2. Fügen Sie den entsprechenden HTML/Word-Content in den jeweiligen Generierungsfunktionen hinzu
3. Aktualisieren Sie die Dokumentenvorschau (DocumentPreview.vue)

### Custom-Formatierung

Beide Export-Utilities unterstützen die Erweiterung um benutzerdefinierte Formatierungsoptionen:

```javascript
// Beispiel für benutzerdefinierten Header
function generateCustomHeader(formData) {
  // Custom Header Logic
}
```

## Testing

Die Datei `src/utils/exportTest.js` enthält umfassende Testfunktionen:

```javascript
import { testAllExports, testMinimalExport } from './utils/exportTest.js';

// Vollständiger Test
const results = await testAllExports();

// Minimaler Test
const minimalResults = await testMinimalExport();
```

## Troubleshooting

### PDF-Export funktioniert nicht
1. Überprüfen Sie die Browser-Konsole auf JavaScript-Fehler
2. Stellen Sie sicher, dass jsPDF und html2canvas korrekt geladen wurden
3. Prüfen Sie, ob Pop-up-Blocker den Download verhindern

### Word-Export funktioniert nicht
1. Überprüfen Sie die docx-Bibliothek Installation
2. Stellen Sie sicher, dass file-saver korrekt geladen wurde
3. Prüfen Sie Browser-Unterstützung für Blob-Downloads

### Formatierungsprobleme
1. Überprüfen Sie die CSS-Stile in generateHTMLContent()
2. Testen Sie mit vereinfachten Daten
3. Validieren Sie die formData-Struktur

### Performance-Probleme
1. Reduzieren Sie die Anzahl der Export-Elemente
2. Optimieren Sie Bilder und komplexe Layouts
3. Implementieren Sie progressiven Export für große Dokumente

## Fazit

Die implementierte Export-Funktionalität bietet eine robuste, benutzerfreundliche Lösung für die Dokumentenerstellung. Durch die modulare Architektur können leicht Anpassungen vorgenommen und neue Features hinzugefügt werden.