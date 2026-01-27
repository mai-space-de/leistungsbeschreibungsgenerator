<template>
  <div class="preview-panel">
    <div class="preview-header">
      <h3>Vorschau</h3>
      <button @click="$emit('close-preview')" class="close-preview-btn">&times;</button>
    </div>
    
    <div class="preview-content">
      <div class="document-page">
        <div class="page-number">Seite 1</div>
        
        <h1 class="document-title">
          {{ formData.projectTitle || 'Projekttitel' }}
        </h1>
        
        <div v-if="formData.vergabeNr" class="vergabe-nummer">
          Vergabenummer: {{ formData.vergabeNr }}
        </div>

        <section v-if="formData.category || formData.contractType" class="grunddaten">
          <h2>Grundkonfiguration</h2>
          <div class="config-grid">
            <div v-if="formData.category">
              <strong>Kategorie:</strong> {{ getCategoryText(formData.category) }}
            </div>
            <div v-if="formData.contractType">
              <strong>Vertragsart:</strong> {{ getContractTypeText(formData.contractType) }}
            </div>
          </div>
        </section>
        
        <section v-if="formData.projectDescription" class="section">
          <h2>1. Projektbeschreibung</h2>
          <p>{{ formData.projectDescription }}</p>
        </section>
        
        <section v-if="formData.clientName" class="section">
          <h2>2. Auftraggeber</h2>
          <p>{{ formData.clientName }}</p>
        </section>

        <section v-if="formData.istZustand" class="section">
          <h2>3. Ist-Zustand</h2>
          <p>{{ formData.istZustand }}</p>
        </section>
        
        <section v-if="formData.scopeDescription" class="section">
          <h2>4. Leistungsumfang</h2>
          <p>{{ formData.scopeDescription }}</p>
        </section>
        
        <section v-if="formData.deliverables" class="section">
          <h2>5. Liefergegenstände</h2>
          <p>{{ formData.deliverables }}</p>
        </section>

        <section v-if="formData.zielZustand" class="section">
          <h2>6. Ziel-Zustand</h2>
          <p>{{ formData.zielZustand }}</p>
        </section>

        <section v-if="formData.leistungszeitraum" class="section">
          <h2>7. Leistungszeitraum</h2>
          <p>{{ formData.leistungszeitraum }}</p>
        </section>
        
        <section v-if="formData.startDate || formData.endDate" class="section">
          <h2>8. Projektzeitraum</h2>
          <div v-if="formData.startDate" class="date-info">
            <strong>Start:</strong> {{ formatDate(formData.startDate) }}
          </div>
          <div v-if="formData.endDate" class="date-info">
            <strong>Ende:</strong> {{ formatDate(formData.endDate) }}
          </div>
        </section>
        
        <section v-if="formData.resources" class="section">
          <h2>9. Benötigte Ressourcen</h2>
          <p>{{ formData.resources }}</p>
        </section>

        <section v-if="formData.budget" class="section">
          <h2>10. Budget</h2>
          <p>{{ formData.budget }}</p>
        </section>

        <section v-if="formData.milestones" class="section">
          <h2>11. Meilensteine</h2>
          <p>{{ formData.milestones }}</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DocumentPreview',
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  emits: ['close-preview'],
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('de-DE');
    },
    
    getCategoryText(category) {
      const categories = {
        'bau': 'Bauleistung',
        'dienst': 'Dienstleistung',
        'it': 'IT / Software'
      };
      return categories[category] || category;
    },
    
    getContractTypeText(contractType) {
      const types = {
        'einzel': 'Einzelauftrag',
        'rahmen': 'Rahmenvertrag'
      };
      return types[contractType] || contractType;
    }
  }
}
</script>

<style scoped>
.preview-panel {
  flex: 0 0 40%;
  background: #ffffff;
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.preview-header {
  padding: 15px 20px;
  background: var(--secondary);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-header h3 {
  color: var(--primary);
  font-size: 1.2rem;
  margin: 0;
  font-weight: bold;
}

.close-preview-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0.25rem;
  line-height: 1;
  transition: color 0.2s ease;
}

.close-preview-btn:hover {
  color: #dc3545;
}

.preview-content {
  flex: 1;
  overflow-y: auto;
  max-height: 80vh;
  border: 1px solid var(--border);
}

.document-page {
  background: white;
  padding: 25mm;
  margin: 0;
  min-height: 297mm;
  width: 100%;
  position: relative;
  font-size: 10pt;
  line-height: 1.4;
  font-family: "Arial", sans-serif;
}

.page-number {
  position: absolute;
  bottom: 15mm;
  right: 25mm;
  font-size: 9pt;
  color: #666;
}

.document-title {
  font-family: "Arial", sans-serif;
  font-size: 16pt;
  margin-top: 0;
  margin-bottom: 20pt;
  text-align: center;
  font-weight: bold;
  color: #000;
}

.vergabe-nummer {
  text-align: center;
  margin-bottom: 20pt;
  font-size: 11pt;
  color: #666;
}

.section {
  margin-bottom: 20pt;
}

.grunddaten {
  margin-bottom: 20pt;
}

.config-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10pt;
  margin-top: 8pt;
}

.config-grid div {
  font-size: 10pt;
}

.section h2,
.grunddaten h2 {
  font-family: "Arial", sans-serif;
  font-size: 12pt;
  margin-top: 16pt;
  margin-bottom: 8pt;
  font-weight: bold;
  color: #000;
  border-bottom: 1px solid #ddd;
  padding-bottom: 4pt;
}

.section p,
.grunddaten p {
  line-height: 1.6;
  text-align: justify;
  margin-bottom: 8pt;
  font-size: 10pt;
  color: #333;
}

.date-info {
  margin-bottom: 6pt;
  font-size: 10pt;
}

.date-info strong {
  color: #000;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .preview-panel {
    flex: 0 0 45%;
  }
}

@media (max-width: 968px) {
  .preview-panel {
    flex: none;
    height: 40vh;
    border-left: none;
    border-top: 1px solid var(--border);
  }
  
  .document-page {
    padding: 15mm;
    font-size: 9pt;
  }
  
  .document-title {
    font-size: 14pt;
  }
  
  .section h2,
  .grunddaten h2 {
    font-size: 11pt;
  }
}
</style>