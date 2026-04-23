// import React, { useState } from 'react'
// import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
// import { useNavigate } from 'react-router-dom'
// import { motion } from 'motion/react'

// function Pricing() {
//   const navigate = useNavigate();
//   const [selectedPlan, setSelectedPlan] = useState("free");

//   const plans = [
//     {
//       id: "free",
//       name: "Free Plan",
//       price: "₹0",
//       credits: 100,
//       description: "Perfect for getting started with basic features.",
//       features: [
//         "100 AI Interview Credits",
//         "Access to Basic Interview Questions",
//         "Voice Interview Access",
//         "Limited Performance Analytics"
//       ],
//       default: true,
//     },
//     {
//       id: "pro",
//       name: "Pro Plan",
//       price: "₹149",
//       credits: 1000,
//       description: "Ideal for regular users seeking enhanced features.",
//       features: [
//         "1000 AI Interview Credits",
//         "Access to All Interview Questions",
//         "Voice Interview Access",
//         "Detailed Performance Analytics",
//         "Priority Customer Support"
//       ],
//       default: false,
//     },
//     {
//       id: "premium",
//       name: "Premium Plan",
//       price: "₹499",
//       credits: 5000,
//       description: "For power users who need maximum features and support.",
//       features: [
//         "5000 AI Interview Credits",
//         "Access to All Interview Questions",
//         "Voice Interview Access",
//         "Advanced Performance Analytics",
//         "24/7 Dedicated Customer Support"
//       ],
//       default: false,

//     }
//   ];
//   return (
//     <div className='min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 py-16 px-6'>
//       <div className='max-w-6xl mx-auto mb-14 flex items-start gap-4'>
//         <button 
//         onClick={() => navigate(-1)}
//         className='mt-2 p-3 rounded-full bg-white shadow hover:shadow-md transition'>
//           <FaArrowLeft className='text-gray-600' />
//         </button>

//         <div className='text-center w-full'>
//           <h1 className='text-4xl font-bold text-gray-800'>Choose Your Plan</h1>
//           <p className='text-gray-500 mt-2 text-lg'>
//             Flexible pricing to fit your needs. Upgrade anytime for more credits and features.
//           </p>
//         </div>
//       </div>

//       <div className='grid gap-8 max-w-6xl mx-auto md:grid-cols-2 lg:grid-cols-3'>
//       {plans.map((plan) => {  
//         const isSelected = selectedPlan === plan.id;
//         return (
//           <motion.div
//             key={plan.id}
//             onClick={() => !plan.default && setSelectedPlan(plan.id)}
//             whileHover={{ scale: 1.05 }}
//             className={`relative rounded-3xl p-8 transition-all duration-300 border 
//               ${isSelected 
//                 ? "border-emerald-600 shadow-2xl bg-white" 
//                 : "border-gray-200 bg-white shadow-md"
//               } 
//               ${plan.default 
//                 ? "cursor-default" 
//                 : "cursor-pointer"
//               }`}
//           >
//             {/* BADGE */}
//             {plan.default && (
//               <div className='absolute top-6 right-6 bg-emerald-600 text-white text-xs px-4 py-1 rounded-full shadow'>
//                 {plan.badge}
//               </div>
//             )}

//             {/* DEFAULT TAG */}
//             {plan.default && (
//               <div className='absolute top-6 right-6 bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full'>
//                 Default
//               </div>
//             )}

//             {/* PLAN NAME */}
//             <h3 className='text-xl font-semibold text-gray-800'>
//               {plan.name}
//             </h3>

//             {/* PRICE */}
//             <div className='mt-4'>
//               <span className='text-3xl font-bold text-emerald-600'>
//                 {plan.price}
//               </span>
//               <p className='text-grayy-500 mt-1'>
//                 {plan.credits} credits included
//               </p>
//             </div>

//             {/* DESCRIPTION */}
//             <p className='text-gray-500 mt-4 text-sm leading-relaxed'>
//               {plan.description}
//             </p>

//             {/* FEATURES */}
//             <div className='mt-6 space-y-3 text-left'>
//               {plan.features.map((feature) => (
//                 <div
//                 key={i}
//                 className='flex items-center gap-3'>
//                   <FaCheckCircle className='text-emerald-500 texxt-sm' />
//                   <span className='text-gray-700 text-sm'>
//                     {feature}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             <div className='flex items-start justify-between gap-4'>
//               <div>
//                 <p className='text-sm font-semibold uppercase tracking-wider text-emerald-600'>{plan.name}</p>
//                 <h2 className='mt-2 text-4xl font-bold text-gray-900'>{plan.price}</h2>
//               </div>
//               {plan.default && (
//                 <span className='rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'>Recommended</span>
//               )}
//             </div>

//             <p className='mt-4 text-gray-600'>{plan.description}</p>

//             <div className='mt-6 rounded-2xl bg-emerald-50 p-4 text-sm text-gray-700'>
//               <span className='font-semibold text-emerald-700'>{plan.credits}</span> credits included
//             </div>

