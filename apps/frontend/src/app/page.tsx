import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Briefcase, ShieldCheck, Users } from 'lucide-react';
import Image from 'next/image';

// Import images using @/ alias
const hiringGateway = '/assets/20250619_0233_Futuristic_Hiring_Gateway_simple_compose_01jy2p58.png';
const createProfile = '/assets/20250619_0149_Create_Profile_Illustration_simple_compose_01jy2k.png';
const verification = '/assets/20250619_0153_3D_Verification_Icons_remix_01jy2kvmvjecmrefc41syp3wct.png';
const aiMatching = '/assets/20250619_0158_AI_Job_Connection_simple_compose_01jy2m66m9enwbptxah9esdqxr.png';

export default function LandingPage() {
  const features = [
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: 'Verified Credentials',
      description: 'Build trust with employers through independently verified skills and experience.',
    },
    {
      icon: <Briefcase className="h-10 w-10 text-primary" />,
      title: 'AI-Powered Job Matching',
      description: 'Discover opportunities perfectly aligned with your verified qualifications and career goals.',
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-primary" />,
      title: 'Secure & Private',
      description: 'Your data is protected with industry-leading security measures, giving you full control.',
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: 'Empower Employers',
      description: 'Access a pool of pre-verified candidates, reducing hiring time and costs.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-4 px-6 md:px-12 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary font-headline">
            TrueMatch
          </Link>
          <Button asChild className="hover:opacity-80 active:scale-95 transition-all">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground font-headline animate-fadeIn">
              Hire Smarter, Get Hired Faster.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              TrueMatch connects talent with opportunity through verifiable credentials and intelligent matching.
            </p>
            <Button size="lg" asChild className="hover:opacity-80 active:scale-95 transition-all animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              <Link href="/sign-in">Get Started</Link>
            </Button>
             <div className="mt-12 relative w-full max-w-4xl mx-auto rounded-lg shadow-2xl overflow-hidden animate-fadeIn aspect-[16/9]" style={{ animationDelay: '0.6s' }}>
                <Image 
                    src={hiringGateway}
                    alt="Futuristic Hiring Gateway"
                    fill
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    className="object-cover w-full h-full"
                    priority
                />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground font-headline">
              Why Choose TrueMatch?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader className="items-center">
                    {feature.icon}
                    <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24 bg-secondary/50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground font-headline">
              Simple Steps to Success
            </h2>
            <div className="grid md:grid-cols-3 gap-10 items-start">
              <div className="flex flex-col items-center text-center p-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4 text-2xl font-bold w-12 h-12 flex items-center justify-center">1</div>
                <h3 className="text-xl font-semibold mb-2 font-headline">Create Your Profile</h3>
                <p className="text-muted-foreground">Job seekers upload CVs, employers post jobs. Get started in minutes.</p>
                <div className="relative w-full aspect-[4/3] mt-4 rounded-lg overflow-hidden shadow-md">
                  <Image 
                    src={createProfile} 
                    alt="Profile creation"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center text-center p-6 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4 text-2xl font-bold w-12 h-12 flex items-center justify-center">2</div>
                <h3 className="text-xl font-semibold mb-2 font-headline">Verify & Validate</h3>
                <p className="text-muted-foreground">Our platform and verifiers confirm credentials, ensuring authenticity and trust.</p>
                <div className="relative w-full aspect-[4/3] mt-4 rounded-lg overflow-hidden shadow-md">
                  <Image 
                    src={verification} 
                    alt="Verification process"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center text-center p-6 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
                <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4 text-2xl font-bold w-12 h-12 flex items-center justify-center">3</div>
                <h3 className="text-xl font-semibold mb-2 font-headline">Match & Connect</h3>
                <p className="text-muted-foreground">AI finds the best fits. Connect, apply, and hire with confidence.</p>
                <div className="relative w-full aspect-[4/3] mt-4 rounded-lg overflow-hidden shadow-md">
                  <Image 
                    src={aiMatching} 
                    alt="AI Job Matching"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground font-headline">
              Ready to Transform Your Hiring?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join TrueMatch today and experience the future of recruitment.
            </p>
            <Button size="lg" asChild className="hover:opacity-80 active:scale-95 transition-all">
              <Link href="/sign-in">Sign Up Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t bg-muted/30">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TrueMatch. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/about" className="hover:text-primary">About</Link>
            <Link href="/help" className="hover:text-primary">Help</Link>
            <Link href="/faq" className="hover:text-primary">FAQ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
