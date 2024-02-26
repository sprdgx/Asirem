import { useEffect, useRef, useState } from "react";
import { close, logo, menu } from "../assets";
import { navLinks } from "../constants";
import { motion, useCycle, useAnimation } from "framer-motion"; 
import { useInView } from 'react-intersection-observer';

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useCycle(false, true);

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
    closed: {
      x: "100%",
      transition: {
        duration: 0.3,
      },
    },
  };

  const ref = useRef(null);
  const isInView = useInView(ref);
  const mainAnimate = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainAnimate.start("visible");
    }
  }, [isInView]);

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setToggle();
  };

  return (
    <motion.nav
      ref={ref}
      variants={{
        hidden: { opacity: 0, x: 75 },
        visible: { opacity: 1, x: 0 },
      }}
      initial="hidden"
      animate={mainAnimate}
      transition={{ duration: 1 }}
      className="sticky w-full flex py-6 justify-between items-center navbar"
      style={{ zIndex: 10 }}
    >
      <img src={logo} alt="hoobank" className="w-[124px] h-[32px]" />

      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] ${
              active === nav.title ? "text-white" : "text-dimWhite"
            } ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}`}
            onClick={() => setActive(nav.title)}
          >
            <a href={`#${nav.id}`}>{nav.title}</a>
          </li>
        ))}
      </ul>

      <div className="sm:hidden flex flex-1 justify-end items-center">
        <motion.img
          src={menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain"
          onClick={toggleSidebar}
        />
        <motion.div
          className="p-6 bg-gray-900 fixed top-0 right-0 h-screen w-[70%] md:w-[300px] lg:w-[350px] xl:w-[400px] rounded-l-xl"
          initial={false}
          animate={toggle ? "open" : "closed"}
          variants={sidebarVariants}
        >
        <button onClick={toggleSidebar} className="absolute top-4 right-4 focus:outline-none">
          <img src={close} alt="close" className="w-6 h-6" />
        </button>
        <ul className="list-none mt-16">
          {navLinks.map((nav, index) => (
            <li
              key={nav.id}
              className={`font-medium cursor-pointer text-[16px] ${
                active === nav.title ? "text-white" : "text-gray-300"
              } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
              onClick={() => setActive(nav.title)}
            >
              <a href={`#${nav.id}`} onClick={toggleSidebar}>{nav.title}</a>
            </li>
          ))}
        </ul>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
