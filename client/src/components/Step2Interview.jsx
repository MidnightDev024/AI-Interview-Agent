import React, { useEffect } from 'react'
import maleVideo from "../assets/videos/male.mp4"
import femaleVideo from "../assets/videos/female.mp4"
import Timer from './Timer';
import { motion } from 'motion/react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { useState, useRef } from 'react';
import { set } from 'mongoose';

const Step2SetUp = ({interviewData, onFinish}) => {
  const {interviewId, questions, username} = interviewData;
  const [isIntroPhase, setIsIntroPhase] = React.useState(true);
  const [isMicOn, setIsMicOn] = React.useState(true);
  const recognitionRef = React.useRef(null);
  const [isAIPlaying, setIsAIPlaying] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [answer, setAnswer] = React.useState("");
  const [feedback, setFeedback] = React.useState("");
  const [timeLeft, setTimeLeft] = React.useState(
    questions[currentIndex]?.timeLimit || 60
  );
  const [selectedVoice, setSelectedVoice] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [voiceGender, setVoiceGender] = React.useState(interviewData?.gender || "male");
  const [subtitle, setSubtitle] = React.useState("");

  const videoRef = React.useRef(null);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if(!voices.length) return;

      // Try known female voices first
      const femaleVoices = voices.filter(voice =>
        voice.name.toLowerCase().includes("zira") ||
        voice.name.toLowerCase().includes("susan") ||
        voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("amy") ||
        voice.name.toLowerCase().includes("emma") ||
        voice.name.toLowerCase().includes("alloy") ||
        voice.name.toLowerCase().includes("nora") ||
        voice.name.toLowerCase().includes("lisa") ||
        voice.name.toLowerCase().includes("karen") ||
        voice.name.toLowerCase().includes("victoria") ||
        voice.name.toLowerCase().includes("samantha") 
      );
      if(femaleVoices.length) {
        setSelectedVoice(femaleVoices[0]);
        setVoiceGender("female");
        return;
      };

      // Try known male voices
      const maleVoices = voices.filter(voice =>
        voice.name.toLowerCase().includes("david") ||
        voice.name.toLowerCase().includes("john") ||
        voice.name.toLowerCase().includes("michael") ||
        voice.name.toLowerCase().includes("thomas") ||
        voice.name.toLowerCase().includes("robert") ||
        voice.name.toLowerCase().includes("william") ||
        voice.name.toLowerCase().includes("james") ||
        voice.name.toLowerCase().includes("richard") ||
        voice.name.toLowerCase().includes("charles") ||
        voice.name.toLowerCase().includes("joseph")
      );
      if(maleVoices.length) {
        setSelectedVoice(maleVoices[0]);
        setVoiceGender("male");
        return;
      }

      // Fallback: first voice (asume male)
      setSelectedVoice(voices[0]);
      setVoiceGender("male");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

  },[])

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  /* ------------ Speak Function -------------- */
      const speakText = (text) => {
        return new Promise((resolve) => {
          if(!window.speechSynthesis || !selectedVoice) {
            resolve();
            return;
          }

          window.speechSynthesis.cancel();

          // Add natural pause after commas and periods
          const humanText = text
            .replace(/,/g, ", ...")
            .replace(/\./g, ". ...");

            const utterance = new SpeechSynthesisUtterance(humanText);

            utterance.voice = selectedVoice;

            // Human-like pacing 
            utterance.rate = 0.92; // Slightly slower than normal
            utterance.pitch = 1.05; // small warmth increase
            utterance.volume = 1; // Full volume

            utterance.onstart = () => {
              setIsAIPlaying(true);
              videoRef.current?.play();
            };

            utterance.onend = () => {
              videoRef.current?.pause();
              videoRef.current.currentTime = 0;
              setIsAIPlaying(false);

              setTimeout(() => {
                setSubtitle("");
                resolve();
              }, 300); // Short pause after speaking
            };

            setSubtitle(text);
            window.speechSynthesis.speak(utterance);
        });
      };

      useEffect(() => {
        if(!selectedVoice) return;
        const runIntro = async () => {
          if(isIntroPhase) {
            await speakText(
              `Hello ${username || 'there'}, it's great to meet you today. I hope you're feeling confident and ready.`
            );

            await speakText(
              "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin."
            );

            setIsIntroPhase(false);
        }else if(currentQuestion) {
          await new Promise(resolve => setTimeout(resolve, 500)); // Short pause before question

          // if Last Question (Hard Level)
          if(currentIndex === questions.length - 1) {
            await speakText(
              "Alright, this one might be a bit more challenging."
            );
          }

          await speakText(currentQuestion.questionText);
        }
      };

        runIntro();
      },[selectedVoice, isIntroPhase, currentIndex]);

      useEffect(() => {
        if(isIntroPhase) return;
        if(!currentQuestion) return;

        setTimeLeft(currentQuestion?.timeLimit || 60);

        const timer = setInterval(() => {
          setTimeLeft((prev) => {
            if(prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        },1000);

        return () => clearInterval(timer);
      },[isIntroPhase, currentIndex, currentQuestion])


      /* ---------  Convert voice into text -----------  */

      useEffect(() => {
        if(!("webkitSpeechRecognition" in window)) return;
        
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = true;
        recognition.continuous = true;

        recognition.onresult = (event) => {
          const transcript =
          event.results[event.results.length - 1][0].transcript;
        }

        recognitionRef.current = recognition;
      },[])

      const startMic = () => {
        if(!recognitionRef.current) return;
        try {
          recognitionRef.current.start();
        } catch (error) {

        }
      };

      const stopMic =() => {
        if(!recognitionRef.current) {
        recognitionRef.current.stop();
        }
      }

      const toggleMic = () => {
        if(isMicOn) {
          stopMic();
        } else {
          startMic();
        }
        setIsMicOn(!isMicOn);
      }

  return (
    <div className='min-h-screen bg-gradiant-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-4 sm:p-6'>
      <div className='w-full max-w-350 min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden'>

        {/* video section */}

        <div className='w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200'>
          <div className='w-full m-w-md rounded-2xl overflow-hidden shadow-xl'>
            <video 
            src={videoSource}
            key={videoSource}
            ref={videoRef} 
            muted
            playsInline
            preload='auto'
            className='w-full h-auto object-cover' />
          </div>

          {/* subtitle */}

          {subtitle && (
            <div className='w-full max-w-md bg-gray-50 border border-gray-20 rounded-xl p-4 shadow-sm'>
              <p className='text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed'>{subtitle}</p>
            </div>
          )}

          {/* timer area */}

          <div className='w-full max-w-md bg-white border border-gray-200 rounded-2xl shaddow-md p-6 space-y-5'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-500'>
                Interview status
              </span>
              {isAIPlaying &&(<span className='text-sm font-semibold text-emerald-600'>
                {isAIPlaying ? "AI Speaking" : "AI Listening" }
              </span>)}
            </div>

            <div className='h-px bg-gray-200'></div>

            <div className='flex justify-center'>
              <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit || 60} />
            </div>

            <div className='h-px bg-gray-200'></div>

            <div className='grid grid-cols-2 gap-6 text-center'>
            <div>
              <span className='text-2xl font-bold text-emerald-600'>{currentIndex + 1}</span>
              <span className='text-xs text-gray-400'>Current Question</span>
            </div>

            <div>
              <span className='text-2xl font-bold text-emerald-600'>{questions.length}</span>
              <span className='text-xs text-gray-400'>Total Questions</span>
            </div>
            </div>
          </div>
        </div>

        {/* text section */}
      
        <div className='flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative'>
          <h2 className='text-xl sm:text-2xl font-bold text-emerald-600 mb-6'>
            AI Smart Interview
          </h2>

          {!isIntroPhase && (<div className='relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm'>
            <p className='text-xs sm:text-sm text-gray-400 mb-2'>
              Question {currentIndex + 1} of {questions.length}
            </p>

            <div className='text-base sm:text-lg font-semibold text-gray-800 leading-relaxed'>
              {currentQuestion?.questionText}
              </div>
          </div>)}

          <textarea 
          onChange={(e) => setAnswer(e.target.value)}
          value={answer}
          placeholder='Type your answer here...'
          className='flex-1 bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition text-gray-800' />

          <div className='flex items-center gap-4 mt-6'>
            <motion.button 
            whileTap={{ scale:0.9 }}
            className='w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black text-white shadow-lg'>
              <FaMicrophone 
              size={20} 
              />
            </motion.button>
            <motion.button
            whileTap={{ scale:0.95 }}
            className='flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold'>
                Submit Answer   
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step2SetUp