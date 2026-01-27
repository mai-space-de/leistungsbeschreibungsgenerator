<template>
  <div class="preview-panel">
    <div class="preview-header">
      <h3>Vorschau</h3>
      <button @click="$emit('close-preview')" class="close-preview-btn">&times;</button>
    </div>
    
    <div class="preview-content">
      <div class="document-page">
        <div class="page-number">Seite 1</div>
        
        <h1 class="document-title">
          {{ formData.projectTitle || 'Projekttitel' }}
        </h1>
        
        <div v-if="formData.vergabeNr" class="vergabe-nummer">
          Vergabenummer: {{ formData.vergabeNr }}
        </div>

        <!-- Basic Configuration -->
        <section v-if="formData.serviceType || formData.contractForm || formData.location" class="grunddaten">
          <h2>Grundkonfiguration</h2>
          <div class="config-grid">
            <div v-if="formData.serviceType" class="config-item">
              <strong>Leistungsart:</strong> {{ getServiceTypeText(formData.serviceType) }}
            </div>
            <div v-if="formData.contractForm" class="config-item">
              <strong>Vertragsform:</strong> {{ getContractFormText(formData.contractForm) }}
            </div>
            <div v-if="formData.location" class="config-item">
              <strong>Ort:</strong> {{ formData.location }}
            </div>
          </div>
        </section>
        
        <!-- Current Situation -->
        <section v-if="formData.currentSituation" class="section">
          <h2>1. Ist-Zustand</h2>
          <p>{{ formData.currentSituation }}</p>
        </section>
        
        <!-- Service Definition -->
        <section v-if="formData.serviceDefinition || formData.stlbNumber" class="section">
          <h2>2. Leistungsbeschreibung</h2>
          <div v-if="formData.stlbNumber" class="date-info">
            <strong>STLB-Nummer:</strong> {{ formData.stlbNumber }}
          </div>
          <p v-if="formData.serviceDefinition">{{ formData.serviceDefinition }}</p>
        </section>
        
        <!-- Service Period -->
        <section v-if="formData.startDate || formData.endDate" class="section">
          <h2>3. Leistungszeitraum</h2>
          <div v-if="formData.startDate" class="date-info">
            <strong>Startdatum:</strong> {{ formatDate(formData.startDate) }}
          </div>
          <div v-if="formData.endDate" class="date-info">
            <strong>Enddatum:</strong> {{ formatDate(formData.endDate) }}
          </div>
        </section>
        
        <!-- Bidder Requirements -->
        <section v-if="formData.bidderRequirements && formData.bidderRequirements.length > 0" class="section">
          <h2>4. Anforderungen an den Bieter</h2>
          <div v-for="(requirement, index) in formData.bidderRequirements" :key="index" class="requirement-group">
            <h3 class="requirement-criterion">{{ requirement.criterion }}</h3>
            <ul class="requirements-list" v-if="requirement.requirements && requirement.requirements.length > 0">
              <li v-for="(subReq, subIndex) in requirement.requirements" :key="subIndex">
                {{ subReq.text }}
              </li>
            </ul>
          </div>
        </section>
        
        <!-- Service Requirements -->
        <section v-if="formData.serviceRequirements && formData.serviceRequirements.length > 0" class="section">
          <h2>5. Leistungsanforderungen</h2>
          <ul class="requirements-list">
            <li v-for="(requirement, index) in formData.serviceRequirements" :key="index">
              <strong>{{ requirement.text }}</strong>
              <span v-if="requirement.criteriaType" class="criteria-badge">
                {{ requirement.criteriaType === 'A' ? 'Ausschlusskriterium' : 'Bewertungskriterium' }}
                <span v-if="requirement.criteriaType === 'B' && requirement.weight"> ({{ requirement.weight }}%)</span>
              </span>
            </li>
          </ul>
        </section>
        
        <!-- Cost Structure -->
        <section v-if="formData.costRows && formData.costRows.length > 0" class="section">
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
              <tr v-for="(row, index) in formData.costRows" :key="index">
                <td class="number">{{ index + 1 }}</td>
                <td>{{ row.service ||  row.description || '' }}</td>
                <td class="number">{{ formatQuantity(row) }}</td>
                <td class="number">{{ formatCurrency(row.unitPrice) }}</td>
                <td class="number">{{ formatCurrency(calculateRowTotal(row)) }}</td>
              </tr>
              <tr class="total-row">
                <td colspan="4"><strong>Gesamtsumme</strong></td>
                <td class="number"><strong>{{ formatCurrency(calculateTotal()) }}</strong></td>
              </tr>
            </tbody>
          </table>
        </section>
        
        <!-- Contract Details (if user role is 'einkauf') -->
        <section v-if="formData.userRole === 'einkauf' && hasContractDetails()" class="section">
          <h2>Vertragsdetails</h2>
          <div v-if="formData.contractVolume" class="date-info">
            <strong>Vertragsvolumen:</strong> {{ formatCurrency(formData.contractVolume) }}
          </div>
          <div v-if="formData.contractDuration" class="date-info">
            <strong>Vertragslaufzeit:</strong> {{ formData.contractDuration }} Jahr(e)
          </div>
          <div v-if="formData.paymentTerms" class="date-info">
            <strong>Zahlungsbedingungen:</strong> {{ getPaymentTermsText() }}
          </div>
          <div v-if="formData.warrantyPeriod" class="date-info">
            <strong>Gewährleistung:</strong> {{ getWarrantyText() }}
          </div>
          <div v-if="formData.contactPerson" class="date-info">
            <strong>Ansprechperson:</strong> {{ formData.contactPerson }}
          </div>
          <div v-if="formData.contactEmail" class="date-info">
            <strong>E-Mail:</strong> {{ formData.contactEmail }}
          </div>
          <div v-if="formData.contactPhone" class="date-info">
            <strong>Telefon:</strong> {{ formData.contactPhone }}
          </div>
        </section>
        
        <!-- Attachments -->
        <section v-if="formData.attachments && formData.attachments.length > 0" class="section">
          <h2>7. Anlagen</h2>
          <div class="attachments-list">
            <div v-for="(attachment, index) in formData.attachments" :key="index" class="attachment-item">
              <strong>Anlage {{ index + 1 }}:</strong> {{ attachment.name }}<br>
              <span v-if="attachment.description" class="attachment-desc">{{ attachment.description }}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DocumentPreview',
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  emits: ['close-preview'],
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('de-DE');
    },
    
    formatCurrency(value) {
      if (!value && value !== 0) return '0,00';
      return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    },
    
    formatQuantity(row) {
      // Handle both old format (quantity + unit) and new format (quantity string)
      if (row.quantity && row.unit) {
        return `${row.quantity} ${row.unit}`;
      } else if (row.quantity) {
        return row.quantity;
      }
      return '';
    },
    
    calculateRowTotal(row) {
      // For new format, quantity is a string, so we need to parse it
      if (typeof row.quantity === 'string') {
        // Extract numeric part from quantity string like "40 Std" or "1 Los"
        const match = row.quantity.match(/^(\d+(?:[.,]\d+)?)/);
        const quantity = match ? parseFloat(match[1].replace(',', '.')) : 0;
        return quantity * (row.unitPrice || 0);
      }
      // For old format, quantity is a number
      return (row.quantity || 0) * (row.unitPrice || 0);
    },
    
    calculateTotal() {
      if (!this.formData.costRows || this.formData.costRows.length === 0) return 0;
      return this.formData.costRows.reduce((total, row) => {
        return total + this.calculateRowTotal(row);
      }, 0);
    },
    
    getServiceTypeText(serviceType) {
      const types = {
        'vob': 'Bauleistung (VOB)',
        'vol': 'Liefer-/Dienstleistung (VOL)'
      };
      return types[serviceType] || serviceType;
    },
    
    getContractFormText(contractForm) {
      const forms = {
        'einzelauftrag': 'Einzelauftrag',
        'rahmenvereinbarung': 'Rahmenvereinbarung'
      };
      return forms[contractForm] || contractForm;
    },
    
    getPaymentTermsText() {
      if (this.formData.paymentTerms === 'custom') {
        return this.formData.customPaymentTerms || '';
      }
      return this.formData.paymentTerms || '';
    },
    
    getWarrantyText() {
      if (this.formData.warrantyPeriod === 'custom') {
        return `${this.formData.customWarranty || 12} Monate`;
      }
      return this.formData.warrantyPeriod || '';
    },
    
    hasContractDetails() {
      return this.formData.contractVolume || 
             this.formData.contractDuration || 
             this.formData.paymentTerms || 
             this.formData.warrantyPeriod || 
             this.formData.contactPerson || 
             this.formData.contactEmail || 
             this.formData.contactPhone;
    }
  }
}
</script>

