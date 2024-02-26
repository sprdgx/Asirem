import { card } from "../assets";
import styles, { layout } from "../style";
import {motion, useAnimation, useInView } from 'framer-motion'
import { useEffect, useRef } from "react";

const CardDeal = () =>{ 
  
  const ref = useRef(null)
  const isInView = useInView(ref)
  const mainAnimate= useAnimation()

  useEffect(() => {
    if (isInView){
      mainAnimate.start("visible")
    }
  } ,[isInView])
  
  
  return (
  <motion.section ref={ref} variants={{hidden:{opacity:0 , x:75 },visible:{opacity:1 , x:0 }}} initial="hidden" animate={mainAnimate} transition={{duration: 1 , delay: 0.7}} className={layout.section}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        Find a better card deal <br className="sm:block hidden" /> in few easy
        steps.
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Arcu tortor, purus in mattis at sed integer faucibus. Aliquet quis
        aliquet eget mauris tortor.ç Aliquet ultrices ac, ametau.
      </p>
    </div>

    <div className={layout.sectionImg}>
      <img src={card} alt="billing" className="w-[100%] h-[100%]" />
    </div>
  </motion.section>
)}

export default CardDeal;
