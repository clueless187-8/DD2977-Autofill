# DD2977-Autofill

Small demo for filling DD2977-style form sections (4-9) using pdf-lib and a candidate-based resolver.

Files of interest
- `src/pdf/da2977-resolver.ts` - helper that resolves a logical field name to a real AcroForm field name using multiple heuristics/APIs.
- `src/pdf/da2977.ts` - logical field list and `fillSectionWithResolver(form, sectionIndex, section)` which writes values into the PDF form.
- `scripts/integrate.ts` (compiled in `dist/scripts/integrate.js`) - creates a sample PDF (if missing), reads `data/hazards.json`, runs the filler for sections 4-9, and writes `filled-all.pdf`.
- `field-mapping.json` - extracted AcroForm field candidates from your provided `draw2297.pdf`.

Quick start

1. Ensure dependencies are installed (pdf-lib, zod, etc.).
2. Build/run the compiled integration script:

```bash
node dist/scripts/integrate.js data/hazards.json
```

This will create `sample-form.pdf` (if not present), create an example `data/hazards.json` (if not present), run the autofill for sections 4-9 and write `filled-all.pdf`.

Mapping and customization
- If your real PDF uses different AcroForm field names, update the `FIELD_CANDIDATES` in `src/pdf/da2977.ts` to include the real raw names before the canonical `section{n}_{field}` names. The extraction script produced `field-mapping.json` to help.

If you want me to auto-apply more mappings from `field-mapping.json`, tell me which logical fields to map to which raw names and I'll apply them and re-run.
# DD2977-Autofill 🎯

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen.svg)](https://github.com/clueless187-8/DD2977-Autofill)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An intelligent PDF form autofill tool for DD2977 hazard assessment forms. Automatically fills PDF form fields with structured data, featuring advanced field name resolution and data validation.

## 🚀 Features

- **🎯 Smart Field Mapping**: Advanced field name resolution with fuzzy matching
- **📝 PDF Form Filling**: Fill DD2977 hazard assessment forms automatically
- **✅ Data Validation**: Zod schema validation for data integrity
- **🔤 Font Analysis**: Extract and analyze PDF fonts for compatibility
- **🧪 Test Coverage**: Comprehensive test suite with Jest
- **🔧 TypeScript**: Full TypeScript support with type safety
- **📊 Multiple Sections**: Support for sections 4-9 of DD2977 forms

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/clueless187-8/DD2977-Autofill.git
cd DD2977-Autofill

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build
```

## 🎯 Quick Start

### Basic Usage

```typescript
import { fillSectionWithResolver } from './src/pdf/da2977';
import { validateHazards } from './src/schema/validateHazards';

// Your hazard data
const hazardData = {
  sections: [
    {
      id: 4,
      subtask: "Equipment inspection",
      hazard: "Electrical shock risk",
      initialRisk: "high",
      control: "Lockout/tagout procedure",
      implementation: "Monthly safety training",
      residualRisk: "low",
      who: "Safety Officer",
      when: "2025-11-01"
    }
  ]
};

// Validate and fill PDF
const validatedData = validateHazards(hazardData);
const filledPDF = await fillPDF('input.pdf', validatedData);
```

### Data Structure

The tool expects data in this format:

```typescript
interface HazardSection {
  id: 4 | 5 | 6 | 7 | 8 | 9;              // Section number
  subtask: string;                        // Task description
  hazard: string;                         // Hazard description
  initialRisk: "low" | "medium" | "high"; // Initial risk level
  control: string;                        // Control measures
  implementation: string;                 // Implementation details
  residualRisk: "low" | "medium" | "high"; // Residual risk level
  who: string;                           // Responsible person
  when: string;                          // Date (YYYY-MM-DD format)
}
```

## 🛠️ API Reference

### Core Functions

#### `fillSectionWithResolver(pdfDoc, sectionData, sectionNumber)`
Fills a specific section of the PDF form with provided data.

#### `validateHazards(data)`
Validates hazard data against the Zod schema.

#### `resolveFieldName(fieldName, candidates)`
Resolves PDF field names using fuzzy matching.

### Font Analysis

```typescript
import { extractFonts } from './scripts/extract-fonts';

// Extract fonts from PDF
const fonts = await extractFonts('your-form.pdf');
console.log('Available fonts:', fonts);
```

## 📁 Project Structure

```
DD2977-Autofill/
├── src/
│   ├── pdf/
│   │   ├── da2977.ts           # Main PDF filling logic
│   │   └── da2977-resolver.ts  # Field name resolution
│   └── schema/
│       └── validateHazards.ts  # Data validation schema
├── scripts/
│   ├── extract-fonts.js        # Font extraction utilities
│   ├── analyze-font-usage.js   # Font analysis tools
│   └── ...                     # Additional utility scripts
├── test/
│   ├── fillSectionWithResolver.test.ts
│   └── resolveFieldName.test.ts
├── data/
│   └── hazards.json            # Sample hazard data
└── tmp/                        # Generated analysis files
```

## 🔧 Configuration

### Field Mapping

The tool uses intelligent field mapping stored in `field-mapping.json`. You can customize field mappings:

```json
{
  "suggestions": {
    "id": ["field_id_1", "field_id_2"],
    "hazard": ["hazard_field", "risk_field"],
    "control": ["control_measure", "safety_control"]
  }
}
```

### Font Configuration

Font analysis results are stored in `tmp/fonts-clean.json`:

```json
[
  {
    "name": "ArialMT",
    "type": "extracted",
    "source": "draw2297.pdf"
  },
  {
    "name": "Times-Roman",
    "type": "extracted", 
    "source": "draw2297.pdf"
  }
]
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📊 Supported Forms

- **DD2977**: Hazard Assessment forms (sections 4-9)
- **Font Support**: Arial, Times, Helvetica, Myriad Pro, ZapfDingbats
- **Field Types**: Text fields, risk assessments, date fields

## 🎨 Font Analysis Features

The tool includes comprehensive font analysis:

- **Font Extraction**: Extract fonts from existing PDFs
- **Compatibility Check**: Verify font compatibility
- **Usage Analysis**: Analyze how fonts are used in forms
- **Clean Font Lists**: Generate clean, readable font inventories

## 🔗 Integration Ready

Perfect for integration with:

- **Risk Management Systems**
- **ERP/CRM Applications**
- **Workflow Management Tools**
- **Database Applications**
- **API-based Services**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [pdf-lib](https://pdf-lib.js.org/) for PDF manipulation
- [Zod](https://zod.dev/) for runtime type validation
- [Jest](https://jestjs.io/) for testing framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/clueless187-8/DD2977-Autofill/issues) page
2. Create a new issue with detailed information
3. Include sample data and error messages

---

**Made with ❤️ for automated form filling**
