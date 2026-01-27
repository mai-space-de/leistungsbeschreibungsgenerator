<template>
  <div class="card">
    <div class="card-header">4. Anforderungen an die Leistung</div>
    <div class="card-content">
      <div class="requirements-section">
        <div class="section-description">
          <p>Definieren Sie hier die spezifischen Anforderungen an die zu erbringende Leistung sowie die entsprechenden Bewertungskriterien.</p>
        </div>

        <!-- Service Requirements List -->
        <div v-if="serviceRequirements.length > 0" class="requirements-list">
          <div 
            v-for="(requirement, index) in serviceRequirements" 
            :key="requirement.id"
            class="requirement-item"
          >
            <div class="requirement-content">
              <div class="requirement-number">{{ index + 1 }}.</div>
              
              <div class="requirement-details">
                <!-- Service Requirement Text -->
                <div class="form-group">
                  <label :for="`requirement-${index}`">Anforderung an die Leistung:</label>
                  <textarea
                    :id="`requirement-${index}`"
                    :value="requirement.text"
                    @input="updateRequirement(index, 'text', $event.target.value)"
                    placeholder="Beschreiben Sie die spezifische Anforderung..."
                    rows="3"
                    class="requirement-input"
                  ></textarea>
                </div>

                <!-- Criteria Type Selection -->
                <div class="criteria-section">
                  <div class="form-group">
                    <label :for="`criteria-type-${index}`">Ausschluss- und Bewertungskriterien:</label>
                    <select
                      :id="`criteria-type-${index}`"
                      :value="requirement.criteriaType"
                      @change="updateRequirement(index, 'criteriaType', $event.target.value)"
                      class="criteria-select"
                    >
                      <option value="">Bitte wählen...</option>
                      <option value="A">A - Ausschlusskriterium</option>
                      <option value="B">B - Bewertungskriterium</option>
                    </select>
                  </div>

                  <!-- Weight input for criteria type B -->
                  <div v-if="requirement.criteriaType === 'B'" class="form-group weight-group">
                    <label :for="`weight-${index}`">Gewichtung (%):</label>
                    <div class="weight-input-container">
                      <input
                        :id="`weight-${index}`"
                        type="number"
                        min="0"
                        max="100"
                        :value="requirement.weight"
                        @input="updateRequirement(index, 'weight', parseInt($event.target.value) || 0)"
                        class="weight-input"
                        placeholder="0"
                      />
                      <span class="weight-unit">%</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Remove Button -->
              <button 
                @click="removeRequirement(index)"
                class="remove-btn"
                type="button"
                title="Anforderung entfernen"
              >
                ×
              </button>
            </div>

            <!-- Criteria Type Information -->
            <div v-if="requirement.criteriaType" class="criteria-info">
              <div v-if="requirement.criteriaType === 'A'" class="criteria-info-content criteria-a">
                <strong>Ausschlusskriterium:</strong> Bieter, die diese Anforderung nicht erfüllen, werden vom Verfahren ausgeschlossen.
              </div>
              <div v-if="requirement.criteriaType === 'B'" class="criteria-info-content criteria-b">
                <strong>Bewertungskriterium:</strong> Diese Anforderung fließt mit der angegebenen Gewichtung in die Bewertung ein.
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <p>Noch keine Anforderungen an die Leistung definiert.</p>
        </div>

        <!-- Weight Summary for Type B criteria -->
        <div v-if="totalWeightB > 0" class="weight-summary">
          <div class="weight-summary-content">
            <span>Gesamtgewichtung der Bewertungskriterien:</span>
            <span class="weight-total" :class="{ 'weight-warning': totalWeightB !== 100 }">
              {{ totalWeightB }}%
            </span>
          </div>
          <div v-if="totalWeightB !== 100" class="weight-warning-text">
            <small>⚠️ Die Gesamtgewichtung sollte 100% betragen.</small>
          </div>
        </div>

        <!-- Add New Requirement Button -->
        <button 
          @click="addRequirement"
          class="add-requirement-btn"
          type="button"
        >
          + Neue Anforderung hinzufügen
        </button>

        <!-- Common Requirements Templates -->
        <div class="templates-section">
          <h4>Häufige Anforderungen (zum Hinzufügen anklicken):</h4>
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServiceRequirementsStep',
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
          name: 'Qualitätsstandards',
          text: 'Einhaltung der geltenden DIN-Normen und Qualitätsstandards',
          criteriaType: 'A',
          weight: null
        },
        {
          name: 'Termintreue',
          text: 'Pünktliche Lieferung/Fertigstellung zum vereinbarten Termin',
          criteriaType: 'B',
          weight: 20
        },
        {
          name: 'Nachhaltigkeit',
          text: 'Berücksichtigung ökologischer Aspekte und Nachhaltigkeit',
          criteriaType: 'B',
          weight: 15
        },
        {
          name: 'Gewährleistung',
          text: 'Mindestgewährleistung von 24 Monaten auf alle Leistungen',
          criteriaType: 'A',
          weight: null
        },
        {
          name: 'Dokumentation',
          text: 'Vollständige und verständliche Dokumentation der Leistung',
          criteriaType: 'B',
          weight: 10
        },
        {
          name: 'Support',
          text: 'Bereitstellung von Support und Wartungsleistungen',
          criteriaType: 'B',
          weight: 15
        }
      ]
    }
  },
  computed: {
    serviceRequirements() {
      return this.formData.serviceRequirements || [];
    },
    
    totalWeightB() {
      return this.serviceRequirements
        .filter(req => req.criteriaType === 'B' && req.weight)
        .reduce((sum, req) => sum + (req.weight || 0), 0);
    }
  },
  methods: {
    generateId() {
      return Date.now() + Math.random().toString(36).substr(2, 9);
    },

    addRequirement() {
      const newRequirement = {
        id: this.generateId(),
        text: '',
        criteriaType: '',
        weight: null
      };
      
      const updatedRequirements = [...this.serviceRequirements, newRequirement];
      this.updateField('serviceRequirements', updatedRequirements);
    },

    removeRequirement(index) {
      const updatedRequirements = this.serviceRequirements.filter((_, i) => i !== index);
      this.updateField('serviceRequirements', updatedRequirements);
    },

    updateRequirement(index, field, value) {
      const updatedRequirements = [...this.serviceRequirements];
      updatedRequirements[index][field] = value;
      
      // Reset weight if criteria type changes to A
      if (field === 'criteriaType' && value === 'A') {
        updatedRequirements[index].weight = null;
      }
      
      this.updateField('serviceRequirements', updatedRequirements);
    },

    addTemplate(template) {
      const newRequirement = {
        id: this.generateId(),
        text: template.text,
        criteriaType: template.criteriaType,
        weight: template.weight
      };
      
      const updatedRequirements = [...this.serviceRequirements, newRequirement];
      this.updateField('serviceRequirements', updatedRequirements);
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

.requirements-list {
  margin-bottom: 20px;
}

.requirement-item {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
}

.requirement-content {
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.requirement-number {
  font-weight: bold;
  color: var(--primary);
  min-width: 20px;
  margin-top: 8px;
}

.requirement-details {
  flex: 1;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.requirement-input,
.criteria-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.requirement-input {
  resize: vertical;
  min-height: 60px;
}

.requirement-input:focus,
.criteria-select:focus,
.weight-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.criteria-section {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 15px;
  align-items: end;
}

.weight-group {
  margin-bottom: 0;
}

.weight-input-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.weight-input {
  width: 80px;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 14px;
  text-align: right;
}

.weight-unit {
  color: #666;
  font-weight: 500;
}

.remove-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: #c82333;
}

.criteria-info {
  margin-top: 10px;
  padding: 10px;
  border-radius: 4px;
  font-size: 13px;
}

.criteria-info-content.criteria-a {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
}

.criteria-info-content.criteria-b {
  background: #e3f2fd;
  border: 1px solid #bbdefb;
  color: #1565c0;
}

.weight-summary {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
}

.weight-summary-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}

.weight-total {
  font-size: 16px;
  font-weight: bold;
  color: var(--primary);
}

.weight-total.weight-warning {
  color: #dc3545;
}

.weight-warning-text {
  margin-top: 8px;
  color: #dc3545;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-style: italic;
}

.add-requirement-btn {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 30px;
}

.add-requirement-btn:hover {
  background: #0052a3;
}

.templates-section {
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
}

.templates-section h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 15px;
}

.template-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.template-btn {
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

/* Responsive Design */
@media (max-width: 768px) {
  .requirement-content {
    flex-direction: column;
    gap: 10px;
  }

  .criteria-section {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .weight-summary-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .template-buttons {
    flex-direction: column;
  }

  .template-btn {
    width: 100%;
  }
}
</style>