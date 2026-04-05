import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppShell({ app, children }) {
  return (
    <div className="app-frame">
      <div className="app-orb orb-a" />
      <div className="app-orb orb-b" />
      <div className="app-orb orb-c" />

      <div className="shell">
        <Sidebar app={app} />
        <div className="main">
          <Topbar app={app} />
          <main className="scroll">
            <div className="container">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
