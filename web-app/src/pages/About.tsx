import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/about.css";
import { useState, useEffect } from "react";
const About: React.FC = () => {
  const [transitionClass, setTransitionClass] = useState("");
  useEffect(() => {
    setTransitionClass("bottom-right");
  }, []);
  return (
    <>
      <Navbar />
      <div className={`about-width ${transitionClass}`}>
        <div className="responsive-about-cont">
          <h1 className="about-heading">
            ABOUT <span>US</span>
          </h1>
          <div className="about-flex">
            <img
              alt="doctor"
              className="about-img"
              src="https://prescripto.vercel.app/assets/about_image-MG9zrc7b.png"
            />

            <div style={{ display: "flex", flexDirection: "column" }}>
              <p className="about-para">
                Welcome to Prescripto, your trusted partner in managing your
                healthcare needs conveniently and efficiently. At Prescripto, we
                understand the challenges individuals face when it comes to
                scheduling doctor appointments and managing their health
                records.
                <br />
                <br />
                <br />
                Prescripto is committed to excellence in healthcare technology.
                We continuously strive to enhance our platform, integrating the
                latest advancements to improve user experience and deliver
                superior service. Whether you're booking your first appointment
                or managing ongoing care, Prescripto is here to support you
                every step of the way.
              </p>
              <p className="vision">OUR VISION</p>
              <p className="about-para">
                Our vision at Prescripto is to create a seamless healthcare
                experience for every user. We aim to bridge the gap between
                patients and healthcare providers, making it easier for you to
                access the care you need, when you need it.
              </p>
            </div>
          </div>
          <h1 className="about-why">
            WHY <span>CHOOSE US</span>
          </h1>
          <div className="why-div-flex">
            <div className="why-div">
              <h1 className="eff">EFFICIENCY:</h1>
              <p className="tttt">
                Streamlined appointment scheduling that fits into your busy
                lifestyle.
              </p>
            </div>
            <div className="why-div">
              <h1 className="eff">CONVENIENCE:</h1>
              <p className="tttt">
                Access to a network of trusted healthcare professionals in your
                area.
              </p>
            </div>
            <div className="why-div">
              <h1 className="eff">PERSONALIZATION:</h1>
              <p className="tttt">
                Tailored recommendations and reminders to help you stay on top
                of your health.
              </p>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default About;
