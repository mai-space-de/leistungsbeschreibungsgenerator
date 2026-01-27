<template>
  <div id="app">
    <header class="header">
      <h1>Leistungsbeschreibungsgenerator</h1>
      <p>Generate professional service descriptions</p>
    </header>
    
    <main class="main-content">
      <section class="form-section">
        <h2>Service Description Generator</h2>
        <form @submit.prevent="generateDescription" class="description-form">
          <div class="form-group">
            <label for="service-title">Service Title:</label>
            <input 
              type="text" 
              id="service-title" 
              v-model="serviceTitle" 
              placeholder="Enter the service title"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="service-description">Brief Description:</label>
            <textarea 
              id="service-description" 
              v-model="serviceDescription" 
              placeholder="Provide a brief description of the service"
              rows="4"
              required
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="service-scope">Scope of Work:</label>
            <textarea 
              id="service-scope" 
              v-model="serviceScope" 
              placeholder="Detail the scope of work and deliverables"
              rows="6"
              required
            ></textarea>
          </div>
          
          <button type="submit" class="generate-btn">Generate Description</button>
        </form>
      </section>
      
      <section v-if="generatedDescription" class="result-section">
        <h2>Generated Service Description</h2>
        <div class="description-output">
          <pre>{{ generatedDescription }}</pre>
          <button @click="copyToClipboard" class="copy-btn">Copy to Clipboard</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      serviceTitle: '',
      serviceDescription: '',
      serviceScope: '',
      generatedDescription: ''
    }
  },
  methods: {
    generateDescription() {
      const template = `LEISTUNGSBESCHREIBUNG

Titel: ${this.serviceTitle}

1. BESCHREIBUNG DER LEISTUNG
${this.serviceDescription}

2. LEISTUNGSUMFANG
${this.serviceScope}

3. QUALITÄTSANFORDERUNGEN
- Alle Arbeiten sind nach den aktuellen technischen Standards und Normen auszuführen
- Die Leistungen sind termingerecht und vollständig zu erbringen
- Dokumentation der durchgeführten Arbeiten ist zu erstellen

4. ABNAHME
- Die Leistung gilt als abgenommen, wenn sie vertragsgemäß und mangelfrei erbracht wurde
- Eventuelle Mängel sind unverzüglich nach Feststellung zu beseitigen

Erstellt am: ${new Date().toLocaleDateString('de-DE')}`;

      this.generatedDescription = template;
    },
    
    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.generatedDescription);
        alert('Description copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy text: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = this.generatedDescription;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Description copied to clipboard!');
      }
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 2rem 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 0.5rem;
}

.header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  width: 100%;
}

.form-section, .result-section {
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  margin-bottom: 2rem;
}

.form-section h2, .result-section h2 {
  color: #667eea;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.generate-btn, .copy-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.generate-btn:hover, .copy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.description-output {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  border-left: 4px solid #667eea;
  position: relative;
}

.description-output pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.copy-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .form-section, .result-section {
    padding: 1.5rem;
  }
}
</style>