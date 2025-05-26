import { Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-xs md:text-sm text-muted-foreground">
              © {new Date().getFullYear()} ToolHub.io. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-4 md:space-x-6">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-lg"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4 md:h-5 md:w-5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-lg"
              aria-label="Twitter"
            >
              <Twitter className="h-4 w-4 md:h-5 md:w-5" />
            </a>
            <a 
              href="mailto:contact@toolhub.io" 
              className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-lg"
              aria-label="Email"
            >
              <Mail className="h-4 w-4 md:h-5 md:w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
