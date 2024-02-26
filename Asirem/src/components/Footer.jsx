import styles from "../style";
import { logo } from "../assets";
import {socialMedia } from "../constants";
import {motion, useAnimation, useInView } from 'framer-motion'
import { useEffect, useRef } from "react";
import React from 'react';
import emailjs from '@emailjs/browser';

const Footer = () =>{ 


  const ref = useRef(null)
  const isInView = useInView(ref)
  const mainAnimate= useAnimation()

  useEffect(() => {
    if (isInView){
      mainAnimate.start("visible")
    }
  } ,[isInView])


  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_6s7ljn9', 'template_65pkwcz', form.current, 'ej2EOq2cdQIEN2qCt')
      .then((result) => {
          console.log(result.text);
          e.target.reset()
      }, (error) => {
          console.log(error.text);
      });
  };


  return(
  <motion.section ref={ref} variants={{hidden:{opacity:0 , x:75 },visible:{opacity:1 , x:0 }}} initial="hidden" animate={mainAnimate} transition={{duration: 1 , delay: 0.7}} className={`${styles.flexCenter} ${styles.paddingY} ss:h-[650px] h-[1000px] flex-col`}>
    <div  className={`${styles.flexStart} md:flex-row flex-col mb-8 ss:w-[80%]`}>
      <div className="flex-[1] flex flex-col justify-start mr-10 ss:pt-[80px] ">
        <img
          id="contactus"
          src={logo}
          alt="hoobank"
          className="w-[266px] h-[72.14px] object-contain"
        />
        <p className={`${styles.paragraph} mt-4 mb-[50px]  max-w-[312px]`}>
        Innovating coding solutions with precision, creativity, and unparalleled reliability.
        </p>
      </div>
      <form class="form" ref={form} onSubmit={sendEmail} >
    <input class="input" type="text" name="user_name" placeholder="Name"/>
    <input class="input" type="text" name="user_number" placeholder="Phone Number"/>
    <input class="input" type="email" name="user_email" placeholder="E-Mail I.D."/>
    <textarea class="textarea" name="message" placeholder="Enter message"></textarea> 
    <center>
    <button class="button">Submit</button>
    </center>
    </form>
    </div>

    <div className=" w-full flex justify-between items-center md:flex-row flex-col pt-6 border-t-[1px] border-t-[#3F3E45]">
      <p className="font-poppins font-normal text-center text-[18px] leading-[27px] text-white">
        Copyright Ⓒ 2022 HooBank. All Rights Reserved.
      </p>

      <div className="flex flex-row md:mt-0 mt-6">
        {socialMedia.map((social, index) => (
          <img
            key={social.id}
            src={social.icon}
            alt={social.id}
            className={`w-[21px] h-[21px] object-contain cursor-pointer ${
              index !== socialMedia.length - 1 ? "mr-6" : "mr-0"
            }`}
            onClick={() => window.open(social.link)}
          />
        ))}
      </div>
    </div>
  </motion.section>
)}

export default Footer;
