"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, Zap, Star, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Navigation from "@/components/navigation"

export default function HomePage() {
  const [resume, setResume] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setResume(file)
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      })
    }
  }

  const handleAnalyze = async () => {
    if (!resume || !jobDescription.trim()) {
      toast({
        title: "Missing information",
        description: "Please upload a resume and provide a job description.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append("resume", resume)
      formData.append("jobDescription", jobDescription)

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const result = await response.json()

      // Store results in sessionStorage for the results page
      sessionStorage.setItem("analysisResult", JSON.stringify(result))
      router.push("/analyze")
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">Smart Resume Screener</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Get AI-powered insights on how well your resume matches job descriptions. Receive personalized feedback and
            improvement suggestions.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="flex flex-col items-center p-6">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mb-4">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Advanced AI analyzes your resume against job requirements
              </p>
            </div>

            <div className="flex flex-col items-center p-6">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mb-4">
                <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Match Score</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Get a precise compatibility score from 0-100</p>
            </div>

            <div className="flex flex-col items-center p-6">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full mb-4">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Personalized Feedback</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Receive detailed suggestions and cover letter generation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Analyze Your Resume</CardTitle>
              <CardDescription className="text-center">
                Upload your resume and paste the job description to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Resume Upload */}
              <div className="space-y-2">
                <Label htmlFor="resume">Resume (PDF)</Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Input id="resume" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                  <Label htmlFor="resume" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {resume ? resume.name : "Click to upload your resume (PDF only)"}
                    </p>
                  </Label>
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
              </div>

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !resume || !jobDescription.trim()}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Analyze Resume
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
