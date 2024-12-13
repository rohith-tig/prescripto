import React from "react";
import { api } from "../config/app";
const doctorsList = [
  {
    name: "Dr. Richard James",
    email: "richard@gmail.com",
    password: "richard@9866",
    image:
      "https://res.cloudinary.com/duzolgclw/image/upload/v1727961063/doc1_vnrle7.png",
    speciality: "General physician",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 50,

    adr_line1: "17th Cross, Richmond",
    adr_line2: "Circle, Ring Road, London",
  },
  {
    name: "Dr. Emily Larson",
    email: "emily@gmail.com",
    password: "emily@9866",
    image:
      "https://res.cloudinary.com/duzolgclw/image/upload/v1727961063/doc2_lmgys0.png",
    speciality: "Gynecologist",
    degree: "MBBS",
    experience: "3 Years",
    about:
      "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 60,

    adr_line1: "27th Cross, Richmond",
    adr_line2: "Circle, Ring Road, London",
  },
  {
    name: "Dr. Sarah Patel",
    email: "sarah@gmail.com",
    password: "sarah@9866",
    image:
      "https://res.cloudinary.com/duzolgclw/image/upload/v1727961063/doc3_ptc6ci.png",
    speciality: "Dermatologist",
    degree: "MBBS",
    experience: "1 Years",
    about:
      "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 30,

    adr_line1: "37th Cross, Richmond",
    adr_line2: "Circle, Ring Road, London",
  },
  {
    name: "Dr. Christopher Lee",
    email: "christopher@gmail.com",
    password: "christopher@9866",
    image:
      "https://res.cloudinary.com/duzolgclw/image/upload/v1727961064/doc4_gv4t6c.png",
    speciality: "Pediatricians",
    degree: "MBBS",
    experience: "2 Years",
    about:
      "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 40,

    adr_line1: "47th Cross, Richmond",
    adr_line2: "Circle, Ring Road, London",
  },
  {
    name: "Dr. Jennifer Garcia",
    email: "jennifer@gmail.com",
    password: "jennifer@9866",
    image:
      "https://res.cloudinary.com/duzolgclw/image/upload/v1727961064/doc5_ojbalf.png",
    speciality: "Neurologist",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 50,

    adr_line1: "57th Cross, Richmond",
    adr_line2: "Circle, Ring Road, London",
  },
  {
    name: "Dr. Andrew Williams",
    email: "andrew@gmail.com",
    password: "andrew@9866",
    doc_image_url:
      "https://res.cloudinary.com/duzolgclw/image/upload/v1727961065/doc6_gsvilf.png",
    speciality: "Gastroenterologist",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 50,

    adr_line1: "57th Cross, Richmond",
    adr_line2: "Circle, Ring Road, London",
  },

  {
    name: "Dr. Timothy White",
    email: "timothy@gmail.com",
    password: "timothy@9866",
    image:
      "https://res.cloudinary.com/duzolgclw/image/upload/v1727961066/doc8_td5qfb.png",
    speciality: "Gynecologist",
    degree: "MBBS",
    experience: "3 Years",
    about:
      "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 60,

    adr_line1: "27th Cross, Richmond",
    adr_line2: "Circle, Ring Road, London",
  },
  {
    name: "Dr. Ava Mitchell",
    email: "ava@gmail.com",
    password: "ava@9866",
    image:
      "https://res.cloudinary.com/duzolgclw/image/upload/v1727961066/doc9_jvxrnb.png",
    speciality: "Dermatologist",
    degree: "MBBS",
    experience: "1 Years",
    about:
      "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 30,

    adr_line1: "37th Cross, Richmond",
    adr_line2: "Circle, Ring Road, London",
  },
  {
    name: "Dr. Jeffrey King",
    email: "jeffrey@gmail.com",
    password: "jeffrey@9866",
    image:
      "https://res.cloudinary.com/duzolgclw/image/upload/v1727961066/doc10_pdfzt0.png",
    speciality: "Pediatricians",
    degree: "MBBS",
    experience: "2 Years",
    about:
      "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 40,

    adr_line1: "47th Cross, Richmond",
    adr_line2: "Circle, Ring Road, London",
  },
  {
    name: "Dr. Zoe Kelly",
    email: "zoe@gmail.com",
    password: "zoe@9866",
    image:
      "https://res.cloudinary.com/duzolgclw/image/upload/v1727961066/doc11_wmwlny.png",
    speciality: "Neurologist",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 50,

    adr_line1: "57th Cross, Richmond",
    adr_line2: "Circle, Ring Road, London",
  },
  {
    name: "Dr. Patrick Harris",
    email: "patrick@gmail.com",
    password: "patrick@9866",
    doc_image_url:
      "https://res.cloudinary.com/duzolgclw/image/upload/v1727961067/doc12_kaezvh.png",
    speciality: "Gastroenterologist",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Patrick has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Patrick has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 50,

    adr_line1: "57th Cross, Richmond",
    adr_line2: "Circle, Ring Road, London",
  },
  {
    name: "Dr. Chloe Evans",
    email: "chloe@gmail.com",
    password: "chloe@9866",
    image:
      "https://res.cloudinary.com/duzolgclw/image/upload/v1727961067/doc13_krtmen.png",
    speciality: "General physician",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 50,

    adr_line1: "17th Cross, Richmond",
    adr_line2: "Circle, Ring Road, London",
  },
  {
    name: "Dr. Ryan Martinez",
    email: "ryan@gmail.com",
    password: "ryan@9866",
    image:
      "https://res.cloudinary.com/duzolgclw/image/upload/v1727961068/doc14_fa1esr.png",
    speciality: "Gynecologist",
    degree: "MBBS",
    experience: "3 Years",
    about:
      "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 60,

    adr_line1: "27th Cross, Richmond",
    adr_line2: "Circle, Ring Road, London",
  },
  {
    name: "Dr. Jennifer Garcia",
    email: "jennifer@gmail.com",
    password: "jennifer@9866",
    doc_image_url:
      "https://res.cloudinary.com/duzolgclw/image/upload/v1727961064/doc5_ojbalf.png",
    speciality: "Neurologist",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Jennifer has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 50,

    adr_line1: "57th Cross, Richmond",
    adr_line2: "Circle, Ring Road, London",
  },
];
//doc_image_url//
const Dummy: React.FC = () => {
  const sendData = async () => {
    try {
      const docDetails = {
        name: "Dr. Patrick Harris",
        email: "patrick@gmail.com",
        password: "patrick@9866",
        doc_image_url:
          "https://res.cloudinary.com/duzolgclw/image/upload/v1727961067/doc12_kaezvh.png",
        speciality: "Gastroenterologist",
        degree: "MBBS",
        experience: "4 Years",
        about:
          "Dr. Patrick has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Patrick has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
        fees: 50,

        adr_line1: "57th Cross, Richmond",
        adr_line2: "Circle, Ring Road, London",
      };
      const response = await api.post("/admin/doc", docDetails);
      console.log(response);
    } catch (error) {
      console.log("erros:", error);
    }
  };

  return (
    <>
      <button onClick={sendData}>submit</button>
    </>
  );
};

export default Dummy;
