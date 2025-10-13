import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function extractFonts(pdfPath) {
    try {
        // Read the PDF file
        const pdfBytes = fs.readFileSync(pdfPath);
        
        // Parse the PDF (ignore encryption if present)
        const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        
        console.log(`\n📄 Analyzing PDF: ${path.basename(pdfPath)}`);
        console.log(`📊 Number of pages: ${pdfDoc.getPageCount()}`);
        
        // Get the PDF catalog and resources
        const catalog = pdfDoc.catalog;
        const context = pdfDoc.context;
        
        console.log('\n🔤 Font Information:');
        console.log('==================');
        
        // Extract font information from the PDF context
        const fontRefs = new Set();
        const fonts = [];
        
        // Iterate through all objects in the PDF
        for (const [ref, obj] of context.indirectObjects.entries()) {
            if (obj && typeof obj === 'object' && obj.dict) {
                const dict = obj.dict;
                
                // Check if this is a font object
                if (dict.get('Type')?.toString() === 'Font') {
                    const fontInfo = {
                        reference: ref.toString(),
                        type: dict.get('Type')?.toString(),
                        subtype: dict.get('Subtype')?.toString(),
                        baseFont: dict.get('BaseFont')?.toString(),
                        name: dict.get('Name')?.toString(),
                        encoding: dict.get('Encoding')?.toString(),
                    };
                    
                    // Try to get font descriptor information
                    const fontDescriptor = dict.get('FontDescriptor');
                    if (fontDescriptor && fontDescriptor.dict) {
                        const descriptor = fontDescriptor.dict;
                        fontInfo.fontName = descriptor.get('FontName')?.toString();
                        fontInfo.fontFamily = descriptor.get('FontFamily')?.toString();
                        fontInfo.fontWeight = descriptor.get('FontWeight')?.toString();
                        fontInfo.flags = descriptor.get('Flags')?.toString();
                        fontInfo.ascent = descriptor.get('Ascent')?.toString();
                        fontInfo.descent = descriptor.get('Descent')?.toString();
                        fontInfo.capHeight = descriptor.get('CapHeight')?.toString();
                        fontInfo.xHeight = descriptor.get('XHeight')?.toString();
                        
                        const fontBBox = descriptor.get('FontBBox');
                        if (fontBBox && fontBBox.array) {
                            fontInfo.boundingBox = fontBBox.array.map(n => n.toString()).join(', ');
                        }
                    }
                    
                    fonts.push(fontInfo);
                }
            }
        }
        
        // Display font information
        if (fonts.length === 0) {
            console.log('❌ No fonts found in this PDF');
        } else {
            fonts.forEach((font, index) => {
                console.log(`\n--- Font ${index + 1} ---`);
                console.log(`Reference: ${font.reference}`);
                console.log(`Type: ${font.type}`);
                console.log(`Subtype: ${font.subtype || 'N/A'}`);
                console.log(`Base Font: ${font.baseFont || 'N/A'}`);
                console.log(`Font Name: ${font.fontName || 'N/A'}`);
                console.log(`Font Family: ${font.fontFamily || 'N/A'}`);
                console.log(`Font Weight: ${font.fontWeight || 'N/A'}`);
                console.log(`Encoding: ${font.encoding || 'N/A'}`);
                console.log(`Ascent: ${font.ascent || 'N/A'}`);
                console.log(`Descent: ${font.descent || 'N/A'}`);
                console.log(`Cap Height: ${font.capHeight || 'N/A'}`);
                console.log(`X-Height: ${font.xHeight || 'N/A'}`);
                console.log(`Bounding Box: ${font.boundingBox || 'N/A'}`);
                console.log(`Flags: ${font.flags || 'N/A'}`);
            });
        }
        
        // Save font information to JSON file
        const outputPath = '/workspaces/DD2977-Autofill/tmp/extracted-fonts.json';
        fs.writeFileSync(outputPath, JSON.stringify(fonts, null, 2));
        console.log(`\n💾 Font information saved to: ${outputPath}`);
        
        return fonts;
        
    } catch (error) {
        console.error('❌ Error extracting fonts:', error.message);
        throw error;
    }
}

// Main execution
const pdfPath = '/workspaces/DD2977-Autofill/draw2297.pdf';

if (!fs.existsSync(pdfPath)) {
    console.error(`❌ PDF file not found: ${pdfPath}`);
    process.exit(1);
}

extractFonts(pdfPath)
    .then(fonts => {
        console.log(`\n✅ Successfully extracted ${fonts.length} font(s) from the PDF`);
    })
    .catch(error => {
        console.error('💥 Failed to extract fonts:', error);
        process.exit(1);
    });