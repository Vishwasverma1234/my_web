import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { id } = useParams(); // grabs :id from /profile/:id
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${id}`);
        const data = await res.json();

        // if backend wraps user object in { user: {...} }
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(data);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <p className="text-center">Loading profile...</p>;
  if (!user) return <p className="text-center">User not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{user.username}</h2>
      <p className="text-gray-600 mb-2">📧 Email: {user.email}</p>
      <p className="text-gray-600 mb-2">
        🗓 Joined: {new Date(user.createdAt).toDateString()}
      </p>
    </div>
  );
}
