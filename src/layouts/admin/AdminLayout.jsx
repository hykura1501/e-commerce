import Header from "./components/Header";
import Navbar from "./components/Navbar";
function AdminLayout({user, children, setUser }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} setUser={setUser}/>
        <main className="flex-1 overflow-y-auto bg-background px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
