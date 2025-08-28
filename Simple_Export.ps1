# Simple Export Script for Cleopatra Dahabiyat SEO Strategy
Write-Host "🏺 Exporting Cleopatra Dahabiyat SEO Strategy Documents" -ForegroundColor Yellow

# Create exports directory
$exportDir = "Strategy_Exports"
if (!(Test-Path $exportDir)) {
    New-Item -ItemType Directory -Path $exportDir
    Write-Host "📁 Created directory: $exportDir" -ForegroundColor Green
}

# Copy files
Write-Host "`n📄 Copying documents..." -ForegroundColor Cyan

$files = @(
    "SEO_Digital_Marketing_Strategy_2025.md",
    "SEO_Action_Plan_Checklist.md", 
    "Cleopatra_Dahabiyat_SEO_Strategy_Word_Export.html"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Copy-Item $file "$exportDir\"
        Write-Host "✅ Copied: $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Not found: $file" -ForegroundColor Red
    }
}

# Create README
$readme = @"
# Cleopatra Dahabiyat SEO Strategy Export

## Files Included
- SEO_Digital_Marketing_Strategy_2025.md (Complete strategy)
- SEO_Action_Plan_Checklist.md (Implementation guide)
- Cleopatra_Dahabiyat_SEO_Strategy_Word_Export.html (Word-ready format)

## Chart Export Instructions
Save these charts from the conversation as JPG:
1. SEO Strategy Implementation Flowchart
2. Digital Marketing Funnel & Conversion Flow  
3. Social Media Strategy & Platform Integration
4. 12-Month Implementation Timeline
5. Marketing Budget Allocation Chart
6. Customer Journey & Touchpoint Mapping
7. SEO Keyword Strategy Hierarchy
8. ROI Projection & Growth Trajectory

## Word Document Conversion
1. Open the HTML file in your browser
2. Press Ctrl+P to print
3. Select "Save as PDF" or copy content to Word

Ready for implementation!
"@

$readme | Out-File -FilePath "$exportDir\README.txt" -Encoding UTF8

Write-Host "`n✅ Export complete!" -ForegroundColor Green
Write-Host "📁 Files saved to: $exportDir" -ForegroundColor White

# Open directory
Start-Process explorer.exe $exportDir
