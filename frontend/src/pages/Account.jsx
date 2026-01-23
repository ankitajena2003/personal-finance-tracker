import { useState, useEffect } from "react";
import Layout from "../components/Layout";

export default function Account() {
  const [isEditing, setIsEditing] = useState(true);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [personalInfo, setPersonalInfo] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("userName") || "");
    setEmail(localStorage.getItem("userEmail") || "");
    setPersonalInfo(localStorage.getItem("personalInfo") || "");
  }, []);

  const handleSave = () => {
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("personalInfo", personalInfo);

    setIsEditing(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-10">My Account</h1>

      <div className="max-w-2xl bg-slate-900/80 rounded-3xl p-10 shadow-xl">
        {/* NAME */}
        <div className="mb-6">
          <label className="block mb-2 text-slate-300">Name</label>
          {isEditing ? (
            <input
              className="input-dark w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <p className="text-lg">{name}</p>
          )}
        </div>

        {/* EMAIL */}
        <div className="mb-6">
          <label className="block mb-2 text-slate-300">Email</label>
          {isEditing ? (
            <input
              className="input-dark w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          ) : (
            <p className="text-lg">{email}</p>
          )}
        </div>

        {/* PERSONAL INFO */}
        <div className="mb-8">
          <label className="block mb-2 text-slate-300">
            Personal Info
          </label>
          {isEditing ? (
            <textarea
              rows="4"
              className="input-dark w-full resize-none"
              value={personalInfo}
              onChange={(e) => setPersonalInfo(e.target.value)}
            />
          ) : (
            <p className="text-lg">{personalInfo || "—"}</p>
          )}
        </div>

        {/* ACTION BUTTON */}
        {isEditing ? (
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold"
          >
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full py-4 rounded-xl bg-slate-800 hover:bg-slate-700"
          >
            ✏️ Edit Profile
          </button>
        )}

        {success && (
          <p className="text-green-400 text-center mt-4">
            ✅ Profile updated successfully
          </p>
        )}
      </div>
    </Layout>
  );
}
