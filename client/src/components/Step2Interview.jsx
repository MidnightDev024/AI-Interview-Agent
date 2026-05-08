import React, { useEffect } from 'react'
import maleVideo from "../assets/videos/male.mp4"
import femaleVideo from "../assets/videos/female.mp4";
import Timer from './Timer.jsx';
import { serverURL } from '../App.jsx';
import { motion } from 'motion/react';
import { FaArrowRight, FaMicrophone , FaMicrophoneSlash } from 'react-icons/fa';
import { useState } from 'react';
import { useRef } from 'react';
import axios from 'axios';

function Step2Interview({interviewData, onFinish}) {
  
  const {interviewId, questions, username} = interviewData;
  const [isIntroPhase, setIsIntroPhase] = React.useState(true);
  const [isMicOn, setisMicOn] = useState(true);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[currentIndex]?.timeLimit || 60);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState(maleVideo);
  const [subtitle, setSubtitle] = useState("");
  const recognitionRef = useRef(null);
  const micEnabledRef = useRef(isMicOn);
  const aiPlayingRef = useRef(isAIPlaying);
  const videoRef = useRef(null);
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    micEnabledRef.current = isMicOn;
  }, [isMicOn]);

  useEffect(() => {
    aiPlayingRef.current = isAIPlaying;
  }, [isAIPlaying]);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      // try known for Female voices
      const femaleVoices = 
      voices.find(v => 
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("susan") ||
        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("samantha") 
      )
      if (femaleVoices) {
        setSelectedVoice(femaleVoices);
        setVoiceGender("female")
        return;
      }

      // try known for male voices
      const maleVoices =
      voices.find(v =>
        v.name.toLowerCase().includes("david") ||
        v.name.toLowerCase().includes("john") ||
        v.name.toLowerCase().includes("male") ||
        v.name.toLowerCase().includes("mark") 
      )
      if (maleVoices) {
        setSelectedVoice(maleVoices);
        setVoiceGender("male");
        return;
      }

      // fallback to first voice
      setSelectedVoice(voices[0]);
      setVoiceGender("male");

    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [])

  const videoSource = (voiceGender === "male") ? maleVideo : femaleVideo;

  // ---------- Speak Function ------------- //
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !text ) {
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

        // Human Like Pase
        utterance.rate = 0.92; // Slightly slower than normal
        utterance.pitch = 1.05; // Small warmth increase
        utterance.volume = 1; // Full volume

        utterance.onstart = () => {
          setIsAIPlaying(true);
          stopMic();
          videoRef.current?.play();
        };

        utterance.onend = () => {
          videoRef.current?.pause();
          videoRef.current.currentTime = 0;
          setIsAIPlaying(false)

          if (isMicOn) {
            startMic();
          }

          setTimeout(() => {
            setSubtitle("");
            resolve();
          },300);
        }

        setSubtitle(text);

        window.speechSynthesis.speak(utterance);
    })
  }

  useEffect(() => {
    if(!selectedVoice) return;

    const runIntro = async () => {
      if(isIntroPhase) {
        await speakText(
          `Hi ${username || 'there'}, it's great to meet you today. I hope you're feeling confident and ready.`
        );

        await speakText(
          `I'll ask you a few questions. Just answer naturally, and take your time. Let's begin.`
        );
        setIsIntroPhase(false);
      } else if(currentQuestion) {
        await new Promise(r => setTimeout(r, 500))

        // If last question (Very Hard)
        if(currentIndex === questions.length - 1) {
          await speakText
          (
            "Alright, this one might be a bit more challenging."
          )
        }
          await speakText(currentQuestion?.questionText || currentQuestion?.question || "");
        
          if (isMicOn) {
            startMic();
          }
        
      }
    }

    runIntro();
  } , [selectedVoice, isIntroPhase, currentIndex, currentQuestion])

  useEffect(() => {
    if(isIntroPhase)return;
    if(!currentQuestion)return;
    if(isSubmitting)return;
    setTimeLeft(currentQuestion.timeLimit || 60);

    const timer = setInterval(() => {
      setTimeLeft((pre) => {
        if(pre <= 1) {
          clearInterval(timer);
          return 0;
        }
        return pre - 1;
      })
    }, 1000)
    return () => clearInterval(timer);
    
  },[isIntroPhase, currentIndex, currentQuestion, isSubmitting])

  useEffect(() => {
    if(!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;

      setAnswer((prev) => (prev ? `${prev} ` : "") + transcript);
    }

    recognition.onend = () => {
      if (micEnabledRef.current && !aiPlayingRef.current) {
        setTimeout(() => {
          startMic();
        }, 250);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognitionRef.current = recognition;
  }, []);

  const startMic = () => {
    if (recognitionRef.current && !aiPlayingRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
      }
    }
  };

  const stopMic = () => {
    if(recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setisMicOn(!isMicOn);
  }

  const submitAnswer = async () => {
    if(isSubmitting)return;
    stopMic();
    setIsSubmitting(true);

    try {
      const result = await axios.post(serverURL + "/api/interview/submit-answer", {
        interviewId,
        questionIndex : currentIndex,
        answer: answer.trim(),
        timeTaken: currentQuestion.timeLimit - timeLeft,
      }, {withCredentials: true});

      setFeedback(result.data.feedback)
      speakText(result.data.feedback)
      setIsSubmitting(false)
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  }

  const handleNext = async () => {
    setAnswer("");
    setFeedback("");

    if(currentIndex + 1 >= questions.length) {
      finishInterview();
      return
  }

  await speakText("Alright, let's move to the next question.");

  setCurrentIndex(currentIndex + 1);
  setTimeout(() => {
    if(isMicOn) startMic();
  }, 500)
}

const finishInterview = async () => {
  stopMic();
  setisMicOn(false);
  toggleMic(false);
  try {
    const result = await axios.post(serverURL + "/api/interview/finish", {interviewId}, {withCredentials: true});

    console.log(result.data);
    onFinish(result.data);
  } catch (error) {
    console.log(error);

  }
}

useEffect(() => {
  if (isIntroPhase) return;
  if (!currentQuestion) return;

  if (timeLeft === 0 && !isSubmitting && !feedback) {
    submitAnswer();
  }
}, [timeLeft])

useEffect(() => {
  return () => {
    if(recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current.abort();
    }

    window.speechSynthesis.cancel();
  }
}, [])

  return (
    <div className='min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-4 sm:p-6'>
      <div className='w-full max-w-350 min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden'>

        {/* ----- video section ------ */}
        <div className='w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200'>
          <div className='w-full m-w-md rounded-2xl overflow-hidden shadow-xl'>
            <video
            muted
            className='w-full h-auto object-cover'
            src={videoSource}
            key={videoSource}
            ref={videoRef}
            />
          </div>

          {/* subtitle area */}
          {subtitle && (<div className='w-full max-w-md bg-gray-50 border border-gray-20 rounded-xl p-4 shadow-sm'>
            <p className='text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed'>{subtitle}</p>
          </div>)}

          {/* timmer */}
          <div className='w-full max-w-md bg-white border border-gray-200 rounded-2xl shaddow-md p-6 space-y-5'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-500'>
                Interview status
              </span>
              { isAIPlaying && (<span className='text-sm font-semibold text-emerald-600'>{isAIPlaying ? "AI Speaking" : ""}</span>)}
            </div>
            <div className='h-px bg-gray-200'></div>
            <div className='flex justify-center'>
              <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit || 60} />
            </div>
            <div className='h-px bg-gray-200'></div>
            <div className='grid grid-cols-2 gap-6 text-center'>
              <div>
                <span className='text-2xl font-bold text-emerald-600'>{currentIndex + 1}</span>
                <span className='text-xs text-gray-400'>current Question</span>
              </div>

              <div>
                <span className='text-2xl font-bold text-emerald-600'>{questions.length}</span>
                <span className='text-xs text-gray-400'>Total Questions</span>
              </div>
            </div>
          </div>
        </div>

        {/* ----- text Section ------ */}
        <div className='flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative'>
          <h2  className='text-xl sm:text-2xl font-bold text-emerald-600 mb-6'> AI Smart Interview</h2>
          {!isIntroPhase && (<div className='relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm'>
            <p className='text-xs sm:text-sm text-gray-400 mb-2'>Question {currentIndex + 1} of {questions.length}</p>
            <div className='text-base sm:text-lg font-semibold text-gray-800 leading-relaxed'>{currentQuestion?.questionText}</div>
          </div>)}
          <textarea 
          onChange={(e) => setAnswer(e.target.value)}
          value={answer}
          placeholder='Type your answer here...'
          className='flex-1 bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition text-gray-800'></textarea>
          {!feedback ? (<div className='flex items-center gap-4 mt-6'>
            <motion.div 
            onClick={toggleMic}
            whileTap={{ scale:0.9 }}
            className='w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black text-white shadow-lg'>
              {isMicOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
            </motion.div>
            <motion.button
            onClick={submitAnswer}
            disabled={isSubmitting}
            whileTap={{ scale:0.95 }}
            className='flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed' >
              {isSubmitting?"submitting..":'Submit Answer'}
            </motion.button>
          </div>) : (
            <motion.div 
            initial= {{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='mt-6 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm'>
              <p className='text-emerald-700 font-medium mb-4'>{feedback}</p>

              <button
              onClick={handleNext} 
              className='w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-1'>
                {currentIndex === questions.length - 1 ? "Finish Interview" : <><span className='font-medium'>Next Question</span><FaArrowRight size={16} /></>}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Step2Interview