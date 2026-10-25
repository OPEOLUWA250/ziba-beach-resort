/**
 * Utility functions for receipt download
 * Uses html2pdf.js (already installed in the project dependencies)
 */

const MODERN_COLOR_FN_PROPS = [
  "color",
  "backgroundColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "textDecorationColor",
  "outlineColor",
  // SVG presentation properties — FontAwesome icons render as inline <svg>
  // with fill="currentColor", and the browser can report the *computed*
  // fill/stroke value using lab()/oklch() even when the rest of the page's
  // computed colors serialize as rgb(), so these need the same treatment.
  "fill",
  "stroke",
] as const;

/**
 * html2canvas (used by html2pdf.js) can only parse legacy rgb()/hsl()/hex
 * colors. Tailwind v4's default palette is defined with oklch() (and the
 * browser itself can report computed values in lab()/lch()/oklab() too),
 * which makes html2canvas throw "Attempting to parse an unsupported color
 * function" the moment it reads any styled element.
 *
 * Reading back `ctx.fillStyle` after setting it no longer downgrades modern
 * color functions to rgb() in current Chrome — it just echoes the same
 * oklch()/lab()/etc. string back. Actually rendering the color and reading
 * the rasterized pixel bytes via getImageData is reliable instead: canvas
 * pixel buffers are always plain 8-bit sRGB, regardless of the color space
 * used to fill them.
 */
function toBrowserRgb(colorFunctionText: string): string | null {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = colorFunctionText;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return a === 255
      ? `rgb(${r}, ${g}, ${b})`
      : `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
  } catch {
    return null;
  }
}

function replaceModernColorFunctions(value: string): string {
  if (!value) return value;
  return value.replace(/(?:oklch|oklab|lch|lab|color)\([^)]*\)/gi, (match) => {
    return toBrowserRgb(match) || match;
  });
}

/**
 * Walks the cloned receipt element (and every descendant) and rewrites any
 * computed color/background/gradient that uses a modern CSS color function
 * into a plain rgb() equivalent, so html2canvas doesn't choke on it.
 */
function flattenModernColors(root: HTMLElement) {
  const view = root.ownerDocument?.defaultView;
  if (!view) return;

  const elements: HTMLElement[] = [
    root,
    ...Array.from(root.querySelectorAll<HTMLElement>("*")),
  ];

  for (const el of elements) {
    const computed = view.getComputedStyle(el);

    for (const prop of MODERN_COLOR_FN_PROPS) {
      const original = computed[prop];
      if (!original) continue;
      const replaced = replaceModernColorFunctions(original);
      if (replaced !== original) {
        el.style[prop] = replaced;
      }
    }

    const bgImage = computed.backgroundImage;
    if (bgImage && bgImage !== "none") {
      const replaced = replaceModernColorFunctions(bgImage);
      if (replaced !== bgImage) {
        el.style.backgroundImage = replaced;
      }
    }
  }
}

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

      // Same exclusion as the html2canvas path — page actions (download,
      // copy link, home) are not part of the receipt itself.
      const printTarget = target.cloneNode(true) as HTMLElement;
      printTarget
        .querySelectorAll("[data-html2canvas-ignore]")
        .forEach((node) => node.remove());

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
            <div id="print-root">${printTarget.outerHTML}</div>
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
          onclone: (_clonedDoc: Document, clonedElement: HTMLElement) => {
            flattenModernColors(clonedElement);
          },
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
