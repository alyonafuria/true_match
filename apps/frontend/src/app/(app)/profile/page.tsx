"use client";

import { useState } from 'react';
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

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile>(sampleUserProfile);
  const [cvText, setCvText] = useState('');
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
      console.log('Sending request to:', `${backendUrl}/api/parse-cv`);
      
      const response = await fetch(`${backendUrl}/api/parse-cv`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ text: cvText }),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Failed to parse CV';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse the error as JSON, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      const responseData = await response.json();
      console.log('Response data:', responseData);
      
      if (!responseData.data) {
        throw new Error('Invalid response format from server');
      }
      
      const { workExperiences } = responseData.data || {};
      
      if (workExperiences && workExperiences.length > 0) {
        setWorkExperiences(workExperiences);
        toast({
          title: "CV Processed",
          description: `Found ${workExperiences.length} work experience(s)`,
        });
      } else {
        toast({
          title: "No Work Experience Found",
          description: "We couldn't find any work experience in your CV.",
          variant: "default"
        });
      }
      
    } catch (error) {
      console.error('Error processing CV:', error);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : 'Failed to process CV',
        variant: "destructive"
      });
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
