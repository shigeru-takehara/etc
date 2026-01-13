import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ChunkingService {
    splitText(text: string, chunkSize: number = 500, overlap: number = 75): string[] {
        const chunks: string[] = [];
        if (!text) return chunks;

        let startIndex = 0;
        while (startIndex < text.length) {
            let endIndex = startIndex + chunkSize;
            if (endIndex > text.length) endIndex = text.length;

            chunks.push(text.substring(startIndex, endIndex));

            if (endIndex === text.length) break;
            startIndex = endIndex - overlap;

            // Safety to prevent infinite loop
            if (startIndex >= endIndex) startIndex = endIndex + 1;
        }
        return chunks;
    }
}
