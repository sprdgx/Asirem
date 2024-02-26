import { feedback } from "../constants";
import styles from "../style";
import FeedbackCard from "./FeedbackCard";
import {motion, useAnimation, useInView } from 'framer-motion'
import { useEffect, useRef } from "react";

export default function Testimonials () { 
  

  const ref = useRef(null)
  const isInView = useInView(ref)
  const mainAnimate= useAnimation()

  useEffect(() => {
    if (isInView){
      mainAnimate.start("visible")
    }
  } ,[isInView])


  return(
  <motion.section ref={ref} variants={{hidden:{opacity:0 , x:-75 },visible:{opacity:1 , x:0 }}} initial="hidden" animate={mainAnimate} transition={{duration: 1 , delay: 0.7}} id="clients" className={`${styles.paddingY} ${styles.flexCenter} ss:h-[650px]  flex-col relative `}>
    <div className="absolute z-[0] w-[60%] h-[0%] -right-[50%] rounded-full blue__gradient" />

    <div className="w-full flex justify-between items-center md:flex-row flex-col relative z-[1]">
      <h2 className={styles.heading2}>
        What People are <br className="sm:block hidden" /> saying about us
      </h2>
      <div className="w-full md:mt-0">
        <p className={`${styles.paragraph} text-left max-w-[450px]`}>
          Everything you need to accept card payments and grow your business
          anywhere on the planet.
        </p>
      </div>
    </div>

    <motion.div ref={ref} variants={{hidden:{opacity:0 , y:75 },visible:{opacity:1 , y:0 }}} initial="hidden" animate={mainAnimate} transition={{duration: 1 , delay: 0.5}} className="flex flex-wrap sm:justify-start justify-center w-full feedback-container relative z-[1]">
      {feedback.map((card) => <FeedbackCard key={card.id} {...card} />)}
    </motion.div>
  </motion.section>
)}


