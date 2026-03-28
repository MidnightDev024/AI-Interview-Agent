import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.service.js";
import { use } from "react";

export const analyzeResume = async (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({ message: "Resume required" });
        }
        const filepath = req.file.path;

        const filebuffer = await fs.promises.readFile(filepath);
        const uint8Array = new Uint8Array(filebuffer);

        const pdf = await pdfjsLib.getDocument({data: uint8Array}).promise;

        let resumeText = "";

        // Extract text from all pages
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const Content = await page.getTextContent();
            const pageText = Content.items.map(item => item.str).join(" ");
            resumeText += pageText + "\n";
        }

        resumeText = resumeText.replace(/\s+/g, " ").trim();

        const messages = [
            {
                role: "system",
                content: `Extract structured data from resumeText.
                
                Return strictly JSON:
                
                {
                    "role": "string",
                    "experience": "string",
                    "projects": ["project1, project2, ..."],
                    "skills": ["skill1, skill2, ..."],
                }`
            },
            {
                role: "user",
                content: `Resume Text: ${resumeText}`
            }
        ];


    const aiResponse = await askAi(messages)

        const parsed = JSON.parse(aiResponse)

        fs.unlinkSync(filepath);

        res.json({
            role: parsed.role,
            experience: parsed.experience,
            projects: parsed.projects,
            skills: parsed.skills,
            resumeText
        })

    } catch (error) {
        console.error("Error analyzing resume:", error);
        
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({ message: error.message });
    }
};


export const genrateQuestions = async (req, res) => {
    try {
        const {role, experience, mode, resumeText, projects, skills} = req.body;

        role = role?.trim()
        experience = experience?.trim()
        mode = mode?.trim()

        if(!role || !experience || !mode) {
            return res.status(400).json({message: "Role, experience and mode are required"})
        }

        const user = await User.findById(req.user._id); 

        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        if (user.credits < 50) {
            return res.status(403).json({message: "Not enough credits. Minimum 50 credits required to generate questions."});
        }

        const projectText = Array.isArray(projects) && projects.length ? projects.join(", ") : "None";

        const skillText = Array.isArray(skills) && skills.length ? skills.join(", ") : "None";

        const safeResume = resumeText?.trim() || "None";

        const userPrompt = `
        Role: ${role}
        Experience: ${experience}
        InterviewMode: ${mode}
        Projects: ${projectText}
        Skills: ${skillText}
        Resume: ${safeResume}
        `;

        if(!userPrompt.trim()) {
            return res.status(400).json({message: "Insufficient information to generate questions."})
        }

        const messages = [
            {
                role: "system",
                content: `You are a real human interviewer conducting a professional interview.
                
                speak in simple, natural English as if you are talking to the candidate.

                Genrate Exactly 5 interview questions

                Strict Rules:
                - Each question must contain between 15 and 25 words.
                - Each question must be a single complete sentence.
                - Do NOT number them. 
                - Do NOT add extra text before or after.
                - Do NOT add extra text before or after.
                - One question per line only.
                - Keep language simple and conversational.
                -Questions must feel practical and realistic.

                Difficulty progression: 
                Question 1 -> easy
                Question 2 -> easy
                Question 3 -> medium
                Question 4 -> medium
                Question 5 -> Hard

                Make queestions based on the candidate's Role, Experience, InterviewMode, Projects, Skills and Resume Details.
                `
            },
            {
                role: "user",
                content: userPrompt
            }
        ];

        const aiResponse = await askAi(messages)

        if(!aiResponse || !aiResponse.trim()) {
            return res.status(500).json({message: "Ai Response is empty."});
        }

        const questionsArray = aiResponse
        .split("\n")
        .map(q => q.trim())
        .filter(q => q.length > 0)
        .slice(0, 5);

        if(questionsArray.length === 0) {
            return res.status(500).json({message: "Failed to generate questions. Please try again."});
        }

        user.credits -= 50;
        await user.save();

        const interview = await interview.create({
            userId: user._id,
            role,
            experience,
            mode,
            resumeText: safeResume,
            questions: questionsArray.map((q, index) => ({
                questions: q,
                difficulty: ["easy", "easy", "medium", "medium", "hard"][index],
                timeLimit: [60, 60, 90, 90, 120][index],
            }))
        })

        res.json({
            interviewId: interview._id,
            creditsLeft: user.credits,
            username: user.username,
            questions: interview.questions
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "An error occurred while generating questions.", error});
    }
}

