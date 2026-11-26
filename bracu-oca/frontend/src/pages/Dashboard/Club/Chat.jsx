import { useContext, useEffect, useRef, useState } from "react";
import { BiSend } from "react-icons/bi";
import { FaVideo } from "react-icons/fa";
import { AuthContext } from "../../../Context/AuthProvider";
import useCurrentUser from "../../../hooks/useCurrentUser";
import apiClient from "../../../utils/apiClient";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessage] = useState([]);
  const [text, setText] = useState('');
  const chatContainerRef = useRef(null);
  const [currUser] = useCurrentUser();

  const username = user?.email ? user.email.split("@")[0] : "";
  const uppercaseUsername = username.toUpperCase();

  const handleSendMessage = () => {
    if (!user?.email || !text.trim()) return;
    const messageInfo = {
      senderEmail: user.email,
      receiverEmail: "oca@bracu.ac.bd",
      content: text.trim(),
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", { hour12: true })
    };
    
    apiClient.post("/send-message", messageInfo).then(() => {
      setMessage((prevMessages) => [...prevMessages, messageInfo]);
      setText('');
    }).catch((err) => console.error("Failed to send message:", err));
  };

  useEffect(() => {
    if (!user?.email) return;
    apiClient.get(`/messages/${user.email}`)
      .then((res) => {
        setMessage(res.data);
      })
      .catch((err) => console.error("Failed to fetch messages:", err));
  }, [user?.email]);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      {/* header */}
      <div className="navbar p-0 mt-[-20px]">
        <div className="flex-1">
          <a className="text-3xl font-bold text-[#3A3F47] ">Chat</a>
        </div>
        <div className="flex-none gap-2">
          
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src={currUser?.photo_url}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* chat */}
      <div className="mt-3 bg-white p-10 rounded-2xl h-full">
        {/* chat top */}
        <div className="navbar bg-white">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="mask mask-squircle h-12 w-12">
                  <img
                    src="/images/logos/oca.svg"
                    alt="Avatar Tailwind CSS Component"
                  />
                </div>
              </div>
              <div>
                <div className="font-bold text-gray-700">OCA</div>
                <div className="text-sm opacity-60">BRAC University</div>
              </div>
            </div>
          </div>
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <div className="indicator">
                  <FaVideo />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        {/* chat bubble */}
        <div ref={chatContainerRef} className="overflow-scroll h-[220px]">
          {messages?.map((msg, index) =>
            msg.senderEmail === "oca@bracu.ac.bd" ? (
              // oca
              <div key={index} className="chat chat-start">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="/images/logos/oca.svg"
                    />
                  </div>
                </div>
                <div className="chat-header ">OCA</div>
                <div className="chat-bubble bg-[#F5F5F5] text-base text-[#3A3F47]">
                  {msg.content}
                </div>
                <div className="chat-footer opacity-100">
                  <time className="text-xs opacity-50">{msg.time} | {msg.date}</time>
                </div>
              </div>
            ) : (
              // club
              <div key={index} className="chat chat-end">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    />
                  </div>
                </div>
                <div className="chat-header">{uppercaseUsername}</div>
                <div className="chat-bubble bg-[#0E4D6B] text-white text-base">
                  {msg.content}
                </div>
                <div className="chat-footer opacity-100">
                  <time className="text-xs opacity-50">{msg.time} | {msg.date}</time>
                </div>
              </div>
            )
          )}
        </div>
        <div className="divider"></div>
        {/* input for message */}
        <div className="join w-full">
          <input
            onChange={(e) => setText(e.target.value)}
            value={text}
            className="input input-bordered join-item text-[14px] font-normal text-black w-[100%] rounded-2xl bg-white"
            placeholder="Write your message..."
          />
          <button onClick={handleSendMessage} className="btn join-item rounded-r-full text-white bg-[#0E4D6B]">
            Send <BiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
