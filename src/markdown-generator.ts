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

/**
 * Converts a YAML CV file to Markdown format using OpenAI
 * @param yamlPath Path to the YAML CV file
 * @param outputPath Path where the markdown file will be saved
 * @param jobDescriptionPath Path where the job description has been set
 */
export async function convertYamlToMarkdown(
  yamlPath: string,
  outputPath: string,
  jobDescriptionPath: string,
): Promise<string> {
  try {
    // Read the YAML CV file
    const yamlContent = fs.readFileSync(yamlPath, 'utf8');
    console.log('YAML CV loaded successfully');

    // Read the ATS strategy document
    const strategyPath = path.join(__dirname, '..', 'meta', 'strategy.txt');
    const atsStrategy = fs.readFileSync(strategyPath, 'utf8');
    console.log('ATS strategy loaded successfully');

    // Read the job description
    const jobDescription = fs.readFileSync(jobDescriptionPath, 'utf8');
    console.log('Job description loaded successfully');

    // Read the prompt templates
    const systemPromptPath = path.join(__dirname, '..', 'prompts', 'markdown-generator', 'system-prompt.txt');
    const systemPrompt = fs.readFileSync(systemPromptPath, 'utf8');
    const userPromptPath = path.join(__dirname, '..', 'prompts', 'markdown-generator', 'user-prompt.txt');
    const userPromptTemplate = fs.readFileSync(userPromptPath, 'utf8');
    console.log('Prompt templates loaded successfully');

    // Fill in the user prompt template with actual content
    const userPrompt = userPromptTemplate
      .replace('{{YAML_CONTENT}}', yamlContent)
      .replace('{{JOB_DESCRIPTION}}', jobDescription)
      .replace('{{ATS_STRATEGY}}', atsStrategy);

    console.log('Sending request to OpenAI...');

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.1,
    });

    let markdownContent = completion.choices[0].message.content;

    if (!markdownContent) {
      throw new Error('Failed to get a response from OpenAI');
    }

    // Clean up the markdown content by removing code block delimiters if present
    markdownContent = markdownContent.replace(/^```markdown\s*\n/, '');
    markdownContent = markdownContent.replace(/^```\s*\n/, '');
    markdownContent = markdownContent.replace(/\n```\s*$/, '');

    console.log('Cleaned up markdown content');

    // Save the Markdown content
    fs.writeFileSync(outputPath, markdownContent);

    console.log(`Markdown CV saved to ${outputPath}`);

    return outputPath;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Example usage (if this file is run directly)
if (require.main === module) {
  const yamlPath = path.join(__dirname, '..', 'outputs', 'example', 'tailored-cv.yaml');
  const outputPath = path.join(__dirname, '..', 'outputs', 'example', 'tailored-cv.md');
  const jobDescriptionPath = path.join(__dirname, '..', 'inputs', 'example', 'job-description.txt');
  convertYamlToMarkdown(
    yamlPath,
    outputPath,
    jobDescriptionPath,
  )
    .then(() => console.log('Markdown generation completed'))
    .catch(err => console.error('Markdown generation failed:', err));
}
