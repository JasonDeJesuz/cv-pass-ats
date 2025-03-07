import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { tailorCV } from './tailor-cv';
import { convertYamlToMarkdown } from './markdown-generator';
import { convertMarkdownToDocx } from './docx-converter';

interface Metadata {
    company: string;
    role: string;
    platform: string;
}

async function start() {
    console.log("starting new cv tailoring experience...");

    // Load metadata.yaml
    const metadataPath = path.join(__dirname, '..', 'inputs', 'metadata.yaml');
    const metadataContent = fs.readFileSync(metadataPath, 'utf8');
    const metadata = yaml.load(metadataContent) as Metadata;

    console.log(`Tailoring CV for ${metadata.role} at ${metadata.company} (${metadata.platform})`);

    // Create output folder structure with datetime
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeStr = now.toISOString().split('T')[1].split('.')[0].replace(/:/g, '-'); // HH-MM-SS

    const outputFolderName = `${metadata.company}-${metadata.role}-${dateStr}-${timeStr}`.toLowerCase().replace(/\s+/g, '-');
    const outputFolder = path.join(__dirname, '..', 'outputs', outputFolderName);

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
    }

    // Define paths for job description and output files
    const jobDescriptionPath = path.join(__dirname, '..', 'inputs', 'job-description.txt');
    const expectedTailoredCvYaml = path.join(outputFolder, 'tailored-cv.yaml');

    // Check if job description exists
    if (!fs.existsSync(jobDescriptionPath)) {
        throw new Error('Job description file not found. Please create a job-description.txt file in the inputs folder.');
    }
    
    const jbd = fs.readFileSync(jobDescriptionPath, 'utf8');
    const expectedJobDescriptionOutput = path.join(outputFolder, 'job-description.txt');
    fs.writeFileSync(expectedJobDescriptionOutput, jbd);

    // Tailor the CV
    console.log("tailoring cv...");
    const actualTailoredCvYaml = await tailorCV(jobDescriptionPath, expectedTailoredCvYaml);

    console.log("converting cv to markdown...");
    const expectedMarkdownOutputPath = path.join(outputFolder, 'tailored-cv.md');
    const actualTailoredCvMarkdown = await convertYamlToMarkdown(actualTailoredCvYaml, expectedMarkdownOutputPath, jobDescriptionPath);

    console.log("converting cv to docx...");
    const expectedDocxOutputPath = path.join(outputFolder, 'tailored-cv.docx');
    const actualDocxOutputPath = await convertMarkdownToDocx(actualTailoredCvMarkdown, expectedDocxOutputPath);

    console.log(`CV tailoring completed. Final DOCX saved to: ${actualDocxOutputPath}. Goodluck man!`);
}

// Run the function if this file is executed directly
if (require.main === module) {
    start()
        .then(() => console.log('Process completed successfully'))
        .catch(err => {
            console.error('Error:', err);
            process.exit(1);
        });
}