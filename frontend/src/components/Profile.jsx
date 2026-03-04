import { SquarePen } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const [tilt, setTilt] = useState({ x: 0, y: 0 });

    // Adjust the threshold value to control the tilt effect
    const threshold = 12;

    const handleMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        setTilt({ x: y * -threshold, y: x * threshold });
    };

  return (
    <div
      
    className="flex justify-center items-center min-h-screen bg-gray-100">
      
      {/* Profile Card */}
      <div
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({x:0, y: 0})}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      className="w-95 bg-white rounded-2xl shadow-lg p-6 transition-transform duration-200 ease-out shadow-gray-800">

        {/* Top Section */}
        <div className="flex items-start justify-between">

          {/* Image + Name */}
          <div className="flex flex-col justify-start gap-1">
            <img
              className="h-20 w-20 rounded-full object-cover object-top"
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=60"
              alt="username"
            />

            <div>
              <h2 className="text-lg font-medium text-gray-800">
                John Doe
              </h2>
              <p className="text-gray-500 text-sm">
                johndoe@gmail.com
              </p>
            </div>
          </div>

          {/* Edit Button */}
          <button
            className="flex items-center gap-2 font-medium px-3 py-1.5 rounded-lg bg-gray-500 hover:bg-gray-700 cursor-pointer text-white text-sm"
            onClick={() => navigate(-1)}
          >
            <SquarePen size={16} />
            Edit
          </button>

        </div>

        {/* Divider */}
        <div className="my-5 border-t"></div>

        {/* Extra Info */}
        <div className="space-y-2 text-gray-700">
          <p className="flex flex-col border-l-4 border-gray-300 pl-3">
            <span className="font-semibold">Username:</span> johndoe
          </p>
          <p className="flex flex-col border-l-4 border-gray-300 pl-3">
            <span className="font-semibold">Location:</span> India
          </p>
          <p className="flex flex-col border-l-4 border-gray-300 pl-3">
            <span className="font-semibold">Email:</span> manish.mvi@gmail.com
          </p>
        </div>

      </div>
    </div>
  );
};

export default Profile;