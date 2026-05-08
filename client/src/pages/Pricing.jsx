import React, { useState } from 'react';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { color, motion } from 'motion/react';
import axios from 'axios';
import { serverURL } from '../App.jsx';
import { setUserData } from '../redux/userSlice.js';
import { useDispatch } from 'react-redux';

function Pricing() {
  const navigate = useNavigate();
  const [selectPlan, setSelectPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const dispatch = useDispatch();

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

  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id);

      const amount = 
      plan.id === "pro" ? 149 :
      plan.id === "premium" ? 499 : 0;

      const result = await axios.post(serverURL + "/api/payment/order", {
        planId: plan.id,
        amount: amount,
        credits: plan.credits,
      },{withCredentials: true} )
      

      const option = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: "INR",
        name: "AI Interview Agent",
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.id,

        handler: async function (response) {
          const verifyPayment = await axios.post(serverURL + "/api/payment/verify", 
            {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }, 
            {withCredentials: true} );

          dispatch(setUserData(verifyPayment.data.user));

          alert("Payment Successful! 🎊 Credits Added");
          navigate("/");
        },

        theme:{
          color: "#10b981"
        },


      }

      const rzp = new window.Razorpay(option);
      rzp.open();

      setLoadingPlan(null);
    } catch (error) {
      console.log(error)
      setLoadingPlan(null);
    }
  }

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
                <button 
                disabled={loadingPlan === plan.id}
                onClick={(e) => {e.stopPropagation();
                  if(!isSeleccted){
                    setSelectPlan(plan.id);
                  } else {
                    handlePayment(plan);
                  }
                }}
                className={`w-full mt-8 py-3 rounded-xl font-semibold transition ${
                  isSeleccted
                    ? "bg-emerald-600 text-white hover:opacity-90"
                    : "bg-gray-100 text-gray-700 hover:bg-emerald-50"
                }`}>
                  {
                    loadingPlan === plan.id
                    ? "Processing..."
                    : isSeleccted
                    ? "Proceed to Pay"
                    : "Select Plan"
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
