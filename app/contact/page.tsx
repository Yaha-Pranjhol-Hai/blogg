"use client";

import { useState } from 'react';
import emailjs from 'emailjs-com';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Label } from "../components/ui/label";

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Use EmailJS to send the email
    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
    };

    emailjs.send(
      process.env.NEXT_PUBLIC_SERVICE_ID || '', 
      process.env.NEXT_PUBLIC_TEMPLATE_ID || '',
      templateParams,
      process.env.NEXT_PUBLIC_USER_ID || ''
    )
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
        setSuccessMessage('Message sent successfully!');
        // Reset form fields
        setName('');
        setEmail('');
        setMessage('');
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        setSuccessMessage('Failed to send message. Please try again later.');
      });
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mb-8">Contact Me</h1>
      {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
      <div className="flex flex-col md:flex-row gap-8 w-6/12">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Send me your message</CardTitle>
            <CardDescription>I&apos;ll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
