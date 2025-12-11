import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const handleFakeLogin = () => {
    onLogin?.({ id: "user_1", name: "Partha" });
    navigate("/");
  };

  return (
    <section className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4 text-text-primary">
        Login
      </h1>

      <p className="text-text-secondary mb-4">
        Temporary mock login for frontend testing.
      </p>

      <button
        onClick={handleFakeLogin}
        className="px-4 py-2 rounded-md bg-accent text-white hover:bg-accent-hover"
      >
        Simulate Login
      </button>
    </section>
  );
}
