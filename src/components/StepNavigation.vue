<template>
  <div class="step-navigation">
    <div class="step-info">
      <h2>Schritt {{ currentStep }} von {{ totalSteps }}</h2>
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
        v-if="currentStep < totalSteps" 
        @click="$emit('next-step')" 
        class="btn btn-primary ml-auto"
      >
        Weiter
      </button>
      
      <button 
        v-if="currentStep === totalSteps" 
        @click="$emit('generate-document')" 
        class="btn btn-success ml-auto"
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
    }
  },
  emits: ['previous-step', 'next-step', 'generate-document']
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
  margin-bottom: 20px;
  font-size: 1.4rem;
  font-weight: 600;
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

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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