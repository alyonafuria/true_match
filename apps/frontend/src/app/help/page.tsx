import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, HelpCircle, Mail, Phone } from "lucide-react";
import { faqData } from "@/lib/data"; // Import FAQ data
import type { FAQItem } from "@/types";

export default function HelpPage() {
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

      <main className="container mx-auto px-4 py-12 md:py-16">
        <section className="text-center mb-12 animate-fadeIn">
          <HelpCircle className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground font-headline">Help Center & FAQ</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about TrueMatch. If you can't find what you're looking for, feel free to contact us.
          </p>
        </section>

        <Card className="max-w-3xl mx-auto shadow-xl mb-12 animate-slideInUp">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((item: FAQItem, index: number) => (
                <AccordionItem value={`item-${index + 1}`} key={index}>
                  <AccordionTrigger className="text-left hover:no-underline font-semibold">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="max-w-3xl mx-auto shadow-xl animate-slideInUp" style={{animationDelay: '0.2s'}}>
            <CardHeader>
                <CardTitle className="text-2xl font-headline">Contact Support</CardTitle>
                <CardDescription>Still have questions? Our support team is here to help.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-start space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <Mail className="h-8 w-8 text-primary mt-1 shrink-0"/>
                    <div>
                        <h3 className="font-semibold text-lg">Email Support</h3>
                        <p className="text-muted-foreground">Get in touch with our support team via email for detailed assistance.</p>
                        <Button variant="link" asChild className="px-0 h-auto text-primary">
                            <a href="mailto:support@truematch.com">support@truematch.com</a>
                        </Button>
                    </div>
                </div>
                 <div className="flex items-start space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <Phone className="h-8 w-8 text-primary mt-1 shrink-0"/>
                    <div>
                        <h3 className="font-semibold text-lg">Phone Support</h3>
                        <p className="text-muted-foreground">Speak directly with a support agent during business hours.</p>
                        <p className="text-primary font-medium">(555) TRU-MTCH / (555) 878-6824</p>
                    </div>
                </div>
                 <div className="flex items-start space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <HelpCircle className="h-8 w-8 text-primary mt-1 shrink-0"/>
                    <div>
                        <h3 className="font-semibold text-lg">Knowledge Base</h3>
                        <p className="text-muted-foreground">Explore our comprehensive guides and tutorials.</p>
                        <Button variant="outline" size="sm" asChild className="mt-2 hover:bg-accent/10 active:scale-95 transition-all">
                            <Link href="/kb">Visit Knowledge Base</Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
      </main>

      <footer className="py-8 border-t bg-muted/30 mt-auto">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TrueMatch. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
