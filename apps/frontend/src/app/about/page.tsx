import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Users, Zap, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
      <header className="py-4 px-6 md:px-12 border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary font-headline">
            TrueMatch
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Home</Link>
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-12 md:py-16">
        <section className="text-center mb-16 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground font-headline">About TrueMatch</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Revolutionizing hiring through trust, transparency, and technology. We connect verified talent with their dream jobs and help companies build exceptional teams.
          </p>
        </section>

        <Card className="mb-12 shadow-xl animate-slideInUp">
          <CardContent className="p-0 md:flex">
            <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
              <h2 className="text-3xl font-semibold mb-4 text-primary font-headline">Our Mission</h2>
              <p className="text-muted-foreground mb-3 leading-relaxed">
                At TrueMatch, our mission is to create a fair and efficient hiring ecosystem. We believe that everyone deserves the opportunity to showcase their true skills and experience, and employers deserve access to genuinely qualified candidates. By leveraging verifiable credentials and intelligent matching, we aim to eliminate biases, reduce hiring times, and foster stronger employer-employee relationships from the very first interaction.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We are committed to building a platform where integrity is paramount, privacy is protected, and potential is unlocked.
              </p>
            </div>
            <div className="md:w-1/2">
              <Image 
                src="https://placehold.co/600x400.png" 
                alt="Diverse team collaborating" 
                width={600} 
                height={400} 
                className="rounded-b-lg md:rounded-r-lg md:rounded-bl-none object-cover h-full"
                data-ai-hint="team collaboration"
              />
            </div>
          </CardContent>
        </Card>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-10 text-foreground font-headline">What Sets Us Apart</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideInUp" style={{animationDelay: '0.1s'}}>
              <CardHeader className="items-center">
                <ShieldCheck className="h-12 w-12 text-primary mb-2" />
                <CardTitle className="font-headline">Verifiable Credentials</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">We go beyond self-reported claims. Our robust verification process ensures authenticity, providing employers with reliable candidate information.</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideInUp" style={{animationDelay: '0.2s'}}>
              <CardHeader className="items-center">
                <Zap className="h-12 w-12 text-primary mb-2" />
                <CardTitle className="font-headline">AI-Powered Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Our intelligent algorithms analyze verified skills and experience to provide highly accurate job-to-candidate matches, saving time for everyone.</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideInUp" style={{animationDelay: '0.3s'}}>
              <CardHeader className="items-center">
                <Users className="h-12 w-12 text-primary mb-2" />
                <CardTitle className="font-headline">User-Centric Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Designed with both job seekers and employers in mind, TrueMatch offers an intuitive, secure, and empowering experience for all users.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center py-12 bg-card rounded-lg shadow-lg animate-fadeIn" style={{animationDelay: '0.4s'}}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground font-headline">Join the Future of Hiring</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Whether you're looking for your next career move or searching for top talent, TrueMatch provides the tools and trust you need.
            </p>
            <Button size="lg" asChild className="hover:opacity-80 active:scale-95 transition-all">
                <Link href="/sign-in">Get Started with TrueMatch</Link>
            </Button>
        </section>
      </main>

       <footer className="py-8 border-t bg-muted/30 mt-auto">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TrueMatch. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
