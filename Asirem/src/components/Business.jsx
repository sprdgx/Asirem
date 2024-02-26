import { features } from "../constants";
import styles, { layout } from "../style";
import {motion, useAnimation, useInView } from 'framer-motion'
import { useEffect, useRef } from "react";

const FeatureCard = ({ icon, title, content, index }) => {
  
  const ref = useRef(null)
  const isInView = useInView(ref)
  const mainAnimate= useAnimation()

  useEffect(() => {
    if (isInView){
      mainAnimate.start("visible")
    }
  } ,[isInView])
  
  
  return(
  <motion.div ref={ref} variants={{hidden:{opacity:0 , x:75 },visible:{opacity:1 , x:0 }}} initial="hidden" animate={mainAnimate} transition={{duration: 1 , delay: 0.7}} className={`flex flex-row p-6 rounded-[20px] ${index !== features.length - 1 ? "mb-6" : "mb-0"} feature-card`}>
    <div className={`w-[64px] h-[64px] rounded-full ${styles.flexCenter} bg-dimBlue`}>
      <img src={icon} alt="star" className="w-[50%] h-[50%] object-contain" />
    </div>
    <div className="flex-1 flex flex-col ml-3">
      <h4 className="font-poppins font-semibold text-white text-[18px] leading-[23.4px] mb-1">
        {title}
      </h4>
      <p className="font-poppins font-normal text-dimWhite text-[16px] leading-[24px]">
        {content}
      </p>
    </div>
  </motion.div>
)}

const Business = () =>{ 
  
  const ref = useRef(null)
  const isInView = useInView(ref)
  const mainAnimate= useAnimation()

  useEffect(() => {
    if (isInView){
      mainAnimate.start("visible")
    }
  } ,[isInView])
  
  
  return(
  <motion.section ref={ref} variants={{hidden:{opacity:0 , x:-75 },visible:{opacity:1 , x:0 }}} initial="hidden" animate={mainAnimate} transition={{duration: 1 , delay: 0.7}}  id="features" className={`mb-[50px] ${layout.section}`}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        You Do The Guess, <br className="sm:block hidden" /> We’ll Build
        You The World.
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        ASIREM is your dynamic development team dedicated to turning visions into reality. We blend innovation with skill, crafting digital solutions that exceed expectations. With us, your project isn't just a task; it's the future we build together.
      </p>
    </div>

    <div className={`${layout.sectionImg} flex-col`}>
      {features.map((feature, index) => (
        <FeatureCard key={feature.id} {...feature} index={index} />
      ))}
    </div>
  </motion.section>
)}

export default Business;
