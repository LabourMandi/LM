// PATCH: smart-profile
// Created by Replit AI in SAFE MODE
// DO NOT MODIFY without human approval
// Isolated Smart Profile Form Component

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  ProfessionType,
  getProfessionConfig,
  calculateSuggestedWage,
  getCompletenessScore,
  generateSuggestions,
  getMajorCities,
  getAvailabilityOptions,
  validateWageRange,
  validateContractRange,
} from "@/lib/smartProfileHelpers";
import { AlertCircle, CheckCircle2, Lightbulb } from "lucide-react";

// Validation schema
const smartProfileSchema = z.object({
  profession: z.enum([
    "mason",
    "electrician",
    "plumber",
    "carpenter",
    "painter",
    "welder",
    "other",
  ] as const),
  minWage: z.coerce.number().positive("Minimum wage must be positive"),
  maxWage: z.coerce.number().positive("Maximum wage must be positive"),
  minContractPrice: z.coerce.number().positive("Minimum price must be positive"),
  maxContractPrice: z.coerce.number().positive("Maximum price must be positive"),
  experience: z.coerce.number().min(0, "Experience cannot be negative"),
  specialization: z.string().min(1, "Select at least one specialization"),
  availability: z.string().min(1, "Select availability"),
  city: z.string().min(1, "Select your city"),
  toolsOwned: z.array(z.string()).optional().default([]),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

type SmartProfileFormValues = z.infer<typeof smartProfileSchema>;

interface SmartProfileFormProps {
  onSuccess?: () => void;
}

export function SmartProfileForm({ onSuccess }: SmartProfileFormProps) {
  const { toast } = useToast();
  const [selectedProfession, setSelectedProfession] = useState<ProfessionType>("mason");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completenessScore, setCompletenessScore] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const form = useForm<SmartProfileFormValues>({
    resolver: zodResolver(smartProfileSchema),
    defaultValues: {
      profession: "mason",
      minWage: 400,
      maxWage: 800,
      minContractPrice: 25000,
      maxContractPrice: 100000,
      experience: 3,
      specialization: "",
      availability: "Available",
      city: "Mumbai",
      toolsOwned: [],
      bio: "",
    },
  });

  // Watch form changes for dynamic updates
  const formValues = form.watch();

  useEffect(() => {
    const profession = (formValues.profession || "mason") as ProfessionType;
    setSelectedProfession(profession);

    // Update wage suggestions
    if (formValues.experience) {
      const suggested = calculateSuggestedWage(profession, formValues.experience);
      form.setValue("minWage", suggested.min);
      form.setValue("maxWage", suggested.max);
    }

    // Generate suggestions
    const newSuggestions = generateSuggestions(profession, formValues.experience || 0);
    setSuggestions(newSuggestions);

    // Calculate completeness
    const score = getCompletenessScore(formValues);
    setCompletenessScore(score);
  }, [formValues.profession, formValues.experience, form]);

  const profConfig = getProfessionConfig(selectedProfession);
  const cities = getMajorCities();
  const availabilityOptions = getAvailabilityOptions(selectedProfession);

  // Validate wage range
  const wageValidation = validateWageRange(
    formValues.minWage || 0,
    formValues.maxWage || 0,
    selectedProfession
  );

  // Validate contract range
  const contractValidation = validateContractRange(
    formValues.minContractPrice || 0,
    formValues.maxContractPrice || 0,
    selectedProfession
  );

  const onSubmit = async (values: SmartProfileFormValues) => {
    // Final validation
    if (!wageValidation.valid) {
      toast({ title: "Wage Error", description: wageValidation.error, variant: "destructive" });
      return;
    }

    if (!contractValidation.valid) {
      toast({ title: "Contract Error", description: contractValidation.error, variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiRequest("POST", "/api/smart/profile", values);
      
      toast({
        title: "Success!",
        description: "Your smart profile has been created successfully.",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create smart profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle>Create Your Smart Profile</CardTitle>
          <CardDescription>
            Dynamic form based on your profession. Let's find the right opportunities for you.
          </CardDescription>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Profile Completeness</span>
              <span className="text-sm text-muted-foreground">{completenessScore}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${completenessScore}%` }}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Form */}
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Step 1: Profession */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Select Your Profession</h3>

                <FormField
                  control={form.control}
                  name="profession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What is your main profession?</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select profession" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mason">Mason</SelectItem>
                          <SelectItem value="electrician">Electrician</SelectItem>
                          <SelectItem value="plumber">Plumber</SelectItem>
                          <SelectItem value="carpenter">Carpenter</SelectItem>
                          <SelectItem value="painter">Painter</SelectItem>
                          <SelectItem value="welder">Welder</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {profConfig.description}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Step 2: Wage Range */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Daily Wage Range (₹)</h3>
                <p className="text-sm text-muted-foreground">
                  Recommended range: ₹{profConfig.minWageDaily} - ₹{profConfig.maxWageDaily}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minWage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Wage</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={String(profConfig.minWageDaily)}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxWage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Wage</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={String(profConfig.maxWageDaily)}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {!wageValidation.valid && (
                  <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg text-destructive text-sm">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{wageValidation.error}</span>
                  </div>
                )}
              </div>

              {/* Step 3: Contract Price Range */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contract Price Range (₹)</h3>
                <p className="text-sm text-muted-foreground">
                  Recommended range: ₹{profConfig.minContractPrice} - ₹{profConfig.maxContractPrice}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minContractPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Contract</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={String(profConfig.minContractPrice)}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxContractPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Contract</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={String(profConfig.maxContractPrice)}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {!contractValidation.valid && (
                  <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg text-destructive text-sm">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{contractValidation.error}</span>
                  </div>
                )}
              </div>

              {/* Step 4: Experience & Specialization */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Experience & Skills</h3>

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Typical experience for this role: {profConfig.typicalExperience}+ years
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Specialization</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialization" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {profConfig.possibleSpecializations.map((spec) => (
                            <SelectItem key={spec} value={spec}>
                              {spec}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Step 5: Availability & Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Availability & Location</h3>

                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Availability</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select availability" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availabilityOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary City/Location</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Step 6: Bio */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">About You</h3>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brief Bio (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell employers about your expertise, certifications, or special achievements..."
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/500 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Tools Owned Display */}
              {profConfig.possibleTools.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tools You Own</h3>
                  <div className="flex flex-wrap gap-2">
                    {profConfig.possibleTools.map((tool) => (
                      <Badge key={tool} variant="outline" className="cursor-pointer">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                  <FormDescription>
                    Tool selection feature coming soon. Complete your profile and we'll show verified tools.
                  </FormDescription>
                </div>
              )}

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="font-medium text-sm">Smart Suggestions</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {suggestions.map((suggestion, idx) => (
                            <li key={idx}>• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !wageValidation.valid || !contractValidation.valid}
                className="w-full h-11"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Creating Profile...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Create Smart Profile
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            💡 This is a smart form that adapts based on your profession. Fields and suggestions change
            automatically to match industry standards in India's construction sector.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// END PATCH
