import { useNavigate } from "react-router-dom";

export default function Signup({ onLogin }) {
  const navigate = useNavigate();

  const handleFakeSignup = () => {
    onLogin?.({ id: "user_2", name: "NewUser" });
    navigate("/");
  };

  return (
    <section className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4 text-text-primary">
        Sign Up
      </h1>

      <p className="text-text-secondary mb-4">
        Temporary mock signup for frontend testing.
      </p>

      <button
        onClick={handleFakeSignup}
        className="px-4 py-2 rounded-md bg-accent text-white hover:bg-accent-hover"
      >
        Simulate Sign Up
      </button>
    </section>
  );
}
