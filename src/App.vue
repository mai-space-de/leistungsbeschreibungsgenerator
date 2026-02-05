<template>
  <div id="app">
    <!-- Header Bar -->
    <HeaderBar
      :show-preview="showPreview"
      @restart="restart"
      @export-pdf="exportPDF"
      @export-word="exportWord"
      @toggle-preview="togglePreview"
      @height-changed="onHeaderHeightChanged"
    />

    <!-- Main Content -->
    <main class="layout" :class="{ 'with-preview': showPreview }">
      <!-- Editor Column -->
      <div class="editor-col">
        <div id="message-box" :class="['alert', messageType === 'success' ? 'alert-success' : 'alert-error']" v-if="errorMessage">
          {{ errorMessage }}
        </div>

        <!-- Progress Bar -->
        <ProgressBar
          :current-step="currentStep"
          :total-steps="totalSteps"
          :form-data="formData"
        />

        <!-- Step Header -->
        <StepHeader
          :current-step="currentStep"
          :total-steps="totalSteps"
          :form-data="formData"
        />

        <!-- Step Components -->
        <div class="step-content">
          <UserRoleStep
            v-if="currentStep === 1"
            :form-data="formData"
            @update-field="updateField"
          />

          <ServiceDefinitionStep
            v-if="currentStep === 2"
            :form-data="formData"
            @update-field="updateField"
          />

          <BidderRequirementsStep
            v-if="currentStep === 3"
            :form-data="formData"
            @update-field="updateField"
          />

          <ServiceRequirementsStep
            v-if="currentStep === 4"
            :form-data="formData"
            @update-field="updateField"
          />

          <CostStructureStep
            v-if="currentStep === 5"
            :form-data="formData"
            @update-field="updateField"
          />

          <ContractDetailsStep
            v-if="currentStep === 6"
            :form-data="formData"
            @update-field="updateField"
          />

          <AttachmentsStep
            v-if="currentStep === 7"
            :form-data="formData"
            @update-field="updateField"
          />
        </div>

        <!-- Navigation -->
        <StepNavigation
            :current-step="currentStep"
            :total-steps="totalSteps"
            :form-data="formData"
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
import UserRoleStep from './components/steps/UserRoleStep.vue'
import ServiceDefinitionStep from './components/steps/ServiceDefinitionStep.vue'
import BidderRequirementsStep from './components/steps/BidderRequirementsStep.vue'
import ServiceRequirementsStep from './components/steps/ServiceRequirementsStep.vue'
import CostStructureStep from './components/steps/CostStructureStep.vue'
import ContractDetailsStep from './components/steps/ContractDetailsStep.vue'
import AttachmentsStep from './components/steps/AttachmentsStep.vue'
import StepNavigation from './components/StepNavigation.vue'
import StepHeader from './components/StepHeader.vue'
import ProgressBar from './components/ProgressBar.vue'
import DocumentPreview from './components/DocumentPreview.vue'
import { exportToPDF } from './utils/pdfExport.js'
import { exportToWord } from './utils/wordExport.js'

