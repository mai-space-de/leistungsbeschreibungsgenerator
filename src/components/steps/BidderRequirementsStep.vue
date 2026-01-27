<template>
  <div class="card">
    <div class="card-header">3. Anforderungen an die Eignung des Bieters</div>
    <div class="card-content">
      <div class="requirements-section">
        <div class="section-description">
          <p>Definieren Sie hier die Kriterien und Anforderungen, die Bieter erfüllen müssen, um für den Auftrag geeignet zu sein.</p>
        </div>

        <!-- Requirements List -->
        <div v-if="bidderRequirements.length > 0" class="requirements-list">
          <div 
            v-for="(requirement, index) in bidderRequirements" 
            :key="requirement.id"
            class="requirement-item"
          >
            <div class="requirement-header">
              <div class="requirement-title">
                <span class="requirement-number">{{ index + 1 }}.</span>
                <input
                  type="text"
                  :value="requirement.criterion"
                  @input="updateRequirement(index, 'criterion', $event.target.value)"
                  placeholder="Kriterium (z.B. Fachkunde, Zuverlässigkeit, etc.)"
                  class="criterion-input"
                />
              </div>
              <button 
                @click="removeRequirement(index)"
                class="remove-btn"
                type="button"
                title="Anforderung entfernen"
              >
                ×
              </button>
            </div>

            <!-- Sub-requirements for this criterion -->
            <div class="sub-requirements">
              <div 
                v-for="(subReq, subIndex) in requirement.requirements" 
                :key="subReq.id"
                class="sub-requirement"
              >
                <textarea
                  :value="subReq.text"
                  @input="updateSubRequirement(index, subIndex, $event.target.value)"
                  placeholder="Detaillierte Anforderung..."
                  rows="2"
                  class="sub-requirement-input"
                ></textarea>
                <button 
                  @click="removeSubRequirement(index, subIndex)"
                  class="remove-sub-btn"
                  type="button"
                  title="Anforderung entfernen"
                >
                  ×
                </button>
              </div>
              
              <button 
                @click="addSubRequirement(index)"
                class="add-sub-btn"
                type="button"
              >
                + Anforderung hinzufügen
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <p>Noch keine Anforderungen definiert.</p>
        </div>

        <!-- Add New Requirement Button -->
        <button 
          @click="addRequirement"
          class="add-requirement-btn"
          type="button"
        >
          + Neues Kriterium hinzufügen
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
  name: 'BidderRequirementsStep',
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
          name: 'Fachkunde',
          criterion: 'Fachkunde',
          requirements: [
            'Nachweis der erforderlichen Fachkenntnisse durch entsprechende Qualifikationen',
            'Mindestens 3 Jahre Erfahrung in vergleichbaren Projekten'
          ]
        },
        {
          name: 'Zuverlässigkeit',
          criterion: 'Zuverlässigkeit',
          requirements: [
            'Keine Insolvenzverfahren in den letzten 3 Jahren',
            'Vorlage aktueller Unbedenklichkeitsbescheinigungen'
          ]
        },
        {
          name: 'Leistungsfähigkeit',
          criterion: 'Leistungsfähigkeit',
          requirements: [
            'Nachweis ausreichender personeller Kapazitäten',
            'Nachweis technischer Ausstattung für die Leistungserbringung'
          ]
        },
        {
          name: 'Referenzen',
          criterion: 'Referenzen',
          requirements: [
            'Mindestens 3 Referenzen vergleichbarer Projekte der letzten 5 Jahre',
            'Kontaktdaten der Referenzgeber zur Nachprüfung'
          ]
        }
      ]
    }
  },
  computed: {
    bidderRequirements() {
      return this.formData.bidderRequirements || [];
    }
  },
  methods: {
    generateId() {
      return Date.now() + Math.random().toString(36).substr(2, 9);
    },

    addRequirement() {
      const newRequirement = {
        id: this.generateId(),
        criterion: '',
        requirements: [{
          id: this.generateId(),
          text: ''
        }]
      };
      
      const updatedRequirements = [...this.bidderRequirements, newRequirement];
      this.updateField('bidderRequirements', updatedRequirements);
    },

    removeRequirement(index) {
      const updatedRequirements = this.bidderRequirements.filter((_, i) => i !== index);
      this.updateField('bidderRequirements', updatedRequirements);
    },

    updateRequirement(index, field, value) {
      const updatedRequirements = [...this.bidderRequirements];
      updatedRequirements[index][field] = value;
      this.updateField('bidderRequirements', updatedRequirements);
    },

    addSubRequirement(requirementIndex) {
      const updatedRequirements = [...this.bidderRequirements];
      updatedRequirements[requirementIndex].requirements.push({
        id: this.generateId(),
        text: ''
      });
      this.updateField('bidderRequirements', updatedRequirements);
    },

    removeSubRequirement(requirementIndex, subIndex) {
      const updatedRequirements = [...this.bidderRequirements];
      updatedRequirements[requirementIndex].requirements = 
        updatedRequirements[requirementIndex].requirements.filter((_, i) => i !== subIndex);
      this.updateField('bidderRequirements', updatedRequirements);
    },

    updateSubRequirement(requirementIndex, subIndex, value) {
      const updatedRequirements = [...this.bidderRequirements];
      updatedRequirements[requirementIndex].requirements[subIndex].text = value;
      this.updateField('bidderRequirements', updatedRequirements);
    },

    addTemplate(template) {
      const newRequirement = {
        id: this.generateId(),
        criterion: template.criterion,
        requirements: template.requirements.map(req => ({
          id: this.generateId(),
          text: req
        }))
      };
      
      const updatedRequirements = [...this.bidderRequirements, newRequirement];
      this.updateField('bidderRequirements', updatedRequirements);
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

.requirement-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.requirement-title {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.requirement-number {
  font-weight: bold;
  color: var(--primary);
  min-width: 20px;
}

.criterion-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
}

.remove-btn {
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
  font-size: 16px;
  line-height: 1;
}

.remove-btn:hover {
  background: #c82333;
}

.sub-requirements {
  margin-left: 30px;
}

.sub-requirement {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
}

.sub-requirement-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 40px;
}

.sub-requirement-input:focus,
.criterion-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.remove-sub-btn {
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 3px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  margin-top: 2px;
}

.remove-sub-btn:hover {
  background: #545b62;
}

.add-sub-btn {
  background: transparent;
  color: var(--primary);
  border: 1px dashed var(--primary);
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 13px;
  margin-top: 5px;
}

.add-sub-btn:hover {
  background: rgba(0, 102, 204, 0.05);
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
  .requirement-header {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .requirement-title {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .remove-btn {
    align-self: flex-end;
  }

  .sub-requirements {
    margin-left: 0;
  }

  .template-buttons {
    flex-direction: column;
  }

  .template-btn {
    width: 100%;
  }
}
</style>