import jsPDF from 'jspdf';
import { useCallback } from 'react';
import { useImageStore } from '../stores/imageStore';
import { useUIStore } from '../stores/uiStore';

// Page size dimensions in mm
const PAGE_SIZES: Record<string, { width: number; height: number }> = {
  a4: { width: 210, height: 297 },
  letter: { width: 215.9, height: 279.4 },
  legal: { width: 215.9, height: 355.6 },
  a3: { width: 297, height: 420 },
  a5: { width: 148, height: 210 }
};

export function usePDFConverter() {
  const { images } = useImageStore();
  const { setLoading, setLoadingTip, pdfSettings } = useUIStore();

  const convertToPDF = useCallback(async () => {
    if (images.length === 0) return;

    setLoading(true, 'Preparing images...');

    const {
      pageSize,
      orientation,
      margin,
      fileName,
      imageScaling,
      imagesPerPage = 1
    } = pdfSettings;
    const pageDimensions = PAGE_SIZES[pageSize] || PAGE_SIZES.a4;

    // Swap dimensions for landscape
    const pageWidth =
      orientation === 'landscape'
        ? pageDimensions.height
        : pageDimensions.width;
    const pageHeight =
      orientation === 'landscape'
        ? pageDimensions.width
        : pageDimensions.height;

    // Load all images first
    const loadedImages = await Promise.all(
      images.map(
        (image) =>
          new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.src = image.src;
            img.onload = () => resolve(img);
            img.onerror = reject;
          })
      )
    );

    const pdf = new jsPDF({
      orientation: orientation === 'landscape' ? 'l' : 'p',
      unit: 'mm',
      format: [pageWidth, pageHeight]
    });

    let currentImageIndex = 0;

    while (currentImageIndex < loadedImages.length) {
      if (currentImageIndex > 0) {
        pdf.addPage();
      }

      const pageImages = loadedImages.slice(
        currentImageIndex,
        currentImageIndex + imagesPerPage
      );

      // Height available for each image slot
      const slotHeight = pageHeight / (imagesPerPage === 2 ? 2 : 1);

      pageImages.forEach((img, idx) => {
        // Calculate available space for this image slot
        const availableWidth = pageWidth - margin * 2;
        const availableHeight = slotHeight - margin * 2;

        // Slot position offset
        const yOffset = idx * slotHeight;

        const imgWidth = img.width;
        const imgHeight = img.height;

        let scaledWidth = imgWidth;
        let scaledHeight = imgHeight;
        let x = margin;
        let y = margin + yOffset;

        if (imageScaling === 'fit-img-size' && imagesPerPage === 1) {
          // Special case for fit-img-size with 1 image per page (resize page)
          // We can't resize page easily for 2 images per page, so fallback to default fit for 2 images
          if (imagesPerPage === 1) {
            let newPageWidth = pageWidth;
            let newPageHeight = pageHeight;

            if (imgWidth / imgHeight > pageWidth / pageHeight) {
              newPageHeight = (pageWidth * imgHeight) / imgWidth;
            } else {
              newPageWidth = (pageHeight * imgWidth) / imgHeight;
            }

            // Resize current page
            pdf.deletePage(pdf.getNumberOfPages());
            pdf.addPage(
              [newPageWidth, newPageHeight],
              newPageWidth > newPageHeight ? 'l' : 'p'
            );

            scaledWidth = newPageWidth;
            scaledHeight = newPageHeight;
            x = 0;
            y = 0;
          }
        } else if (
          imageScaling === 'default' ||
          (imageScaling === 'fit-img-size' && imagesPerPage > 1)
        ) {
          // Default fit behavior
          const ratio = Math.min(
            availableWidth / imgWidth,
            availableHeight / imgHeight
          );
          scaledWidth = imgWidth * ratio;
          scaledHeight = imgHeight * ratio;
          x = margin + (availableWidth - scaledWidth) / 2;
          y = margin + yOffset + (availableHeight - scaledHeight) / 2;
        } else if (imageScaling === 'cover') {
          const ratio = Math.max(
            availableWidth / imgWidth,
            availableHeight / imgHeight
          );
          scaledWidth = imgWidth * ratio;
          scaledHeight = imgHeight * ratio;
          x = margin + (availableWidth - scaledWidth) / 2;
          y = margin + yOffset + (availableHeight - scaledHeight) / 2;
        } else if (imageScaling === 'stretch') {
          scaledWidth = availableWidth;
          scaledHeight = availableHeight;
          x = margin;
          y = margin + yOffset;
        }

        // Detect image format
        // Note: We use original image.src to detect format, assuming index matches
        const originalSrc = images[currentImageIndex + idx].src;
        const format = originalSrc.startsWith('data:image/png')
          ? 'PNG'
          : 'JPEG';

        pdf.addImage(
          img,
          format,
          x,
          y,
          scaledWidth,
          scaledHeight,
          undefined,
          'MEDIUM'
        );
      });

      currentImageIndex += imagesPerPage;
      setLoadingTip(
        `Processing images... ${Math.min(currentImageIndex, images.length)}/${images.length}`
      );
    }

    const finalFileName = fileName.trim() || 'result';
    pdf.save(`${finalFileName}.pdf`);
    setLoading(false);
  }, [images, pdfSettings, setLoading, setLoadingTip]);

  return { convertToPDF };
}
