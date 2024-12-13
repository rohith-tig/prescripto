import React from "react";
import Navbar from "../components/Navbar";
import "../styles/contact.css";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import useScrollToTop from "../components/ScrollToTop";
const Contact: React.FC = () => {
  useScrollToTop();
  const [transitionClass, setTransitionClass] = useState("");
  useEffect(() => {
    setTransitionClass("bottom-right");
  }, []);
  return (
    <>
      <Navbar />
      <div className={`contact-width ${transitionClass}`}>
        <div className="responsive-contact-cont">
          <h1 className="contact-heading">
            CONTACT <span>US</span>
          </h1>
          <div className="contact-flex">
            <img
              alt="doctor"
              className="contact-img"
              src="https://prescripto.vercel.app/assets/contact_image-IJu_19v_.png"
            />

            <div style={{ display: "flex", flexDirection: "column" }}>
              <p className="vision">OUR OFFICE</p>
              <p className="contact-para">
                00000 Willms Station Suite 000, Washington, USA
              </p>

              <br />
              <p style={{ marginTop: "-20px" }} className="contact-para">
                Tel: (000) 000-0000 <br />
                <br />
                Email: greatstackdev@gmail.com
              </p>
              <p className="vision">CAREERS AT PRESCRIPTO</p>
              <p style={{ marginTop: "-1px" }} className="contact-para">
                Learn more about our teams and job openings.
              </p>
              <button className="explore">Explore Jobs</button>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Contact;
