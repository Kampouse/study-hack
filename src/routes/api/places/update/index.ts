import type { RequestHandler } from "@builder.io/qwik-city";
import { UpdatePlace } from "~/api/Query";

export const onPost: RequestHandler = async ({ request, json }) => {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.placeId) {
      json(400, {
        success: false,
        message: "Missing required field: placeId",
      });
      return;
    }

    const placeId = parseInt(body.placeId as string);
    if (isNaN(placeId)) {
      json(400, {
        success: false,
        message: "Invalid placeId format",
      });
      return;
    }

    // Parse and validate placeData
    let placeData;
    try {
      placeData =
        typeof body.placeData === "string"
          ? JSON.parse(body.placeData)
          : body.placeData;
    } catch (error) {
      json(400, {
        success: false,
        message: "Invalid placeData format. Must be valid JSON.",
      });
      return;
    }

    // Validate specific fields
    const allowedFields = [
      "name",
      "address", 
      "image",
      "description",
      "tags",
      "rating",
      "wifiSpeed",
      "lat",
      "lng",
      "hasQuietEnvironment"
    ];
    const invalidFields = Object.keys(placeData).filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      json(400, {
        success: false,
        message: `Invalid fields: ${invalidFields.join(
          ", "
        )}. Allowed fields: ${allowedFields.join(", ")}`,
      });
      return;
    }

    // Field-specific validations
    if (placeData.rating !== undefined) {
      if (typeof placeData.rating !== "number" || placeData.rating < 1 || placeData.rating > 5) {
        json(400, {
          success: false,
          message: "Rating must be a number between 1 and 5",
        });
        return;
      }
    }

    if (placeData.wifiSpeed !== undefined) {
      if (typeof placeData.wifiSpeed !== "number" || placeData.wifiSpeed < 0) {
        json(400, {
          success: false,
          message: "WifiSpeed must be a non-negative number",
        });
        return;
      }
    }

    if (placeData.lat !== undefined && (typeof placeData.lat !== "number" || placeData.lat < -90 || placeData.lat > 90)) {
      json(400, {
        success: false,
        message: "Latitude must be a number between -90 and 90",
      });
      return;
    }

    if (placeData.lng !== undefined && (typeof placeData.lng !== "number" || placeData.lng < -180 || placeData.lng > 180)) {
      json(400, {
        success: false,
        message: "Longitude must be a number between -180 and 180",
      });
      return;
    }

    // Call secure update function with built-in ownership validation
    const result = await UpdatePlace({
      event: request,
      placeId,
      placeData,
    });

    if (result.success) {
      json(200, result);
    } else {
      const statusCode = result.message.includes("Unauthorized")
        ? 403
        : result.message.includes("not found")
        ? 404
        : 400;
      json(statusCode, result);
    }
  } catch (error) {
    console.error("API Error in place update:", error);
    json(500, {
      success: false,
      message: "Internal server error",
    });
  }
};

// Keep GET endpoint for backward compatibility or debugging
export const onGet: RequestHandler = async ({ json }) => {
  json(405, {
    success: false,
    message: "Method not allowed. Use POST to update place.",
  });
};