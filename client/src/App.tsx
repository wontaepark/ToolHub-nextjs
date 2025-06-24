import { Switch, Route } from "wouter";
import Header from "./components/ui/header";
import Footer from "./components/ui/footer";
import CookieConsent from "./components/CookieConsent";
import Home from "./pages/Home";
import Calculator from "./pages/Calculator";
import PomodoroTimer from "./pages/PomodoroTimer";
import Timer from "./pages/Timer";
import NumberRaffle from "./pages/NumberRaffle";
import ThumbnailDownloader from "./pages/ThumbnailDownloader";
import PasswordGenerator from "./pages/PasswordGenerator";
import UnitConverter from "./pages/UnitConverter";
import DateCalculator from "./pages/DateCalculator";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import MBTITest from "./pages/MBTITest_clean";
import TetoEgenTest from "./pages/TetoEgenTest";
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
          <Route path="/timer" component={Timer} />
          <Route path="/raffle" component={NumberRaffle} />
          <Route path="/thumbnail" component={ThumbnailDownloader} />
          <Route path="/password" component={PasswordGenerator} />
          <Route path="/converter" component={UnitConverter} />
          <Route path="/date-calculator" component={DateCalculator} />
          <Route path="/mbti" component={MBTITest} />
          <Route path="/teto-egen-test" component={TetoEgenTest} />
          <Route path="/contact" component={Contact} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}

export default App;