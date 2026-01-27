<template>
  <div class="card">
    <div class="card-header">
      5. Kosten und Preise
      <span class="tooltip-wrapper">
        <span class="tooltip-icon">?</span>
        <span class="tooltip-text">Die hier zu erstellende Tabelle soll die Vergleichbarkeit von Angeboten ermöglichen. Fügen Sie die relevanten Kosten- und Preiskriterien hinzu.</span>
      </span>
    </div>
    <div class="card-content">
      <div class="cost-section">
        <div class="section-description">
          <p>Erstellen Sie eine Tabelle zur strukturierten Erfassung von Kosten und Preisen. Dies ermöglicht eine bessere Vergleichbarkeit der eingehenden Angebote.</p>
        </div>

        <!-- Table Row Count Input -->
        <div class="form-group">
          <label for="row-count">Anzahl der Tabellenzeilen:</label>
          <input 
            type="number" 
            id="row-count" 
            min="1"
            max="50"
            :value="rowCount"
            @input="updateRowCount(parseInt($event.target.value) || 1)"
            placeholder="10"
            class="row-count-input"
          />
        </div>

        <!-- Cost Table -->
        <div class="table-container">
          <table class="cost-table">
            <thead>
              <tr>
                <th class="pos-col">#</th>
                <th class="service-col">Leistung</th>
                <th class="quantity-col">Menge</th>
                <th class="unit-price-col">Einzelpreis in Euro ohne MwSt.</th>
                <th class="total-price-col">Gesamtpreis in Euro ohne MwSt.</th>
                <th class="action-col"></th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(row, index) in costRows" 
                :key="row.id"
                class="cost-row"
              >
                <td class="pos-cell">{{ index + 1 }}</td>
                <td class="service-cell">
                  <textarea
                    :value="row.service"
                    @input="updateCostRow(index, 'service', $event.target.value)"
                    placeholder="Beschreibung der Leistung"
                    rows="2"
                    class="service-input"
                  ></textarea>
                </td>
                <td class="quantity-cell">
                  <input
                    type="text"
                    :value="row.quantity"
                    @input="updateCostRow(index, 'quantity', $event.target.value)"
                    placeholder="z.B. 10 Stk"
                    class="quantity-input"
                  />
                </td>
                <td class="unit-price-cell">
                  <div class="price-input-container">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      :value="row.unitPrice"
                      @input="updateCostRow(index, 'unitPrice', parseFloat($event.target.value) || 0)"
                      placeholder="0.00"
                      class="price-input"
                    />
                    <span class="currency">€</span>
                  </div>
                </td>
                <td class="total-price-cell">
                  <div class="price-display">
                    {{ formatPrice(calculateTotal(row)) }}
                  </div>
                </td>
                <td class="action-cell">
                  <button 
                    @click="removeCostRow(index)"
                    class="remove-row-btn"
                    type="button"
                    title="Zeile entfernen"
                    v-if="costRows.length > 1"
                  >
                    ×
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot v-if="costRows.length > 0">
              <tr class="total-row">
                <td colspan="4" class="total-label">
                  <strong>Gesamtsumme (netto):</strong>
                </td>
                <td class="total-value">
                  <strong>{{ formatPrice(grandTotal) }}</strong>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Table Actions -->
        <div class="table-actions">
          <button 
            @click="addCostRow"
            class="add-row-btn"
            type="button"
          >
            + Zeile hinzufügen
          </button>
          
          <button 
            @click="clearAllRows"
            class="clear-btn"
            type="button"
            v-if="costRows.length > 1"
          >
            Alle Zeilen leeren
          </button>
        </div>

        <!-- Template Rows -->
        <div class="templates-section">
          <h4>Beispiel-Zeilen (zum Hinzufügen anklicken):</h4>
          <div class="template-buttons">
            <button 
              v-for="template in templates"
              :key="template.name"
              @click="addTemplate(template)"
              class="template-btn"
              type="button"
            >
              {{ template.name }}
            </button>
          </div>
        </div>

        <!-- Export Options -->
        <div class="export-section">
          <h4>Tabelle exportieren:</h4>
          <div class="export-buttons">
            <button 
              @click="exportToCSV"
              class="export-btn"
              type="button"
            >
              Als CSV exportieren
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CostStructureStep',
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  emits: ['update-field'],
  data() {
    return {
      templates: [
        {
          name: 'Material',
          service: 'Materialkosten',
          quantity: '1 Los',
          unitPrice: 0
        },
        {
          name: 'Arbeitszeit',
          service: 'Arbeitszeit/Personalkosten',
          quantity: '40 Std',
          unitPrice: 0
        },
        {
          name: 'Transport',
          service: 'Transport und Logistik',
          quantity: '1 Pausch.',
          unitPrice: 0
        },
        {
          name: 'Planung',
          service: 'Planungs- und Konstruktionsleistungen',
          quantity: '1 Pausch.',
          unitPrice: 0
        },
        {
          name: 'Installation',
          service: 'Installation und Inbetriebnahme',
          quantity: '1 Pausch.',
          unitPrice: 0
        },
        {
          name: 'Schulung',
          service: 'Schulung und Einweisung',
          quantity: '1 Tag',
          unitPrice: 0
        }
      ]
    }
  },
  computed: {
    costRows() {
      return this.formData.costRows || this.initializeCostRows();
    },
    
    rowCount() {
      return this.costRows.length;
    },
    
    grandTotal() {
      return this.costRows.reduce((sum, row) => {
        return sum + this.calculateTotal(row);
      }, 0);
    }
  },
  methods: {
    generateId() {
      return Date.now() + Math.random().toString(36).substr(2, 9);
    },

    initializeCostRows() {
      const rows = [];
      for (let i = 0; i < 5; i++) {
        rows.push({
          id: this.generateId(),
          service: '',
          quantity: '',
          unitPrice: 0
        });
      }
      this.updateField('costRows', rows);
      return rows;
    },

    updateRowCount(count) {
      const currentRows = [...this.costRows];
      const targetCount = Math.max(1, Math.min(50, count));
      
      if (targetCount > currentRows.length) {
        // Add new rows
        for (let i = currentRows.length; i < targetCount; i++) {
          currentRows.push({
            id: this.generateId(),
            service: '',
            quantity: '',
            unitPrice: 0
          });
        }
      } else if (targetCount < currentRows.length) {
        // Remove excess rows
        currentRows.splice(targetCount);
      }
      
      this.updateField('costRows', currentRows);
    },

    addCostRow() {
      const newRow = {
        id: this.generateId(),
        service: '',
        quantity: '',
        unitPrice: 0
      };
      
      const updatedRows = [...this.costRows, newRow];
      this.updateField('costRows', updatedRows);
    },

    removeCostRow(index) {
      if (this.costRows.length > 1) {
        const updatedRows = this.costRows.filter((_, i) => i !== index);
        this.updateField('costRows', updatedRows);
      }
    },

    updateCostRow(index, field, value) {
      const updatedRows = [...this.costRows];
      updatedRows[index][field] = value;
      this.updateField('costRows', updatedRows);
    },

    calculateTotal(row) {
      const quantity = parseFloat(row.quantity) || 1;
      const unitPrice = parseFloat(row.unitPrice) || 0;
      return quantity * unitPrice;
    },

    formatPrice(amount) {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
      }).format(amount);
    },

    addTemplate(template) {
      const newRow = {
        id: this.generateId(),
        service: template.service,
        quantity: template.quantity,
        unitPrice: template.unitPrice
      };
      
      const updatedRows = [...this.costRows, newRow];
      this.updateField('costRows', updatedRows);
    },

    clearAllRows() {
      if (confirm('Möchten Sie wirklich alle Zeilen leeren?')) {
        const clearedRows = this.costRows.map(row => ({
          ...row,
          service: '',
          quantity: '',
          unitPrice: 0
        }));
        this.updateField('costRows', clearedRows);
      }
    },

    exportToCSV() {
      const headers = ['Position', 'Leistung', 'Menge', 'Einzelpreis (EUR)', 'Gesamtpreis (EUR)'];
      const rows = this.costRows.map((row, index) => [
        index + 1,
        row.service,
        row.quantity,
        row.unitPrice,
        this.calculateTotal(row)
      ]);
      
      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', 'kostentabelle.csv');
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    updateField(field, value) {
      this.$emit('update-field', { field, value });
    }
  }
}
</script>

