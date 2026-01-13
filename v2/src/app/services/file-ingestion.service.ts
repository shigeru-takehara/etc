import { Injectable } from '@angular/core';
import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
// Configure pdf.js worker to use local public asset
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

@Injectable({
    providedIn: 'root'
})
export class FileIngestionService {
    async extractText(file: File): Promise<string> {
        const extension = file.name.split('.').pop()?.toLowerCase();

        switch (extension) {
            case 'pdf':
                return this.extractFromPdf(file);
            case 'docx':
                return this.extractFromDocx(file);
            case 'md':
            case 'txt':
                return this.readAsText(file);
            default:
                throw new Error(`Unsupported file type: .${extension}`);
        }
    }

    private async readAsText(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    private async extractFromDocx(file: File): Promise<string> {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
    }

    private async extractFromPdf(file: File): Promise<string> {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map((item: any) => item.str)
                    .join(' ');
                fullText += pageText + '\n';
            }
            return fullText;
        } catch (e) {
            console.error('PDF extraction failed', e);
            throw new Error('Failed to extract text from PDF. Ensure the file is not corrupted and pdfjs worker is reachable.');
        }
    }
}
