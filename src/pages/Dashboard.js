import './Dashboard.css';
import Sidebar from '../components/Sidebar';

function Dashboard() {
  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="p-7 flex-1 h-screen">
          <h1 className="text-2xl font-semibold">
            Dashboard
          </h1>
        </div>
      
      </div>
    </>
  );
}

export default Dashboard;