import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { setRole } = useAuth();

  const handleRoleSelection = (role) => {
    setRole(role); // Set role in context
    router.push(`/${role}`); // Navigate to the role-specific page
  };
  return (
    <div>
      {/* First page */}
      <h1>Welcome! Select Your Role</h1>
      <button class="button" onClick={() => handleRoleSelection("admin")}>
        Admin
      </button>
      <br />
      <br />
      <button class="button" onClick={() => handleRoleSelection("client")}>
        Client
      </button>
    </div>
  );
}
