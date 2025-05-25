import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Your Essential <span className="text-primary">Toolkit</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Access a collection of useful tools designed to make your life easier. All in one place, always at your fingertips.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Calculator Card */}
        <div className="tool-card bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl">
          <div className="h-32 gradient-bg flex items-center justify-center">
            <i className="ri-calculator-line text-white text-5xl"></i>
          </div>
          <div className="p-5">
            <h3 className="font-semibold text-lg mb-2">Calculator</h3>
            <p className="text-muted-foreground text-sm mb-4">Perform basic and advanced calculations with ease.</p>
            <Link href="/calculator">
              <Button className="w-full">
                Open Tool
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Timer Card (Coming Soon) */}
        <div className="tool-card bg-card rounded-xl shadow-lg overflow-hidden opacity-80">
          <div className="h-32 bg-muted flex items-center justify-center">
            <i className="ri-timer-line text-muted-foreground text-5xl"></i>
          </div>
          <div className="p-5">
            <h3 className="font-semibold text-lg mb-2">Timer</h3>
            <p className="text-muted-foreground text-sm mb-4">Set timers and countdowns for your tasks.</p>
            <div className="w-full py-2 px-4 bg-muted text-muted-foreground rounded-lg text-center">
              Coming Soon
            </div>
          </div>
        </div>
        
        {/* Unit Converter Card (Coming Soon) */}
        <div className="tool-card bg-card rounded-xl shadow-lg overflow-hidden opacity-80">
          <div className="h-32 bg-muted flex items-center justify-center">
            <i className="ri-scales-3-line text-muted-foreground text-5xl"></i>
          </div>
          <div className="p-5">
            <h3 className="font-semibold text-lg mb-2">Unit Converter</h3>
            <p className="text-muted-foreground text-sm mb-4">Convert between different units of measurement.</p>
            <div className="w-full py-2 px-4 bg-muted text-muted-foreground rounded-lg text-center">
              Coming Soon
            </div>
          </div>
        </div>
        
        {/* Weather Card (Coming Soon) */}
        <div className="tool-card bg-card rounded-xl shadow-lg overflow-hidden opacity-80">
          <div className="h-32 bg-muted flex items-center justify-center">
            <i className="ri-sun-cloudy-line text-muted-foreground text-5xl"></i>
          </div>
          <div className="p-5">
            <h3 className="font-semibold text-lg mb-2">Weather</h3>
            <p className="text-muted-foreground text-sm mb-4">Check the current weather and forecast.</p>
            <div className="w-full py-2 px-4 bg-muted text-muted-foreground rounded-lg text-center">
              Coming Soon
            </div>
          </div>
        </div>
      </div>
      
      <Card className="mt-16">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">About ToolHub.io</h3>
          <p className="text-card-foreground mb-4">
            ToolHub.io is a growing collection of practical web tools designed to help you with everyday tasks. 
            Our mission is to provide simple, fast, and free utilities that work seamlessly across all your devices.
          </p>
          <p className="text-card-foreground">
            We're constantly adding new tools to our collection. If you have any suggestions or feedback, we'd love to hear from you!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
