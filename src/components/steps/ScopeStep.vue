<template>
  <div class="card">
    <div class="card-header">Legacy: Leistungsumfang (zusätzlich)</div>
    <div class="card-content">
      <div class="info-box">
        <strong>Hinweis:</strong> Diese Felder sind als zusätzliche Ergänzung gedacht. Die wichtigsten Informationen wurden bereits in den vorherigen Schritten erfasst.
      </div>
      
      <div class="form-group">
        <label for="ist-zustand">Ist-Zustand (Punkt 1):</label>
        <textarea 
          id="ist-zustand" 
          :value="formData.currentSituation"
          @input="updateField('currentSituation', $event.target.value)"
          placeholder="Beschreibung der aktuellen Situation..."
          rows="4"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="scope-description">Detaillierte Leistungsbeschreibung:</label>
        <textarea 
          id="scope-description" 
          :value="formData.scopeDescription"
          @input="updateField('scopeDescription', $event.target.value)"
          placeholder="Beschreiben Sie den detaillierten Leistungsumfang"
          rows="6"
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="deliverables">Liefergegenstände:</label>
        <textarea 
          id="deliverables" 
          :value="formData.deliverables"
          @input="updateField('deliverables', $event.target.value)"
          placeholder="Listen Sie die zu erbringenden Liefergegenstände auf"
          rows="4"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="ziel-zustand">Ziel-Zustand (Punkt 3):</label>
        <textarea 
          id="ziel-zustand" 
          :value="formData.targetState"
          @input="updateField('targetState', $event.target.value)"
          placeholder="Beschreibung des gewünschten Ergebnisses..."
          rows="4"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="leistungszeitraum">Leistungszeitraum:</label>
        <input 
          type="text" 
          id="leistungszeitraum" 
          :value="formData.servicePeriod"
          @input="updateField('servicePeriod', $event.target.value)"
          placeholder="Nach Vereinbarung"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScopeStep',
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
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.info-box {
  background: #e3f2fd;
  border: 1px solid #bbdefb;
  color: #1565c0;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
}
</style>