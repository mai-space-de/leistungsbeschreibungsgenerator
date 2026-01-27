<template>
  <header class="header-bar">
    <h1 class="header-title">
      <span class="th-koeln">TH Köln</span>
      Leistungsbeschreibung Generator
    </h1>
    <div class="header-buttons">
      <button @click="$emit('restart')" class="btn btn-secondary">
        Neustarten
      </button>
      <button @click="$emit('export-pdf')" class="btn btn-success">
        Export PDF
      </button>
      <button @click="$emit('export-word')" class="btn btn-success">
        Export Word
      </button>
      <button @click="$emit('toggle-preview')" class="btn btn-primary">
        {{ showPreview ? 'Vorschau ausblenden' : 'Vorschau anzeigen' }}
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderBar',
  props: {
    showPreview: {
      type: Boolean,
      default: false
    }
  },
  emits: ['restart', 'export-pdf', 'export-word', 'toggle-preview']
}
</script>

<style scoped>
.header-bar {
  background: var(--primary);
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.th-koeln {
  font-weight: normal;
  margin-right: 0.5rem;
}

.header-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn:hover {
  background: #0052a3;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #6c757d;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-success {
  background: #28a745;
}

.btn-success:hover {
  background: #218838;
}

.btn-primary {
  background: #007bff;
}

.btn-primary:hover {
  background: #0056b3;
}

@media (max-width: 768px) {
  .header-bar {
    flex-direction: column;
    text-align: center;
    padding: 15px;
  }
  
  .header-title {
    margin-bottom: 15px;
    font-size: 1.3rem;
  }
  
  .header-buttons {
    justify-content: center;
  }
  
  .btn {
    font-size: 13px;
    padding: 6px 12px;
  }
}
</style>