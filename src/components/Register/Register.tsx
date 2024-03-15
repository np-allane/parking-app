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
  width: 400px;
  padding: 40px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
  font-size: 1.1em;

  .form-group {
    margin-bottom: 1.5em;
  }

  .btn {
    font-size: 1.05em;
    padding: 0.5em 1em;
  }

  .btn-link {
    font-size: 0.9em;
  }

  .form-label {
    display: block;
    margin-bottom: 0.5rem;
    text-align: left;
  }

  .form-control {
    display: block;
    width: 100%; // Ensures full-width inputs
    padding: 0.375rem 0.75rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .btn {
    display: block;
    width: 100%;
  }

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 1em;
  }

  .btn-link {
    align-self: center;
  }

  .error-message {
    color: red;
    margin-top: 0.5rem;
    font-size: 0.9em;
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
