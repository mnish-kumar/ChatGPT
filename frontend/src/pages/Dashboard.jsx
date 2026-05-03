import PixelCard from "@/components/PixelCard";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-chart-1 text-foreground font-sans gap-10 justify-center items-center">
      <PixelCard
        variant="pink"
        className="cursor-pointer"
        onClick={() => navigate("/chat")}
      >
        <h1 className="absolute font-heading text-xl">ChitChat</h1>
      </PixelCard>

      <PixelCard
        variant="yellow"
        className="cursor-pointer"
        onClick={() => navigate("/resume-analyzer")}
      >
        <h1 className="absolute font-heading text-xl">Resume Analysis</h1>
      </PixelCard>
    </div>
  );
};

export default Dashboard;
