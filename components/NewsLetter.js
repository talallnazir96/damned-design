import axios from "axios";
import { useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { createNotification, isValidEmail } from "../functions/utils";
import newsLetterStyles from "../styles/Newsletter.module.css";

function NewsLetter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email))
      return createNotification("error", "Invalid email", "Error");

    setLoading(true);

    try {
      await axios.post("/api/newsletter-subscribe", { email });
      createNotification(
        "success",
        "Thank you for joining our newsletter",
        "Success!"
      );
    } catch (error) {
      console.log(error.response);
      if (error.response?.data?.errorMessage)
        createNotification("error", error.response.data.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`${newsLetterStyles.newsLetter} mt-2`}>
      <Container>
        <Row>
          <Col sm={12} md={12}>
            <h2>Get notified about special offers!</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="newsletter"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
              />
              <button
                type="submit"
                className={`btn btnWhite`}
                disabled={loading}
              >
                {loading ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default NewsLetter;