export default {
  name: 'App',
  components: {
    HeaderBar,
    UserRoleStep,
    ServiceDefinitionStep,
    BidderRequirementsStep,
    ServiceRequirementsStep,
    CostStructureStep,
    ContractDetailsStep,
    AttachmentsStep,
    StepNavigation,
    StepHeader,
    ProgressBar,
    DocumentPreview
  },
  data() {
    return {
      currentStep: 1,
      totalSteps: 7,
      showPreview: false,
      errorMessage: '',
      messageType: 'error', // 'error' or 'success'
      resizeObserver: null,
      headerHeight: 70,
      formData: {
        // User Role and Basic Data (Step 1)
        userRole: '',
        projectTitle: '',
        vergabeNr: '',
        serviceType: '',
        contractForm: '',
        location: '',
        currentSituation: '',

        // Service Definition (Step 2)
        stlbNumber: '',
        serviceDefinition: '',
        startDate: '',
        endDate: '',

        // Bidder Requirements (Step 3)
        bidderRequirements: [],

        // Service Requirements (Step 4)
        serviceRequirements: [],

        // Cost Structure (Step 5)
        costRows: [],

        // Contract Details (Step 6) - Einkauf only
        contractVolume: 0,
        contractDuration: 1,
        contractTerms: '',
        paymentTerms: '',
        customPaymentTerms: '',
        warrantyPeriod: '',
        customWarranty: 12,
        contactPerson: '',
        contactEmail: '',
        contactPhone: '',
        guidelinesUnderstood: false,
        equalTreatment: false,
        transparency: false,

        // Attachments (Step 7)
        attachments: [],

        // Legacy fields for backward compatibility
        scopeDescription: '',
        deliverables: '',
        targetState: '',
        servicePeriod: 'Nach Vereinbarung'
      }
    }
  },
  mounted() {
    this.loadFromLocalStorage();
    this.setupDynamicHeights();
  },
  beforeUnmount() {
    this.cleanupDynamicHeights();
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
          // User Role and Basic Data (Step 1)
          userRole: '',
          projectTitle: '',
          vergabeNr: '',
          serviceType: '',
          contractForm: '',
          location: '',
          currentSituation: '',

          // Service Definition (Step 2)
          stlbNumber: '',
          serviceDefinition: '',
          startDate: '',
          endDate: '',

          // Bidder Requirements (Step 3)
          bidderRequirements: [],

          // Service Requirements (Step 4)
          serviceRequirements: [],

          // Cost Structure (Step 5)
          costRows: [],

          // Contract Details (Step 6) - Einkauf only
          contractVolume: 0,
          contractDuration: 1,
          contractTerms: '',
          paymentTerms: '',
          customPaymentTerms: '',
          warrantyPeriod: '',
          customWarranty: 12,
          contactPerson: '',
          contactEmail: '',
          contactPhone: '',
          guidelinesUnderstood: false,
          equalTreatment: false,
          transparency: false,

          // Attachments (Step 7)
          attachments: [],

          // Legacy fields for backward compatibility
          scopeDescription: '',
          deliverables: '',
          targetState: '',
          servicePeriod: 'Nach Vereinbarung'
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

        // Skip step 6 (Contract Details) if user is not Einkauf
        if (this.currentStep === 6 && this.formData.userRole !== 'einkauf') {
          this.currentStep++;
        }
      }
    },

    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--;

        // Skip step 6 (Contract Details) if user is not Einkauf when going backwards
        if (this.currentStep === 6 && this.formData.userRole !== 'einkauf') {
          this.currentStep--;
        }
      }
    },

    async exportPDF() {
      try {
        this.showError(''); // Clear any previous errors

        // Generate filename based on project title
        const filename = this.generateFilename('pdf');

        // Export to PDF
        const result = await exportToPDF(this.formData, filename);

        if (result.success) {
          this.showSuccess('PDF erfolgreich exportiert!');
        } else {
          this.showError(result.message);
        }
      } catch (error) {
        console.error('PDF Export Error:', error);
        this.showError('Fehler beim PDF-Export: ' + error.message);
      }
    },

    async exportWord() {
      try {
        this.showError(''); // Clear any previous errors

        // Generate filename based on project title
        const filename = this.generateFilename('docx');

        // Export to Word
        const result = await exportToWord(this.formData, filename);

        if (result.success) {
          this.showSuccess('Word-Dokument erfolgreich exportiert!');
        } else {
          this.showError(result.message);
        }
      } catch (error) {
        console.error('Word Export Error:', error);
        this.showError('Fehler beim Word-Export: ' + error.message);
      }
    },

    generateDocument() {
      this.showPreview = true;
      this.showError(''); // Clear any previous errors
      // You could add validation here
    },

    generateFilename(extension) {
      // Generate filename based on project title and vergabe number
      let filename = 'Leistungsbeschreibung';

      if (this.formData.projectTitle) {
        filename = this.formData.projectTitle.replace(/[^a-zA-Z0-9äöüÄÖÜß\s-]/g, '').trim();
      }

      if (this.formData.vergabeNr) {
        filename += `_${this.formData.vergabeNr}`;
      }

      // Add current date
      const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
      filename += `_${date}`;

      return `${filename}.${extension}`;
    },

    showError(message) {
      this.errorMessage = message;
      this.messageType = 'error';
      setTimeout(() => {
        this.clearError();
      }, 5000);
    },

    showSuccess(message) {
      this.errorMessage = message;
      this.messageType = 'success';
      setTimeout(() => {
        this.clearError();
      }, 3000);
    },

    clearError() {
      this.errorMessage = '';
      this.messageType = 'error';
    },

    // Header height change handler
    onHeaderHeightChanged(height) {
      this.headerHeight = Math.ceil(height);
      this.updateHeightProperties();
    },

    // Dynamic height management
    setupDynamicHeights() {
      this.$nextTick(() => {
        this.updateHeightProperties();
        window.addEventListener('resize', this.debounce(this.updateHeightProperties, 100));
        window.addEventListener('orientationchange', () => {
          setTimeout(this.updateHeightProperties, 250);
        });
      });
    },

    cleanupDynamicHeights() {
      window.removeEventListener('resize', this.updateHeightProperties);
      window.removeEventListener('orientationchange', this.updateHeightProperties);
    },

    updateHeightProperties() {
      this.$nextTick(() => {
        const viewportWidth = window.innerWidth;

        // Calculate dynamic padding based on actual viewport
        let layoutPadding;
        if (viewportWidth <= 768) {
          layoutPadding = 20; // Mobile: 10px top + 10px bottom
        } else if (viewportWidth <= 968) {
          layoutPadding = 30; // Tablet: 15px top + 15px bottom
        } else {
          layoutPadding = 40; // Desktop: 20px top + 20px bottom
        }

        // Get accurate viewport height
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const availableHeight = Math.max(200, viewportHeight - this.headerHeight - layoutPadding);

        // Update CSS custom properties with pixel values for precision
        document.documentElement.style.setProperty('--header-height', `${this.headerHeight}px`);
        document.documentElement.style.setProperty('--layout-padding', `${layoutPadding}px`);
        document.documentElement.style.setProperty('--available-height', `${availableHeight}px`);

        // Debug logging (remove in production)
        if (process.env.NODE_ENV === 'development') {
          console.log('Height update:', {
            headerHeight: this.headerHeight,
            layoutPadding,
            availableHeight,
            viewportHeight
          });
        }
      });
    },

    // Utility function for debouncing resize events
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
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
  --error-color: #dc3545;

  /* Height calculations - will be updated by JavaScript */
  --header-height: 70px; /* Conservative default, updated dynamically */
  --layout-padding: 40px; /* Default padding, updated dynamically */
  --available-height: calc(100dvh - var(--header-height) - var(--layout-padding));
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
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Layout from test16.html */
.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin: 0;
  padding: 20px;
  height: var(--available-height);
  transition: grid-template-columns 0.3s ease;
  overflow: hidden;
}

.layout.with-preview {
  grid-template-columns: 1fr 1fr;
}

.editor-col {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  overflow-y: auto;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.layout.with-preview .editor-col {
  max-width: none;
  margin: 0;
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

.alert-success {
  background: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

/* Step content area */
.step-content {
  flex: 1;
  margin: 20px 0;
}

/* Navigation stays at bottom */
.step-navigation {
  margin-top: auto;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .layout {
    max-width: 100%;
    padding: 15px;
  }
}

@media (max-width: 968px) {
  .layout,
  .layout.with-preview {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 15px;
  }

  .editor-col {
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
