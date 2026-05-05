import PixelCard from "@/components/PixelCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PremiumButton from "@/components/PremiumButton";
import TextType from "@/components/TextType";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((s) => s.user);

  if (!user || isLoading) {
    return (
      <div className="flex min-h-screen bg-chart-1 items-center justify-center gap-10">
        <style>{`
          @keyframes shimmer {
            0% { background-position: -600px 0; }
            100% { background-position: 600px 0; }
          }
          .sk {
            background: linear-gradient(90deg, #e2e2e2 25%, #efefef 50%, #e2e2e2 75%);
            background-size: 1200px 100%;
            animation: shimmer 1.6s infinite linear;
          }
          .dark .sk {
            background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
            background-size: 1200px 100%;
          }
        `}</style>

        {/* PixelCard 1 — ChitChat */}
        <div className="sk h-64 w-56 rounded-xl" />

        {/* PixelCard 2 — Resume */}
        <div className="sk h-64 w-56 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-chart-1 text-foreground font-sans gap-10 justify-center items-center">
      <PixelCard
        variant="pink"
        className="cursor-pointer"
        onClick={() => navigate("/chat")}
      >
        <h1 className="absolute font-heading text-5xl font-semibold text-center">
          ChitChat
        </h1>
      </PixelCard>

      <PixelCard
        variant="yellow"
        className="cursor-pointer"
        onClick={() => navigate("/resume-analyzer")}
      >
        <h1 className="absolute font-heading text-3xl font-medium text-center">
          <TextType
            text={[
              "Get Hired Faster",
              "AI Resume Intelligence",
              "Crack Your Dream Job",
            ]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor
            cursorCharacter="_"
            deletingSpeed={50}
            variableSpeedEnabled={false}
            variableSpeedMin={60}
            variableSpeedMax={120}
            cursorBlinkDuration={0.5}
          />
        </h1>
        <div className="absolute bottom-8 flex flex-col">
          {user?.plan?.type !== "PREMIUM" ? (
            <>
              <span className="mb-1 text-sm text-center leading-relaxed">
                Upgrade to Premium for unlimited access
              </span>
              <PremiumButton />
            </>
          ) : (
            <span className="mb-1 text-lg font-medium text-center leading-relaxed">
              Now we help you faster to get hired 🚀
            </span>
          )}
        </div>
      </PixelCard>
    </div>
  );
};

export default Dashboard;
