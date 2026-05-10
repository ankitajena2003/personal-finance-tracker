import { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import { 
  User, 
  Mail, 
  FileText, 
  Edit3, 
  Check, 
  Shield, 
  Bell, 
  Lock,
  Camera
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Account() {
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [personalInfo, setPersonalInfo] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail") || "";
    setEmail(storedEmail);
    setName(localStorage.getItem("userName") || "");
    setPersonalInfo(localStorage.getItem(`personalInfo_${storedEmail}`) || "");
    setProfileImage(localStorage.getItem(`profileImage_${storedEmail}`) || null);
  }, []);

  const handleSave = () => {
    const storedEmail = localStorage.getItem("userEmail") || "";
    try {
      localStorage.setItem("userName", name);
      localStorage.setItem(`personalInfo_${storedEmail}`, personalInfo);
      if (profileImage) {
        localStorage.setItem(`profileImage_${storedEmail}`, profileImage);
        localStorage.setItem("profileImage", profileImage);
      }
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      console.error("Storage limit reached", e);
      alert("Image is too large to save locally. Please try a smaller image.");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Compress image using canvas
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get compressed base64
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setProfileImage(compressedBase64);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <Layout>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Account Settings</h1>
            <p className="text-slate-400 text-sm">Manage your personal information and preferences.</p>
          </div>
          <AnimatePresence>
            {success && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-emerald-500/20"
              >
                <Check size={16} /> Changes Saved
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PROFILE CARD */}
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 border border-slate-800/50 rounded-[2.5rem] p-8 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-20" />
              
              <div className="relative mt-4 mb-6 inline-block">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  className="hidden" 
                  accept="image/*"
                />
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-2xl relative z-10 mx-auto overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    name.charAt(0).toUpperCase()
                  )}
                </div>
                <button 
                  onClick={handleImageClick}
                  className="absolute -bottom-2 -right-2 p-2 bg-slate-800 text-white rounded-xl border border-slate-700 hover:bg-indigo-600 transition-colors z-20 shadow-xl"
                >
                  <Camera size={14} />
                </button>
              </div>

              <h2 className="text-xl font-bold text-white mb-1">{name}</h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">{email}</p>

              <div className="grid grid-cols-2 gap-4 py-6 border-t border-slate-800/50">
                <div>
                  <p className="text-white font-bold">12</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Budgets</p>
                </div>
                <div className="border-l border-slate-800/50">
                  <p className="text-white font-bold">Premium</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Member</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800/50 rounded-[2.5rem] p-6 space-y-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-sm font-medium">
                <Shield size={18} className="text-indigo-500" />
                Security & Privacy
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-sm font-medium">
                <Bell size={18} className="text-indigo-500" />
                Notifications
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-sm font-medium">
                <Lock size={18} className="text-indigo-500" />
                Linked Devices
              </button>
            </div>
          </motion.div>

          {/* EDIT SECTION */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="bg-slate-900 border border-slate-800/50 rounded-[2.5rem] p-8 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white">Personal Information</h3>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-bold transition-colors"
                  >
                    <Edit3 size={16} /> Edit Profile
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        type="text"
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white outline-none ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        type="email"
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white outline-none ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Bio / Personal Info</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 text-slate-500" size={18} />
                    <textarea
                      rows="5"
                      disabled={!isEditing}
                      placeholder="Tell us a bit about your financial goals..."
                      className={`w-full pl-11 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-3xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white outline-none resize-none ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
                      value={personalInfo}
                      onChange={(e) => setPersonalInfo(e.target.value)}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {isEditing && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-4 pt-4"
                    >
                      <button
                        onClick={handleSave}
                        className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Check size={20} /> Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all"
                      >
                        Cancel
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
}
