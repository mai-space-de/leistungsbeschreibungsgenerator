<template>
  <div class="step-header">
    <div class="step-title-section">
      <h1>{{ stepTitle }}</h1>
      <p class="step-counter">Schritt {{ currentStep }} von {{ effectiveTotalSteps }}</p>
    </div>
    
    <div v-if="currentStep === 6 && formData.userRole !== 'einkauf'" class="skip-info">
      <small>Schritt 6 wird übersprungen (nur für Einkauf relevant)</small>
    </div>

    <!-- Validation warnings -->
    <div v-if="validationWarnings.length > 0" class="validation-warnings">
      <div class="warning-header">⚠️ Bitte prüfen Sie folgende Angaben:</div>
      <ul class="warning-list">
        <li v-for="warning in validationWarnings" :key="warning">{{ warning }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StepHeader',
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
  computed: {
    effectiveTotalSteps() {
      // Skip step 6 (Contract Details) if user is not Einkauf
      return this.formData.userRole === 'einkauf' ? this.totalSteps : this.totalSteps - 1;
    },

    stepTitle() {
      const titles = [
        'Nutzerrolle und Grunddaten',
        'Definition der Leistung', 
        'Anforderungen an die Bieter',
        'Anforderungen an die Leistung',
        'Kostenstruktur',
        'Vertragsdetails',
        'Anhänge'
      ];
      
      return titles[this.currentStep - 1] || 'Unbekannter Schritt';
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
    }
  }
}
</script>

<style scoped>
.step-header {
  margin-bottom: 30px;
  transition: all 0.3s ease;
}

.step-title-section {
  margin-bottom: 20px;
  animation: fadeInUp 0.5s ease-out;
}

.step-title-section h1 {
  color: var(--primary);
  margin: 0 0 5px 0;
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.2;
  transition: color 0.3s ease;
}

.step-counter {
  color: #6c757d;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;
  transition: opacity 0.3s ease;
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
  border-radius: 8px;
  margin-top: 15px;
  animation: slideIn 0.4s ease-out;
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.15);
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .step-header {
    margin-bottom: 20px;
  }
  
  .step-title-section h1 {
    font-size: 1.5rem;
  }
  
  .step-counter {
    font-size: 0.8rem;
  }
  
  .validation-warnings {
    padding: 12px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .step-title-section h1 {
    font-size: 1.3rem;
  }
  
  .validation-warnings {
    padding: 10px;
  }
}
</style>