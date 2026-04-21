import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { serverURL } from '../App.jsx';
import Step3Report from '../components/Step3Report.jsx';

function InterviewReport() {
  const {id} = useParams()
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await axios.get(serverURL + `/api/interview/report/${id}`, { withCredentials: true });
        console.log(result.data)
        setReport(result.data);
      } catch (error) {
        console.log(error)
      }
    }
    fetchReport();
  }, [id])

  if(!report) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-500 text-lg'>
          Loading Report...
        </p>
      </div>
    );
  }

  return <Step3Report report={report} />
}

export default InterviewReport