<style scoped>
.preview-panel {
  background: #ffffff;
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.preview-header {
  padding: 15px 20px;
  background: var(--secondary);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-header h3 {
  color: var(--primary);
  font-size: 1.2rem;
  margin: 0;
  font-weight: bold;
}

.close-preview-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0.25rem;
  line-height: 1;
  transition: color 0.2s ease;
}

.close-preview-btn:hover {
  color: #dc3545;
}

.preview-content {
  flex: 1;
  overflow-y: auto;
  height: calc(100% - 60px);
  border: 1px solid var(--border);
  background-color: #f0f0f0;
  padding: 20px;
}

.document-page {
  background: white;
  padding: 25mm;
  margin: 0 auto;
  min-height: 297mm;
  width: 210mm;
  max-width: 100%;
  position: relative;
  font-size: 10pt;
  line-height: 1.4;
  font-family: Arial, sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-number {
  position: absolute;
  bottom: 15mm;
  right: 25mm;
  font-size: 9pt;
  color: #666;
}

.document-title {
  font-family: Arial, sans-serif;
  font-size: 16pt;
  margin-top: 0;
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

.section {
  margin-bottom: 20pt;
  page-break-inside: avoid;
}

.grunddaten {
  margin-bottom: 25pt;
  padding: 15pt;
  background-color: #f8f9fa;
  border-left: 4px solid #0066cc;
}

.config-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10pt;
  margin-top: 8pt;
}

.config-item {
  font-size: 10pt;
}

.section h2,
.grunddaten h2 {
  font-family: Arial, sans-serif;
  font-size: 12pt;
  margin-top: 16pt;
  margin-bottom: 8pt;
  font-weight: bold;
  color: #0066cc;
  border-bottom: 1px solid #ddd;
  padding-bottom: 4pt;
}

.section p,
.grunddaten p {
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

.requirement-group {
  margin-bottom: 15pt;
}

.requirement-criterion {
  font-size: 10pt;
  font-weight: bold;
  color: #333;
  margin-bottom: 8pt;
}

.criteria-badge {
  display: inline-block;
  margin-left: 8pt;
  font-size: 8pt;
  color: #666;
  font-style: italic;
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

.cost-table .total-row {
  background-color: #f8f9fa;
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

.attachment-desc {
  color: #666;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .document-page {
    width: 100%;
    padding: 20mm;
  }
}

@media (max-width: 968px) {
  .preview-panel {
    border-left: none;
    border-top: 1px solid var(--border);
    height: 50vh;
  }
  
  .document-page {
    width: 100%;
    padding: 15mm;
    font-size: 9pt;
  }
  
  .document-title {
    font-size: 14pt;
  }
  
  .section h2,
  .grunddaten h2 {
    font-size: 11pt;
  }
}
</style>