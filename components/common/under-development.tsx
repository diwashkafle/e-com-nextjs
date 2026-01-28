"use client"
import React from 'react'
import { Construction, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface UnderDevelopmentProps {
  pageName: string;
  description?: string;
}

export default function UnderDevelopment({ 
  pageName, 
  description = "We're currently building this feature to ensure the best experience. Check back soon!" 
}: UnderDevelopmentProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-6"
      >
        {/* Animated Pulse Ring */}
        <div className="absolute inset-0 rounded-full bg-yellow-100 animate-ping opacity-20" />
        
        <div className="relative bg-yellow-50 p-6 rounded-full border-2 border-yellow-200">
          <Construction className="w-12 h-12 text-yellow-600" />
        </div>
      </motion.div>

      <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
        {pageName} is Under Construction
      </h1>
      
      <p className="text-slate-500 max-w-md mb-8">
        {description}
      </p>

      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="flex gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </Button>
        <Button 
          onClick={() => router.push('/admin')}
        >
          Admin Dashboard
        </Button>
      </div>
    </div>
  )
}