<template>
  <div class="card">
    <div class="card-header">7. Anlagen</div>
    <div class="card-content">
      <div class="attachments-section">
        <div class="section-description">
          <p>Fügen Sie hier alle relevanten Dokumente und Anlagen hinzu, die Teil der Ausschreibungsunterlagen werden sollen.</p>
        </div>

        <!-- Attachments List -->
        <div v-if="attachments.length > 0" class="attachments-list">
          <div 
            v-for="(attachment, index) in attachments" 
            :key="attachment.id"
            class="attachment-item"
          >
            <div class="attachment-content">
              <div class="attachment-number">{{ index + 1 }}.</div>
              
              <div class="attachment-details">
                <div class="form-group">
                  <label :for="`attachment-name-${index}`">Dokumentenname:</label>
                  <input
                    :id="`attachment-name-${index}`"
                    type="text"
                    :value="attachment.name"
                    @input="updateAttachment(index, 'name', $event.target.value)"
                    placeholder="z.B. Technische Spezifikation, Grundriss, etc."
                    class="attachment-input"
                  />
                </div>

                <div class="form-group">
                  <label :for="`attachment-description-${index}`">Beschreibung (optional):</label>
                  <textarea
                    :id="`attachment-description-${index}`"
                    :value="attachment.description"
                    @input="updateAttachment(index, 'description', $event.target.value)"
                    placeholder="Kurze Beschreibung des Dokuments..."
                    rows="2"
                    class="attachment-description"
                  ></textarea>
                </div>

                <div class="form-group">
                  <label :for="`attachment-type-${index}`">Dokumententyp:</label>
                  <select
                    :id="`attachment-type-${index}`"
                    :value="attachment.type"
                    @change="updateAttachment(index, 'type', $event.target.value)"
                    class="attachment-type-select"
                  >
                    <option value="">Bitte wählen...</option>
                    <option value="technical">Technische Spezifikation</option>
                    <option value="drawing">Zeichnung/Grundriss</option>
                    <option value="photo">Foto/Bildmaterial</option>
                    <option value="contract">Vertragsbedingungen</option>
                    <option value="reference">Referenzdokument</option>
                    <option value="checklist">Checkliste/Formular</option>
                    <option value="other">Sonstiges</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="checkbox-group">
                    <input 
                      type="checkbox"
                      :checked="attachment.required"
                      @change="updateAttachment(index, 'required', $event.target.checked)"
                    />
                    <span class="checkbox-label">Pflichtdokument (muss von Bietern beachtet werden)</span>
                  </label>
                </div>
              </div>

              <button 
                @click="removeAttachment(index)"
                class="remove-btn"
                type="button"
                title="Anlage entfernen"
              >
                ×
              </button>
            </div>

            <!-- Type-specific info -->
            <div v-if="attachment.type" class="type-info">
              <div class="type-info-content">
                <span class="type-badge" :class="`type-${attachment.type}`">
                  {{ getTypeLabel(attachment.type) }}
                </span>
                <span v-if="attachment.required" class="required-badge">Pflicht</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <div class="empty-icon">📄</div>
          <p>Noch keine Anlagen hinzugefügt.</p>
          <small>Klicken Sie auf "Neue Anlage hinzufügen" um zu beginnen.</small>
        </div>

        <!-- Add New Attachment Button -->
        <button 
          @click="addAttachment"
          class="add-attachment-btn"
          type="button"
        >
          + Neue Anlage hinzufügen
        </button>

        <!-- Quick Add Templates -->
        <div class="templates-section">
          <h4>Häufige Anlagen (zum Hinzufügen anklicken):</h4>
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

        <!-- Attachment Summary -->
        <div v-if="attachments.length > 0" class="attachment-summary">
          <div class="summary-content">
            <div class="summary-item">
              <span class="summary-label">Anlagen gesamt:</span>
              <span class="summary-value">{{ attachments.length }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Pflichtdokumente:</span>
              <span class="summary-value">{{ requiredAttachmentsCount }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Optionale Dokumente:</span>
              <span class="summary-value">{{ optionalAttachmentsCount }}</span>
            </div>
          </div>
        </div>

        <!-- Export Functionality -->
        <div class="export-section">
          <h4>Anlagenliste exportieren:</h4>
          <div class="export-buttons">
            <button 
              @click="exportAttachmentsList"
              class="export-btn"
              type="button"
              :disabled="attachments.length === 0"
            >
              Liste als Text exportieren
            </button>
          </div>
        </div>

        <!-- Help Section -->
        <div class="help-section">
          <h4>Hinweise zu Anlagen:</h4>
          <ul class="help-list">
            <li>Geben Sie aussagekräftige Namen für die Dokumente an</li>
            <li>Markieren Sie wichtige Dokumente als Pflichtdokumente</li>
            <li>Verwenden Sie Beschreibungen um den Inhalt zu erläutern</li>
            <li>Sortieren Sie die Anlagen nach Wichtigkeit (wichtigste zuerst)</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AttachmentsStep',
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
          name: 'Technische Spezifikation',
          description: 'Detaillierte technische Anforderungen',
          type: 'technical',
          required: true
        },
        {
          name: 'Zeichnungen/Grundrisse',
          description: 'Pläne und technische Zeichnungen',
          type: 'drawing',
          required: true
        },
        {
          name: 'Referenzliste',
          description: 'Liste vergleichbarer Projekte',
          type: 'reference',
          required: false
        },
        {
          name: 'Vertragsbedingungen',
          description: 'Allgemeine Vertragsbedingungen',
          type: 'contract',
          required: true
        },
        {
          name: 'Checkliste Angebot',
          description: 'Checkliste für die Angebotserstellung',
          type: 'checklist',
          required: false
        },
        {
          name: 'Fotos Ist-Zustand',
          description: 'Bildmaterial zum aktuellen Zustand',
          type: 'photo',
          required: false
        }
      ]
    }
  },
  computed: {
    attachments() {
      return this.formData.attachments || [];
    },
    
    requiredAttachmentsCount() {
      return this.attachments.filter(att => att.required).length;
    },
    
    optionalAttachmentsCount() {
      return this.attachments.filter(att => !att.required).length;
    }
  },
  methods: {
    generateId() {
      return Date.now() + Math.random().toString(36).substr(2, 9);
    },

    addAttachment() {
      const newAttachment = {
        id: this.generateId(),
        name: '',
        description: '',
        type: '',
        required: false
      };
      
      const updatedAttachments = [...this.attachments, newAttachment];
      this.updateField('attachments', updatedAttachments);
    },

    removeAttachment(index) {
      const updatedAttachments = this.attachments.filter((_, i) => i !== index);
      this.updateField('attachments', updatedAttachments);
    },

    updateAttachment(index, field, value) {
      const updatedAttachments = [...this.attachments];
      updatedAttachments[index][field] = value;
      this.updateField('attachments', updatedAttachments);
    },

    addTemplate(template) {
      const newAttachment = {
        id: this.generateId(),
        name: template.name,
        description: template.description,
        type: template.type,
        required: template.required
      };
      
      const updatedAttachments = [...this.attachments, newAttachment];
      this.updateField('attachments', updatedAttachments);
    },

    getTypeLabel(type) {
      const labels = {
        'technical': 'Technisch',
        'drawing': 'Zeichnung',
        'photo': 'Foto',
        'contract': 'Vertrag',
        'reference': 'Referenz',
        'checklist': 'Checkliste',
        'other': 'Sonstiges'
      };
      return labels[type] || type;
    },

    exportAttachmentsList() {
      const lines = [
        'Anlagenliste:',
        '=' .repeat(50),
        ''
      ];
      
      this.attachments.forEach((attachment, index) => {
        lines.push(`${index + 1}. ${attachment.name}`);
        if (attachment.description) {
          lines.push(`   Beschreibung: ${attachment.description}`);
        }
        if (attachment.type) {
          lines.push(`   Typ: ${this.getTypeLabel(attachment.type)}`);
        }
        if (attachment.required) {
          lines.push(`   ⚠️ Pflichtdokument`);
        }
        lines.push('');
      });
      
      lines.push('');
      lines.push(`Zusammenfassung:`);
      lines.push(`- Anlagen gesamt: ${this.attachments.length}`);
      lines.push(`- Pflichtdokumente: ${this.requiredAttachmentsCount}`);
      lines.push(`- Optionale Dokumente: ${this.optionalAttachmentsCount}`);
      
      const content = lines.join('\n');
      
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', 'anlagenliste.txt');
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

.attachments-list {
  margin-bottom: 20px;
}

.attachment-item {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
}

.attachment-content {
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.attachment-number {
  font-weight: bold;
  color: var(--primary);
  min-width: 20px;
  margin-top: 8px;
}

.attachment-details {
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

.attachment-input,
.attachment-description,
.attachment-type-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.attachment-description {
  resize: vertical;
  min-height: 50px;
}

.attachment-input:focus,
.attachment-description:focus,
.attachment-type-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 0 !important;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.checkbox-label {
  font-weight: normal;
  margin: 0;
  cursor: pointer;
  line-height: 1.4;
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

.type-info {
  margin-top: 10px;
}

.type-info-content {
  display: flex;
  gap: 8px;
  align-items: center;
}

.type-badge {
  background: #e9ecef;
  color: #495057;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.type-badge.type-technical { background: #e3f2fd; color: #1565c0; }
.type-badge.type-drawing { background: #f3e5f5; color: #7b1fa2; }
.type-badge.type-photo { background: #e8f5e8; color: #388e3c; }
.type-badge.type-contract { background: #fff3e0; color: #f57c00; }
.type-badge.type-reference { background: #fce4ec; color: #c2185b; }
.type-badge.type-checklist { background: #f1f8e9; color: #689f38; }

.required-badge {
  background: #ffcdd2;
  color: #d32f2f;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  margin: 0 0 8px 0;
  font-size: 16px;
}

.empty-state small {
  color: #999;
}

.add-attachment-btn {
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

.add-attachment-btn:hover {
  background: #0052a3;
}

.templates-section,
.export-section,
.help-section {
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
  margin-bottom: 20px;
}

.templates-section h4,
.export-section h4,
.help-section h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 15px;
}

.template-buttons,
.export-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.template-btn,
.export-btn {
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

.export-btn {
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.export-btn:hover:not(:disabled) {
  background: #218838;
}

.export-btn:disabled {
  background: #6c757d;
  border-color: #6c757d;
  cursor: not-allowed;
}

.attachment-summary {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
}

.summary-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  font-weight: 500;
  color: #333;
}

.summary-value {
  font-weight: bold;
  color: var(--primary);
  background: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 14px;
}

.help-list {
  margin: 0;
  padding-left: 20px;
  color: #666;
  font-size: 14px;
}

.help-list li {
  margin-bottom: 8px;
  line-height: 1.4;
}

/* Responsive Design */
@media (max-width: 768px) {
  .attachment-content {
    flex-direction: column;
    gap: 10px;
  }
  
  .summary-content {
    grid-template-columns: 1fr;
  }
  
  .template-buttons,
  .export-buttons {
    flex-direction: column;
  }
  
  .template-btn,
  .export-btn {
    width: 100%;
  }
}
</style>