# Leistungsbeschreibungsgenerator - Implementation Overview

## Project Overview

This application is a comprehensive form wizard for creating "Leistungsbeschreibungen" (service specifications) in German procurement processes. It guides users through a step-by-step process to create detailed procurement documents.

## Architecture

The application is built using Vue.js 3 with a component-based architecture:

- **Main App Component**: `src/App.vue` - Orchestrates the entire wizard flow
- **Step Components**: Individual components for each form step
- **Navigation Component**: `src/components/StepNavigation.vue` - Handles step navigation with validation
- **Header Component**: `src/components/HeaderBar.vue` - Application header with export functions
- **Preview Component**: `src/components/DocumentPreview.vue` - Live document preview

## Implemented Form Steps

Based on the specification in `clickstrecke`, the following 7 steps have been implemented:

### Step 1: User Role and Basic Data (`UserRoleStep.vue`)
**Purpose**: Establishes user context and basic project information

**Fields**:
- User role selection (Fachabteilung vs Einkauf)
- Project title with tooltip guidance
- Vergabe number (Einkauf only)
- Service type (VOB vs VOL)
- Contract form (Einzelauftrag vs Rahmenvereinbarung) with detailed tooltip
- Location (Leistungsort)
- Current situation description

**Features**:
- Conditional field display based on user role
- Interactive tooltips with detailed explanations
- Responsive design

### Step 2: Service Definition (`ServiceDefinitionStep.vue`)
**Purpose**: Defines the specific service based on chosen type

**Fields**:
- STLB number input (VOB only)
- Service definition text area (VOL only)
- Service period with start/end dates
- Contextual help based on service type

**Features**:
- Conditional content based on VOB/VOL selection
- Input validation for required fields
- Date range picker for service period

### Step 3: Bidder Requirements (`BidderRequirementsStep.vue`)
**Purpose**: Defines qualification requirements for bidders

**Features**:
- Dynamic list management (add/remove requirements)
- Hierarchical structure: Criteria → Requirements
- Pre-defined templates (Fachkunde, Zuverlässigkeit, etc.)
- Expandable sub-requirements per criterion

**Templates included**:
- Fachkunde (Professional competence)
- Zuverlässigkeit (Reliability)
- Leistungsfähigkeit (Performance capability)
- Referenzen (References)

### Step 4: Service Requirements (`ServiceRequirementsStep.vue`)
**Purpose**: Defines specific service requirements with evaluation criteria

**Features**:
- Dynamic requirements list
- Criteria type selection (A: Exclusion, B: Evaluation)
- Weight assignment for evaluation criteria (percentage)
- Weight validation (should total 100%)
- Pre-defined requirement templates

**Criteria Types**:
- **Type A**: Exclusion criteria (must be met)
- **Type B**: Evaluation criteria (weighted scoring)

**Templates included**:
- Quality standards
- Punctuality
- Sustainability
- Warranty
- Documentation
- Support services

### Step 5: Cost Structure (`CostStructureStep.vue`)
**Purpose**: Creates structured pricing table for bid comparison

**Features**:
- Dynamic table with configurable row count
- Standard columns: Position, Service, Quantity, Unit Price, Total Price
- Automatic total calculation
- Pre-defined cost templates
- CSV export functionality
- Real-time price calculations

**Built-in Templates**:
- Material costs
- Labor costs
- Transport and logistics
- Planning and construction
- Installation and commissioning
- Training and instruction

### Step 6: Contract Details (`ContractDetailsStep.vue`)
**Purpose**: Einkauf-specific contract and procurement details

**Conditional Display**: Only shown for users with "Einkauf" role

**Fields**:
- Contract volume (estimated budget)
- Contract duration (max 4 years)
- Additional contract terms
- Payment conditions
- Warranty period
- Contact information
- Procurement compliance checkboxes

**Features**:
- Currency input with Euro formatting
- Contract duration validation (max 4 years)
- Custom payment terms option
- Procurement compliance verification

### Step 7: Attachments (`AttachmentsStep.vue`)
**Purpose**: Manages document attachments for the specification

**Features**:
- Dynamic attachment list
- Document categorization by type
- Required/optional document marking
- Document description fields
- Quick-add templates
- Attachment summary statistics
- Export functionality

**Document Types**:
- Technical specifications
- Drawings/blueprints
- Photos/images
- Contract conditions
- Reference documents
- Checklists/forms
- Other documents

## Key Implementation Features

