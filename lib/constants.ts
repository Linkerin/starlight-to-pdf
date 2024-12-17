import type { PaperFormat } from "puppeteer";
import type { PDFMargin } from "puppeteer";

export const MARGINS: PDFMargin = {
  top: "1cm",
  right: "1cm",
  bottom: "1cm",
  left: "1.5cm",
};

export const PDF_FORMAT: PaperFormat = "A4";

export const basePaperFormats = [
  "LETTER",
  "LEGAL",
  "TABLOID",
  "LEDGER",
  "A0",
  "A1",
  "A2",
  "A3",
  "A4",
  "A5",
  "A6",
  "Letter",
  "Legal",
  "Tabloid",
  "Ledger",
];

export const PAPER_FORMATS = new Set([
  ...basePaperFormats,
  ...basePaperFormats.map((f) => f.toLowerCase()),
]);