<style scoped>
.card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: var(--secondary);
  padding: 15px 20px;
  font-weight: bold;
  border-bottom: 1px solid var(--border);
  color: var(--primary);
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-content {
  padding: 20px;
}

.section-description {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid var(--primary);
}

.section-description p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.row-count-input {
  width: 120px;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 14px;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
  border: 1px solid var(--border);
  border-radius: 6px;
}

.cost-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  min-width: 800px;
}

.cost-table th,
.cost-table td {
  padding: 12px 8px;
  text-align: left;
  border-bottom: 1px solid #eee;
  vertical-align: top;
}

.cost-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  font-size: 13px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.pos-col { width: 50px; }
.service-col { width: 40%; }
.quantity-col { width: 15%; }
.unit-price-col { width: 20%; }
.total-price-col { width: 20%; }
.action-col { width: 50px; }

.pos-cell {
  text-align: center;
  font-weight: 500;
  color: var(--primary);
}

.service-input,
.quantity-input,
.price-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 13px;
  font-family: inherit;
}

.service-input {
  resize: none;
  min-height: 40px;
}

.price-input-container {
  display: flex;
  align-items: center;
  gap: 4px;
}

.price-input {
  flex: 1;
  text-align: right;
}

.currency {
  color: #666;
  font-size: 13px;
}

