import { motion } from "framer-motion";

export default function Toast({ message, type = "success" }) {
  if (!message) return null;

  const color = type === "error" ? "bg-red-500/90" : "bg-accent";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-6 right-6 px-4 py-2 text-white rounded-md shadow-lg ${color} z-50`}
    >
      {message}
    </motion.div>
  );
}
