import React, { useState, useEffect } from "react";
import "./guestbook.css"; // optional for styling
import Navigation from "../../navigation-links/navigation-links";
import Footer from "../../footer/footer";
import group_center from "../../../assets/group_center.png";
import avatar from "../../../assets/avatar.jpg";

import "../../../vendor/fonts.css";

const HOST = import.meta.env.VITE_HOST;

function Guestbook({ dancerName, fullName }) {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`${HOST}/api/message`);
      if (response.ok) {
        const data = await response.json();
        setEntries(data.messages);
      }
    };

    fetchMessages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${HOST}/api/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dancerName, name, content: message }),
    });

    if (response.ok) {
      const data = await response.json();
      setEntries([data.message, ...entries]); // prepend new entry
    }
    setName("");
    setMessage("");
  };

  return (
    <div>
      <div className="guestbook">
        <h2>{fullName ? `${fullName}'s Guestbook` : "Guestbook"}</h2>
        <img
          className="group_photo"
          src={group_center ? group_center : avatar}
          alt="group center"
        ></img>
        <form className="guestbook" onSubmit={handleSubmit}>
          <input
            type="text"
            className="name_textfield"
            placeholder="Your Name + Family Members, Surname"
            value={name}
            min="1"
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Leave a Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            min="1"
            required
          ></textarea>
          <button className="submit" type="submit">
            Submit
          </button>
        </form>

        <ul className="entries">
          {entries
            .filter((entry) => {
              console.log({ dancerName, entry });
              return dancerName === entry.dancerName;
              // filter for dancerName match
            })
            .map((entry, index) => (
              <li key={index}>
                <strong>{entry.name}</strong> (
                {new Date(entry.createdAt).toLocaleString()})
                <p>{entry.content}</p>
              </li>
            ))}
        </ul>
      </div>
      {!fullName && (
        <>
          <Navigation />
          <Footer />
        </>
      )}
    </div>
  );
}
export default Guestbook;
