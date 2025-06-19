"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { UploadCloud, CheckCircle, AlertCircle, Edit3, Save, Briefcase, GraduationCap, Award } from 'lucide-react';
import { sampleUserProfile } from '@/lib/data';
import type { UserProfile, ParsedExperience, ParsedEducation, WorkExperience } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { createActor } from "@/declarations/user";
import { canisterId } from '@/declarations/user/index.js';


// Import Internet Computer dependencies
import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
// Import the IDL factory from the generated declarations
import { idlFactory } from '@/declarations/user/user.did';

// User canister ID - replace with your actual canister ID
const USER_CANISTER_ID = 'lqy7q-dh777-77777-aaaaq-cai'; // Replace with your canister ID
const IC_HOST = process.env.NEXT_PUBLIC_IC_HOST || 'http://localhost:8000';

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile>(sampleUserProfile);
  const [cvText, setCvText] = useState('');
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authClient, setAuthClient] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState<string>('');
  const { toast } = useToast();

  // Handle authentication callback
  useEffect(() => {
    const handleAuthCallback = async () => {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        const status = url.searchParams.get('status');
        
        if (status === 'success') {
          const userParam = url.searchParams.get('user');
          if (userParam) {
            try {
              const userData = JSON.parse(decodeURIComponent(userParam));
              setUserProfile(prev => ({
                ...prev,
                name: userData.name || prev.name,
                email: userData.email || prev.email,
                profilePicture: userData.picture || prev.profilePicture
              }));
              
              // Clean up the URL
              window.history.replaceState({}, document.title, window.location.pathname);
            } catch (error) {
              console.error('Error parsing user data:', error);
              toast({
                title: 'Error',
                description: 'Failed to parse user data',
                variant: 'destructive'
              });
            }
          }
        }
      }
    };

    handleAuthCallback();
  }, [toast]);

  // Initialize auth client on component mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const client = await AuthClient.create({
          idleOptions: {
            idleTimeout: 1000 * 60 * 30, // 30 minutes
            disableDefaultIdleCallback: true
          }
        });
        setAuthClient(client);
        const isAuthed = await client.isAuthenticated();
        setIsAuthenticated(isAuthed);
      } catch (error) {
        console.error('Failed to initialize auth client:', error);
      }
    };
    initAuth();
  }, []);

  // Function to handle login
  const login = async (): Promise<void> => {
    if (!authClient) {
      const error = new Error('Auth client not initialized');
      console.error(error);
      throw error;
    }
    
    try {
      // First check if we're already authenticated
      const isAuthed = await authClient.isAuthenticated();
      if (isAuthed) {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toString();
        setIsAuthenticated(true);
        setPrincipal(principal);
        return;
      }

      // If not authenticated, start the login flow
      return new Promise((resolve, reject) => {
        authClient.login({
          identityProvider: 'http://localhost:8000?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai',
          maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 1 week in nanoseconds
          onSuccess: async () => {
            try {
              const isAuthed = await authClient.isAuthenticated();
              if (!isAuthed) {
                throw new Error('Authentication verification failed');
              }
              const identity = authClient.getIdentity();
              const principal = identity.getPrincipal().toString();
              
              setIsAuthenticated(true);
              setPrincipal(principal);
              
              toast({
                title: 'Successfully authenticated',
                description: `Principal: ${principal}`,
                variant: 'default'
              });
              
              console.log('Login successful, principal:', principal);
              resolve();
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error';
              console.error('Error in login success handler:', errorMessage);
              toast({
                title: 'Authentication error',
                description: errorMessage,
                variant: 'destructive'
              });
              reject(new Error(errorMessage));
            }
          },
          onError: (error: Error) => {
            console.error('Login error:', error.message);
            toast({
              title: 'Login failed',
              description: error.message,
              variant: 'destructive'
            });
            reject(error);
          }
        });
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Login failed:', errorMessage);
      toast({
        title: 'Authentication failed',
        description: errorMessage,
        variant: 'destructive'
      });
      throw error;
    }
  };

  // Function to get the authenticated user actor
  const getUserActor = async () => {
    if (!authClient) {
      throw new Error('Auth client not initialized');
    }
    
    // Ensure we're authenticated
    const isAuthed = await authClient.isAuthenticated();
    if (!isAuthed) {
      await login();
      throw new Error('Please authenticate first');
    }
    
    const identity = authClient.getIdentity();
    return createActor(canisterId, {
      agentOptions: {
        identity
      }
    });

    
 
    
    
  };

  // Function to save work experiences to the canister
  const saveToCanister = async (experiences: WorkExperience[]) => {
    
    try {
      // Get the authenticated actor
      const actor = await getUserActor();
      
      // First register the user if not already registered
      try {
        await actor.registerUser('User', 'Professional');
        console.log('User registered successfully');
      } catch (error) {
        // Ignore if user is already registered
        console.log('User may already be registered');
      }
      
      // Add each position to the canister
      for (const exp of experiences) {
        try {
          const duration = exp.endDate && exp.startDate 
            ? (new Date(exp.endDate).getTime() - new Date(exp.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30) // Convert to months
            : 12; // Default to 1 year if dates not available
            
          // Create the position object with exact fields expected by the canister
          const position = {
            company: exp.company,
            role: exp.title,
            duration: BigInt(Math.round(duration)),
            verified: [],  // This will be converted to null in Motoko
            reviewed: []   // This will be converted to null in Motoko
          };
          
          // Log position details without trying to stringify BigInt directly
          console.log('Sending position to canister:', {
            company: position.company,
            role: position.role,
            duration: position.duration.toString(), // Convert BigInt to string for logging
            verified: position.verified,
            reviewed: position.reviewed
          });
          
          await actor.addPosition(position);
          console.log('Position added successfully');
        } catch (error) {
          console.error(`Error adding position for ${exp.company}:`, error);
          // Continue with next position even if one fails
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error in saveToCanister:', error);
      throw new Error(`Failed to save to canister: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleParsedInfoChange = (section: 'experience' | 'education', index: number, field: keyof ParsedExperience | keyof ParsedEducation, value: string) => {
    setUserProfile(prev => ({
      ...prev,
      parsedInfo: {
        ...prev.parsedInfo,
        [section]: prev.parsedInfo[section].map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };
  
  const handleSkillChange = (index: number, value: string) => {
    setUserProfile(prev => {
      const newSkills = [...prev.skills];
      newSkills[index] = { ...newSkills[index], name: value };
      return { ...prev, skills: newSkills };
    });
  };

  const handleCvSubmit = async () => {
    if (!cvText.trim()) {
      toast({
        title: "No CV text",
        description: "Please paste your CV text before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    setIsParsing(true);
    
    try {
      // Call OpenAI API directly from the frontend
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that extracts work experience from CV text in JSON format.'
            },
            {
              role: 'user',
              content: `Extract work experience from this CV text and return a JSON array with the following structure for each job:
              [
                {
                  "title": "Job Title",
                  "company": "Company Name",
                  "startDate": "YYYY-MM-DD or YYYY",
                  "endDate": "YYYY-MM-DD or YYYY or null if current",
                  "description": "Brief description of role"
                }
              ]
              
              CV text: ${cvText}
              
              Only return valid JSON, no other text.`
            }
          ]
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to parse CV with OpenAI');
      }
      
      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content in OpenAI response');
      }
      
      // Clean the response to remove markdown code blocks if present
      let jsonContent = content.trim();
      if (jsonContent.startsWith('```json')) {
        // Remove the opening ```json and closing ```
        jsonContent = jsonContent
          .replace(/^```json\n?/m, '')  // Remove opening ```json
          .replace(/```$/, '')          // Remove closing ```
          .trim();
      } else if (jsonContent.startsWith('```')) {
        // Handle case where it's just ``` without json
        jsonContent = jsonContent
          .replace(/^```\n?/m, '')     // Remove opening ```
          .replace(/```$/, '')          // Remove closing ```
          .trim();
      }
      
      // Parse the JSON response
      const workExperiences = JSON.parse(jsonContent);
      
      if (!Array.isArray(workExperiences)) {
        throw new Error('Invalid format returned from OpenAI: Expected an array of work experiences');
      }
      
      if (workExperiences.length === 0) {
        throw new Error('No work experiences found in the CV');
      }
      
      // Update the UI with parsed experiences
      const parsedExperiences: ParsedExperience[] = workExperiences.map((exp: any) => ({
        id: `exp-${Math.random().toString(36).substr(2, 9)}`,
        title: exp.title,
        company: exp.company,
        dates: `${exp.startDate} - ${exp.endDate || 'Present'}`,
        description: exp.description || '',
        verified: false,
        verifiedBy: '',
        startDate: exp.startDate,
        endDate: exp.endDate || 'Present'
      }));
      
      setUserProfile(prev => ({
        ...prev,
        parsedInfo: {
          ...prev.parsedInfo,
          experience: parsedExperiences
        }
      }));
      
      // Save to the canister
      await saveToCanister(workExperiences);
      
      setWorkExperiences(workExperiences);
      
      toast({
        title: "CV Processed Successfully",
        description: `Saved ${workExperiences.length} work experience(s) to the blockchain`,
        variant: "default"
      });
      
    } catch (error) {
      console.error('Error processing CV:', error);
      
      // Check if it's an authentication error
      if (error instanceof Error && error.message.includes('authenticate')) {
        toast({
          title: "Authentication Required",
          description: "Please sign in with Internet Identity to save your CV data.",
          variant: "default",
          action: (
            <Button variant="outline" onClick={login}>
              Sign In
            </Button>
          )
        });
      } else {
        toast({
          title: "Processing failed",
          description: error instanceof Error ? error.message : 'Failed to process CV',
          variant: "destructive"
        });
      }
    } finally {
      setIsParsing(false);
    }
  };

  const handleSaveProfile = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsEditing(false);
      setIsLoading(false);
      // Update sampleUserProfile to persist changes for the session (won't persist across reloads without backend)
      // Object.assign(sampleUserProfile, userProfile);
      toast({ title: "Profile Saved", description: "Your profile information has been updated." });
    }, 1500);
  };

  // Calculate profile completion
  let profileCompletion = 0;
  if (userProfile.headline) profileCompletion += 20;
  if (userProfile.summary) profileCompletion += 20;
  if (userProfile.parsedInfo.experience.length > 0) profileCompletion += 20;
  if (userProfile.parsedInfo.education.length > 0) profileCompletion += 20;
  if (userProfile.skills.length > 0) profileCompletion += 20;


  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">My Profile & CV</h1>
        <Button onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)} disabled={isLoading} className="hover:opacity-80 active:scale-95 transition-all">
          {isEditing ? (isLoading ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Profile</>) : <><Edit3 className="mr-2 h-4 w-4" /> Edit Profile</>}
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Overall Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
                <Label>Verification Status:</Label>
                <Badge variant={userProfile.verificationStatus === 'Verified' ? 'default' : 'secondary'} 
                    className={userProfile.verificationStatus === 'Verified' ? 'bg-green-100 text-green-700' : 
                               userProfile.verificationStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                               'bg-red-100 text-red-700'}>
                    {userProfile.verificationStatus === 'Verified' && <CheckCircle className="mr-1 h-4 w-4" />}
                    {userProfile.verificationStatus !== 'Verified' && <AlertCircle className="mr-1 h-4 w-4" />}
                    {userProfile.verificationStatus}
                </Badge>
            </div>
            <div>
                <Label>Profile Completion: {profileCompletion}%</Label>
                <Progress value={profileCompletion} className="w-full mt-1 h-2" />
            </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">CV Management</CardTitle>
          <CardDescription>Upload your CV to automatically parse information and kickstart verification.</CardDescription>
        </CardHeader>
        <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cv-text">Paste your CV text here</Label>
                  <Textarea
                    id="cv-text"
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    placeholder="Paste your CV content here..."
                    className="min-h-[200px] mt-2"
                    disabled={isParsing}
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleCvSubmit} 
                    disabled={isParsing || !cvText.trim()}
                    className="hover:opacity-90 active:scale-95 transition-all"
                  >
                    {isParsing ? 'Processing...' : 'Parse CV'}
                  </Button>
                </div>
                
                {workExperiences.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-medium">Extracted Work Experience</h3>
                    <div className="space-y-4">
                      {workExperiences.map((exp, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{exp.title}</h4>
                              <p className="text-sm text-muted-foreground">{exp.company}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {exp.startDate} - {exp.endDate || 'Present'}
                              </p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                // Add to profile or create claim
                                toast({
                                  title: "Claim Created",
                                  description: `Claim created for ${exp.title} at ${exp.company}`,
                                });
                              }}
                            >
                              Create Claim
                            </Button>
                          </div>
                          {exp.description && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {isParsing && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span>Parsing your CV...</span>
                  </div>
                )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={userProfile.name} onChange={(e) => handleInputChange('name', e.target.value)} disabled={!isEditing || isLoading} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={userProfile.email} onChange={(e) => handleInputChange('email', e.target.value)} disabled={!isEditing || isLoading} />
          </div>
          <div>
            <Label htmlFor="headline">Headline</Label>
            <Input id="headline" value={userProfile.headline || ''} onChange={(e) => handleInputChange('headline', e.target.value)} placeholder="e.g., Senior Software Engineer" disabled={!isEditing || isLoading} />
          </div>
          <div>
            <Label htmlFor="summary">Summary</Label>
            <Textarea id="summary" value={userProfile.summary || ''} onChange={(e) => handleInputChange('summary', e.target.value)} placeholder="Brief professional summary" disabled={!isEditing || isLoading} />
          </div>
        </CardContent>
      </Card>
      
      {userProfile.parsedInfo && (
        <>
          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center font-headline"><Briefcase className="mr-2 h-5 w-5 text-primary" /> Work Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {userProfile.parsedInfo.experience.map((exp, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-md relative">
                  {isEditing && <Button size="sm" variant="ghost" className="absolute top-2 right-2 px-2 py-1 h-auto"><Edit3 className="h-4 w-4"/></Button>}
                  <Badge variant={exp.verified ? 'default' : 'secondary'} className={`${exp.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} mb-2`}>
                    {exp.verified ? <CheckCircle className="mr-1 h-3 w-3" /> : <AlertCircle className="mr-1 h-3 w-3" />}
                    {exp.verified ? 'Verified' : 'Pending Verification'}
                  </Badge>
                  <div>
                    <Label htmlFor={`exp-title-${index}`}>Job Title</Label>
                    <Input id={`exp-title-${index}`} value={exp.title} onChange={(e) => handleParsedInfoChange('experience', index, 'title', e.target.value)} disabled={!isEditing || isLoading} />
                  </div>
                  <div>
                    <Label htmlFor={`exp-company-${index}`}>Company</Label>
                    <Input id={`exp-company-${index}`} value={exp.company} onChange={(e) => handleParsedInfoChange('experience', index, 'company', e.target.value)} disabled={!isEditing || isLoading} />
                  </div>
                  <div>
                    <Label htmlFor={`exp-dates-${index}`}>Dates</Label>
                    <Input id={`exp-dates-${index}`} value={exp.dates} onChange={(e) => handleParsedInfoChange('experience', index, 'dates', e.target.value)} disabled={!isEditing || isLoading} />
                  </div>
                   {isEditing && (
                    <div>
                        <Label htmlFor={`exp-desc-${index}`}>Description</Label>
                        <Textarea id={`exp-desc-${index}`} value={exp.description || ''} onChange={(e) => handleParsedInfoChange('experience', index, 'description', e.target.value)} disabled={!isEditing || isLoading} />
                    </div>
                  )}
                  {!isEditing && exp.description && <p className="text-sm text-muted-foreground">{exp.description}</p>}
                </div>
              ))}
              {isEditing && <Button variant="outline" size="sm" onClick={() => { /* Add new experience logic */ }}>+ Add Experience</Button>}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
             <CardHeader>
                <CardTitle className="flex items-center font-headline"><GraduationCap className="mr-2 h-5 w-5 text-primary" /> Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {userProfile.parsedInfo.education.map((edu, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-md relative">
                  {isEditing && <Button size="sm" variant="ghost" className="absolute top-2 right-2 px-2 py-1 h-auto"><Edit3 className="h-4 w-4"/></Button>}
                  <Badge variant={edu.verified ? 'default' : 'secondary'} className={`${edu.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} mb-2`}>
                    {edu.verified ? <CheckCircle className="mr-1 h-3 w-3" /> : <AlertCircle className="mr-1 h-3 w-3" />}
                    {edu.verified ? 'Verified' : 'Pending Verification'}
                  </Badge>
                  <div>
                    <Label htmlFor={`edu-degree-${index}`}>Degree</Label>
                    <Input id={`edu-degree-${index}`} value={edu.degree} onChange={(e) => handleParsedInfoChange('education', index, 'degree', e.target.value)} disabled={!isEditing || isLoading} />
                  </div>
                  <div>
                    <Label htmlFor={`edu-institution-${index}`}>Institution</Label>
                    <Input id={`edu-institution-${index}`} value={edu.institution} onChange={(e) => handleParsedInfoChange('education', index, 'institution', e.target.value)} disabled={!isEditing || isLoading} />
                  </div>
                  <div>
                    <Label htmlFor={`edu-dates-${index}`}>Dates</Label>
                    <Input id={`edu-dates-${index}`} value={edu.dates} onChange={(e) => handleParsedInfoChange('education', index, 'dates', e.target.value)} disabled={!isEditing || isLoading} />
                  </div>
                </div>
              ))}
              {isEditing && <Button variant="outline" size="sm" onClick={() => { /* Add new education logic */ }}>+ Add Education</Button>}
            </CardContent>
          </Card>
        </>
      )}

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center font-headline"><Award className="mr-2 h-5 w-5 text-primary" /> Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {userProfile.skills.map((skill, index) => (
              <div key={index} className="flex items-center">
                {isEditing ? (
                  <Input value={skill.name} onChange={(e) => handleSkillChange(index, e.target.value)} className="h-8 mr-1" disabled={isLoading} />
                ) : (
                  <Badge variant={skill.verified ? 'default' : 'secondary'} className={`py-1 px-3 text-sm ${skill.verified ? 'bg-primary/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {skill.name}
                  </Badge>
                )}
                {skill.verified && !isEditing && <CheckCircle className="ml-1 h-4 w-4 text-green-500" />}
              </div>
            ))}
          </div>
          {isEditing && <Button variant="outline" size="sm" onClick={() => { /* Add new skill logic */ }}>+ Add Skill</Button>}
        </CardContent>
      </Card>
    </div>
  );
}
