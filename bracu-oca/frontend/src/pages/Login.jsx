import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { BsPersonBadge, BsShieldLock } from "react-icons/bs";
import { FaChevronDown, FaUserCircle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../components/Loading";
import { AuthContext } from "../Context/AuthProvider";
import apiClient from "../utils/apiClient";

const Login = () => {
  const navigate = useNavigate();
  const { login, registerVisitor } = useContext(AuthContext);
  const { register, handleSubmit, setValue, reset } = useForm();
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"
  const [loginType, setLoginType] = useState("org"); // "org" | "visitor"
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setSelectedClub(null);
    setIsDropdownOpen(false);
    reset();
  };

  const onSubmit = async (data) => {
    if (authMode === "register") {
      if (!data.name?.trim() || !data.visitorEmail?.trim() || !data.password) {
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "Name, email, and password are required",
          showConfirmButton: false,
          timer: 1800,
        });
        return;
      }
      if (data.password.length < 6) {
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "Password must be at least 6 characters",
          showConfirmButton: false,
          timer: 1800,
        });
        return;
      }

      try {
        setIsSubmitting(true);
        await registerVisitor({
          name: data.name.trim(),
          email: data.visitorEmail.trim(),
          studentId: data.studentId?.trim() || "",
          password: data.password,
        });
        navigate("/dashboard");
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Visitor Account Created!",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        const msg = error?.response?.data?.message || error?.message || "Registration failed";
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: msg,
          showConfirmButton: false,
          timer: 2200,
        });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const emailToUse = loginType === "org" ? data.email : data.visitorEmail?.trim();
    if (!emailToUse) {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: loginType === "org" ? "Please select an organization" : "Please enter your email",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    if (!data.password) {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Please enter your password",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await login(emailToUse, data.password);
      navigate("/dashboard");
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Logged In",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "Login failed";
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: msg,
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const { data: clubs, isLoading } = useQuery({
    queryKey: ["clubInfo"],
    queryFn: () => apiClient.get("/club-list").then((res) => res.data),
  });

  if (isLoading) {
    return <Loading />;
  }

  const handleClubSelect = (club) => {
    setSelectedClub(club);
    setValue("email", club.email);
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E4D6B] via-[#1C3D4E] to-[#3A3F47] flex items-center justify-center px-4 py-10 font-poppins">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FEFFFA]/10 border border-[#FEFFFA]/15 mb-3">
            <img src="/images/logos/oca.svg" alt="BRACUOca" className="w-10 h-10 rounded-lg" />
          </div>
          <h1 className="text-4xl font-bold text-[#FEFFFA] tracking-tight">BRACUOca</h1>
          <p className="text-[#FEFFFA]/75 mt-1.5 text-sm">Streamline your club management</p>
        </div>

        <div className="bg-[#FEFFFA] rounded-2xl shadow-2xl p-8 border border-[#FEFFFA]/20">
          {/* Auth Mode Tabs */}
          <div className="flex bg-[#F4F6F8] p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => switchAuthMode("login")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                authMode === "login"
                  ? "bg-[#0E4D6B] text-[#FEFFFA] shadow-sm"
                  : "text-[#3A3F47]/70 hover:text-[#3A3F47]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchAuthMode("register")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                authMode === "register"
                  ? "bg-[#0E4D6B] text-[#FEFFFA] shadow-sm"
                  : "text-[#3A3F47]/70 hover:text-[#3A3F47]"
              }`}
            >
              Visitor Sign Up
            </button>
          </div>

          <h2 className="text-2xl font-bold text-[#3A3F47] mb-5">
            {authMode === "login" ? "Welcome Back" : "Create Visitor ID"}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {authMode === "login" ? (
              <>
                {/* Toggle between Club/OCA dropdown and Visitor Email */}
                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setLoginType("org")}
                    className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                      loginType === "org"
                        ? "bg-[#0E4D6B]/10 text-[#0E4D6B] border border-[#0E4D6B]/30"
                        : "text-[#3A3F47]/65 hover:bg-gray-100"
                    }`}
                  >
                    Club / OCA
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginType("visitor")}
                    className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                      loginType === "visitor"
                        ? "bg-[#0E4D6B]/10 text-[#0E4D6B] border border-[#0E4D6B]/30"
                        : "text-[#3A3F47]/65 hover:bg-gray-100"
                    }`}
                  >
                    Visitor Account
                  </button>
                </div>

                {loginType === "org" ? (
                  <div className="space-y-2">
                    <label className="block text-[#3A3F47] font-medium text-sm">
                      Select Your Organization
                    </label>
                    <div className="relative">
                      <div
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full pl-10 pr-4 py-2.5 border border-[#3A3F47]/25 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E4D6B] bg-[#FEFFFA] cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <FaUserCircle className="h-5 w-5 text-[#0E4D6B] absolute left-3" />
                          <span className={selectedClub ? "text-[#3A3F47] font-medium" : "text-[#3A3F47]/50"}>
                            {selectedClub ? selectedClub.name : "Choose your Role"}
                          </span>
                        </div>
                        <FaChevronDown
                          className={`h-4 w-4 text-[#3A3F47] transition-transform ${
                            isDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1.5 bg-[#FEFFFA] border border-[#3A3F47]/20 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                          <div className="p-2 space-y-1">
                            {(clubs || []).map((club) => (
                              <div
                                key={club._id || club.email}
                                onClick={() => handleClubSelect(club)}
                                className={`flex items-center px-3 py-2 cursor-pointer rounded-lg transition-colors ${
                                  club.name === "OCA"
                                    ? "bg-[#0E4D6B] text-[#FEFFFA] hover:bg-[#0B3C54]"
                                    : "hover:bg-[#0E4D6B]/10"
                                }`}
                              >
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 overflow-hidden ${
                                    club.name === "OCA" ? "bg-[#FEFFFA]/20" : "bg-[#0E4D6B]/10"
                                  }`}
                                >
                                  {club.photo_url ? (
                                    <img src={club.photo_url} alt={club.name} className="w-full h-full object-cover" />
                                  ) : club.name === "OCA" ? (
                                    <BsShieldLock className="h-4 w-4 text-[#FEFFFA]" />
                                  ) : (
                                    <FaUserCircle className="h-4 w-4 text-[#0E4D6B]" />
                                  )}
                                </div>
                                <div>
                                  <div
                                    className={`text-sm font-semibold ${
                                      club.name === "OCA" ? "text-[#FEFFFA]" : "text-[#3A3F47]"
                                    }`}
                                  >
                                    {club.name}
                                  </div>
                                  <div
                                    className={`text-xs ${
                                      club.name === "OCA" ? "text-[#FEFFFA]/80" : "text-[#3A3F47]/65"
                                    }`}
                                  >
                                    {club.email}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <input type="hidden" {...register("email")} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-[#3A3F47] font-medium text-sm">
                      Visitor Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MdEmail className="h-5 w-5 text-[#0E4D6B]" />
                      </div>
                      <input
                        type="email"
                        {...register("visitorEmail")}
                        placeholder="you@g.bracu.ac.bd"
                        className="w-full pl-10 pr-4 py-2.5 border border-[#3A3F47]/25 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E4D6B] bg-[#FEFFFA] text-[#3A3F47]"
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="block text-[#3A3F47] font-medium text-sm">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUserCircle className="h-5 w-5 text-[#0E4D6B]" />
                    </div>
                    <input
                      type="text"
                      {...register("name")}
                      placeholder="e.g. Ayesha Rahman"
                      className="w-full pl-10 pr-4 py-2.5 border border-[#3A3F47]/25 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E4D6B] bg-[#FEFFFA] text-[#3A3F47]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[#3A3F47] font-medium text-sm">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdEmail className="h-5 w-5 text-[#0E4D6B]" />
                    </div>
                    <input
                      type="email"
                      {...register("visitorEmail")}
                      placeholder="you@g.bracu.ac.bd"
                      className="w-full pl-10 pr-4 py-2.5 border border-[#3A3F47]/25 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E4D6B] bg-[#FEFFFA] text-[#3A3F47]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[#3A3F47] font-medium text-sm">
                    Student ID <span className="text-[#3A3F47]/50 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BsPersonBadge className="h-5 w-5 text-[#0E4D6B]" />
                    </div>
                    <input
                      type="text"
                      {...register("studentId")}
                      placeholder="e.g. 22101234"
                      className="w-full pl-10 pr-4 py-2.5 border border-[#3A3F47]/25 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E4D6B] bg-[#FEFFFA] text-[#3A3F47]"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="block text-[#3A3F47] font-medium text-sm">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiLockPasswordLine className="h-5 w-5 text-[#0E4D6B]" />
                </div>
                <input
                  type="password"
                  {...register("password")}
                  placeholder={authMode === "register" ? "At least 6 characters" : "Enter your password"}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#3A3F47]/25 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E4D6B] bg-[#FEFFFA] text-[#3A3F47]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0E4D6B] text-[#FEFFFA] py-2.5 px-4 rounded-xl hover:bg-[#0B3C54] transition-colors font-semibold disabled:opacity-50 shadow-md"
            >
              {isSubmitting
                ? authMode === "login"
                  ? "Signing In..."
                  : "Creating Account..."
                : authMode === "login"
                  ? "Sign In"
                  : "Create Visitor ID & Enter"}
            </button>
          </form>

          <div className="text-center">
            <div
              className="mt-6 text-center text-sm tooltip hover:tooltip-open"
              data-tip="mail us at: md.taosif@g.bracu.ac.bd"
            >
              <a
                href="mailto:md.taosif@g.bracu.ac.bd"
                className="text-[#0E4D6B] hover:underline font-medium"
              >
                Need help?
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-[#FEFFFA]/70 text-xs">
          © {new Date().getFullYear()} BRACUOca. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
