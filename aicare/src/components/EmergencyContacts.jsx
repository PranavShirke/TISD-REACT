import React from 'react';
import { FaPhone, FaMapMarkerAlt, FaHospital, FaUserMd, FaClock } from 'react-icons/fa';
import './EmergencyContacts.css';

const EmergencyContacts = () => {
  // Sample doctor data - you can replace this with real data from your backend
  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Emergency Medicine",
      hospital: "City General Hospital",
      phone: "+1 (555) 123-4567",
      address: "123 Medical Center Drive, City, State 12345",
      availability: "24/7 Emergency",
      rating: 4.8
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Cardiology",
      hospital: "Heart Care Center",
      phone: "+1 (555) 234-5678",
      address: "456 Heart Street, City, State 12345",
      availability: "24/7 Emergency",
      rating: 4.9
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrics",
      hospital: "Children's Medical Center",
      phone: "+1 (555) 345-6789",
      address: "789 Kids Avenue, City, State 12345",
      availability: "24/7 Emergency",
      rating: 4.7
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialty: "Neurology",
      hospital: "Neuro Care Institute",
      phone: "+1 (555) 456-7890",
      address: "321 Brain Street, City, State 12345",
      availability: "24/7 Emergency",
      rating: 4.6
    }
  ];

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="emergency-contacts-container">
      <div className="emergency-header">
        <h1>Emergency Contacts</h1>
        <p>Quick access to emergency medical services and doctors</p>
      </div>

      <div className="emergency-grid">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="doctor-card">
            <div className="doctor-header">
              <FaUserMd className="doctor-icon" />
              <div className="doctor-info">
                <h2>{doctor.name}</h2>
                <p className="specialty">{doctor.specialty}</p>
              </div>
            </div>

            <div className="doctor-details">
              <div className="detail-item">
                <FaHospital className="detail-icon" />
                <span>{doctor.hospital}</span>
              </div>
              <div className="detail-item">
                <FaMapMarkerAlt className="detail-icon" />
                <span>{doctor.address}</span>
              </div>
              <div className="detail-item">
                <FaClock className="detail-icon" />
                <span>{doctor.availability}</span>
              </div>
            </div>

            <div className="doctor-actions">
              <button 
                className="call-button"
                onClick={() => handleCall(doctor.phone)}
              >
                <FaPhone className="action-icon" />
                Call Now
              </button>
              <div className="rating">
                Rating: {doctor.rating}/5.0
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="emergency-footer">
        <p>For life-threatening emergencies, please call 911 immediately</p>
      </div>
    </div>
  );
};

export default EmergencyContacts; 