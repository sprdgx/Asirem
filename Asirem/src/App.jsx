import styles from "./style";
import { Business,YazBot, Footer, Navbar, Testimonials, Hero } from "./components";
import {motion, useAnimation, useInView } from 'framer-motion'
import { useEffect, useRef } from "react";


export default function App () {

  const ref = useRef(null)
  const isInView = useInView(ref)
  const mainAnimate= useAnimation()

  useEffect(() => {
    if (isInView){
      mainAnimate.start("visible")
    }
  } ,[isInView])


  return(
  <div   className="bg-primary w-full overflow-hidden">
    <div className={`${styles.paddingX} ${styles.flexCenter}`}>
      <motion.div ref={ref} variants={{hidden:{opacity:0 , x:75 },visible:{opacity:1 , x:0 }}} initial="hidden" animate={mainAnimate} transition={{duration: 1 }} className={`${styles.boxWidth}`}>
        <Navbar />
          <Hero />
      </motion.div>
    </div>
    
    <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
      <motion.div className={`${styles.boxWidth}`}>
        <Business />
        <YazBot/>
        <Testimonials />
        <Footer />
      </motion.div>
    </div>
  </div>
);
}

