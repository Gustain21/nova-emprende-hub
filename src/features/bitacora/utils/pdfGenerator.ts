import jsPDF from 'jspdf';
import { phases, introContent, conclusionContent } from '@/features/bitacora/data/bitacoraContent';

export const generatePDF = (answers: Record<string, string>) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Colors
  const bgColor = { r: 2, g: 6, b: 23 }; // #020617
  const primaryColor = { r: 234, g: 88, b: 12 }; // #ea580c
  const textColor = { r: 226, g: 232, b: 240 }; // #e2e8f0
  const mutedColor = { r: 148, g: 163, b: 184 }; // #94a3b8

  const addBackground = () => {
    pdf.setFillColor(bgColor.r, bgColor.g, bgColor.b);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  };

  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      addBackground();
      yPosition = margin;
      return true;
    }
    return false;
  };

  const addText = (text: string, fontSize: number, color: { r: number; g: number; b: number }, isBold = false, align: 'left' | 'center' | 'right' = 'left') => {
    pdf.setFontSize(fontSize);
    pdf.setTextColor(color.r, color.g, color.b);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    const lines = pdf.splitTextToSize(text, contentWidth);
    const lineHeight = fontSize * 0.5;
    
    checkNewPage(lines.length * lineHeight);
    
    lines.forEach((line: string) => {
      let xPos = margin;
      if (align === 'center') {
        xPos = pageWidth / 2;
      } else if (align === 'right') {
        xPos = pageWidth - margin;
      }
      pdf.text(line, xPos, yPosition, { align });
      yPosition += lineHeight;
    });
    
    return lines.length * lineHeight;
  };

  // ========== COVER PAGE ==========
  addBackground();
  
  yPosition = pageHeight / 2 - 40;
  
  // Badge
  pdf.setFontSize(8);
  pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  pdf.text('EL BIG BANG DE LOS NEGOCIOS', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Main title
  pdf.setFontSize(36);
  pdf.setTextColor(textColor.r, textColor.g, textColor.b);
  pdf.setFont('helvetica', 'bold');
  pdf.text('LA', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 18;

  pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  pdf.text('BITÁCORA', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 18;

  pdf.text('DEL CAPITÁN', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 25;

  // Subtitle
  pdf.setFontSize(10);
  pdf.setTextColor(mutedColor.r, mutedColor.g, mutedColor.b);
  pdf.setFont('helvetica', 'normal');
  pdf.text('30 DÍAS PARA DETONAR TU MENTALIDAD EMPRENDEDORA', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  pdf.setFontSize(8);
  pdf.text('El cuaderno de trabajo oficial', pageWidth / 2, yPosition, { align: 'center' });

  // ========== INTRODUCTION PAGE ==========
  pdf.addPage();
  addBackground();
  yPosition = margin;

  addText('⚠️ ADVERTENCIA: No leas esto. Hazlo.', 14, primaryColor, true, 'center');
  yPosition += 10;

  addText('Bienvenido a la plataforma de lanzamiento.', 12, textColor, true);
  yPosition += 5;

  const introParagraphs = introContent.welcome.split('\n\n');
  introParagraphs.forEach(para => {
    addText(para, 9, mutedColor);
    yPosition += 3;
  });

  yPosition += 10;
  addText('Cómo usar esta Bitácora:', 12, primaryColor, true);
  yPosition += 5;
  addText(introContent.howToUse.replace(/🔴|🔵|🟢/g, '•'), 9, mutedColor);
  
  yPosition += 10;
  addText('Tus 3 Reglas de Vuelo:', 12, primaryColor, true);
  yPosition += 5;
  introContent.rules.forEach(rule => {
    addText(`${rule.emoji} ${rule.title}`, 10, textColor, true);
    addText(rule.description, 9, mutedColor);
    yPosition += 3;
  });

  // ========== DAYS PAGES ==========
  phases.forEach(phase => {
    // Phase header page
    pdf.addPage();
    addBackground();
    yPosition = pageHeight / 2 - 30;

    const phaseEmoji = phase.phase === 1 ? '🔴' : phase.phase === 2 ? '🔵' : '🟢';
    addText(`FASE ${phase.phase}`, 12, mutedColor, false, 'center');
    yPosition += 10;
    addText(phase.title, 24, primaryColor, true, 'center');
    yPosition += 10;
    addText(phase.subtitle, 12, textColor, false, 'center');

    // Individual days
    phase.days.forEach(day => {
      pdf.addPage();
      addBackground();
      yPosition = margin;

      // Day header
      addText(`Fase ${phase.phase} • Día ${day.day}`, 8, mutedColor, false, 'center');
      yPosition += 5;
      addText(`${day.emoji} ${day.title}`, 16, textColor, true, 'center');
      yPosition += 10;

      // Spark
      addText('✨ Chispa de Ignición', 10, primaryColor, true);
      yPosition += 3;
      addText(day.spark.replace(/"/g, ''), 8, mutedColor);
      yPosition += 10;

      // Exercise title
      addText(day.exercise.title, 12, primaryColor, true);
      yPosition += 5;

      // Instructions
      day.exercise.instructions.forEach((instruction, idx) => {
        addText(`${idx + 1}. ${instruction}`, 9, textColor);
        yPosition += 2;
      });
      yPosition += 8;

      // Fields with answers
      day.exercise.fields.forEach((field, idx) => {
        checkNewPage(30);
        
        addText(field.label, 9, textColor, true);
        yPosition += 2;

        // Draw input box
        pdf.setDrawColor(30, 41, 59); // slate-800
        pdf.setFillColor(15, 23, 42); // slate-900
        const boxHeight = field.multiline ? 25 : 12;
        pdf.roundedRect(margin, yPosition, contentWidth, boxHeight, 2, 2, 'FD');
        
        // Add answer text if exists
        const fieldId = `day-${day.day}-field-${idx}`;
        const answer = answers[fieldId] || '';
        if (answer) {
          pdf.setFontSize(8);
          pdf.setTextColor(textColor.r, textColor.g, textColor.b);
          const answerLines = pdf.splitTextToSize(answer, contentWidth - 6);
          pdf.text(answerLines.slice(0, field.multiline ? 4 : 2), margin + 3, yPosition + 5);
        } else {
          // Placeholder
          pdf.setFontSize(7);
          pdf.setTextColor(mutedColor.r, mutedColor.g, mutedColor.b);
          pdf.text(field.placeholder.substring(0, 60) + '...', margin + 3, yPosition + 5);
        }
        
        yPosition += boxHeight + 5;
      });
    });
  });

  // ========== CONCLUSION PAGE ==========
  pdf.addPage();
  addBackground();
  yPosition = margin;

  addText('🎯 Misión Completada', 10, mutedColor, false, 'center');
  yPosition += 10;
  addText(conclusionContent.title, 16, textColor, true, 'center');
  yPosition += 15;

  const conclusionParagraphs = conclusionContent.content.split('\n\n');
  conclusionParagraphs.forEach(para => {
    const cleanPara = para.replace(/\*\*/g, '');
    addText(cleanPara, 9, mutedColor);
    yPosition += 5;
  });

  // Footer on last page
  yPosition = pageHeight - 25;
  pdf.setDrawColor(30, 41, 59);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;
  
  addText('EDITORIAL NOVA EMPRENDE', 10, textColor, true, 'center');
  yPosition += 5;
  pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  pdf.textWithLink('www.editorialnovaemprende.com', pageWidth / 2, yPosition, {
    align: 'center',
    url: 'https://www.editorialnovaemprende.com'
  });

  // Save the PDF
  pdf.save('La_Bitacora_del_Capitan.pdf');
};
