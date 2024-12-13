import React from "react";
import "../styles/footer.css";

const Footer: React.FC = () => (
  <>
    <div className="footer-div">
      <div className="press-footer">
        <img
          className="logo"
          alt="logo"
          src="https://res.cloudinary.com/duzolgclw/image/upload/v1727787471/logo-prescripto_lfcmea.svg"
        />
        <p className="special-lorem">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
      </div>
      <div className="comp-footer">
        <h1 className="special-hf">COMPANY</h1>
        <p className="special-pf">Home</p>
        <p className="special-pf">About us</p>
        <p className="special-pf">Delivery</p>
        <p className="special-pf">Privacy policy</p>
      </div>
      <div className="TOUCH-footer">
        <h1 className="special-hf">GET IN TOUCH</h1>
        <p className="special-pf">+0-000-000-000</p>
        <p className="special-pf">prescripto@gmail.com</p>
      </div>
    </div>
    <hr className="footer-line" />
    <p className="final-foot">
      Copyright 2024 @ Greatstack.dev - All Right Reserved.
    </p>
  </>
);

export default Footer;
