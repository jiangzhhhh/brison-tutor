// macOS: swift -module-cache-path /tmp/brison-ocr-cache corpus/tools/extract_pdf.swift INPUT.pdf OUTPUT.txt
// Extracts embedded text only. Scanned pages can produce no text.
// Render original pages locally for OCR; never modifies the original documents.
import Foundation
import AppKit
import PDFKit

let input = URL(fileURLWithPath: CommandLine.arguments[1])
let output = URL(fileURLWithPath: CommandLine.arguments[2])
guard let document = PDFDocument(url: input) else { fatalError("Cannot open PDF") }
var text = ""
for n in 0..<document.pageCount {
    text += "\n\n--- PDF page \(n + 1) ---\n" + (document.page(at: n)?.string ?? "")
}
try text.write(to: output, atomically: true, encoding: .utf8)
print("\(document.pageCount) PDF pages")
