"use client";

import { useState, useEffect, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import React from "react";
import PasswordInput from "./password-input.component";
import { Box, VStack, Button, useToast } from "@chakra-ui/react";
import { apiClient } from "@/apiClient";

const ChangePasswordForm = () => {
    
    const {user} = useContext(AuthContext)

    const [formValues, setFormValues] = useState({
        password: "",
        new_password: "",
    });

    

    const toast = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple validation example
        if (!formValues.password || !formValues.new_password) {
        toast({
            title: "Error",
            description: "Please fill out all fields.",
            status: "error",
            duration: 3000,
            isClosable: true,
        });
        return;
        }

        try {
            // Make API call to change password here
            // const response = await apiClient.post('/change-password', formValues);
            
            const response = await apiClient.put('/user/password/', formValues)
            
            //console.log(formValues)
            toast({
                title: "Şifreniz başarıyla değiştirildi.",
                //description: "Password changed successfully.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            const errorMessage = typeof error.response?.data?.detail === "string" ? error.response.data.detail: "Beklenmedik bir hata oluştu.";
            toast({
                title: "Şifre deiştirilemedi.",
                description: errorMessage,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box as="form" onSubmit={handleSubmit}>
        <VStack spacing={4}>
            <PasswordInput
            label={"ESKİ ŞİFRE"}
            placeholder={"Eski Şifrenizi Girin"}
            name="password"
            value={formValues.password}
            onChange={handleChange}
            />
            <PasswordInput
            label={"YENİ ŞİFRE"}
            placeholder={"Yeni Şifrenizi Girin"}
            name="new_password"
            value={formValues.new_password}
            onChange={handleChange}
            />
            <Button type="submit" colorScheme="orange">
            ONAYLA
            </Button>
        </VStack>
        </Box>
  );
};

export default ChangePasswordForm;
