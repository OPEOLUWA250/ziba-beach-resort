/**
 * Utility functions for receipt download
 * Downloads receipt as PNG image - more reliable than PDF with complex CSS
 */

export async function downloadReceiptPDF(
  elementId: string,
  filename: string,
): Promise<boolean> {
  try {
    console.log(`📥 Starting receipt download for: ${filename}`);

    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`❌ Element with ID "${elementId}" not found`);
      return false;
    }

    console.log(`✅ Found element: ${elementId}`);

    // Import html2canvas for reliable rendering
    console.log("📦 Loading html2canvas library...");
    const html2canvas = (await import("html2canvas")).default;

    if (!html2canvas) {
      throw new Error("html2canvas failed to load");
    }

    console.log("✅ html2canvas loaded");

    // Render element to canvas
    console.log("🎨 Rendering receipt to image...");
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: false,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowHeight: 1200,
      windowWidth: 600,
      imageTimeout: 0,
      removeContainer: true,
    });

    console.log("✅ Receipt rendered to canvas");

    // Convert canvas to blob and download as PNG
    console.log("💾 Converting to PNG...");
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error("❌ Failed to create blob");
        return;
      }

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename.replace(".pdf", ".png"); // Download as PNG
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      URL.revokeObjectURL(url);

      console.log("✅ Receipt downloaded successfully as PNG");
    }, "image/png");

    return true;
  } catch (error) {
    console.error("❌ Error downloading receipt:", error);
    return false;
  }
}
