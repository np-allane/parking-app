import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import styled from "styled-components";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const StyledForm = styled(Form)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px; /* Increased width */
  padding: 40px; /* More padding for a better look */
  background-color: white;
  border-radius: 15px; /* Slightly more rounded corners */
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15); /* Slightly deeper shadow for depth */
  font-size: 1.1em; /* Bigger font size for better readability */

  .form-group {
    margin-bottom: 1.5em; /* More space between form groups */
  }

  .btn {
    font-size: 1.05em; /* Bigger buttons for better clickability */
    padding: 0.5em 1em; /* More padding in buttons */
  }

  .btn-link {
    font-size: 0.9em; /* Stylish yet distinguished link button */
  }

  .form-label {
    display: block;
    margin-bottom: 0.5rem;
    text-align: left; // Aligns the label text to the left for consistency
  }

  .form-control {
    display: block;
    width: 100%; // Ensures full-width inputs
    padding: 0.375rem 0.75rem; // Adjust padding if needed
  }

  .form-group {
    margin-bottom: 1.5rem; // Consistent spacing between form groups
  }

  .btn {
    display: block; // Makes the button a block element
    width: 100%; // Full width for the button
    // ...other existing button styles...
  }

  h2 {
    text-align: center; // Center-align the title
    margin-bottom: 1.5rem; // Space between title and first input field
  }

  .button-group {
    display: flex;
    justify-content: space-between; // Aligns one button to the left, the other to the right
    margin-top: 1em; // Adds some space above the button group
  }

  .btn-link {
    align-self: center; // Aligns the link button vertically in the center of the flex container
  }

  .error-message {
    color: red; // Sets the color of the error message to red
    margin-top: 0.5rem; // Adds some space above the error message
    font-size: 0.9em; // Adjust the font size as needed
  }
`;

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate("/parkingLot");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      {error && <p className="error-message">{error}</p>}
      <Button variant="success" type="submit">
        Register
      </Button>
    </StyledForm>
  );
}

export default Register;
