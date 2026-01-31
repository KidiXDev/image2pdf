import { useCallback } from 'react';
import jsPDF from 'jspdf';
import { useImageStore, ImageItem } from '../stores/imageStore';
import { useUIStore } from '../stores/uiStore';

// Page size dimensions in mm
const PAGE_SIZES: Record<string, { width: number; height: number }> = {
  a4: { width: 210, height: 297 },
  letter: { width: 215.9, height: 279.4 },
  legal: { width: 215.9, height: 355.6 },
  a3: { width: 297, height: 420 },
  a5: { width: 148, height: 210 },
};

export function usePDFConverter() {
  const { images } = useImageStore();
  const { setLoading, setLoadingTip, pdfSettings } = useUIStore();

  const convertToPDF = useCallback(() => {
    if (images.length === 0) return;

    setLoading(true, 'Converting images to PDF...');

    const { pageSize, orientation, margin, fileName, imageScaling } = pdfSettings;
    const pageDimensions = PAGE_SIZES[pageSize] || PAGE_SIZES.a4;

    // Swap dimensions for landscape
    const pageWidth = orientation === 'landscape' ? pageDimensions.height : pageDimensions.width;
    const pageHeight = orientation === 'landscape' ? pageDimensions.width : pageDimensions.height;

    let pdf = new jsPDF({
      orientation: orientation === 'landscape' ? 'l' : 'p',
      unit: 'mm',
      format: [pageWidth, pageHeight],
    });

    let processedCount = 0;

    const processImage = (image: ImageItem, index: number) => {
      const img = new Image();
      img.src = image.src;

      img.onload = () => {
        const pdfWidth = pageWidth;
        const pdfHeight = pageHeight;
        const availableWidth = pdfWidth - margin * 2;
        const availableHeight = pdfHeight - margin * 2;

        const imgWidth = img.width;
        const imgHeight = img.height;

        let scaledWidth = imgWidth;
        let scaledHeight = imgHeight;
        let x = margin;
        let y = margin;

        if (imageScaling === 'fit-img-size') {
          // Adjust page size to fit image
          let newPageWidth = pdfWidth;
          let newPageHeight = pdfHeight;

          if (imgWidth / imgHeight > pdfWidth / pdfHeight) {
            newPageHeight = (pdfWidth * imgHeight) / imgWidth;
          } else {
            newPageWidth = (pdfHeight * imgWidth) / imgHeight;
          }

          if (index > 0) {
            pdf.addPage(
              [newPageWidth, newPageHeight],
              newPageWidth > newPageHeight ? 'l' : 'p'
            );
          } else {
            pdf = new jsPDF({
              orientation: newPageWidth > newPageHeight ? 'l' : 'p',
              unit: 'mm',
              format: [newPageWidth, newPageHeight],
            });
          }
          scaledWidth = newPageWidth;
          scaledHeight = newPageHeight;
          x = 0;
          y = 0;
        } else if (imageScaling === 'default') {
          // Fit image within available space maintaining aspect ratio
          const ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
          scaledWidth = imgWidth * ratio;
          scaledHeight = imgHeight * ratio;
          x = margin + (availableWidth - scaledWidth) / 2;
          y = margin + (availableHeight - scaledHeight) / 2;

          if (index > 0) {
            pdf.addPage();
          }
        } else if (imageScaling === 'cover') {
          // Cover the page (may crop)
          const ratio = Math.max(availableWidth / imgWidth, availableHeight / imgHeight);
          scaledWidth = imgWidth * ratio;
          scaledHeight = imgHeight * ratio;
          x = margin + (availableWidth - scaledWidth) / 2;
          y = margin + (availableHeight - scaledHeight) / 2;

          if (index > 0) {
            pdf.addPage();
          }
        } else if (imageScaling === 'stretch') {
          // Stretch to fill available space
          scaledWidth = availableWidth;
          scaledHeight = availableHeight;
          x = margin;
          y = margin;

          if (index > 0) {
            pdf.addPage();
          }
        }

        // Detect image format from data URL
        const format = image.src.startsWith('data:image/png') ? 'PNG' : 'JPEG';
        pdf.addImage(img, format, x, y, scaledWidth, scaledHeight, undefined, 'MEDIUM');

        processedCount++;
        setLoadingTip(`Processing ${processedCount}/${images.length} images...`);

        if (processedCount === images.length) {
          const finalFileName = fileName.trim() || 'result';
          pdf.save(`${finalFileName}.pdf`);
          setLoading(false);
        }
      };
    };

    images.forEach((image, index) => {
      processImage(image, index);
    });
  }, [images, pdfSettings, setLoading, setLoadingTip]);

  return { convertToPDF };
}
