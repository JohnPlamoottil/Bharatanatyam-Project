import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./dancer.css"; // optional for styling
import Guestbook from "../guestbook/guestbook.jsx";
import { RSVPModal } from "./rsvp";
import { Link } from "react-router-dom";
import Navigation from "../../navigation-links/navigation-links";
import { DANCERS } from "../../../constants.js";

const Dancer = () => {
  const [searchParams] = useSearchParams();

  const dancerName = searchParams.get("dancer").toLowerCase();

  const dancerInfo = DANCERS[dancerName];
  console.log(DANCERS[dancerName]);

  function handleClick(e) {
    const button = e.target;
    button.classList.toggle("slide");
    const panel = button.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }
  const [showRSVP, setShowRSVP] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <div>
        <Navigation />
        <section className="questions">
          <h2 className="title_dancer">{dancerInfo.fullName}</h2>
          <div className="outer_fullpose">
            <img
              className={`full_pose full_pose_${dancerName}`}
              src={dancerInfo.fullPose}
              alt="Full Length Pose"
            ></img>
          </div>
          <button className="accordion" onClick={handleClick}>
            Shishya (Autobiography on {dancerInfo.shortName})
          </button>
          <div className="panel">
            <p>
              {dancerInfo.autobio}
              <img
                className="headshot"
                src={dancerInfo.headshot}
                alt="headshot"
              ></img>
            </p>
          </div>
          <button className="accordion" onClick={handleClick}>
            Shishya (Biography from Parents)
          </button>
          <div className="panel">
            {dancerInfo.shishya}
            <div className="outer_mother_daughter">
              <img
                className={`mother_daughter mom_daughter_${dancerInfo.dancerName}`}
                src={dancerInfo.mother_daughter}
                alt={`Mom and ${dancerInfo.shortName}`}
              />
            </div>
          </div>
          <button className="accordion" onClick={handleClick}>
            Solo Performance
          </button>
          <div className="panel">
            <p>{dancerInfo.dance_title}</p>
            <p>{dancerInfo.solo_duration}</p>
            <p>{dancerInfo.solo}</p>
            <p>
              <img
                className="solo_photo"
                src={dancerInfo.solo_photo}
                alt="solo_photo"
              ></img>
            </p>
          </div>
          <button className="accordion" onClick={handleClick}>
            Invitation Card
          </button>
          <div className="panel">
            <p>
              <img
                className={`invite_card invite_card_${dancerName}`}
                src={dancerInfo.invite}
                alt="invitation"
              />
              Dinner to Follow After the Performance
            </p>
          </div>
          <button className="accordion" onClick={() => setShowRSVP(true)}>
            RSVP
          </button>
          <button
            className="dropdown"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <p className="dropdown__title">Shishya</p>
            <span className="burger-icon">☰</span>
          </button>
          {menuOpen && (
            <div className="dancers" onClick={() => setMenuOpen(false)}>
              <Link
                className="dancer_text"
                to={{
                  pathname: "/dancer",
                  search: "?dancer=michelle",
                }}
              >
                Michelle Eapen
              </Link>

              <Link
                className="dancer_text"
                to={{
                  pathname: "/dancer",
                  search: "?dancer=andrea",
                }}
              >
                Andrea Thomas
              </Link>

              <Link
                className="dancer_text"
                to={{
                  pathname: "/dancer",
                  search: "?dancer=jana",
                }}
              >
                Jana Scaria
              </Link>

              <Link
                className="dancer_text"
                to={{
                  pathname: "/dancer",
                  search: "?dancer=rose",
                }}
              >
                Rose Thomas
              </Link>

              <Link
                className="dancer_text"
                to={{
                  pathname: "/dancer",
                  search: "?dancer=jenna",
                }}
              >
                Jenna Plamoottil
              </Link>

              <Link
                className="dancer_text"
                to={{
                  pathname: "/dancer",
                  search: "?dancer=amarya",
                }}
              >
                Amarya Koola
              </Link>
            </div>
          )}
          <div className="panel">
            <RSVPModal isOpen={showRSVP} onClose={() => setShowRSVP(false)} />
            <p>RSVP</p>
            <Link to="/guestbook">Shishya</Link>
          </div>
          <img
            className="varnum_pose"
            src={dancerInfo.varnum}
            alt="sitting pose"
          ></img>
          <Guestbook dancerName={dancerName} />
        </section>
      </div>
    </div>
  );
};

export default Dancer;
