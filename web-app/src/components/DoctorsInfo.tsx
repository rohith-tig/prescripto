import { Link } from "react-router-dom";
import { formatData } from "../pages/Home";
import { GoDotFill } from "react-icons/go";
import "../styles/home.css";
const Doctorsinfo = (props: { doctorInfo: formatData }) => {
  const { doctorInfo } = props;
  return (
    <>
      <li className="grid">
        <Link
          style={{ textDecoration: "none" }}
          to={`/appointment/${encodeURIComponent(doctorInfo.id)}`}
        >
          <div className="card">
            <img
              className="card_img"
              alt={doctorInfo.name}
              src={doctorInfo.image}
            />
          </div>

          <p className="card-name">{doctorInfo.name}</p>
          <p className="card-spec">{doctorInfo.speciality}</p>
          {doctorInfo.availability ? (
            <p className="card-availa">
              <GoDotFill /> Available
            </p>
          ) : (
            <p className="card-not-avila">
              <GoDotFill /> Not-Available
            </p>
          )}
          <button className="card_btn">
            Book Now<span>&rarr;</span>
          </button>
        </Link>
      </li>
    </>
  );
};

export default Doctorsinfo;
