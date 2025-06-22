"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, ArrowLeft, Copy, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Navigation from "@/components/navigation"

interface AnalysisResult {
  matchScore: number
  feedback: string[]
  improvements: string[]
  coverLetter: string
}

export default function AnalyzePage() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isImprovementsOpen, setIsImprovementsOpen] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(true)
  const [coverLetter, setCoverLetter] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const storedResult = sessionStorage.getItem("analysisResult")
    if (storedResult) {
      const parsedResult = JSON.parse(storedResult)
      setResult(parsedResult)
      setCoverLetter(parsedResult.coverLetter)
    } else {
      router.push("/")
    }
  }, [router])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard.",
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={() => router.push("/")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Upload
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resume Analysis Results</h1>
          </div>

          {/* Match Score */}
          <Card className="mb-8 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Match Score</CardTitle>
              <CardDescription>How well your resume matches the job description</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4">
                <span className={`text-6xl font-bold ${getScoreColor(result.matchScore)}`}>{result.matchScore}</span>
                <span className="text-2xl text-gray-500">/100</span>
              </div>
              <Progress value={result.matchScore} className="mb-4" />
              <Badge variant={getScoreBadgeVariant(result.matchScore)} className="text-lg px-4 py-2">
                {result.matchScore >= 80
                  ? "Excellent Match"
                  : result.matchScore >= 60
                    ? "Good Match"
                    : "Needs Improvement"}
              </Badge>
            </CardContent>
          </Card>

          {/* Feedback Section */}
          <Card className="mb-8 shadow-lg">
            <Collapsible open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>AI Feedback</CardTitle>
                      <CardDescription>Detailed analysis of your resume</CardDescription>
                    </div>
                    {isFeedbackOpen ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <ul className="space-y-3">
                    {result.feedback.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-1 mr-3 mt-1">
                          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Improvements Section */}
          <Card className="mb-8 shadow-lg">
            <Collapsible open={isImprovementsOpen} onOpenChange={setIsImprovementsOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Suggested Improvements</CardTitle>
                      <CardDescription>Recommended changes to boost your match score</CardDescription>
                    </div>
                    {isImprovementsOpen ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <ul className="space-y-3">
                    {result.improvements.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-green-100 dark:bg-green-900 rounded-full p-1 mr-3 mt-1">
                          <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Cover Letter Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generated Cover Letter</CardTitle>
                  <CardDescription>
                    AI-generated cover letter based on your resume and the job description
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(coverLetter)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={12}
                className="resize-none"
                placeholder="Your personalized cover letter will appear here..."
              />
              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={() => copyToClipboard(coverLetter)} className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const blob = new Blob([coverLetter], { type: "text/plain" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = "cover-letter.txt"
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
