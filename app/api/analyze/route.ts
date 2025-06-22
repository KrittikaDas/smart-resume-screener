import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Mock PDF text extraction function
// In a real implementation, you would use pdf-parse or similar
async function extractTextFromPDF(file: File): Promise<string> {
  // This is a mock implementation
  // In production, you would use pdf-parse or similar library
  return `
    John Doe
    Software Engineer
    
    Experience:
    - 5 years of experience in full-stack development
    - Proficient in React, Node.js, Python, and SQL
    - Led a team of 3 developers on multiple projects
    - Implemented CI/CD pipelines and automated testing
    - Experience with cloud platforms (AWS, Azure)
    
    Education:
    - Bachelor's in Computer Science
    - Certified in AWS Solutions Architecture
    
    Skills:
    - JavaScript, TypeScript, Python, Java
    - React, Next.js, Vue.js
    - Node.js, Express, Django
    - PostgreSQL, MongoDB
    - Docker, Kubernetes
    - Git, Jenkins, GitHub Actions
  `
}

// Fallback analysis function when OpenAI API is not available
function generateFallbackAnalysis(resumeText: string, jobDescription: string) {
  // Simple keyword matching for demo purposes
  const resumeKeywords = resumeText.toLowerCase().split(/\s+/)
  const jobKeywords = jobDescription.toLowerCase().split(/\s+/)

  const commonKeywords = resumeKeywords.filter((word) => jobKeywords.includes(word) && word.length > 3)

  const matchScore = Math.min(90, Math.max(45, (commonKeywords.length / jobKeywords.length) * 100))

  return {
    matchScore: Math.round(matchScore),
    feedback: [
      "Your resume demonstrates relevant technical experience for this position",
      "Strong background in software development aligns with job requirements",
      "Leadership experience mentioned shows potential for senior-level responsibilities",
      "Technical skills portfolio covers most of the required technologies",
      "Professional experience duration meets the job's experience requirements",
    ],
    improvements: [
      "Consider adding specific metrics to quantify your achievements (e.g., 'Improved system performance by 30%')",
      "Include more keywords from the job description to improve ATS compatibility",
      "Add a professional summary section highlighting your most relevant experience",
      "Expand on your most recent projects with concrete examples of impact",
      "Consider reorganizing sections to prioritize most relevant experience first",
    ],
    coverLetter: `Dear Hiring Manager,

I am excited to apply for this position at your organization. With my extensive background in software development and proven track record of delivering high-quality solutions, I am confident I would be a valuable addition to your team.

My experience includes comprehensive full-stack development expertise, with proficiency in the core technologies mentioned in your job posting. I have successfully led development teams and implemented modern practices including automated testing and CI/CD pipelines, which directly aligns with your requirements.

What particularly attracts me to this role is the opportunity to work on challenging projects that leverage my technical skills while contributing to meaningful business outcomes. I am eager to bring my problem-solving abilities and collaborative approach to your development team.

I would welcome the opportunity to discuss how my experience and enthusiasm can contribute to your organization's continued success. Thank you for considering my application.

Best regards,
[Your Name]`,
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const resumeFile = formData.get("resume") as File
    const jobDescription = formData.get("jobDescription") as string

    if (!resumeFile || !jobDescription) {
      return NextResponse.json({ error: "Resume file and job description are required" }, { status: 400 })
    }

    // Extract text from PDF
    const resumeText = await extractTextFromPDF(resumeFile)

    let analysisResult

    // Check if OpenAI API key is available
    const openaiApiKey = process.env.OPENAI_API_KEY

    if (openaiApiKey) {
      try {
        // Generate analysis using AI
        const { text } = await generateText({
          model: openai("gpt-4o", {
            apiKey: openaiApiKey,
          }),
          system: `You are an expert resume screener and career advisor. Analyze the provided resume against the job description and provide a comprehensive evaluation.

Your response must be in the following JSON format:
{
  "matchScore": <number between 0-100>,
  "feedback": [
    "<feedback point 1>",
    "<feedback point 2>",
    "<feedback point 3>",
    "<feedback point 4>",
    "<feedback point 5>"
  ],
  "improvements": [
    "<improvement suggestion 1>",
    "<improvement suggestion 2>",
    "<improvement suggestion 3>",
    "<improvement suggestion 4>",
    "<improvement suggestion 5>"
  ],
  "coverLetter": "<personalized cover letter content>"
}

Guidelines:
- Match score should reflect how well the resume aligns with job requirements
- Feedback should highlight strengths and areas for improvement
- Improvements should be specific, actionable suggestions
- Cover letter should be professional and tailored to the specific job
- Keep feedback and improvements concise but informative`,
          prompt: `Resume Content:
${resumeText}

Job Description:
${jobDescription}

Please analyze this resume against the job description and provide your evaluation in the specified JSON format.`,
        })

        // Parse the AI response
        try {
          analysisResult = JSON.parse(text)
        } catch (parseError) {
          console.warn("Failed to parse AI response, using fallback")
          analysisResult = generateFallbackAnalysis(resumeText, jobDescription)
        }
      } catch (aiError) {
        console.warn("AI analysis failed, using fallback:", aiError)
        analysisResult = generateFallbackAnalysis(resumeText, jobDescription)
      }
    } else {
      console.log("OpenAI API key not found, using fallback analysis")
      analysisResult = generateFallbackAnalysis(resumeText, jobDescription)
    }

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 })
  }
}
