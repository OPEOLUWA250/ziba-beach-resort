/**
 * Utility functions for receipt download
 * Uses html2pdf.js (already installed in the project dependencies)
 */

export async function downloadReceiptPDF(
  elementId: string,
  filename: string,
): Promise<boolean> {
  let element: HTMLElement | null = null;

  const printFallback = (
    target: HTMLElement,
    safeFilename: string,
  ): boolean => {
    try {
      const printWindow = window.open("", "_blank", "width=900,height=1200");
      if (!printWindow) {
        console.error("❌ Print fallback blocked by browser popup settings");
        return false;
      }

      const styles = Array.from(
        document.querySelectorAll("style, link[rel='stylesheet']"),
      )
        .map((node) => node.outerHTML)
        .join("\n");

      printWindow.document.open();
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>${safeFilename.replace(".pdf", "")}</title>
            ${styles}
            <style>
              body { margin: 0; padding: 24px; background: #ffffff; }
              #print-root { max-width: 800px; margin: 0 auto; }
              @media print {
                body { padding: 0; }
                #print-root { max-width: 100%; }
              }
            </style>
          </head>
          <body>
            <div id="print-root">${target.outerHTML}</div>
          </body>
        </html>
      `);
      printWindow.document.close();

      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 400);

      console.log("✅ Print fallback opened (Save as PDF available)");
      return true;
    } catch (error) {
      console.error("❌ Print fallback failed:", error);
      return false;
    }
  };

  try {
    console.log(`📥 Starting receipt download for: ${filename}`);

    element = document.getElementById(elementId);
    if (!element) {
      console.error(`❌ Element with ID "${elementId}" not found`);
      return false;
    }

    console.log(`✅ Found element: ${elementId}`);

    console.log("📦 Loading html2pdf.js library...");
    const html2pdfModule = await import("html2pdf.js");
    const html2pdf = html2pdfModule.default || html2pdfModule;

    if (!html2pdf) {
      throw new Error("html2pdf.js failed to load");
    }

    const safeFilename = filename.endsWith(".pdf")
      ? filename
      : `${filename}.pdf`;

    console.log("🎨 Rendering and downloading PDF...");
    await html2pdf()
      .set({
        margin: [8, 8, 8, 8],
        filename: safeFilename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: Math.min(2, window.devicePixelRatio || 1.5),
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
          scrollY: 0,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      })
      .from(element)
      .save();

    console.log("✅ Receipt downloaded successfully as PDF");

    return true;
  } catch (error) {
    console.error("❌ Error downloading receipt:", error);

    if (element) {
      const fallbackFilename = filename.endsWith(".pdf")
        ? filename
        : `${filename}.pdf`;
      const fallbackWorked = printFallback(element, fallbackFilename);
      if (fallbackWorked) {
        return true;
      }
    }

    return false;
  }
}
