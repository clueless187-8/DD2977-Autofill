import fs from 'fs';
import path from 'path';

// Alternative font extraction using raw PDF parsing
async function extractFontsRaw(pdfPath) {
    try {
        console.log(`📄 Analyzing PDF: ${path.basename(pdfPath)}`);
        
        // Read the PDF as raw bytes
        const pdfBuffer = fs.readFileSync(pdfPath);
        const pdfContent = pdfBuffer.toString('latin1');
        
        console.log(`📊 PDF file size: ${pdfBuffer.length} bytes`);
        
        // Look for font objects using regex patterns
        const fonts = [];
        
        // Pattern 1: Font dictionaries
        const fontPattern = /\/Type\s*\/Font[\s\S]*?(?=\/Type\s*\/|endobj|%%EOF)/g;
        let match;
        
        console.log('\n🔍 Searching for font objects...');
        
        while ((match = fontPattern.exec(pdfContent)) !== null) {
            const fontObj = match[0];
            console.log('\n📝 Found font object:');
            console.log('-------------------');
            
            // Extract font properties
            const fontInfo = {};
            
            // Extract Subtype
            const subtypeMatch = fontObj.match(/\/Subtype\s*\/(\w+)/);
            if (subtypeMatch) {
                fontInfo.subtype = subtypeMatch[1];
                console.log(`📄 Subtype: ${fontInfo.subtype}`);
            }
            
            // Extract BaseFont
            const baseFontMatch = fontObj.match(/\/BaseFont\s*\/([^\s\/\]\)]+)/);
            if (baseFontMatch) {
                fontInfo.baseFont = baseFontMatch[1];
                console.log(`🔤 BaseFont: ${fontInfo.baseFont}`);
            }
            
            // Extract FontName
            const fontNameMatch = fontObj.match(/\/FontName\s*\/([^\s\/\]\)]+)/);
            if (fontNameMatch) {
                fontInfo.fontName = fontNameMatch[1];
                console.log(`📝 FontName: ${fontInfo.fontName}`);
            }
            
            // Extract Encoding
            const encodingMatch = fontObj.match(/\/Encoding\s*\/([^\s\/\]\)]+)/);
            if (encodingMatch) {
                fontInfo.encoding = encodingMatch[1];
                console.log(`🔢 Encoding: ${fontInfo.encoding}`);
            }
            
            fonts.push(fontInfo);
        }
        
        // Pattern 2: Look for FontDescriptor objects
        console.log('\n🔍 Searching for FontDescriptor objects...');
        const descriptorPattern = /\/Type\s*\/FontDescriptor[\s\S]*?(?=\/Type\s*\/|endobj|%%EOF)/g;
        
        while ((match = descriptorPattern.exec(pdfContent)) !== null) {
            const descriptorObj = match[0];
            console.log('\n📋 Found FontDescriptor:');
            console.log('----------------------');
            
            // Extract FontName
            const fontNameMatch = descriptorObj.match(/\/FontName\s*\/([^\s\/\]\)]+)/);
            if (fontNameMatch) {
                console.log(`🔤 FontName: ${fontNameMatch[1]}`);
            }
            
            // Extract FontFamily
            const fontFamilyMatch = descriptorObj.match(/\/FontFamily\s*\(([^)]*)\)/);
            if (fontFamilyMatch) {
                console.log(`👨‍👩‍👧‍👦 FontFamily: ${fontFamilyMatch[1]}`);
            }
            
            // Extract FontWeight
            const fontWeightMatch = descriptorObj.match(/\/FontWeight\s*(\d+)/);
            if (fontWeightMatch) {
                console.log(`⚖️  FontWeight: ${fontWeightMatch[1]}`);
            }
            
            // Extract Flags
            const flagsMatch = descriptorObj.match(/\/Flags\s*(\d+)/);
            if (flagsMatch) {
                console.log(`🚩 Flags: ${flagsMatch[1]}`);
            }
        }
        
        // Pattern 3: Look for embedded font data
        console.log('\n🔍 Searching for embedded font data...');
        const fontFilePattern = /\/Type\s*\/FontFile[23]?[\s\S]*?stream[\s\S]*?endstream/g;
        let embeddedCount = 0;
        
        while ((match = fontFilePattern.exec(pdfContent)) !== null) {
            embeddedCount++;
            console.log(`📦 Found embedded font data #${embeddedCount}`);
        }
        
        // Save results
        const outputPath = path.join(process.cwd(), 'tmp', 'extracted-fonts-raw.json');
        fs.writeFileSync(outputPath, JSON.stringify(fonts, null, 2));
        
        console.log(`\n💾 Font information saved to: ${outputPath}`);
        console.log(`✅ Found ${fonts.length} font object(s) and ${embeddedCount} embedded font(s)`);
        
        return fonts;
        
    } catch (error) {
        console.error('❌ Error extracting fonts:', error.message);
        throw error;
    }
}

// Main execution
async function main() {
    const pdfFiles = [
        'draw2297.pdf',
        'sample-form.pdf',
        'filled-sample.pdf',
        'filled-all.pdf'
    ].filter(file => fs.existsSync(file));
    
    if (pdfFiles.length === 0) {
        console.log('❌ No PDF files found in the current directory');
        return;
    }
    
    console.log(`🎯 Found ${pdfFiles.length} PDF file(s) to analyze`);
    
    for (const pdfFile of pdfFiles) {
        console.log(`\n${'='.repeat(60)}`);
        try {
            await extractFontsRaw(pdfFile);
        } catch (error) {
            console.error(`💥 Failed to extract fonts from ${pdfFile}:`, error.message);
        }
    }
}

main().catch(console.error);