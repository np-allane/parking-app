import { useState } from "react";
import { useNavigate } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { LinkContainer } from "react-router-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import styled from "styled-components";
import { auth } from "../../firebase";

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

  .form-label {
    display: block;
    margin-bottom: 0.5rem;
    text-align: left;
  }

  .form-control {
    display: block;
    width: 100%;
    padding: 0.375rem 0.75rem;
  }

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .error-message {
    color: red;
    margin-top: 0.5rem;
    font-size: 0.9em;
  }

  .btn {
    display: block;
    width: 100%;
    font-size: 1.05em;
    padding: 0.5em 1em;
    margin-bottom: 1rem;
  }

  .btn-success {
    padding: 0.4em 0.8em;
    border-radius: 20px;
    font-size: 0.9em;
    background-color: #28a745;
    border-color: #28a745;
    color: white;

    &:hover {
      background-color: #218838;
      border-color: #1e7e34;
    }
  }

  .button-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 1em;
  }

  .btn-link {
    align-self: center;
    font-size: 0.9em;
    color: #007bff;
    text-decoration: underline;
    &:hover {
      color: #0056b3;
    }
    padding: 0.4em 0.8em;
    margin-left: 110px;
  }
`;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate("/parkingLot");
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      {error && <p className="error-message">{error}</p>}
      <div className="button-group">
        <Button variant="success" type="submit">
          Submit
        </Button>
        <LinkContainer to="/register">
          <Button variant="link">Register</Button>
        </LinkContainer>
      </div>
    </StyledForm>
  );
};

export default LoginPage;
