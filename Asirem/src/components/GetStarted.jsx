import styles from "../style";

const GetStarted = () => (
  <div className={`${styles.flexCenter} w-[300px] h-[140px] ss:pt-[125px] ss:pr-[125px]`}>
    <a href="#contactus" className="btn" type="button">
      <ul>
        <strong>
          Contact Us
        </strong>
      </ul>
      <div id="container-stars">
        <div id="stars"></div>
      </div>
      <div id="glow">
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
    </a>
  </div>
);

export default GetStarted;
