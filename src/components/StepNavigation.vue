<template>
  <div class="step-navigation">
    <div class="step-info">
      <h2>Schritt {{ currentStep }} von {{ effectiveTotalSteps }}</h2>
      <div v-if="currentStep === 6 && formData.userRole !== 'einkauf'" class="skip-info">
        <small>Schritt 6 wird übersprungen (nur für Einkauf relevant)</small>
      </div>
    </div>
    
    <!-- Validation warnings -->
    <div v-if="validationWarnings.length > 0" class="validation-warnings">
      <div class="warning-header">⚠️ Bitte prüfen Sie folgende Angaben:</div>
      <ul class="warning-list">
        <li v-for="warning in validationWarnings" :key="warning">{{ warning }}</li>
      </ul>
    </div>
    
    <div class="navigation-buttons">
      <button 
        v-if="currentStep > 1" 
        @click="$emit('previous-step')" 
        class="btn btn-secondary"
      >
        Zurück
      </button>
      
      <button 
        v-if="currentStep < effectiveTotalSteps" 
        @click="handleNextStep" 
        class="btn btn-primary ml-auto"
        :disabled="hasBlockingValidation"
      >
        {{ isSkippingStep ? 'Weiter (überspringen)' : 'Weiter' }}
      </button>
      
      <button 
        v-if="currentStep === effectiveTotalSteps" 
        @click="$emit('generate-document')" 
        class="btn btn-success ml-auto"
        :disabled="hasBlockingValidation"
      >
        Dokument generieren
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StepNavigation',
  props: {
    currentStep: {
      type: Number,
      required: true
    },
    totalSteps: {
      type: Number,
      required: true
    },
    formData: {
      type: Object,
      required: true
    }
  },
  emits: ['previous-step', 'next-step', 'generate-document'],
  computed: {
    effectiveTotalSteps() {
      // Skip step 6 (Contract Details) if user is not Einkauf
      return this.formData.userRole === 'einkauf' ? this.totalSteps : this.totalSteps - 1;
    },
    
    isSkippingStep() {
      return this.currentStep === 6 && this.formData.userRole !== 'einkauf';
    },
    
    validationWarnings() {
      const warnings = [];
      
      // Step 1 validations
      if (this.currentStep === 1) {
        if (!this.formData.userRole) warnings.push('Bitte wählen Sie Ihre Rolle aus');
        if (!this.formData.projectTitle) warnings.push('Projekttitel ist erforderlich');
        if (!this.formData.serviceType) warnings.push('Leistungsart ist erforderlich');
        if (!this.formData.contractForm) warnings.push('Vertragsform ist erforderlich');
        if (!this.formData.location) warnings.push('Leistungsort ist erforderlich');
        if (this.formData.userRole === 'einkauf' && !this.formData.vergabeNr) {
          warnings.push('Vergabenummer ist für Einkauf erforderlich');
        }
      }
      
      // Step 2 validations
      if (this.currentStep === 2) {
        if (this.formData.serviceType === 'vob' && !this.formData.stlbNumber) {
          warnings.push('STLB-Nummer ist für VOB-Leistungen erforderlich');
        }
        if (this.formData.serviceType === 'vol' && !this.formData.serviceDefinition) {
          warnings.push('Leistungsdefinition ist für VOL-Leistungen erforderlich');
        }
        if (!this.formData.startDate) warnings.push('Startdatum ist erforderlich');
        if (!this.formData.endDate) warnings.push('Enddatum ist erforderlich');
      }
      
      // Step 6 validations (only for Einkauf)
      if (this.currentStep === 6 && this.formData.userRole === 'einkauf') {
        if (!this.formData.contractVolume || this.formData.contractVolume <= 0) {
          warnings.push('Auftragsvolumen ist erforderlich');
        }
        if (!this.formData.contractDuration || this.formData.contractDuration <= 0) {
          warnings.push('Vertragslaufzeit ist erforderlich');
        }
        if (!this.formData.paymentTerms) warnings.push('Zahlungskonditionen sind erforderlich');
        if (!this.formData.warrantyPeriod) warnings.push('Gewährleistungsdauer ist erforderlich');
      }
      
      return warnings;
    },
    
    hasBlockingValidation() {
      // Only block on critical validations
      if (this.currentStep === 1) {
        return !this.formData.userRole || !this.formData.projectTitle || !this.formData.serviceType;
      }
      
      if (this.currentStep === 2) {
        if (this.formData.serviceType === 'vob' && !this.formData.stlbNumber) return true;
        if (this.formData.serviceType === 'vol' && !this.formData.serviceDefinition) return true;
        return !this.formData.startDate || !this.formData.endDate;
      }
      
      return false;
    }
  },
  methods: {
    handleNextStep() {
      // Skip step 6 if user is not Einkauf
      if (this.currentStep === 5 && this.formData.userRole !== 'einkauf') {
        // Jump directly to step 7
        this.$emit('next-step');
        this.$emit('next-step');
      } else {
        this.$emit('next-step');
      }
    }
  }
}
</script>

<style scoped>
.step-navigation {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.step-info h2 {
  color: var(--primary);
  margin-bottom: 10px;
  font-size: 1.4rem;
  font-weight: 600;
}

.skip-info {
  margin-bottom: 15px;
  color: #666;
  font-style: italic;
}

.validation-warnings {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.warning-header {
  font-weight: 600;
  margin-bottom: 8px;
}

.warning-list {
  margin: 0;
  padding-left: 20px;
}

.warning-list li {
  margin-bottom: 4px;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-secondary {
  background: #6c757d;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-primary {
  background: var(--primary);
}

.btn-primary:hover {
  background: #0052a3;
}

.btn-success {
  background: #28a745;
}

.btn-success:hover {
  background: #218838;
}

.ml-auto {
  margin-left: auto;
}

@media (max-width: 768px) {
  .navigation-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .btn {
    width: 100%;
    margin-left: 0 !important;
  }
}
</style>