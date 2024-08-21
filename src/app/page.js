"use client"
import ProtectedRoute from "@/components/protected-route.component"



export default function Home() {
  
  return (
    <ProtectedRoute>
      Geçici Deneme Sayfası
    </ProtectedRoute>
  )
}
