// src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../api/api-calls";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await authAPI.verifyEmail(token);
        console.log(response);
        toast.success("Email verified successfully!");
        setStatus("success");

        setTimeout(() => navigate("/"), 3000); // redirect after delay
      } catch (error) {
        console.error(error);
        toast.error(
          error.response.data.error || "Verification failed or link expired."
        );
        setStatus("failed");
      }
    };

    if (token) {
      verify();
    } else {
      setStatus("invalid");
      toast.error("Invalid token.");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        {status === "verifying" && (
          <p className="text-lg font-medium text-gray-600">Verifying...</p>
        )}
        {status === "success" && (
          <p className="text-green-600 text-xl font-semibold">
            ✅ Your email has been verified!
          </p>
        )}
        {status === "failed" && (
          <p className="text-red-500 text-xl font-semibold">
            ❌ Verification failed. Please check your email or request a new
            link.
          </p>
        )}
        {status === "invalid" && (
          <p className="text-red-500 text-xl font-semibold">
            ⚠️ Invalid token provided.
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
