<template>
  <div class="card">
    <div class="card-header">1. Nutzerrolle und Grunddaten</div>
    <div class="card-content">
      <!-- User Role Selection -->
      <div class="form-group">
        <label class="section-label">Ich arbeite in:</label>
        <div class="radio-group">
          <div class="radio-option">
            <input 
              type="radio" 
              id="role-fachabteilung" 
              value="fachabteilung"
              :checked="formData.userRole === 'fachabteilung'"
              @change="updateField('userRole', $event.target.value)"
            />
            <label for="role-fachabteilung">Fachabteilung</label>
          </div>
          <div class="radio-option">
            <input 
              type="radio" 
              id="role-einkauf" 
              value="einkauf"
              :checked="formData.userRole === 'einkauf'"
              @change="updateField('userRole', $event.target.value)"
            />
            <label for="role-einkauf">Einkauf</label>
          </div>
        </div>
      </div>

      <!-- Project Title -->
      <div class="form-group">
        <label for="project-title">
          Titel der Leistungsbeschreibung:
          <span class="tooltip-wrapper">
            <span class="tooltip-icon">?</span>
            <span class="tooltip-text">z.B. Instandsetzung der Fassade oder Lieferung von Labormöbeln</span>
          </span>
        </label>
        <input 
          type="text" 
          id="project-title" 
          :value="formData.projectTitle"
          @input="updateField('projectTitle', $event.target.value)"
          placeholder="Geben Sie den Titel der Leistungsbeschreibung ein"
        />
      </div>

      <!-- Vergabe Number (only for Einkauf) -->
      <div v-if="formData.userRole === 'einkauf'" class="form-group">
        <label for="vergabe-nr">Vergabenummer:</label>
        <input 
          type="text" 
          id="vergabe-nr" 
          :value="formData.vergabeNr"
          @input="updateField('vergabeNr', $event.target.value)"
          placeholder="z.B. 2024-001"
        />
      </div>

      <!-- Service Type -->
      <div class="form-group">
        <label for="service-type">Leistungsart:</label>
        <select 
          id="service-type" 
          :value="formData.serviceType"
          @change="updateField('serviceType', $event.target.value)"
        >
          <option value="">Bitte wählen...</option>
          <option value="vob">Bauleistung (VOB)</option>
          <option value="vol">Liefer-/Dienstleistung (VOL)</option>
        </select>
      </div>

      <!-- Contract Form -->
      <div class="form-group">
        <label for="contract-form">
          Vertragsform:
          <span class="tooltip-wrapper">
            <span class="tooltip-icon">?</span>
            <span class="tooltip-text">
              <strong>Einzelauftrag:</strong> Ein einmaliger Auftrag mit klar definiertem Umfang und Zeitpunkt. Beispiel: Eine einzelne Lieferung von 100 Stühlen.<br><br>
              <strong>Rahmenvereinbarung:</strong> Eine längerfristige Vereinbarung mit festen Konditionen für mehrere Abrufe. Beispiel: Über 2 Jahre hinweg regelmäßig Stühle zu vereinbarten Preisen bestellen.
            </span>
          </span>
        </label>
        <select 
          id="contract-form" 
          :value="formData.contractForm"
          @change="updateField('contractForm', $event.target.value)"
        >
          <option value="">Bitte wählen...</option>
          <option value="einzelauftrag">Einzelauftrag</option>
          <option value="rahmenvereinbarung">Rahmenvereinbarung</option>
        </select>
      </div>

      <!-- Location (Ist-Zustand) -->
      <div class="form-group">
        <label for="location">
          Leistungsort:
          <span class="tooltip-wrapper">
            <span class="tooltip-icon">?</span>
            <span class="tooltip-text">z.B. Campus Deutz</span>
          </span>
        </label>
        <input 
          type="text" 
          id="location" 
          :value="formData.location"
          @input="updateField('location', $event.target.value)"
          placeholder="Geben Sie den Leistungsort ein"
        />
      </div>

      <!-- Current Situation Description -->
      <div class="form-group">
        <label for="current-situation">
          Beschreibung der aktuellen Situation:
          <span class="tooltip-wrapper">
            <span class="tooltip-icon">?</span>
            <span class="tooltip-text">Kurze Beschreibung des Projekts, bzw. Vorhabens in dessen Rahmen die Leistung benötigt wird.</span>
          </span>
        </label>
        <textarea 
          id="current-situation" 
          :value="formData.currentSituation"
          @input="updateField('currentSituation', $event.target.value)"
          placeholder="Beschreiben Sie die aktuelle Situation..."
          rows="4"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserRoleStep',
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

.section-label {
  display: block;
  margin-bottom: 12px;
  font-weight: 600;
  color: #333;
  font-size: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
  position: relative;
}

.radio-group {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.radio-option input[type="radio"] {
  margin: 0;
  width: auto;
}

.radio-option label {
  margin: 0;
  font-weight: normal;
  cursor: pointer;
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

/* Tooltip Styles */
.tooltip-wrapper {
  position: relative;
  display: inline-block;
  margin-left: 5px;
}

.tooltip-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  font-size: 10px;
  font-weight: bold;
  cursor: help;
  line-height: 1;
}

.tooltip-text {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: normal;
  white-space: nowrap;
  z-index: 1000;
  transition: opacity 0.3s, visibility 0.3s;
  max-width: 300px;
  white-space: normal;
  line-height: 1.4;
}

.tooltip-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #333;
}

.tooltip-wrapper:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

/* Responsive Design */
@media (max-width: 768px) {
  .radio-group {
    flex-direction: column;
    gap: 12px;
  }
  
  .tooltip-text {
    max-width: 250px;
    left: 0;
    transform: none;
  }
  
  .tooltip-text::after {
    left: 20px;
    transform: none;
  }
}
</style>