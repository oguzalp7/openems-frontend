"use client"

import { useToast, Button, Stack } from "@chakra-ui/react"
import PwaModal from "@/components/pwa-modal"

import { apiClient } from "@/apiClient"
import { useEffect, useState } from "react"


export default function Home() {
  const[res, setRes] = useState("");

  useEffect(() => {
    const checkAPI = async () => {
      const response = await apiClient.get("/")
      
      setRes(response.data);
    }
    checkAPI();
  }, []);
  
  //const toast = useToast()
  return (
    <>Home</>
  )
}
