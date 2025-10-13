import fs from 'fs';
import path from 'path';

// Clean up font extraction results
function cleanFontData() {
    const inputPath = path.join(process.cwd(), 'tmp', 'fonts-detailed.json');
    const outputPath = path.join(process.cwd(), 'tmp', 'fonts-clean.json');
    
    if (!fs.existsSync(inputPath)) {
        console.log('❌ No detailed font data found');
        return;
    }
    
    const rawFonts = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    
    // Filter out binary-encoded font families and keep only readable font names
    const cleanFonts = rawFonts.filter(font => {
        // Keep only fonts with readable names (no binary characters)
        const isReadable = /^[A-Za-z0-9\-+_.]+$/.test(font.name);
        const isNotTooShort = font.name.length > 2;
        const isNotBackslash = font.name !== '\\';
        
        return isReadable && isNotTooShort && isNotBackslash;
    });
    
    // Create a more structured output
    const fontSummary = {
        extractedFrom: 'draw2297.pdf',
        extractionDate: new Date().toISOString(),
        totalFontsFound: cleanFonts.length,
        fonts: cleanFonts.map(font => ({
            name: font.name,
            type: font.type,
            category: categorizeFontName(font.name),
            variants: getVariants(font.name)
        })).sort((a, b) => a.name.localeCompare(b.name))
    };
    
    // Save cleaned data
    fs.writeFileSync(outputPath, JSON.stringify(fontSummary, null, 2));
    
    console.log('✅ Clean font data saved to:', outputPath);
    console.log(`📊 Found ${fontSummary.totalFontsFound} readable fonts:`);
    
    fontSummary.fonts.forEach((font, index) => {
        console.log(`${index + 1}. ${font.name} (${font.category})`);
    });
    
    return fontSummary;
}

function categorizeFontName(fontName) {
    const name = fontName.toLowerCase();
    
    if (name.includes('arial')) return 'Sans-serif';
    if (name.includes('helvetica')) return 'Sans-serif';
    if (name.includes('times')) return 'Serif';
    if (name.includes('myriad')) return 'Sans-serif';
    if (name.includes('courier')) return 'Monospace';
    if (name.includes('zapf') || name.includes('dingbats')) return 'Symbol';
    
    return 'Unknown';
}

function getVariants(fontName) {
    const variants = [];
    const name = fontName.toLowerCase();
    
    if (name.includes('bold')) variants.push('Bold');
    if (name.includes('italic')) variants.push('Italic');
    if (name.includes('light')) variants.push('Light');
    if (name.includes('regular') || (!name.includes('bold') && !name.includes('italic'))) {
        variants.push('Regular');
    }
    
    return variants.length > 0 ? variants : ['Regular'];
}

// Run the cleanup
cleanFontData();