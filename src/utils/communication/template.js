// src/utils/communication/template.js

export const generateEmailTemplate = ({ firstName, passcode }) => {
  return `
    Hello ${firstName},
    
    Welcome to The Almaroof Initiative!
    
    Your 6-digit passcode is: ${passcode}
    
    Please use this code to verify your account.
    
    Thank you,
    The Almaroof Initiative Team
  `;
};

export const generateSmsTemplate = ({ firstName, passcode }) => {
  return `Hi ${firstName}, your verification passcode for The Almaroof Initiative is: ${passcode}`;
};
