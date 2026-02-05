<template>
  <div class="step-navigation">
    <div class="navigation-buttons">
      <button
        v-if="currentStep > 1"
        @click="$emit('previous-step')"
        class="btn btn-secondary"
      >
        ← Zurück
      </button>

      <button
        v-if="currentStep < effectiveTotalSteps"
        @click="handleNextStep"
        class="btn btn-primary ml-auto"
        :disabled="hasBlockingValidation"
      >
        {{ isSkippingStep ? 'Weiter (überspringen) →' : 'Weiter →' }}
      </button>

      <button
        v-if="currentStep === effectiveTotalSteps"
        @click="$emit('generate-document')"
        class="btn btn-success ml-auto"
        :disabled="hasBlockingValidation"
      >
        Dokument generieren ✓
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
  margin-top: auto;
  padding: 20px 0;
  border-top: 1px solid var(--border);
  background: linear-gradient(180deg, rgba(248, 249, 250, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%);
  border-radius: 0 0 8px 8px;
  margin-left: -20px;
  margin-right: -20px;
  padding-left: 20px;
  padding-right: 20px;
}

.navigation-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  width: 100%;
  margin: 0 auto;
  align-items: center;
}

.btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 102, 204, 0.2);
  min-width: 120px;
  text-align: center;
  width: 100%;
  max-width: 200px;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 102, 204, 0.3);
}

.btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-secondary {
  background: #6c757d;
  grid-column-start: 1;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-primary {
  background: var(--primary);
  grid-column-start: 2;
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
  justify-self: end;
}

@media (max-width: 768px) {
  .step-navigation {
    margin-left: -15px;
    margin-right: -15px;
    padding-left: 15px;
    padding-right: 15px;
  }

  .navigation-buttons {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .btn {
    margin-left: 0 !important;
    min-width: 100px;
  }
}
</style>
