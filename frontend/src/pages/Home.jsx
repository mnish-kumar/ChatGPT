import Navbar from "../components/Navbar";
import Threads from "../components/Thread";

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="relative w-full h-screen bg-slate-400 overflow-hidden">
        <div className="absolute inset-0 z-20">
          <Threads amplitude={1} distance={0} enableMouseInteraction />
        </div>

        <div className="relative z-10">
          <h1>Welcome to JarviSync</h1>
          <p>This is the home page.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
