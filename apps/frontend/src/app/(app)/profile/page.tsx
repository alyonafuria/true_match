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
import type { UserProfile } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile>(sampleUserProfile);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleParsedInfoChange = (section: 'experience' | 'education', index: number, field: string, value: string) => {
    setUserProfile(prev => {
      const newProfile = { ...prev };
      if (newProfile.parsedInfo && newProfile.parsedInfo[section]) {
        // @ts-ignore
        newProfile.parsedInfo[section][index][field] = value;
      }
      return newProfile;
    });
  };
  
  const handleSkillChange = (index: number, value: string) => {
    setUserProfile(prev => {
      const newSkills = [...prev.skills];
      newSkills[index] = { ...newSkills[index], name: value };
      return { ...prev, skills: newSkills };
    });
  };

  const handleCvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCvFile(event.target.files[0]);
      // Simulate CV parsing
      setIsLoading(true);
      setTimeout(() => {
        toast({ title: "CV Uploaded", description: "CV parsing initiated. Information will appear shortly." });
        // In a real app, you'd parse the CV and update userProfile.parsedInfo
        // For now, we just acknowledge the upload
        setUserProfile(prev => ({...prev, cvUrl: event.target.files![0].name, verificationStatus: 'Pending'})); // Update verification status to pending
        setIsLoading(false);
      }, 2000);
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
  if (userProfile.parsedInfo?.experience?.length > 0) profileCompletion += 20;
  if (userProfile.parsedInfo?.education?.length > 0) profileCompletion += 20;
  if (userProfile.skills?.length > 0) profileCompletion += 20;


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
          <div className="space-y-2">
            <Label htmlFor="cv-upload">Upload CV (PDF, DOCX)</Label>
            <div className="flex items-center space-x-2">
                <Input id="cv-upload" type="file" accept=".pdf,.doc,.docx" onChange={handleCvUpload} className="max-w-sm" disabled={isLoading}/>
                <Button variant="outline" onClick={() => document.getElementById('cv-upload')?.click()} disabled={isLoading} className="hover:bg-accent/10 active:scale-95 transition-all">
                    <UploadCloud className="mr-2 h-4 w-4" /> {cvFile ? "Replace CV" : "Upload CV"}
                </Button>
            </div>
            {cvFile && <p className="text-sm text-muted-foreground">Selected file: {cvFile.name}</p>}
            {userProfile.cvUrl && !cvFile && <p className="text-sm text-muted-foreground">Current CV: {userProfile.cvUrl}</p>}
            {isLoading && <p className="text-sm text-primary">Processing CV...</p>}
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
