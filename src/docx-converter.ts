import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

// Convert exec to Promise-based
const execPromise = promisify(exec);

/**
 * Converts a Markdown file to DOCX format using pandoc
 * @param markdownPath Path to the Markdown file
 * @param outputPath Path where the DOCX file will be saved
 */
export async function convertMarkdownToDocx(
    markdownPath: string,
    outputPath: string
): Promise<string> {
    try {
        console.log('Converting Markdown to DOCX...');

        const referenceDocPath = path.join(__dirname, '..', 'meta', 'ref.docx');

        // Use pandoc to convert directly from Markdown to DOCX
        const { stdout, stderr } = await execPromise(
            `pandoc -f markdown -t docx "${markdownPath}" -o "${outputPath}" --standalone --wrap=none --reference-doc="${referenceDocPath}"`
        );

        if (stderr) {
            console.warn('Pandoc warnings:', stderr);
        }

        console.log(`DOCX file saved to ${outputPath}`);
        return outputPath;

    } catch (error) {
        console.error('Error converting Markdown to DOCX:', error);
        console.error('Make sure pandoc is installed. You can install it with: brew install pandoc');
        throw error;
    }
}

// Example usage (if this file is run directly)
if (require.main === module) {
    const baseDir = path.join(__dirname, '..', 'outputs', 'example');
    const markdownPath = path.join(baseDir, 'tailored-cv.md');
    const outputPath = path.join(baseDir, 'tailored-cv.docx');

    convertMarkdownToDocx(markdownPath, outputPath)
        .then(() => console.log('Conversion completed'))
        .catch(err => console.error('Conversion failed:', err));
}