import { useState } from 'react'
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', { name, email, message })
    // Reset form fields
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
      <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>We'll get back to you as soon as possible.</CardDescription>
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
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Here are other ways to reach us.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Mail className="h-5 w-5 text-gray-500" />
              <p>contact@blogg.com</p>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="h-5 w-5 text-gray-500" />
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin className="h-5 w-5 text-gray-500" />
              <p>123 Blog Street, Content City, ST 12345</p>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">
              Our office hours are Monday to Friday, 9am to 5pm.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}