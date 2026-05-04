import PixelCard from "@/components/PixelCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PremiumButton from "@/components/PremiumButton";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.user);
  console.log("User in Dashboard:", user.plan);

  return (
    <div className="flex min-h-screen bg-chart-1 text-foreground font-sans gap-10 justify-center items-center">
      <PixelCard
        variant="pink"
        className="cursor-pointer"
        onClick={() => navigate("/chat")}
      >
        <h1 className="absolute font-heading text-5xl font-semibold text-center">ChitChat</h1>
      </PixelCard>

      <PixelCard
        variant="yellow"
        className="cursor-pointer"
        
      >
        <h1 className="absolute font-heading text-5xl font-semibold text-center">Resume Analysis</h1>
        <div className="absolute bottom-8">
          <PremiumButton />
        </div>
      </PixelCard>
    </div>
  );
};

export default Dashboard;
