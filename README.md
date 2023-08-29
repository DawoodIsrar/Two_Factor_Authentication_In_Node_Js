# Two_Factor_Authentication_In_Node_Js
Two factor authentication with Email.
Description: This repository contains a sample Node.js application that demonstrates two-factor authentication (2FA) implementation using the speakeasy library for generating and verifying OTP tokens, and the jsonwebtoken library for handling JSON Web Tokens (JWT) for user sessions. The application allows users to sign up, log in, receive OTPs via email, and verify OTPs for accessing the dashboard.

Features:

User registration and login
Generation and verification of OTP tokens using speakeasy
JSON Web Token (JWT) based user sessions
Sending OTPs via email using Nodemailer
Basic web interface using EJS templates
Error handling and flash messages for user feedback
Instructions:

Clone the repository to your local machine.
Install the required dependencies using npm install.
Set up your MongoDB connection in index.js.
Configure your Gmail credentials in app.js for sending emails.
Run the application using node index.js.
Access the application in your browser at http://localhost:6000.
Note: Make sure to replace placeholders such as yourSecretKey, Gmail credentials, and any other relevant placeholders with your actual values.

Technologies Used:

Node.js
Express.js
MongoDB
speakeasy library for OTP generation and verification
jsonwebtoken library for handling JWT
Nodemailer for sending emails
Contributions: Contributions and improvements are welcome! Feel free to fork the repository and submit pull requests.

Feel free to customize this description to fit your project's specific details and features. Additionally, make sure to update the repository with proper documentation, a license file, and any other necessary files or instructions that will help users understand and use your project effectively.
