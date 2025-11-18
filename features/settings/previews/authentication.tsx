import * as React from 'react';
import { Button } from '../../../components/ui/button.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { Input } from '../../../components/ui/input.tsx';
import { Label } from '../../../components/ui/label.tsx';
import { Separator } from '../../../components/ui/separator.tsx';

export function PreviewAuthentication() {
  return (
    <div className="flex items-center justify-center">
        <Card className="w-full max-w-sm">
        <CardHeader>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
            Enter your email below to create your account.
            </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-6">
            <Button variant="outline">GitHub</Button>
            <Button variant="outline">Google</Button>
            </div>
            <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                Or continue with
                </span>
            </div>
            </div>
            <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" />
            </div>
            <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
            </div>
            <Button className="w-full">Create account</Button>
        </CardContent>
        </Card>
    </div>
  );
}
