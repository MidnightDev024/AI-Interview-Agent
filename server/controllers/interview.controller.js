import fs from "fs";
import pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";

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

        
    } catch (error) {
        console.error("Error analyzing resume:", error);
        return res.status(500).json({ message: "Error analyzing resume" });
    }
}