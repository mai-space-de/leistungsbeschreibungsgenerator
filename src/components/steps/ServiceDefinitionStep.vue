<template>
  <div class="card">
    <div class="card-header">2. Definition der Leistung</div>
    <div class="card-content">
      <!-- VOB: STLB Number -->
      <div v-if="formData.serviceType === 'vob'" class="form-group" :class="{ 'has-error': validationErrors.stlbNumber }">
        <label for="stlb-number">
          STLB-Nummer:
          <span class="tooltip-wrapper">
            <span class="tooltip-icon">?</span>
            <span class="tooltip-text">z.B. 663 Maler oder 682 Elektro</span>
          </span>
        </label>
        <input 
          type="text" 
          id="stlb-number" 
          :value="formData.stlbNumber"
          @input="updateField('stlbNumber', $event.target.value)"
          placeholder="z.B. 663 Maler oder 682 Elektro"
        />
        <div v-if="validationErrors.stlbNumber" class="error-message">{{ validationErrors.stlbNumber }}</div>
      </div>

      <!-- VOL: Service Definition -->
      <div v-if="formData.serviceType === 'vol'" class="form-group" :class="{ 'has-error': validationErrors.serviceDefinition }">
        <label for="service-definition">Definition der Ware oder Dienstleistung:</label>
        <textarea 
          id="service-definition" 
          :value="formData.serviceDefinition"
          @input="updateField('serviceDefinition', $event.target.value)"
          placeholder="Beschreiben Sie detailliert die gewünschte Ware oder Dienstleistung..."
          rows="6"
        ></textarea>
        <div v-if="validationErrors.serviceDefinition" class="error-message">{{ validationErrors.serviceDefinition }}</div>
      </div>

      <!-- Service Period -->
      <div class="form-group">
        <label for="service-period">Zeitraum für die Leistungserbringung:</label>
        <div class="date-range">
          <div class="date-input" :class="{ 'has-error': validationErrors.startDate }">
            <label for="start-date">Startdatum:</label>
            <input 
              type="date" 
              id="start-date" 
              :value="formData.startDate"
              @input="updateField('startDate', $event.target.value)"
            />
            <div v-if="validationErrors.startDate" class="error-message">{{ validationErrors.startDate }}</div>
          </div>
          <div class="date-input" :class="{ 'has-error': validationErrors.endDate }">
            <label for="end-date">Enddatum:</label>
            <input 
              type="date" 
              id="end-date" 
              :value="formData.endDate"
              @input="updateField('endDate', $event.target.value)"
            />
            <div v-if="validationErrors.endDate" class="error-message">{{ validationErrors.endDate }}</div>
          </div>
        </div>
      </div>

      <!-- Help text based on service type -->
      <div v-if="formData.serviceType === 'vob'" class="info-box">
        <strong>VOB-Hinweis:</strong> Bei Bauleistungen nach VOB sind die entsprechenden STLB-Nummern zu verwenden, um eine standardisierte Leistungsbeschreibung zu gewährleisten.
      </div>

      <div v-if="formData.serviceType === 'vol'" class="info-box">
        <strong>VOL-Hinweis:</strong> Bei Liefer- und Dienstleistungen nach VOL ist eine detaillierte Beschreibung der gewünschten Leistung erforderlich.
      </div>

      <!-- Warning if no service type selected -->
      <div v-if="!formData.serviceType" class="alert alert-warning">
        <strong>Hinweis:</strong> Bitte wählen Sie zuerst eine Leistungsart im vorherigen Schritt aus.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServiceDefinitionStep',
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  emits: ['update-field'],
  computed: {
    validationErrors() {
      const errors = {};
      if (this.formData.serviceType === 'vob' && !this.formData.stlbNumber) {
        errors.stlbNumber = 'STLB-Nummer ist für VOB-Leistungen erforderlich';
      }
      if (this.formData.serviceType === 'vol' && !this.formData.serviceDefinition) {
        errors.serviceDefinition = 'Leistungsdefinition ist für VOL-Leistungen erforderlich';
      }
      if (!this.formData.startDate) {
        errors.startDate = 'Startdatum ist erforderlich';
      }
      if (!this.formData.endDate) {
        errors.endDate = 'Enddatum ist erforderlich';
      }
      return errors;
    }
  },
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

.form-group {
  margin-bottom: 20px;
}

.form-group.has-error input,
.form-group.has-error select,
.form-group.has-error textarea {
  border-color: #dc3545;
}

.form-group.has-error input:focus,
.form-group.has-error select:focus,
.form-group.has-error textarea:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.date-input.has-error input {
  border-color: #dc3545;
}

.date-input.has-error input:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.error-message {
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
  display: flex;
  align-items: center;
}

.error-message::before {
  content: "⚠ ";
  margin-right: 4px;
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
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.date-range {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.date-input label {
  font-size: 13px;
  color: #666;
  margin-bottom: 5px;
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
  white-space: nowrap;
  z-index: 1000;
  transition: opacity 0.3s, visibility 0.3s;
  max-width: 300px;
  white-space: normal;
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

/* Alert and Info Boxes */
.alert {
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid;
}

.alert-warning {
  background: #fff3cd;
  border-color: #ffeaa7;
  color: #856404;
}

.info-box {
  background: #e3f2fd;
  border: 1px solid #bbdefb;
  color: #1565c0;
  padding: 12px;
  border-radius: 4px;
  margin-top: 15px;
  font-size: 14px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .date-range {
    grid-template-columns: 1fr;
    gap: 12px;
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