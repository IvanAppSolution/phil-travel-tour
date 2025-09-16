"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MultipleImageUpload } from "@/components/ui/multiple-image-upload";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  imageUrls: z.array(z.string().url()).min(1, {
    message: "Please upload at least one image.",
  }),
});

export default function TripForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrls: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      console.log("Form submitted with values:", values);
      // Here you would typically send this data to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert("Form submitted successfully!");
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleImagesUploaded = (urls: string[]) => {
    form.setValue("imageUrls", urls, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Trip</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter trip title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter trip description"
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trip Images</FormLabel>
                    <FormControl>
                      <MultipleImageUpload
                        onImagesUploaded={handleImagesUploaded}
                        maxFiles={10}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Create Trip"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
