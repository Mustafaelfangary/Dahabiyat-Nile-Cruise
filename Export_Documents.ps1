# Export Cleopatra Dahabiyat SEO Strategy Documents
Write-Host "Exporting Cleopatra Dahabiyat SEO Strategy Documents" -ForegroundColor Yellow

# Create exports directory
$exportDir = "Strategy_Exports"
if (!(Test-Path $exportDir)) {
    New-Item -ItemType Directory -Path $exportDir
    Write-Host "Created directory: $exportDir" -ForegroundColor Green
}

# Copy files
Write-Host "Copying documents..." -ForegroundColor Cyan

$files = @(
    "SEO_Digital_Marketing_Strategy_2025.md",
    "SEO_Action_Plan_Checklist.md", 
    "Cleopatra_Dahabiyat_SEO_Strategy_Word_Export.html"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Copy-Item $file "$exportDir\"
        Write-Host "Copied: $file" -ForegroundColor Green
    } else {
        Write-Host "Not found: $file" -ForegroundColor Red
    }
}

Write-Host "Export complete!" -ForegroundColor Green
Write-Host "Files saved to: $exportDir" -ForegroundColor White

# Open directory
Start-Process explorer.exe $exportDir

Write-Host ""
Write-Host "CHART EXPORT INSTRUCTIONS:" -ForegroundColor Yellow
Write-Host "1. Right-click on each chart in the conversation"
Write-Host "2. Select 'Save image as...' or 'Copy image'"
Write-Host "3. Save as JPG with these names:"
Write-Host "   - 01_SEO_Strategy_Implementation_Flowchart.jpg"
Write-Host "   - 02_Digital_Marketing_Funnel_Conversion_Flow.jpg"
Write-Host "   - 03_Social_Media_Strategy_Platform_Integration.jpg"
Write-Host "   - 04_12_Month_Implementation_Timeline.jpg"
Write-Host "   - 05_Marketing_Budget_Allocation_Chart.jpg"
Write-Host "   - 06_Customer_Journey_Touchpoint_Mapping.jpg"
Write-Host "   - 07_SEO_Keyword_Strategy_Hierarchy.jpg"
Write-Host "   - 08_ROI_Projection_Growth_Trajectory.jpg"
Write-Host ""
Write-Host "WORD DOCUMENT CONVERSION:" -ForegroundColor Yellow
Write-Host "1. Open the HTML file in your browser"
Write-Host "2. Press Ctrl+P to print"
Write-Host "3. Select 'Save as PDF' or copy content to Word"
