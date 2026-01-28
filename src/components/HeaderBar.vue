<template>
  <header class="header-bar">
    <h1 class="header-title">
      <span class="th-koeln">TH Köln</span>
      Leistungsbeschreibung Generator
    </h1>
    
    <!-- Hamburger Menu Button (Mobile Only) -->
    <button 
      @click="toggleMobileMenu" 
      class="hamburger-btn" 
      :class="{ 'is-active': isMobileMenuOpen }"
      aria-label="Toggle navigation menu"
      :aria-expanded="isMobileMenuOpen"
      aria-controls="mobile-menu"
    >
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>
    
    <!-- Desktop Buttons -->
    <div class="header-buttons desktop-buttons">
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
    
    <!-- Mobile Menu Overlay -->
    <transition name="slide-fade">
      <div 
        v-if="isMobileMenuOpen" 
        id="mobile-menu"
        class="mobile-menu"
        role="navigation"
        aria-label="Mobile Navigation"
      >
        <button @click="handleMobileAction('restart')" class="btn btn-secondary btn-mobile">
          Neustarten
        </button>
        <button @click="handleMobileAction('export-pdf')" class="btn btn-success btn-mobile">
          Export PDF
        </button>
        <button @click="handleMobileAction('export-word')" class="btn btn-success btn-mobile">
          Export Word
        </button>
        <button @click="handleMobileAction('toggle-preview')" class="btn btn-primary btn-mobile">
          {{ showPreview ? 'Vorschau ausblenden' : 'Vorschau anzeigen' }}
        </button>
      </div>
    </transition>
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
  emits: ['restart', 'export-pdf', 'export-word', 'toggle-preview', 'height-changed'],
  data() {
    return {
      resizeObserver: null,
      isMobileMenuOpen: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.emitHeight();
      this.setupResizeObserver();
      this.setupEventListeners();
    });
  },
  beforeUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.cleanupEventListeners();
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    handleMobileAction(action) {
      this.$emit(action);
      this.isMobileMenuOpen = false;
    },
    handleClickOutside(event) {
      // Close menu if click is outside the header bar
      if (this.isMobileMenuOpen && this.$el && !this.$el.contains(event.target)) {
        this.isMobileMenuOpen = false;
      }
    },
    handleResize() {
      // Close menu when resizing from mobile to desktop
      if (this.isMobileMenuOpen && window.innerWidth > 768) {
        this.isMobileMenuOpen = false;
      }
    },
    handleEscapeKey(event) {
      // Close menu when Escape key is pressed
      if (event.key === 'Escape' && this.isMobileMenuOpen) {
        this.isMobileMenuOpen = false;
      }
    },
    setupEventListeners() {
      document.addEventListener('click', this.handleClickOutside);
      window.addEventListener('resize', this.handleResize);
      document.addEventListener('keydown', this.handleEscapeKey);
    },
    cleanupEventListeners() {
      document.removeEventListener('click', this.handleClickOutside);
      window.removeEventListener('resize', this.handleResize);
      document.removeEventListener('keydown', this.handleEscapeKey);
    },
    emitHeight() {
      if (this.$el) {
        const height = this.$el.getBoundingClientRect().height;
        this.$emit('height-changed', height);
      }
    },
    setupResizeObserver() {
      if ('ResizeObserver' in window && this.$el) {
        this.resizeObserver = new ResizeObserver(() => {
          this.emitHeight();
        });
        this.resizeObserver.observe(this.$el);
      }
    }
  }
}
</script>

<style scoped>
.header-bar {
  background: var(--primary);
  color: white;
  padding: 15px 20px;
  height: var(--header-height);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  position: relative;
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

/* Hamburger Menu Button */
.hamburger-btn {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 32px;
  height: 28px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.hamburger-line {
  width: 100%;
  height: 3px;
  background-color: white;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger-btn.is-active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(8px, 8px);
}

.hamburger-btn.is-active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.hamburger-btn.is-active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

/* Mobile Menu */
.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--primary);
  padding: 15px 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  flex-direction: column;
  gap: 10px;
}

.btn-mobile {
  width: 100%;
  text-align: center;
}

/* Slide-fade transition */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
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
    padding: 15px 20px;
    height: auto;
    min-height: 60px;
  }

  .header-title {
    font-size: 1.2rem;
    flex: 1;
  }
  
  .th-koeln {
    display: block;
    margin-bottom: 2px;
  }

  /* Hide desktop buttons on mobile */
  .desktop-buttons {
    display: none;
  }

  /* Show hamburger button on mobile */
  .hamburger-btn {
    display: flex;
  }

  /* Show mobile menu when open */
  .mobile-menu {
    display: flex;
  }
}
</style>
