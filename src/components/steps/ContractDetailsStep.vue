<template>
  <div class="card">
    <div class="card-header">6. Vertragsdetails (Einkauf)</div>
    <div class="card-content">
      <!-- Show only for Einkauf users -->
      <div v-if="formData.userRole === 'einkauf'" class="contract-details">
        <div class="section-description">
          <p>Zusätzliche Angaben für die Vergabeunterlagen und Vertragsgestaltung.</p>
        </div>

        <!-- Contract Volume -->
        <div class="form-group">
          <label for="contract-volume">
            Auftragsvolumen in Euro (netto):
            <span class="tooltip-wrapper">
              <span class="tooltip-icon">?</span>
              <span class="tooltip-text">Geschätztes Auftragsvolumen zur besseren Einordnung der Ausschreibung.</span>
            </span>
          </label>
          <div class="currency-input-container">
            <input 
              type="number" 
              id="contract-volume" 
              step="0.01"
              min="0"
              :value="formData.contractVolume"
              @input="updateField('contractVolume', parseFloat($event.target.value) || 0)"
              placeholder="0.00"
              class="currency-input"
            />
            <span class="currency-symbol">€</span>
          </div>
        </div>

        <!-- Contract Duration -->
        <div class="form-group">
          <label for="contract-duration">Vertragslaufzeit (Jahre):</label>
          <div class="duration-container">
            <input 
              type="number" 
              id="contract-duration" 
              min="0.5"
              max="4"
              step="0.5"
              :value="formData.contractDuration"
              @input="updateField('contractDuration', parseFloat($event.target.value) || 1)"
              placeholder="1"
              class="duration-input"
            />
            <span class="duration-unit">Jahre</span>
            <div class="duration-note">
              <small>Maximal 4 Jahre möglich</small>
            </div>
          </div>
        </div>

        <!-- Contract Duration Info -->
        <div class="info-box">
          <strong>Hinweis zur Vertragslaufzeit:</strong> 
          Die maximale Vertragslaufzeit beträgt 4 Jahre. Bei Rahmenvereinbarungen kann diese Zeit für mehrere Abrufe genutzt werden.
        </div>

        <!-- Additional Contract Terms -->
        <div class="form-group">
          <label for="contract-terms">Zusätzliche Vertragsbedingungen:</label>
          <textarea 
            id="contract-terms" 
            :value="formData.contractTerms"
            @input="updateField('contractTerms', $event.target.value)"
            placeholder="Besondere Vertragsbedingungen, Zahlungsmodalitäten, etc."
            rows="4"
          ></textarea>
        </div>

        <!-- Payment Terms -->
        <div class="form-group">
          <label for="payment-terms">Zahlungskonditionen:</label>
          <select 
            id="payment-terms" 
            :value="formData.paymentTerms"
            @change="updateField('paymentTerms', $event.target.value)"
          >
            <option value="">Bitte wählen...</option>
            <option value="sofort">Zahlung sofort nach Rechnungsstellung</option>
            <option value="14-tage">14 Tage nach Rechnungsstellung</option>
            <option value="30-tage">30 Tage nach Rechnungsstellung</option>
            <option value="bei-lieferung">Bei Lieferung/Abnahme</option>
            <option value="teilzahlung">Teilzahlungen nach Leistungsfortschritt</option>
            <option value="custom">Individuelle Vereinbarung</option>
          </select>
        </div>

        <!-- Custom Payment Terms (shown when "custom" is selected) -->
        <div v-if="formData.paymentTerms === 'custom'" class="form-group">
          <label for="custom-payment-terms">Individuelle Zahlungskonditionen:</label>
          <textarea 
            id="custom-payment-terms" 
            :value="formData.customPaymentTerms"
            @input="updateField('customPaymentTerms', $event.target.value)"
            placeholder="Beschreiben Sie die individuellen Zahlungskonditionen..."
            rows="3"
          ></textarea>
        </div>

        <!-- Warranty Period -->
        <div class="form-group">
          <label for="warranty-period">Gewährleistungsdauer:</label>
          <select 
            id="warranty-period" 
            :value="formData.warrantyPeriod"
            @change="updateField('warrantyPeriod', $event.target.value)"
          >
            <option value="">Bitte wählen...</option>
            <option value="12">12 Monate</option>
            <option value="24">24 Monate</option>
            <option value="36">36 Monate</option>
            <option value="60">60 Monate</option>
            <option value="custom">Andere Dauer</option>
          </select>
        </div>

        <!-- Custom Warranty Period -->
        <div v-if="formData.warrantyPeriod === 'custom'" class="form-group">
          <label for="custom-warranty">Gewährleistungsdauer (Monate):</label>
          <input 
            type="number" 
            id="custom-warranty" 
            min="1"
            max="120"
            :value="formData.customWarranty"
            @input="updateField('customWarranty', parseInt($event.target.value) || 12)"
            placeholder="12"
          />
        </div>

        <!-- Contact Information -->
        <div class="contact-section">
          <h4>Kontaktdaten für Rückfragen</h4>
          
          <div class="form-group">
            <label for="contact-person">Ansprechperson:</label>
            <input 
              type="text" 
              id="contact-person" 
              :value="formData.contactPerson"
              @input="updateField('contactPerson', $event.target.value)"
              placeholder="Name der Ansprechperson"
            />
          </div>

          <div class="form-group">
            <label for="contact-email">E-Mail:</label>
            <input 
              type="email" 
              id="contact-email" 
              :value="formData.contactEmail"
              @input="updateField('contactEmail', $event.target.value)"
              placeholder="email@beispiel.de"
            />
          </div>

          <div class="form-group">
            <label for="contact-phone">Telefon:</label>
            <input 
              type="tel" 
              id="contact-phone" 
              :value="formData.contactPhone"
              @input="updateField('contactPhone', $event.target.value)"
              placeholder="+49 123 456789"
            />
          </div>
        </div>

        <!-- Procurement Guidelines -->
        <div class="guidelines-section">
          <h4>Vergaberechtliche Hinweise</h4>
          <div class="guidelines-content">
            <div class="guideline-item">
              <input 
                type="checkbox" 
                id="guidelines-understood"
                :checked="formData.guidelinesUnderstood"
                @change="updateField('guidelinesUnderstood', $event.target.checked)"
              />
              <label for="guidelines-understood">
                Ich bestätige, dass die vergaberechtlichen Bestimmungen beachtet wurden.
              </label>
            </div>
            <div class="guideline-item">
              <input 
                type="checkbox" 
                id="equal-treatment"
                :checked="formData.equalTreatment"
                @change="updateField('equalTreatment', $event.target.checked)"
              />
              <label for="equal-treatment">
                Gleichbehandlung aller Bieter ist sichergestellt.
              </label>
            </div>
            <div class="guideline-item">
              <input 
                type="checkbox" 
                id="transparency"
                :checked="formData.transparency"
                @change="updateField('transparency', $event.target.checked)"
              />
              <label for="transparency">
                Transparenz des Vergabeverfahrens ist gewährleistet.
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Message for non-Einkauf users -->
      <div v-else class="not-einkauf-message">
        <div class="info-box">
          <strong>Hinweis:</strong> Dieser Abschnitt ist nur für Nutzer aus dem Einkauf relevant. 
          Da Sie als Fachabteilung arbeiten, können Sie diesen Schritt überspringen.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContractDetailsStep',
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  emits: ['update-field'],
  methods: {
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
  position: relative;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.currency-input-container,
.duration-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.currency-input,
.duration-input {
  flex: 1;
  max-width: 200px;
  text-align: right;
}

.currency-symbol,
.duration-unit {
  color: #666;
  font-weight: 500;
  min-width: 20px;
}

.duration-container {
  flex-direction: column;
  align-items: flex-start;
}

.duration-note {
  color: #666;
  margin-top: 4px;
}

.contact-section,
.guidelines-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.contact-section h4,
.guidelines-section h4 {
  margin: 0 0 15px 0;
  color: var(--primary);
  font-size: 16px;
}

.guidelines-content {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  border-left: 4px solid #28a745;
}

.guideline-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
}

.guideline-item:last-child {
  margin-bottom: 0;
}

.guideline-item input[type="checkbox"] {
  width: auto;
  margin: 0;
  margin-top: 2px;
}

.guideline-item label {
  margin: 0;
  font-weight: normal;
  cursor: pointer;
  line-height: 1.4;
}

.info-box {
  background: #e3f2fd;
  border: 1px solid #bbdefb;
  color: #1565c0;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
}

.not-einkauf-message {
  text-align: center;
  padding: 20px;
}

/* Tooltip Styles */
.tooltip-wrapper {
  position: relative;
  display: inline-block;
  margin-left: 5px;
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
  .currency-input-container,
  .duration-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .currency-input,
  .duration-input {
    max-width: none;
    text-align: left;
  }
  
  .tooltip-text {
    max-width: 250px;
    left: 0;
    transform: none;
  }
  
  .tooltip-text::after {
    left: 20px;
    transform: none;
  }
}
</style>