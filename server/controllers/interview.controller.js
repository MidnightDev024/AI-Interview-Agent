import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.service.js";

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