import React from 'react';
import Step1SetUp from '../components/Step1SetUp';
import Step2Interview from '../components/Step2Interview';
import Step3Report from '../components/Step3Report';

const InterviewPage = () => {
    const [step, setStep] = React.useState(1);
    const [interviewData, setInterviewData] = React.useState(null);

  return (
    <div className='min-h-screen bg-gray-50'>
        {step===1 && (
            <Step1SetUp 
            onStart={(Data) => { 
                setInterviewData(Data);
                setStep(2) ;
            }} />
        )}
        {step===2 && (
            <Step2Interview interviewData={interviewData}
            onFinish={(report) => {
                setInterviewData(report)
                setStep(3);
            }} 
            />
        )}
        {step===3 && (
            <Step3Report report={interviewData} 
            />
        )}
    
    </div>
    )
}

export default InterviewPage
