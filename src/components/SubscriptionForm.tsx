import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface FormState {
  email: string;
  isSubmitting: boolean;
  succeeded: boolean;
  errors: string[];
}

const SubscriptionForm = () => {
  const [state, setState] = useState<FormState>({
    email: '',
    isSubmitting: false,
    succeeded: false,
    errors: []
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setState(prev => ({ ...prev, errors: [] }));
    
    // Validate email
    if (!validateEmail(state.email)) {
      setState(prev => ({ ...prev, errors: ['Please enter a valid email address'] }));
      return;
    }
    
    // Set submitting state
    setState(prev => ({ ...prev, isSubmitting: true, errors: [] }));
    
    try {
      // Simulate API call (in a real implementation, you would send the data to your backend)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success
      setState({
        email: '',
        isSubmitting: false,
        succeeded: true,
        errors: []
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setState(prev => ({ ...prev, succeeded: false }));
      }, 5000);
    } catch (error) {
      // Handle error
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        errors: ['Failed to subscribe. Please try again.']
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, email: e.target.value }));
  };

  if (state.succeeded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center"
      >
        <p className="text-green-700 font-medium">
          Thanks for subscribing! We'll notify you about our new updates.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          name="email"
          value={state.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          className="bg-background border-border"
          required
        />
        {state.errors.length > 0 && (
          <p className="text-sm text-red-500">{state.errors[0]}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        disabled={state.isSubmitting}
        className="w-full bg-gradient-to-r from-gold to-yellow-500 text-black font-bold hover:opacity-90"
      >
        {state.isSubmitting ? 'Subscribing...' : 'Subscribe for Updates'}
      </Button>
    </form>
  );
};

export default SubscriptionForm;