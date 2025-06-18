"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Send, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

const allSkills = ["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js", "Python", "AWS", "Product Strategy", "Agile", "Market Research", "JIRA", "Figma", "User Research", "Prototyping", "Adobe XD", "SQL", "Communication"];

const jobFormSchema = z.object({
  title: z.string().min(5, "Job title must be at least 5 characters.").max(100),
  company: z.string().min(2, "Company name must be at least 2 characters.").max(100),
  location: z.string().min(2, "Location is required.").max(50),
  description: z.string().min(50, "Description must be at least 50 characters.").max(5000),
  responsibilities: z.string().optional(),
  qualifications: z.string().optional(),
  requiredSkills: z.array(z.string()).min(1, "At least one skill is required."),
  salaryRange: z.string().optional(),
  isRemote: z.boolean().default(false).optional(),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

export default function PostJobPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      requiredSkills: [],
      isRemote: false,
    },
  });

  async function onSubmit(data: JobFormValues) {
    setIsLoading(true);
    // Simulate API call
    console.log(data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast({
      title: "Job Posted Successfully!",
      description: `The job "${data.title}" has been posted.`,
    });
    form.reset();
    router.push('/jobs/manage');
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto animate-fadeIn">
      <header className="text-center">
        <Briefcase className="mx-auto h-12 w-12 text-primary mb-2" />
        <h1 className="text-3xl font-bold font-headline">Post a New Job</h1>
        <p className="text-muted-foreground">Fill in the details below to find your next great hire.</p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Job Details</CardTitle>
              <CardDescription>Provide essential information about the position.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Senior Frontend Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Company Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., New York, NY or Remote" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                control={form.control}
                name="isRemote"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        This is a remote position
                      </FormLabel>
                      <FormDescription>
                        Candidates can work from anywhere.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="salaryRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Range (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., $80,000 - $120,000 per year" {...field} />
                    </FormControl>
                    <FormDescription>Provide an estimated salary range for this role.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Description & Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detailed description of the role, company culture, etc." rows={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="responsibilities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Responsibilities (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List key responsibilities, one per line." rows={4} {...field} />
                    </FormControl>
                    <FormDescription>Enter each responsibility on a new line.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="qualifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualifications (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List required or preferred qualifications, one per line." rows={4} {...field} />
                    </FormControl>
                     <FormDescription>Enter each qualification on a new line.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline">Required Skills</CardTitle>
                <CardDescription>Select the skills crucial for this role. This helps in accurate candidate matching.</CardDescription>
            </CardHeader>
            <CardContent>
                <FormField
                control={form.control}
                name="requiredSkills"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <Controller
                        control={form.control}
                        name="requiredSkills"
                        render={({ field: controllerField }) => (
                        <Select
                            onValueChange={(value) => {
                            const currentSkills = controllerField.value || [];
                            if (currentSkills.includes(value)) {
                                controllerField.onChange(currentSkills.filter(skill => skill !== value));
                            } else {
                                controllerField.onChange([...currentSkills, value]);
                            }
                            }}
                            // value={''} // This select is for adding skills, not showing current single value
                        >
                            <SelectTrigger>
                            <SelectValue placeholder="Add a skill..." />
                            </SelectTrigger>
                            <SelectContent>
                            {allSkills.map(skill => (
                                <SelectItem key={skill} value={skill} disabled={controllerField.value?.includes(skill)}>
                                {skill} {controllerField.value?.includes(skill) && "(Selected)"}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        )}
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                        {field.value?.map((skill) => (
                        <Badge
                            key={skill}
                            variant="secondary"
                            className="flex items-center gap-1"
                        >
                            {skill}
                            <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 text-muted-foreground hover:text-destructive"
                            onClick={() => field.onChange(field.value.filter(s => s !== skill))}
                            >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove {skill}</span>
                            </Button>
                        </Badge>
                        ))}
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </CardContent>
            <CardFooter>
                 <Button type="submit" disabled={isLoading} className="w-full md:w-auto hover:opacity-80 active:scale-95 transition-all">
                    {isLoading ? "Posting Job..." : <><Send className="mr-2 h-4 w-4" /> Post Job</>}
                 </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}

// Minimal X icon for badge, if not using lucide-react directly or want custom size
const X = ({ className }: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "h-4 w-4"}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
