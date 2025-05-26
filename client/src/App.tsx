import { Switch, Route } from "wouter";
import Header from "./components/ui/header";
import Footer from "./components/ui/footer";
import Home from "./pages/Home";
import Calculator from "./pages/Calculator";
import PomodoroTimer from "./pages/PomodoroTimer";
import NotFound from "./pages/not-found";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/calculator" component={Calculator} />
          <Route path="/pomodoro" component={PomodoroTimer} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;
