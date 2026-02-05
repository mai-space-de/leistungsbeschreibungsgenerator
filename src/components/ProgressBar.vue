<template>
  <div class="progress-bar">
    <div class="progress-container" :style="{ '--progress': progressPercentage }">
      <div
        v-for="step in effectiveSteps"
        :key="step.number"
        class="progress-step"
        :class="{
          'completed': step.number < currentStep,
          'active': step.number === currentStep,
          'upcoming': step.number > currentStep,
          'skipped': step.skipped
        }"
      >
        <div class="step-circle">
          <span v-if="step.number < currentStep">✓</span>
          <span v-else-if="step.skipped">—</span>
          <span v-else>{{ step.number }}</span>
        </div>
        <div class="step-label">{{ step.label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
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
    stepLabels() {
      return [
        'Grunddaten',
        'Leistungsdefinition',
        'Bieter-Anforderungen',
        'Leistungsanforderungen',
        'Kostenstruktur',
        'Vertragsdetails',
        'Anhänge'
      ];
    },

    effectiveSteps() {
      const steps = [];
      const isEinkauf = this.formData.userRole === 'einkauf';

      for (let i = 1; i <= this.totalSteps; i++) {
        const step = {
          number: i,
          label: this.stepLabels[i - 1],
          skipped: false
        };

        // Mark step 6 as skipped if user is not Einkauf
        if (i === 6 && !isEinkauf) {
          step.skipped = true;
        }

        steps.push(step);
      }

      return steps;
    },

    progressPercentage() {
      const isEinkauf = this.formData.userRole === 'einkauf';
      const totalEffectiveSteps = isEinkauf ? this.totalSteps : this.totalSteps - 1;

      let adjustedCurrentStep = this.currentStep;

      // Adjust for skipped step 6 if not Einkauf and current step is after 6
      if (!isEinkauf && this.currentStep > 6) {
        adjustedCurrentStep = this.currentStep - 1;
      }

      // Calculate progress as percentage (0-100)
      const progress = Math.min(100, Math.max(0, ((adjustedCurrentStep - 1) / (totalEffectiveSteps - 1)) * 100));

      return progress;
    }
  }
}
</script>

<style scoped>
.progress-bar {
  margin-bottom: 20px;
  padding: 20px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  container-type: inline-size;
}

/* Container queries for responsive design */
@container (max-width: 968px) {
  .progress-bar {
    padding: 15px 0;
  }

  .progress-container {
    padding: 0 15px;
  }

  .progress-step {
    min-width: 70px;
  }

  .step-label {
    font-size: 11px;
  }
}

@container (max-width: 768px) {
  .progress-bar {
    padding: 15px;
  }

  .progress-container {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    padding: 0;
    overflow-x: visible;
  }

  .progress-container::before {
    content: initial;
    position: absolute;
    top: 0;
    left: 35px;
    bottom: 0;
    width: 2px;
    height: calc(100% - 60px);
    background: #dee2e6;
    z-index: 1;
  }

  .progress-container::after {
    content: initial;
    position: absolute;
    top: 0;
    left: 35px;
    width: 2px;
    background: linear-gradient(180deg, var(--primary) 0%, #4fa8e0 100%);
    z-index: 1;
    transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    height: calc((100% - 60px) * (var(--progress, 0) / 100));
    border-radius: 1px;
  }

  .progress-step {
    flex-direction: row;
    align-items: center;
    min-width: auto;
    width: 100%;
    gap: 12px;
    padding: 8px 0;
  }

  .step-circle {
    width: 32px;
    height: 32px;
    font-size: 12px;
    border-width: 2px;
    margin-bottom: 0;
    flex-shrink: 0;
  }

  .step-label {
    font-size: 14px;
    text-align: left;
    max-width: none;
    overflow: visible;
    text-overflow: initial;
    white-space: normal;
    flex: 1;
  }
}

@container (max-width: 480px) {
  .progress-bar {
    padding: 12px;
  }

  .progress-container::before,
  .progress-container::after {
    left: 29px;
  }

  .step-circle {
    width: 28px;
    height: 28px;
    font-size: 11px;
  }

  .step-label {
    font-size: 13px;
  }
}

.progress-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  max-width: 100%;
  overflow-x: auto;
  padding: 0 20px;
}

.progress-container::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  height: 2px;
  background: #dee2e6;
  z-index: 1;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  min-width: 80px;
  flex-shrink: 0;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  background: #fff;
  border: 3px solid #dee2e6;
  color: #6c757d;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.step-label {
  font-size: 12px;
  color: #6c757d;
  text-align: center;
  font-weight: 500;
  transition: color 0.3s ease;
}

/* Completed steps */
.progress-step.completed .step-circle {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.progress-step.completed .step-label {
  color: var(--primary);
}

/* Active step */
.progress-step.active .step-circle {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
  box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.2);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 102, 204, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(0, 102, 204, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 102, 204, 0);
  }
}

.progress-step.active .step-label {
  color: var(--primary);
  font-weight: 600;
}

/* Skipped steps */
.progress-step.skipped .step-circle {
  background: #f8f9fa;
  border-color: #dee2e6;
  color: #adb5bd;
  border-style: dashed;
}

.progress-step.skipped .step-label {
  color: #adb5bd;
  text-decoration: line-through;
}

/* Progress line animation */
.progress-container::after {
  content: '';
  position: absolute;
  top: 20px;
  left: 20px;
  height: 2px;
  background: linear-gradient(90deg, var(--primary) 0%, #4fa8e0 100%);
  z-index: 1;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  width: calc((100% - 40px) * (var(--progress, 0) / 100));
  border-radius: 1px;
}

/* Container queries for responsive design */
@container (max-width: 968px) {
  .progress-bar {
    padding: 15px 0;
  }

  .progress-container {
    padding: 0 15px;
  }

  .progress-step {
    min-width: 70px;
  }

  .step-label {
    font-size: 11px;
  }
}

@container (max-width: 768px) {
  .progress-bar {
    padding: 15px;
  }

  .progress-container {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    padding: 0;
    overflow-x: visible;
  }

  .progress-container::before {
    content: initial;
    position: absolute;
    top: 0;
    left: 35px;
    bottom: 0;
    width: 2px;
    height: calc(100% - 60px);
    background: #dee2e6;
    z-index: 1;
  }

  .progress-container::after {
    content: initial;
    position: absolute;
    top: 0;
    left: 35px;
    width: 2px;
    background: linear-gradient(180deg, var(--primary) 0%, #4fa8e0 100%);
    z-index: 1;
    transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    height: calc((100% - 60px) * (var(--progress, 0) / 100));
    border-radius: 1px;
  }

  .progress-step {
    flex-direction: row;
    align-items: center;
    min-width: auto;
    width: 100%;
    gap: 12px;
    padding: 8px 0;
  }

  .step-circle {
    width: 32px;
    height: 32px;
    font-size: 12px;
    border-width: 2px;
    margin-bottom: 0;
    flex-shrink: 0;
  }

  .step-label {
    font-size: 14px;
    text-align: left;
    max-width: none;
    overflow: visible;
    text-overflow: initial;
    white-space: normal;
    flex: 1;
  }
}

@container (max-width: 480px) {
  .progress-bar {
    padding: 12px;
  }

  .progress-container::before,
  .progress-container::after {
    left: 29px;
  }

  .step-circle {
    width: 28px;
    height: 28px;
    font-size: 11px;
  }

  .step-label {
    font-size: 13px;
  }
}
</style>
