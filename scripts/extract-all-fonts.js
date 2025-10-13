import fs from 'fs';
import path from 'path';

// Extract fonts from all PDF files in the workspace
async function extractFromAllPDFs() {
    console.log('🎯 Extracting Fonts from All PDF Files');
    console.log('======================================');
    
    // Find all PDF files in the workspace
    const pdfFiles = [
        'draw2297.pdf',
        'sample-form.pdf', 
        'filled-sample.pdf',
        'filled-all.pdf'
    ].filter(file => {
        const exists = fs.existsSync(file);
        if (!exists) {
            console.log(`⚠️  PDF file not found: ${file}`);
        }
        return exists;
    });
    
    console.log(`📁 Found ${pdfFiles.length} PDF files to analyze`);
    
    const allFonts = [];
    const fontsByFile = {};
    
    for (const pdfFile of pdfFiles) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`📄 Analyzing: ${pdfFile}`);
        console.log(`${'='.repeat(60)}`);
        
        try {
            const fonts = await extractFontsFromFile(pdfFile);
            fontsByFile[pdfFile] = fonts;
            
            // Add to master list with source tracking
            fonts.forEach(font => {
                const existingFont = allFonts.find(f => f.name === font.name);
                if (existingFont) {
                    if (!existingFont.sources.includes(pdfFile)) {
                        existingFont.sources.push(pdfFile);
                    }
                } else {
                    allFonts.push({
                        ...font,
                        sources: [pdfFile]
                    });
                }
            });
            
        } catch (error) {
            console.error(`❌ Failed to extract fonts from ${pdfFile}:`, error.message);
            fontsByFile[pdfFile] = [];
        }
    }
    
    // Generate comprehensive report
    console.log(`\n\n📊 COMPREHENSIVE FONT ANALYSIS`);
    console.log(`${'='.repeat(60)}`);
    
    console.log(`\n🔤 Total Unique Fonts Found: ${allFonts.length}`);
    
    // Sort fonts by number of sources (most common first)
    const sortedFonts = allFonts.sort((a, b) => b.sources.length - a.sources.length);
    
    console.log(`\n📋 Font Usage Across Files:`);
    console.log(`---------------------------`);
    
    sortedFonts.forEach((font, index) => {
        const sourceList = font.sources.join(', ');
        console.log(`${index + 1}. ${font.name}`);
        console.log(`   📁 Used in: ${sourceList} (${font.sources.length} file${font.sources.length > 1 ? 's' : ''})`);
        console.log('');
    });
    
    // Analyze by file
    console.log(`\n📁 Fonts by File:`);
    console.log(`-----------------`);
    
    Object.entries(fontsByFile).forEach(([file, fonts]) => {
        console.log(`\n📄 ${file}: ${fonts.length} font${fonts.length !== 1 ? 's' : ''}`);
        if (fonts.length > 0) {
            fonts.forEach((font, index) => {
                console.log(`   ${index + 1}. ${font.name}`);
            });
        } else {
            console.log(`   (No fonts found)`);
        }
    });
    
    // Find common fonts across files
    const commonFonts = sortedFonts.filter(font => font.sources.length > 1);
    
    if (commonFonts.length > 0) {
        console.log(`\n🔄 Common Fonts (used in multiple files): ${commonFonts.length}`);
        console.log(`------------------------------------------------`);
        commonFonts.forEach((font, index) => {
            console.log(`${index + 1}. ${font.name} (${font.sources.length} files)`);
        });
    }
    
    // Save comprehensive results
    const results = {
        summary: {
            totalFiles: pdfFiles.length,
            totalUniqueFonts: allFonts.length,
            commonFonts: commonFonts.length,
            timestamp: new Date().toISOString()
        },
        fontsByFile,
        allFonts: sortedFonts,
        commonFonts
    };
    
    const outputPath = path.join(process.cwd(), 'tmp', 'comprehensive-font-analysis.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    
    console.log(`\n💾 Comprehensive analysis saved to: ${outputPath}`);
    console.log(`✅ Successfully analyzed ${pdfFiles.length} PDF files`);
    
    return results;
}

// Extract fonts from a single file (reusing our existing logic)
async function extractFontsFromFile(pdfPath) {
    try {
        const pdfBuffer = fs.readFileSync(pdfPath);
        const pdfContent = pdfBuffer.toString('latin1');
        
        const fontNamePatterns = [
            /\/BaseFont\s*\/([A-Za-z0-9+\-,._]+)/g,
            /\/FontName\s*\/([A-Za-z0-9+\-,._]+)/g,
        ];
        
        const foundFonts = new Set();
        
        fontNamePatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(pdfContent)) !== null) {
                const fontName = match[1];
                if (fontName && fontName.length > 1 && !fontName.includes('\\')) {
                    foundFonts.add(fontName);
                }
            }
        });
        
        return Array.from(foundFonts).map(name => ({
            name,
            type: 'extracted',
            source: path.basename(pdfPath)
        }));
        
    } catch (error) {
        console.error(`Error extracting fonts from ${pdfPath}:`, error.message);
        return [];
    }
}

// Main execution
extractFromAllPDFs().catch(console.error);