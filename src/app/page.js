"use client"

import { useToast, Button, Stack } from "@chakra-ui/react"
import PwaModal from "@/components/pwa-modal"
export default function Home() {

  const toast = useToast()
  return (
    // <Stack flexDir={'column'}>
    // <Button
    //   onClick={() =>
    //     toast({
    //       title: 'Account created.',
    //       description: "We've created your account for you.",
    //       status: 'success',
    //       duration: 9000,
    //       isClosable: true,
    //     })
    //   }
    // >
    //   Show Toast
    // </Button>

    
    // </Stack>
    <PwaModal/>
  )
}
