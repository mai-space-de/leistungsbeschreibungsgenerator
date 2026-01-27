<template>
  <div class="card">
    <div class="card-header">3. Termine und Ressourcen</div>
    <div class="card-content">
      <div class="form-group">
        <label for="start-date">Projektstart:</label>
        <input 
          type="date" 
          id="start-date" 
          :value="formData.startDate"
          @input="updateField('startDate', $event.target.value)"
        />
      </div>
      
      <div class="form-group">
        <label for="end-date">Projektende:</label>
        <input 
          type="date" 
          id="end-date" 
          :value="formData.endDate"
          @input="updateField('endDate', $event.target.value)"
        />
      </div>
      
      <div class="form-group">
        <label for="resources">Benötigte Ressourcen:</label>
        <textarea 
          id="resources" 
          :value="formData.resources"
          @input="updateField('resources', $event.target.value)"
          placeholder="Beschreiben Sie die benötigten Ressourcen"
          rows="4"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="budget">Budget (optional):</label>
        <input 
          type="text" 
          id="budget" 
          :value="formData.budget"
          @input="updateField('budget', $event.target.value)"
          placeholder="Geschätztes Budget"
        />
      </div>

      <div class="form-group">
        <label for="milestones">Wichtige Meilensteine:</label>
        <textarea 
          id="milestones" 
          :value="formData.milestones"
          @input="updateField('milestones', $event.target.value)"
          placeholder="Beschreiben Sie wichtige Projektmeilensteine"
          rows="4"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimelineResourcesStep',
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
</style>