.service-input:focus,
.quantity-input:focus,
.price-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
}

.price-display {
  text-align: right;
  font-weight: 500;
  color: #333;
  padding: 6px 8px;
  background: #f8f9fa;
  border-radius: 3px;
}

.remove-row-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}

.remove-row-btn:hover {
  background: #c82333;
}

.total-row {
  background: #f8f9fa;
  font-weight: bold;
}

.total-label {
  text-align: right;
  padding-right: 16px;
  color: var(--primary);
}

.total-value {
  text-align: right;
  color: var(--primary);
  font-size: 16px;
}

.table-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.add-row-btn {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
}

.add-row-btn:hover {
  background: #0052a3;
}

.clear-btn {
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
}

.clear-btn:hover {
  background: #545b62;
}

.templates-section,
.export-section {
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
  margin-bottom: 20px;
}

.templates-section h4,
.export-section h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 15px;
}

.template-buttons,
.export-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.template-btn,
.export-btn {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s ease;
}

.template-btn:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.export-btn {
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.export-btn:hover {
  background: #218838;
}

/* Tooltip Styles */
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tooltip-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  font-size: 10px;
  font-weight: bold;
  cursor: help;
  line-height: 1;
}

.tooltip-text {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: normal;
  white-space: normal;
  z-index: 1000;
  transition: opacity 0.3s, visibility 0.3s;
  max-width: 300px;
  line-height: 1.4;
}

.tooltip-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #333;
}

.tooltip-wrapper:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

/* Responsive Design */
@media (max-width: 768px) {
  .table-container {
    font-size: 12px;
  }
  
  .cost-table th,
  .cost-table td {
    padding: 8px 4px;
  }
  
  .service-input,
  .quantity-input,
  .price-input {
    padding: 4px 6px;
    font-size: 12px;
  }
  
  .table-actions {
    flex-direction: column;
  }
  
  .template-buttons,
  .export-buttons {
    flex-direction: column;
  }
  
  .template-btn,
  .export-btn {
    width: 100%;
  }
}
</style>