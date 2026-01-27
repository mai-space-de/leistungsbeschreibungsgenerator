<template>
  <div id="app">
    <!-- Header Bar -->
    <HeaderBar 
      :show-preview="showPreview"
      @restart="restart"
      @export-pdf="exportPDF"
      @export-word="exportWord"
      @toggle-preview="togglePreview"
    />

    <!-- Main Content -->
    <main class="layout">
      <!-- Editor Column -->
      <div class="editor-col">
        <div id="error-box" class="alert alert-error" v-if="errorMessage">
          {{ errorMessage }}
        </div>

        <!-- Step Components -->
        <BasicDataStep 
          v-if="currentStep === 1"
          :form-data="formData"
          @update-field="updateField"
        />
        
        <ScopeStep 
          v-if="currentStep === 2"
          :form-data="formData"
          @update-field="updateField"
        />
        
        <TimelineResourcesStep 
          v-if="currentStep === 3"
          :form-data="formData"
          @update-field="updateField"
        />

        <!-- Navigation -->
        <StepNavigation 
          :current-step="currentStep"
          :total-steps="totalSteps"
          @previous-step="previousStep"
          @next-step="nextStep"
          @generate-document="generateDocument"
        />
      </div>

      <!-- Preview Column -->
      <DocumentPreview 
        v-if="showPreview"
        :form-data="formData"
        @close-preview="togglePreview"
      />
    </main>
  </div>
</template>

<script>
import HeaderBar from './components/HeaderBar.vue'
import BasicDataStep from './components/steps/BasicDataStep.vue'
import ScopeStep from './components/steps/ScopeStep.vue'
import TimelineResourcesStep from './components/steps/TimelineResourcesStep.vue'
import StepNavigation from './components/StepNavigation.vue'
import DocumentPreview from './components/DocumentPreview.vue'

export default {
  name: 'App',
  components: {
    HeaderBar,
    BasicDataStep,
    ScopeStep,
    TimelineResourcesStep,
    StepNavigation,
    DocumentPreview
  },
  data() {
    return {
      currentStep: 1,
      totalSteps: 3,
      showPreview: false,
      errorMessage: '',
      formData: {
        projectTitle: '',
        projectDescription: '',
        clientName: '',
        vergabeNr: '',
        category: 'bau',
        contractType: 'einzel',
        istZustand: '',
        scopeDescription: '',
        deliverables: '',
        zielZustand: '',
        leistungszeitraum: 'Nach Vereinbarung',
        startDate: '',
        endDate: '',
        resources: '',
        budget: '',
        milestones: ''
      }
    }
  },
  mounted() {
    this.loadFromLocalStorage();
  },
  methods: {
    updateField({ field, value }) {
      this.formData[field] = value;
      this.saveToLocalStorage();
    },
    
    saveToLocalStorage() {
      try {
        localStorage.setItem('leistungsbeschreibung-data', JSON.stringify(this.formData));
        this.clearError();
      } catch (error) {
        this.showError('Fehler beim Speichern der Daten');
        console.error('Fehler beim Speichern der Daten:', error);
      }
    },
    
    loadFromLocalStorage() {
      const savedData = localStorage.getItem('leistungsbeschreibung-data');
      if (savedData) {
        try {
          this.formData = { ...this.formData, ...JSON.parse(savedData) };
          this.clearError();
        } catch (error) {
          this.showError('Fehler beim Laden der gespeicherten Daten');
          console.error('Fehler beim Laden der gespeicherten Daten:', error);
        }
      }
    },
    
    restart() {
      if (confirm('Möchten Sie wirklich alle Eingaben löschen und von vorne beginnen?')) {
        localStorage.removeItem('leistungsbeschreibung-data');
        this.formData = {
          projectTitle: '',
          projectDescription: '',
          clientName: '',
          vergabeNr: '',
          category: 'bau',
          contractType: 'einzel',
          istZustand: '',
          scopeDescription: '',
          deliverables: '',
          zielZustand: '',
          leistungszeitraum: 'Nach Vereinbarung',
          startDate: '',
          endDate: '',
          resources: '',
          budget: '',
          milestones: ''
        };
        this.currentStep = 1;
        this.showPreview = false;
        this.clearError();
      }
    },
    
    togglePreview() {
      this.showPreview = !this.showPreview;
    },
    
    nextStep() {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    },
    
    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    
    exportPDF() {
      // TODO: Implement PDF export
      alert('PDF-Export wird implementiert...');
    },
    
    exportWord() {
      // TODO: Implement Word export
      alert('Word-Export wird implementiert...');
    },
    
    generateDocument() {
      this.showPreview = true;
      this.showError(''); // Clear any previous errors
      // You could add validation here
    },
    
    showError(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.clearError();
      }, 5000);
    },
    
    clearError() {
      this.errorMessage = '';
    }
  }
}
</script>

<style>
/* CSS Variables from test16.html */
:root {
  --primary: #0066cc;
  --secondary: #f8f9fa;
  --border: #ddd;
  --header-grey: #f2f2f2;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  color: #333;
  line-height: 1.5;
  margin: 0;
  padding: 0;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Layout from test16.html */
.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  flex: 1;
}

.editor-col {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 80vh;
  overflow-y: auto;
}

/* Alert Styles */
.alert {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.alert-error {
  background: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .layout {
    max-width: 100%;
    padding: 15px;
  }
}

@media (max-width: 968px) {
  .layout {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .editor-col {
    max-height: none;
    padding: 15px;
  }
}

@media (max-width: 768px) {
  .layout {
    padding: 10px;
  }
  
  .editor-col {
    padding: 15px;
  }
}
</style>