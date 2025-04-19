import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { FaUser, FaChartLine, FaFileMedical, FaSignOutAlt, FaEdit, FaCalculator, FaPhone } from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userDoc = await getDoc(doc(db, "medicalForms", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [auth.currentUser, db]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleEditMedical = () => {
    navigate("/medical-form");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">
            <span>AI</span>Carelink
          </h1>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-link active">
            <FaChartLine className="nav-icon" />
            Dashboard
          </Link>
          <Link to="/medical-form" className="nav-link">
            <FaFileMedical className="nav-icon" />
            Medical Info
          </Link>
          <Link to="/bmi-calculator" className="nav-link">
            <FaCalculator className="nav-icon" />
            BMI Calculator
          </Link>
          <Link to="/emergency-contacts" className="nav-link">
            <FaPhone className="nav-icon" />
            Emergency Contacts
          </Link>
          <Link to="/profile" className="nav-link">
            <FaUser className="nav-icon" />
            Profile
          </Link>
        </nav>
        <button 
          onClick={handleLogout}
          className="logout-button"
        >
          <FaSignOutAlt className="nav-icon" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="welcome-section">
            <h2 className="welcome-text">
              Welcome back, {auth.currentUser?.email?.split("@")[0] || "User"} 👋
            </h2>
            <div className="date-text">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
          <div className="profile-section">
            <div className="profile-image">
              <FaUser className="profile-icon" />
            </div>
            <div className="profile-info">
              <div className="profile-name">{auth.currentUser?.displayName || "User"}</div>
              <div className="profile-email">{auth.currentUser?.email}</div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="stats-grid">
          <div className="stat-card age">
            <div className="info-header">
              <h3>Age</h3>
              <button className="edit-button" onClick={handleEditMedical}>
                <FaEdit />
              </button>
            </div>
            <div className="info-content">
              <h2>{userData?.age || "Not set"}</h2>
              <p>Last updated: Recently</p>
            </div>
          </div>
          <div className="stat-card blood">
            <div className="info-header">
              <h3>Blood Group</h3>
              <button className="edit-button" onClick={handleEditMedical}>
                <FaEdit />
              </button>
            </div>
            <div className="info-content">
              <h2>{userData?.bloodGroup || "Not set"}</h2>
              <p>Vital information</p>
            </div>
          </div>
          <div className="stat-card health">
            <div className="info-header">
              <h3>Medical History</h3>
              <button className="edit-button" onClick={handleEditMedical}>
                <FaEdit />
              </button>
            </div>
            <div className="info-content">
              <p>{userData?.medicalHistory || "No medical history recorded"}</p>
            </div>
          </div>
          <div className="stat-card health">
            <div className="info-header">
              <h3>Current Medications</h3>
              <button className="edit-button" onClick={handleEditMedical}>
                <FaEdit />
              </button>
            </div>
            <div className="info-content">
              <p>{userData?.medications || "No medications recorded"}</p>
            </div>
          </div>
        </section>

        {/* Medical Info Section */}
        <section className="medical-info-section">
          <div className="section-header">
            <h2 className="section-title">
              <FaFileMedical className="section-icon" />
              Your Medical Info
            </h2>
            <button onClick={handleEditMedical} className="edit-button">
              <FaEdit />
              Update Information
            </button>
          </div>
          
          <div className="info-grid">
            <div className="info-card">
              <h3 className="info-label">Allergies</h3>
              <p className="info-value">{userData?.allergies || "None reported"}</p>
            </div>
            <div className="info-card">
              <h3 className="info-label">Existing Conditions</h3>
              <p className="info-value">{userData?.existingConditions || "None reported"}</p>
            </div>
            <div className="info-card">
              <h3 className="info-label">Gender</h3>
              <p className="info-value">{userData?.gender || "Not specified"}</p>
            </div>
            <div className="info-card">
              <h3 className="info-label">Last Updated</h3>
              <p className="info-value">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
