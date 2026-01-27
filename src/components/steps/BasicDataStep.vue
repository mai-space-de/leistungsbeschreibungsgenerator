<template>
  <div class="card">
    <div class="card-header">1. Grunddaten des Projekts</div>
    <div class="card-content">
      <div class="form-group">
        <label for="project-title">Projekttitel:</label>
        <input 
          type="text" 
          id="project-title" 
          :value="formData.projectTitle"
          @input="updateField('projectTitle', $event.target.value)"
          placeholder="Geben Sie den Projekttitel ein"
        />
      </div>
      
      <div class="form-group">
        <label for="project-description">Projektbeschreibung:</label>
        <textarea 
          id="project-description" 
          :value="formData.projectDescription"
          @input="updateField('projectDescription', $event.target.value)"
          placeholder="Beschreiben Sie das Projekt kurz"
          rows="4"
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="client-name">Auftraggeber:</label>
        <input 
          type="text" 
          id="client-name" 
          :value="formData.clientName"
          @input="updateField('clientName', $event.target.value)"
          placeholder="Name des Auftraggebers"
        />
      </div>

      <div class="form-group">
        <label for="vergabe-nr">Vergabenummer:</label>
        <input 
          type="text" 
          id="vergabe-nr" 
          :value="formData.vergabeNr"
          @input="updateField('vergabeNr', $event.target.value)"
          placeholder="z.B. 2024-001"
        />
      </div>

      <div class="form-group">
        <label for="category">Kategorie:</label>
        <select 
          id="category" 
          :value="formData.category"
          @change="updateField('category', $event.target.value)"
        >
          <option value="bau">Bauleistung</option>
          <option value="dienst">Dienstleistung</option>
          <option value="it">IT / Software</option>
        </select>
      </div>

      <div class="form-group">
        <label for="contract-type">Vertragsart:</label>
        <select 
          id="contract-type" 
          :value="formData.contractType"
          @change="updateField('contractType', $event.target.value)"
        >
          <option value="einzel">Einzelauftrag</option>
          <option value="rahmen">Rahmenvertrag</option>
        </select>
      </div>

      <div v-if="formData.category === 'it'" class="alert alert-info">
        <strong>IT-Hinweis:</strong> Bei IT-Beschaffungen gelten besondere Regelungen.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasicDataStep',
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  emits: ['update-field'],
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

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.alert {
  background: #d1ecf1;
  border: 1px solid #bee5eb;
  color: #0c5460;
  padding: 12px;
  border-radius: 4px;
  margin-top: 15px;
}

.alert-info {
  background: #d1ecf1;
  border-color: #bee5eb;
  color: #0c5460;
}
</style>