//             <ul className='mt-6 space-y-3 text-gray-700'>
//               {plan.features.map((feature) => (
//                 <li key={feature} className='flex items-start gap-3'>
//                   <span className='mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500' />
//                   <span>{feature}</span>
//                 </li>
//               ))}
//             </ul>

//             <button
//               type='button'
//               className={`mt-8 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition 
//                 ${isSelected 
//                   ? 'bg-emerald-600 text-white' 
//                   : 'bg-gray-900 text-white hover:bg-gray-800'
//                 }`}
//             >
//               {isSelected ? 'Selected Plan' : 'Choose Plan'}
//             </button>
//           </motion.div>
//         )
//       })}
//       </div>

//     </div>
//   )
// }

// export default Pricing


import React, { useState } from 'react';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { set } from 'mongoose';

function Pricing() {
  const navigate = useNavigate();
  const [selectPlan, setSelectPlan] = useState("free");

  const plans = [
    {
      id: "free",
      name: "Free Plan",
      price: "₹0",
      credits: 100,
      description: "Perfect for getting started with basic features.",
      features: [
        "100 AI Interview Credits",
        "Access to Basic Interview Questions",
        "Voice Interview Access",
        "Limited Performance Analytics"
      ],
      default: true,
    },
    {
      id: "pro",
      name: "Pro Plan",
      price: "₹149",
      credits: 1000,
      description: "Great for focused practice and skill improvement.",
      features: [
        "1000 AI Interview Credits",
        "Detailed Feedbacks",
        "Performance Analytics",
        "Full Interview History"
      ],
    },
    {
      id: "premium",
      name: "Premium Plan",
      price: "₹499",
      credits: 5000,
      description: "Best value for serious job prepration",
      features: [
        "5000 AI Interview Credits",
        "Advance AI Feedbacks",
        "Skill Trend Analysis",
        "Priority AI Processing"
      ],
      badge: "Best Value",

    }
  ];
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 py-16 px-6'>
      <div className='max-w-6xl mx-auto mb-14 flex items-start gap-4'>
        <button
        onClick={() => navigate(-1)}
        className='mt-2 p-3 rounded-full bg-white shadow hover:shadow-md transition'>
          <FaArrowLeft className='text-gray-600' />
        </button>
        <div className='text-center w-full'>
          <h1 className='text-4xl font-bold text-gray-800'>Choose Your Plan</h1>
          <p className='text-gray-500 mt-2 text-lg'>
            Flexible pricing to fit your needs. Upgrade anytime for more credits and features.
          </p>
        </div>
      </div>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
        {plans.map((plan) => {
          const isSeleccted = selectPlan === plan.id;
          return(
            <motion.div
            key={plan.id}
            whileHover={!plan.default && {scale:1.05}}
            onClick={() => !plan.default && setSelectPlan(plan.id)}
            className={`relative rounded-3xl p-8 transition-all duration-300 border
            ${
              isSeleccted
                ? "border-emerald-600 shadow-2xl bg-white"
                : "border-gray-200 bg-white shadow-md"
            }
            ${plan.default
              ? "cursor-default"
              : "cursor-pointer"
            }`}>

              {/* BADGE */}
              {plan.badge && (
                <div className='absolute top-6 right-6 bg-emerald-600 text-white text-xs px-4 py-1 rounded-full shadow'>
                  {plan.badge}
                </div>
              )}
              
              {/* DEFAULT TAG */}
              {plan.default && (
                <div className='absolute top-6 right-6 bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full'>
                  Default
                </div>
              )}

              {/* PLAN NAME */}
              <h3 className='text-xl font-semibold text-gray-800'>
                {plan.name}
              </h3>

              {/* PRICE */}
              <div className='mt-4'>
                <span className='text-3xl font-bold text-emerald-600'>
                  {plan.price}
                </span>
                <p className='text-gray-500 mt-1'>
                  {plan.credits} credits included
                </p>
              </div>

              {/* DESCRIPTION */}
              <p className='text-gray-500 mt-4 text-sm leading-relaxed'>
                {plan.description}
              </p>

              {/* FEATURES */}
              <div className='mt-6 space-y-3 text-left'>
                {plan.features.map((feature, i) => (
                  <div
                  key={i}
                  className='flex items-center gap-3'>
                    <FaCheckCircle className='text-emerald-600 text-sm' />
                    <span className='text-gray-700 text-sm'>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {!plan.default && (
                <button className={`w-full mt-8 py-3 rounded-xl font-semibold transition ${
                  isSeleccted
                    ? "bg-emerald-600 text-white hover:opacity-90"
                    : "bg-gray-100 text-gray-700 hover:bg-emerald-50"
                }`}>
                  {
                    isSeleccted ? "Proceed to Pay" : "Select Plan"
                  }
                </button>
              )
              }

            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default Pricing