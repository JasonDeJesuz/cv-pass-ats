import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Define the CV interface based on your YAML structure
interface CV {
    name: string;
    contact: {
        email: string;
        phone: string[];
        locations: string[];
        nationality: string[];
        website: string;
    };
    summary: string;
    experience: Array<{
        role: string;
        company: string;
        duration: string;
        location: string;
        achievements: string[];
    }>;
    education: Array<{
        name: string;
        institution?: string;
        instituion?: string; // Handle typo in original YAML
        country?: string;
        type?: string;
        note?: string;
        years: string[];
    }>;
    certifications: string[];
    skills: string[];
    languages: string[];
    interests: string[];
    references: Array<{
        name: string;
        position: string;
        company: string;
        contact: string;
    }>;
}

/**
 * Tailors the existing yaml data to new yaml data using the job description
 * @param jobDescriptionPath Path where the job description has been set
 * @param outputPath Path where the markdown file will be saved
 */
export async function tailorCV(jobDescriptionPath: string, outputPath: string): Promise<string> {
    try {
        // Read CV YAML file
        const cvPath = path.join(__dirname, '..', 'meta', 'original-cv.yaml');
        const cvContent = fs.readFileSync(cvPath, 'utf8');
        console.log('CV loaded successfully');

        // Read job description
        const jobDescription = fs.readFileSync(jobDescriptionPath, 'utf8');
        console.log('Job description loaded successfully');

        // Read ATS strategy document
        const strategyPath = path.join(__dirname, '..', 'meta', 'strategy.txt');
        const atsStrategy = fs.readFileSync(strategyPath, 'utf8');
        console.log('ATS strategy loaded successfully');

        // Read prompt templates
        const userPromptPath = path.join(__dirname, '..', 'prompts', 'tailor-cv', 'user-prompt.txt');
        const systemPromptPath = path.join(__dirname, '..', 'prompts', 'tailor-cv', 'system-prompt.txt');
        const userPromptTemplate = fs.readFileSync(userPromptPath, 'utf8');
        const systemPromptTemplate = fs.readFileSync(systemPromptPath, 'utf8');
        console.log('Prompt templates loaded successfully');

        // Fill in the user prompt template with actual content
        const userPrompt = userPromptTemplate
            .replace('{{CV_CONTENT}}', cvContent)
            .replace('{{JOB_DESCRIPTION}}', jobDescription)
            .replace('{{ATS_STRATEGY}}', atsStrategy);

        console.log('Sending request to OpenAI...');

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: systemPromptTemplate
                },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.5, // Lower temperature for more consistent and factual responses
        });

        const tailoredCV = completion.choices[0].message.content;

        if (!tailoredCV) {
            throw new Error('Failed to get a response from OpenAI');
        }

        // Extract just the YAML content (in case there's any additional text)
        const yamlMatch = tailoredCV.match(/```yaml\n([\s\S]*?)```/) ||
            tailoredCV.match(/```\n([\s\S]*?)```/) ||
            [null, tailoredCV];

        const cleanYaml = yamlMatch[1] || tailoredCV;

        // Save the tailored CV
        fs.writeFileSync(outputPath, cleanYaml);

        console.log(`Tailored CV saved to ${outputPath}`);

        return outputPath;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Usage
// Example usage (if this file is run directly)
if (require.main === module) {
    const jobDescriptionPath = path.join(__dirname, '..', 'inputs', 'example', 'job-description.txt');
    const outputPath = path.join(__dirname, '..', 'outputs', 'example', 'tailored-cv.yaml');
    tailorCV(jobDescriptionPath, outputPath)
        .then(() => console.log('Process completed'))
        .catch(err => console.error('Process failed:', err));
}
