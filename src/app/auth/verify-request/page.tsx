import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail } from 'lucide-react'
import Link from 'next/link'

export default function VerifyRequest() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="warm-card w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="text-2xl font-bold text-orange-800 mb-4 block">
            JourneyHub
          </Link>
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            A sign in link has been sent to your email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Click the link in the email to sign in to your account. The link will expire in 24 hours.
            </p>
            
            <div className="pt-4">
              <Link 
                href="/" 
                className="text-sm text-gray-600 hover:text-orange-600 transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}