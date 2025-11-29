// PATCH: smart-profile
// Created by Replit AI in SAFE MODE
// DO NOT MODIFY without human approval
// Smart Profile API Route Handler - ISOLATED

import { Router, Request, Response } from "express";
import { z } from "zod";
import { IStorage } from "../storage";

// Validation schema matching the form
const smartProfileSchema = z.object({
  profession: z.enum([
    "mason",
    "electrician",
    "plumber",
    "carpenter",
    "painter",
    "welder",
    "other",
  ]),
  minWage: z.number().positive(),
  maxWage: z.number().positive(),
  minContractPrice: z.number().positive(),
  maxContractPrice: z.number().positive(),
  experience: z.number().min(0),
  specialization: z.string().min(1),
  availability: z.string().min(1),
  city: z.string().min(1),
  toolsOwned: z.array(z.string()).optional().default([]),
  bio: z.string().max(500).optional(),
});

type SmartProfile = z.infer<typeof smartProfileSchema>;

export function setupSmartProfileRoutes(router: Router, storage: IStorage, isAuthenticated: any) {
  // PATCH: smart-profile - POST /api/smart/profile
  router.post(
    "/api/smart/profile",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        // PATCH: Validate input
        const payload = smartProfileSchema.parse(req.body);

        // PATCH: Get authenticated user
        const userId = (req as any).user?.id;
        if (!userId) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        // PATCH: Get user from DB
        const user = await storage.getUser(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // PATCH: Update user profile with smart profile data
        const updatedUser = await storage.updateUser(userId, {
          experience: payload.experience,
          skills: [payload.specialization, ...payload.toolsOwned],
          bio: payload.bio || user.bio,
          location: payload.city,
          availability: payload.availability as any,
          hourlyRate: String(payload.minWage), // Store as hourly for now
        });

        // PATCH: Log the smart profile creation
        console.log(
          `[SMART_PROFILE] User ${userId} created profile: profession=${payload.profession}, city=${payload.city}, wage=${payload.minWage}-${payload.maxWage}`
        );

        // PATCH: Return success response
        return res.status(200).json({
          message: "Smart profile created successfully",
          data: {
            userId,
            profession: payload.profession,
            city: payload.city,
            experience: payload.experience,
            specialization: payload.specialization,
            availability: payload.availability,
            wageRange: {
              min: payload.minWage,
              max: payload.maxWage,
            },
            contractRange: {
              min: payload.minContractPrice,
              max: payload.maxContractPrice,
            },
            toolsOwned: payload.toolsOwned,
            createdAt: new Date().toISOString(),
          },
        });
      } catch (error: any) {
        // PATCH: Handle validation errors
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Validation failed",
            errors: error.errors,
          });
        }

        // PATCH: Handle generic errors
        console.error("[SMART_PROFILE_ERROR]", error);
        return res.status(500).json({
          message: "Failed to create smart profile",
          error: error.message,
        });
      }
    }
  );
  // END PATCH

  // PATCH: smart-profile - GET /api/smart/profile
  router.get(
    "/api/smart/profile",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        // PATCH: Get authenticated user
        const userId = (req as any).user?.id;
        if (!userId) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        // PATCH: Get user from DB
        const user = await storage.getUser(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // PATCH: Return user profile as smart profile
        return res.status(200).json({
          data: {
            userId,
            experience: user.experience || 0,
            skills: user.skills || [],
            bio: user.bio || "",
            location: user.location || "",
            availability: user.availability || "available",
            hourlyRate: user.hourlyRate || "0",
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        });
      } catch (error: any) {
        // PATCH: Handle errors
        console.error("[SMART_PROFILE_GET_ERROR]", error);
        return res.status(500).json({
          message: "Failed to fetch smart profile",
          error: error.message,
        });
      }
    }
  );
  // END PATCH

  return router;
}

// END PATCH