### Conditional Logic
- **Role-based navigation**: Step 6 is automatically skipped for non-Einkauf users
- **Service type conditional content**: VOB shows STLB fields, VOL shows definition fields
- **Dynamic field validation**: Required fields change based on user selections

### Data Persistence
- **Local Storage**: All form data is automatically saved to browser local storage
- **Auto-save**: Data is saved on every field update
- **Recovery**: Users can continue where they left off

### Validation System
- **Progressive validation**: Shows warnings but doesn't block navigation
- **Critical validation**: Blocks navigation for essential missing data
- **Visual feedback**: Clear indication of validation issues
- **Smart validation**: Context-aware based on user role and selections

### User Experience Features
- **Responsive design**: Works on desktop, tablet, and mobile
- **Tooltips**: Contextual help throughout the application
- **Templates**: Quick-start options for common requirements
- **Live preview**: Real-time document preview (when implemented)
- **Progress indication**: Clear step progress with conditional counting

### Data Structure
The form data is comprehensively structured to support all requirements:

```javascript
formData: {
  // User Role and Basic Data
  userRole: '',
  projectTitle: '',
  vergabeNr: '',
  serviceType: '',
  contractForm: '',
  location: '',
  currentSituation: '',
  
  // Service Definition
  stlbNumber: '',
  serviceDefinition: '',
  startDate: '',
  endDate: '',
  
  // Dynamic Arrays
  bidderRequirements: [],
  serviceRequirements: [],
  costRows: [],
  attachments: [],
  
  // Contract Details (Einkauf only)
  contractVolume: 0,
  contractDuration: 1,
  contractTerms: '',
  paymentTerms: '',
  // ... more contract fields
  
  // Legacy compatibility fields
  scopeDescription: '',
  deliverables: '',
  // ... legacy fields
}
```

## Technical Implementation Details

### Component Architecture
- **Prop-based communication**: Form data flows down via props
- **Event-based updates**: Changes flow up via emit events
- **Centralized state**: All form state managed in main App component
- **Modular design**: Each step is self-contained and reusable

### Styling
- **CSS Variables**: Consistent theming throughout
- **Responsive Grid**: Flexible layouts for all screen sizes
- **Component-scoped styles**: No style conflicts between components
- **Accessible design**: Proper focus management and ARIA attributes

### Navigation Logic
- **Smart step skipping**: Automatically handles conditional navigation
- **Validation integration**: Navigation respects validation state
- **Progress tracking**: Accurate step counting with conditional logic
- **Breadcrumb support**: Users can jump between completed steps

## Usage Flow

1. **User Role Selection**: User identifies as Fachabteilung or Einkauf
2. **Basic Project Data**: Core project information and service type
3. **Service Definition**: Detailed service specification (VOB/VOL specific)
4. **Bidder Qualification**: Define who can participate
5. **Service Requirements**: Specify what must be delivered
6. **Cost Structure**: Create pricing framework
7. **Contract Details**: Einkauf-specific procurement details (conditional)
8. **Attachments**: Add supporting documents
9. **Document Generation**: Create final specification document

## Future Enhancements

### Planned Features
- **PDF Export**: Generate formatted PDF documents
- **Word Export**: Create editable Word documents
- **Template Library**: Save and reuse common configurations
- **Multi-language Support**: Support for other languages
- **Advanced Validation**: More sophisticated business rules
- **Collaborative Editing**: Multi-user support
- **Integration APIs**: Connect to existing procurement systems

### Technical Improvements
- **State Management**: Consider Vuex/Pinia for complex state
- **Testing Suite**: Comprehensive unit and integration tests
- **Performance Optimization**: Lazy loading and code splitting
- **Accessibility Enhancement**: Full WCAG 2.1 compliance
- **Error Handling**: Robust error recovery mechanisms

## Development Guidelines

### Code Organization
- Components follow single responsibility principle
- Consistent naming conventions throughout
- Clear separation of concerns
- Comprehensive inline documentation

### Data Flow
- Unidirectional data flow (props down, events up)
- Centralized state management in main app
- Immutable data updates for predictability
- Event naming follows Vue.js conventions

### Validation Strategy
- Progressive enhancement approach
- Non-blocking warnings vs blocking errors
- Context-aware validation rules
- Clear user feedback mechanisms

This implementation provides a solid foundation for a comprehensive procurement specification generator that can handle the complexity of German public procurement processes while maintaining usability and accessibility.