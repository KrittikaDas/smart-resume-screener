# 🧠 Smart Resume Screener  
> **AI-powered tool to evaluate resumes, generate feedback, and suggest improvements using LLMs (GPT-4)**

---

## 🚀 Overview

**Smart Resume Screener** is a full-stack GenAI-powered application that helps job applicants and recruiters evaluate how well a resume matches a given job description. It uses the **OpenAI GPT-4 API** to generate:

- ✅ A match score (0–100)
- ✅ Bullet point rewrites
- ✅ Feedback on resume gaps
- ✅ A customized cover letter

The platform is built with **Next.js**, **TailwindCSS**, **Node.js**, and **Express**, and deployed seamlessly on **Vercel**.

---

## 🔧 Features

- 📄 **Upload Resume** (PDF format)
- 🧾 **Paste Job Description** input field
- 🧠 **GPT-4 Evaluation**: Match score + feedback
- ✍️ **Bullet Point Rewriter**
- 💌 **Auto Cover Letter Generator**
- 📊 **Dynamic UI with real-time feedback**
- ☁️ **Deployed on Vercel**

---

## 🧰 Tech Stack

| Frontend     | Backend       | AI/LLM           | Deployment |
|--------------|----------------|------------------|-------------|
| Next.js      | Node.js        | OpenAI GPT-4 API | Vercel      |
| Tailwind CSS | Express.js     | Custom Prompts   |             |
| pdf-parse    |                |                  |             |

---

## 🛠️ Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/KrittikaDas/smart-resume-screener.git
cd smart-resume-screener

# 2. Install dependencies
npm install

# 3. Set up environment variables
touch .env.local
# Add your OpenAI API key in the .env.local file:
OPENAI_API_KEY=your_openai_key_here

# 4. Run the development server
npm run dev

# 5. Open in browser
http://localhost:3000


---

🧠 How LLM Is Used
Takes resume text (parsed from uploaded PDF) and job description as inputs.

Sends both to OpenAI GPT-4 API via a custom prompt.

Receives and renders:

🎯 A match score (0–100)

📌 Key feedback points on missing skills or gaps

✍️ Improved resume bullet point suggestions

💌 A customized cover letter

Ensures prompt consistency and response structure for clean UI display.

📦 Future Enhancements
 Store and view result history

 Add user authentication

 Include multi-role prompt templates

 Support resume export as PDF

 Add voice-based JD input for accessibility

👨‍💻 Author
Krittika Das

📄 License
This project is licensed under the MIT License.
This project is licensed under the [MIT License](LICENSE).
