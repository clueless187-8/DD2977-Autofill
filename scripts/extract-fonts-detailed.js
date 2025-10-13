import fs from 'fs';
import path from 'path';

// Enhanced font extraction with better regex patterns
async function extractFontsDetailed(pdfPath) {
    try {
        console.log(`📄 Analyzing PDF: ${path.basename(pdfPath)}`);
        
        // Read the PDF as raw bytes
        const pdfBuffer = fs.readFileSync(pdfPath);
        const pdfContent = pdfBuffer.toString('latin1');
        
        console.log(`📊 PDF file size: ${pdfBuffer.length} bytes`);
        
        const fonts = [];
        
        // Look for all font-related names in the PDF
        console.log('\n🔍 Searching for font names...');
        
        // Pattern for font names (common font patterns)
        const fontNamePatterns = [
            /\/BaseFont\s*\/([A-Za-z0-9+\-,._]+)/g,
            /\/FontName\s*\/([A-Za-z0-9+\-,._]+)/g,
            /\/(Times[A-Za-z\-]*|Arial[A-Za-z\-]*|Helvetica[A-Za-z\-]*|Courier[A-Za-z\-]*|Myriad[A-Za-z\-]*|Symbol[A-Za-z\-]*)/gi
        ];
        
        const foundFonts = new Set();
        
        fontNamePatterns.forEach((pattern, index) => {
            let match;
            while ((match = pattern.exec(pdfContent)) !== null) {
                const fontName = match[1] || match[0];
                if (fontName && fontName.length > 1) {
                    foundFonts.add(fontName.replace(/^\//, ''));
                }
            }
        });
        
        // Look for font family information in parentheses
        const fontFamilyPattern = /\/FontFamily\s*\(([^)]+)\)/g;
        let match;
        const fontFamilies = new Set();
        
        while ((match = fontFamilyPattern.exec(pdfContent)) !== null) {
            fontFamilies.add(match[1]);
        }
        
        // Look for font weight information
        const fontWeightPattern = /\/FontWeight\s*(\d+)/g;
        const fontWeights = [];
        
        while ((match = fontWeightPattern.exec(pdfContent)) !== null) {
            fontWeights.push(parseInt(match[1]));
        }
        
        // Display results
        if (foundFonts.size > 0) {
            console.log('\n🔤 Font Names Found:');
            console.log('===================');
            Array.from(foundFonts).sort().forEach((font, index) => {
                console.log(`${index + 1}. ${font}`);
            });
        }
        
        if (fontFamilies.size > 0) {
            console.log('\n👨‍👩‍👧‍👦 Font Families Found:');
            console.log('========================');
            Array.from(fontFamilies).forEach((family, index) => {
                console.log(`${index + 1}. ${family}`);
            });
        }
        
        if (fontWeights.length > 0) {
            console.log('\n⚖️  Font Weights Found:');
            console.log('======================');
            const uniqueWeights = [...new Set(fontWeights)].sort((a, b) => a - b);
            uniqueWeights.forEach((weight, index) => {
                const weightName = weight === 400 ? 'Normal' : 
                                 weight === 700 ? 'Bold' :
                                 weight < 400 ? 'Light' : 'Heavy';
                console.log(`${index + 1}. ${weight} (${weightName})`);
            });
        }
        
        // Create detailed font objects
        const fontDetails = Array.from(foundFonts).map(fontName => ({
            name: fontName,
            type: 'extracted',
            source: path.basename(pdfPath)
        }));
        
        // Add font families
        Array.from(fontFamilies).forEach(family => {
            fontDetails.push({
                name: family,
                type: 'family',
                source: path.basename(pdfPath)
            });
        });
        
        fonts.push(...fontDetails);
        
        // Look for specific font patterns in the content
        console.log('\n🔍 Advanced Font Analysis:');
        console.log('==========================');
        
        // Check for Adobe font patterns
        if (pdfContent.includes('Adobe')) {
            console.log('📋 Adobe fonts detected in PDF');
        }
        
        // Check for TrueType fonts
        if (pdfContent.includes('TrueType')) {
            console.log('🔤 TrueType fonts detected');
        }
        
        // Check for Type1 fonts
        if (pdfContent.includes('Type1')) {
            console.log('📝 Type1 fonts detected');
        }
        
        return fonts;
        
    } catch (error) {
        console.error('❌ Error extracting fonts:', error.message);
        throw error;
    }
}

// Main execution - focus on the main PDF
async function main() {
    const pdfFile = 'draw2297.pdf';
    
    if (!fs.existsSync(pdfFile)) {
        console.log(`❌ PDF file '${pdfFile}' not found`);
        return;
    }
    
    console.log(`🎯 Analyzing main PDF: ${pdfFile}`);
    
    try {
        const fonts = await extractFontsDetailed(pdfFile);
        
        // Save detailed results
        const outputPath = path.join(process.cwd(), 'tmp', 'fonts-detailed.json');
        fs.writeFileSync(outputPath, JSON.stringify(fonts, null, 2));
        
        console.log(`\n💾 Detailed font information saved to: ${outputPath}`);
        console.log(`✅ Successfully extracted ${fonts.length} font entries`);
        
    } catch (error) {
        console.error(`💥 Failed to extract fonts:`, error.message);
    }
}

main().catch(console.error);