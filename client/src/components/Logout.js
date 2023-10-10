import React from 'react';

const modalStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1000,
};

const cardStyle = {
  width: '400px',
  background: 'white',
  borderRadius: '8px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
};

const headerStyle = {
  backgroundColor: 'gray',
  color: 'white',
  padding: '10px',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
  
};

const closeButtonStyle = {
  float: 'right',
  cursor: 'pointer',
};

const contentStyle = {
  padding: '20px',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '20px',
};

const buttonStyle = {
  marginLeft: '10px',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  backgroundColor: '#007BFF',
  color: 'white',
  flex: 'left',
};

const cancelButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#ccc',
};

const LogoutModal = ({ isOpen, onClose, onLogout }) => {
  const handleConfirmLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <div style={{ ...modalStyle, display: isOpen ? 'flex' : 'none' }}>
      <div style={cardStyle}>
      <center> <div style={headerStyle}>
          <h2 style={{fontFamily:"revert"}}>Confirm Logout<span style={closeButtonStyle} onClick={onClose}>❌</span></h2>
          
        </div></center>
       
        <div style={contentStyle}>
          <p>Are you sure you want to log out?</p>
        </div>
        <div style={buttonContainerStyle}>
          <button style={buttonStyle} onClick={handleConfirmLogout}>Logout</button>
          <button style={cancelButtonStyle} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
