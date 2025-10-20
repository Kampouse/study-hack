import { component$, useSignal, $, useStore } from "@builder.io/qwik";
import type * as v from "valibot";
import { useForm, formAction$, valiForm$ } from "@modular-forms/qwik";
import type { Signal } from "@builder.io/qwik";
import { PlaceCard } from "~/routes/(app)/home/place-card";
import { useLocation } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import type { JSONObject } from "@builder.io/qwik-city";
import { userSchema, type UpdateUserForm } from "~/api/Forms";
import { updateProfileForm } from "~/api/Forms";
import type { UserProfileType } from "~/routes/profile/types";
import {
  CalendarIcon as Calendar,
  UserPlusIcon as UserPlus,
  BellIcon as Bell,
  ClockIcon as Clock,
  BookmarkIcon as Bookmark,
  UserIcon as User,
  PencilIcon as Pencil,
  CameraIcon as Camera,
  CheckIcon as Check,
  XIcon as X,
  CompassIcon as Compass,
} from "lucide-qwik";
import type { DetailedEventType, PlaceType } from "~/routes/profile/types";
import { EventCard } from "./EventCard";
import { EmptyState } from "./EmptyState";

type ProfileSchemaType = v.InferInput<typeof userSchema>;
type ActiveRequestType = any; // Temporary type definition

// Function to update profile form (to be implemented)
// Define form action for profile updates
export const useUpdateProfileAction = formAction$<UpdateUserForm>(
  async (values, event) => {
    try {
      // Convert values to the format expected by the backend
      const formData = {
        Name: values.Name,
        Description: values.Description,
        Username: values.Username,
        ImageURL: values.ImageURL || undefined,
        Intrests: values.Intrests,
      };

      const result = await updateProfileForm(formData as JSONObject, event);

      if (!result.success) {
        return {
          status: "error" as const,
          message: "Failed to update profile",
        };
      }

      return {
        status: "success" as const,
        message: "Profile updated successfully",
      };
    } catch (error) {
      return {
        status: "error" as const,
        message: "An unexpected error occurred",
      };
    }
  },
  valiForm$(userSchema),
);
// Define props interface for ProfileView component
interface ProfileViewProps {
  profileData: UserProfileType;
  isEditing: Signal<boolean>;
}

// Profile View component
const ProfileView = component$<ProfileViewProps>(
  ({ profileData, isEditing }) => {
    return (
      <div class="flex flex-col rounded-lg bg-white p-4 shadow-sm sm:p-6 md:p-8">
        {/* Profile header with avatar and basic info */}
        <div class="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
          {/* Avatar container - centered on mobile, left-aligned on desktop */}
          <div class="relative flex justify-center md:justify-start">
            <div class="h-32 w-32 overflow-hidden rounded-full border-4 border-[#D98E73] bg-[#F8D7BD] shadow-md">
              <img
                src={profileData.avatar}
                alt="Profile avatar"
                class="h-full w-full object-cover"
                width={128}
                height={128}
                onError$={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/placeholder-avatar.svg";
                }}
              />
            </div>
          </div>

          {/* Profile info container - takes remaining width */}
          <div class="flex w-full flex-1 flex-col text-center md:text-left">
            {/* Name, username and edit button */}
            <div class="flex flex-col items-center space-y-2 md:flex-row md:items-start md:justify-between md:space-y-0">
              <div>
                <h2 class="mb-1 text-2xl font-bold text-[#5B3E29]">
                  {profileData.name}
                </h2>
                <p class="text-[#D98E73]">@{profileData.username}</p>
                <p class="mt-2 text-sm text-[#6D5D4E]">
                  Member since {profileData.joinedDate}
                </p>
              </div>

              <button
                type="button"
                onClick$={() => {
                  isEditing.value = !isEditing.value;
                }}
                class="mx-auto mt-4 inline-flex h-10 items-center justify-center rounded-md bg-[#D98E73] px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-[#C27B62] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 md:mx-0 md:mt-0"
              >
                <Pencil class="mr-2 h-4 w-4" /> Edit Profile
              </button>
            </div>

            {/* Stats cards - single column on small screens, 3 columns on larger screens */}
            <div class="my-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              <div class="rounded-lg bg-[#FFF8F0] p-3 text-center shadow-sm transition-all hover:shadow-md">
                <span class="block text-xl font-bold text-[#D98E73] sm:text-2xl">
                  {profileData.stats.eventAttended || 0}
                </span>
                <span class="text-xs text-[#6D5D4E] sm:text-sm">
                  Events Attended
                </span>
              </div>
              <div class="rounded-lg bg-[#FFF8F0] p-3 text-center shadow-sm transition-all hover:shadow-md">
                <span class="block text-xl font-bold text-[#D98E73] sm:text-2xl">
                  {profileData.stats.eventCreated || 0}
                </span>
                <span class="text-xs text-[#6D5D4E] sm:text-sm">
                  Events Hosted
                </span>
              </div>
              <div class="rounded-lg bg-[#FFF8F0] p-3 text-center shadow-sm transition-all hover:shadow-md">
                <span class="block text-xl font-bold text-[#D98E73] sm:text-2xl">
                  {profileData.stats.placeCreated || 0}
                </span>
                <span class="text-xs text-[#6D5D4E] sm:text-sm">
                  Places Found
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* About section */}
        <div class="mt-6 border-t border-[#F8EDE3] pt-6">
          <h3 class="mb-2 text-lg font-semibold text-[#5B3E29]">About Me</h3>
          <p class="whitespace-pre-line text-[#6D5D4E]">
            {profileData.bio || "No bio added yet."}
          </p>
        </div>

        {/* Skills section */}
        <div class="mt-6 border-t border-[#F8EDE3] pt-6">
          <h3 class="mb-3 text-lg font-semibold text-[#5B3E29]">
            Skills & Interests
          </h3>
          <div class="flex flex-wrap gap-2">
            {profileData.skills.length > 0 ? (
              profileData.skills.map((skill) => (
                <span
                  key={skill}
                  class="rounded-full bg-[#F8D7BD] px-3 py-1 text-sm text-[#8B5A2B] shadow-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p class="text-sm italic text-[#6D5D4E]">
                No skills or interests added yet.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  },
);

// Define props interface for ProfileEdit component
interface ProfileEditProps {
  profileData: UserProfileType;
  isEditing: Signal<boolean>;
}

// Profile Edit component
const ProfileEdit = component$<ProfileEditProps>(
  ({ profileData, isEditing }) => {
    // Get the form action
    const updateProfileAction = useUpdateProfileAction();

    // Local state management within the component
    const editableProfile = useStore<UserProfileType>({
      name: profileData.name,
      username: profileData.username,
      bio: profileData.bio,
      avatar: profileData.avatar,
      skills: profileData.skills,
      joinedDate: profileData.joinedDate,
      stats: profileData.stats,
    });

    // Form state tracking
    const isSubmitting = useSignal(false);
    const formSuccess = useSignal(false);

    // Create the form with initial values from profileData
    const [form, { Form, Field }] = useForm<UpdateUserForm>({
      loader: {
        value: {
          Name: editableProfile.name,
          Username: editableProfile.username,
          Description: editableProfile.bio,
          ImageURL: editableProfile.avatar,
          Intrests: editableProfile.skills,
        },
      },
      action: updateProfileAction,
      validate: valiForm$(userSchema),
    });

    const newSkill = useSignal("");
    const validationErrors = useStore<
      Partial<Record<keyof ProfileSchemaType, string>>
    >({});

    // Self-contained functions
    const addSkill = $((arr: any) => {
      if (
        newSkill.value.trim() &&
        !editableProfile.skills.includes(newSkill.value.trim())
      ) {
        // Check max skills validation
        if (editableProfile.skills.length >= 20) {
          validationErrors["Intrests"] = "Maximum 20 skills allowed";
          return;
        }

        // Validate skill length
        if (newSkill.value.trim().length > 20) {
          validationErrors["Intrests"] =
            "Skill must be less than 20 characters";
          return;
        }

        editableProfile.skills = [
          ...editableProfile.skills,
          newSkill.value.trim(),
        ];
        arr.value = editableProfile.skills;
      }
    });

    const removeSkill = $((skill: string, field: any) => {
      editableProfile.skills = editableProfile.skills.filter(
        (s) => s !== skill,
      );
      // Update the form field value to reflect the changes
      field.value = editableProfile.skills;
      // Clear skill validation error when removing skills
      if (validationErrors["Intrests"]) {
        delete validationErrors["Intrests"];
      }
    });

    return (
      <div class="rounded-lg bg-white p-8 shadow-sm">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-[#5B3E29]">Edit Profile</h2>
          <div class="flex space-x-3">
            <button
              type="button"
              onClick$={() => {
                isEditing.value = false;
              }}
              class="rounded-md bg-white px-4 py-2 text-sm font-medium text-[#5B3E29] shadow-sm ring-1 ring-inset ring-[#E6D7C3] transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D98E73] focus:ring-offset-2"
              disabled={isSubmitting.value}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="profile-edit-form"
              class={`rounded-md ${
                formSuccess.value ? "bg-green-600" : "bg-[#D98E73]"
              } px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors ${
                formSuccess.value ? "hover:bg-green-700" : "hover:bg-[#C27B62]"
              } focus:outline-none focus:ring-2 focus:ring-[#D98E73] focus:ring-offset-2`}
              disabled={isSubmitting.value}
            >
              {form.submitting ? (
                "Saving..."
              ) : form.response.status === "success" ? (
                <>
                  <Check class="mr-1 inline-block h-4 w-4" />
                  Saved!
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
        <Form
          id="profile-edit-form"
          onSubmit$={() => {
            if (form.submitted && !form.invalid) {
              isEditing.value = false;
              if (form.response.status === "success") {
                console.log("Profile updated successfully");
              }
            }
          }}
          class="flex flex-col space-y-6"
        >
          {/* Two column layout on desktop */}
          <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left column - Profile photo and personal info */}
            <div class="flex flex-col space-y-6">
              <div class="flex flex-col items-center md:items-start">
                <div class="relative mb-6">
                  <div class="h-32 w-32 overflow-hidden rounded-full border-4 border-[#D98E73] bg-[#F8D7BD]">
                    <img
                      src={profileData.avatar}
                      alt="Profile avatar"
                      class="h-full w-full object-cover"
                      width={128}
                      height={128}
                      onError$={(e) => {
                        (e.target as HTMLInputElement).src =
                          "/placeholder-avatar.svg";
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    class="absolute bottom-0 right-0 rounded-full bg-[#D98E73] p-2 text-white shadow-md transition-colors hover:bg-[#C27B62]"
                  >
                    <Camera class="h-5 w-5" />
                  </button>
                </div>

                <Field name="Name">
                  {(field, props) => (
                    <div class="w-full">
                      <label
                        class="mb-2 block font-medium text-[#5B3E29]"
                        for="Name"
                      >
                        Name
                      </label>
                      <input
                        {...props}
                        id="Name"
                        type="text"
                        value={field.value}
                        class={`w-full rounded-md border ${
                          field.error ? "border-red-500" : "border-[#E6D7C3]"
                        } bg-white px-4 py-2 text-[#5B3E29] shadow-sm focus:border-[#D98E73] focus:outline-none focus:ring-1 focus:ring-[#D98E73]`}
                      />
                      {field.error && (
                        <p class="mt-1 text-sm text-red-500">{field.error}</p>
                      )}
                    </div>
                  )}
                </Field>

                <Field name="Username">
                  {(field, props) => (
                    <div class="w-full">
                      <label
                        class="mb-2 block font-medium text-[#5B3E29]"
                        for="Username"
                      >
                        Username
                      </label>
                      <input
                        {...props}
                        id="Username"
                        type="text"
                        value={field.value}
                        class={`w-full rounded-md border ${
                          field.error ? "border-red-500" : "border-[#E6D7C3]"
                        } bg-white px-4 py-2 text-[#5B3E29] shadow-sm focus:border-[#D98E73] focus:outline-none focus:ring-1 focus:ring-[#D98E73]`}
                      />
                      {field.error && (
                        <p class="mt-1 text-sm text-red-500">{field.error}</p>
                      )}
                    </div>
                  )}
                </Field>
              </div>

              <Field name="Description">
                {(field, props) => (
                  <div>
                    <label
                      class="mb-2 block font-medium text-[#5B3E29]"
                      for="bio"
                    >
                      About Me
                    </label>
                    <textarea
                      {...props}
                      id="bio"
                      value={field.value}
                      rows={4}
                      class={`w-full rounded-md border ${
                        field.error ? "border-red-500" : "border-[#E6D7C3]"
                      } bg-white px-4 py-2 text-[#5B3E29] shadow-sm focus:border-[#D98E73] focus:outline-none focus:ring-1 focus:ring-[#D98E73]`}
                    />
                    {field.error && (
                      <p class="mt-1 text-sm text-red-500">{field.error}</p>
                    )}
                  </div>
                )}
              </Field>
            </div>

            {/* Right column - Skills & Interests */}
            <div>
              <Field type="string[]" name="Intrests">
                {(field) => (
                  <div>
                    <label class="mb-2 block font-medium text-[#5B3E29]">
                      Skills & Interests
                    </label>

                    {/* Grid of checkbox skills first */}
                    <div class="mb-4 grid grid-cols-2 gap-2 md:grid-cols-3">
                      <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                        <input
                          type="checkbox"
                          value="Networking"
                          onChange$={(e) => {
                            if ((e.target as HTMLInputElement).checked) {
                              newSkill.value = "Networking";
                              addSkill(field);
                            } else {
                              removeSkill("Networking", field);
                            }
                          }}
                          checked={editableProfile.skills.includes(
                            "Networking",
                          )}
                          class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                        />
                        <span class="text-sm">Networking</span>
                      </label>
                      <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                        <input
                          type="checkbox"
                          value="Web Development"
                          onChange$={(e) => {
                            if ((e.target as HTMLInputElement).checked) {
                              newSkill.value = "Web Development";
                              addSkill(field);
                            } else {
                              removeSkill("Web Development", field);
                            }
                          }}
                          checked={editableProfile.skills.includes(
                            "Web Development",
                          )}
                          class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                        />
                        <span class="text-sm">Web Development</span>
                      </label>
                      <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                        <input
                          type="checkbox"
                          value="Marketing"
                          onChange$={(e) => {
                            if ((e.target as HTMLInputElement).checked) {
                              newSkill.value = "Marketing";
                              addSkill(field);
                            } else {
                              removeSkill("Marketing", field);
                            }
                          }}
                          checked={editableProfile.skills.includes("Marketing")}
                          class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                        />
                        <span class="text-sm">Marketing</span>
                      </label>
                      <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                        <input
                          type="checkbox"
                          value="Startups"
                          onChange$={(e) => {
                            if ((e.target as HTMLInputElement).checked) {
                              newSkill.value = "Startups";
                              addSkill(field);
                            } else {
                              removeSkill("Startups", field);
                            }
                          }}
                          checked={editableProfile.skills.includes("Startups")}
                          class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                        />
                        <span class="text-sm">Startups</span>
                      </label>
                      <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                        <input
                          type="checkbox"
                          value="Graphic Design"
                          onChange$={(e) => {
                            if ((e.target as HTMLInputElement).checked) {
                              newSkill.value = "Graphic Design";
                              addSkill(field);
                            } else {
                              removeSkill("Graphic Design", field);
                            }
                          }}
                          checked={editableProfile.skills.includes(
                            "Graphic Design",
                          )}
                          class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                        />
                        <span class="text-sm">Graphic Design</span>
                      </label>
                      <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                        <input
                          type="checkbox"
                          value="Business Strategy"
                          onChange$={(e) => {
                            if ((e.target as HTMLInputElement).checked) {
                              newSkill.value = "Business Strategy";
                              addSkill(field);
                            } else {
                              removeSkill("Business Strategy", field);
                            }
                          }}
                          checked={editableProfile.skills.includes(
                            "Business Strategy",
                          )}
                          class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                        />
                        <span class="text-sm">Business Strategy</span>
                      </label>
                      <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                        <input
                          type="checkbox"
                          value="Remote Work"
                          onChange$={(e) => {
                            if ((e.target as HTMLInputElement).checked) {
                              newSkill.value = "Remote Work";
                              addSkill(field);
                            } else {
                              removeSkill("Remote Work", field);
                            }
                          }}
                          checked={editableProfile.skills.includes(
                            "Remote Work",
                          )}
                          class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                        />
                        <span class="text-sm">Remote Work</span>
                      </label>
                      <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                        <input
                          type="checkbox"
                          value="Productivity"
                          onChange$={(e) => {
                            if ((e.target as HTMLInputElement).checked) {
                              newSkill.value = "Productivity";
                              addSkill(field);
                            } else {
                              removeSkill("Productivity", field);
                            }
                          }}
                          checked={editableProfile.skills.includes(
                            "Productivity",
                          )}
                          class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                        />
                        <span class="text-sm">Productivity</span>
                      </label>
                      <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                        <input
                          type="checkbox"
                          value="Project Management"
                          onChange$={(e) => {
                            if ((e.target as HTMLInputElement).checked) {
                              newSkill.value = "Project Management";
                              addSkill(field);
                            } else {
                              removeSkill("Project Management", field);
                            }
                          }}
                          checked={editableProfile.skills.includes(
                            "Project Management",
                          )}
                          class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                        />
                        <span class="text-sm">Project Management</span>
                      </label>
                      <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                        <input
                          type="checkbox"
                          value="Digital Nomad"
                          onChange$={(e) => {
                            if ((e.target as HTMLInputElement).checked) {
                              newSkill.value = "Digital Nomad";
                              addSkill(field);
                            } else {
                              removeSkill("Digital Nomad", field);
                            }
                          }}
                          checked={editableProfile.skills.includes(
                            "Digital Nomad",
                          )}
                          class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                        />
                        <span class="text-sm">Digital Nomad</span>
                      </label>
                      <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                        <input
                          type="checkbox"
                          value="Content Creation"
                          onChange$={(e) => {
                            if ((e.target as HTMLInputElement).checked) {
                              newSkill.value = "Content Creation";
                              addSkill(field);
                            } else {
                              removeSkill("Content Creation", field);
                            }
                          }}
                          checked={editableProfile.skills.includes(
                            "Content Creation",
                          )}
                          class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                        />
                        <span class="text-sm">Content Creation</span>
                      </label>
                      <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                        <input
                          type="checkbox"
                          value="UI/UX Design"
                          onChange$={(e) => {
                            if ((e.target as HTMLInputElement).checked) {
                              newSkill.value = "UI/UX Design";
                              addSkill(field);
                            } else {
                              removeSkill("UI/UX Design", field);
                            }
                          }}
                          checked={editableProfile.skills.includes(
                            "UI/UX Design",
                          )}
                          class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                        />
                        <span class="text-sm">UI/UX Design</span>
                      </label>
                    </div>

                    {/* Selected skills display */}
                    <div class="mb-4 flex flex-wrap gap-2">
                      {editableProfile.skills.map((skill) => (
                        <div
                          key={skill}
                          class="group flex items-center rounded-full bg-[#F8D7BD] px-3 py-1"
                        >
                          <span class="text-sm text-[#8B5A2B]">{skill}</span>
                          <button
                            type="button"
                            onClick$={() => removeSkill(skill, field)}
                            class="ml-1 rounded-full p-0.5 text-[#8B5A2B] opacity-70 transition-opacity hover:opacity-100"
                          >
                            <X class="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {field.error && (
                      <p class="mt-1 text-sm text-red-500">{field.error}</p>
                    )}
                    {validationErrors["Intrests"] && !field.error && (
                      <p class="mt-1 text-sm text-red-500">
                        {validationErrors["Intrests"]}
                      </p>
                    )}
                  </div>
                )}
              </Field>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick$={() => {
                isEditing.value = false;
              }}
              class="rounded-md bg-white px-4 py-2 text-sm font-medium text-[#5B3E29] shadow-sm ring-1 ring-inset ring-[#E6D7C3] transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D98E73] focus:ring-offset-2"
              disabled={isSubmitting.value}
            >
              Cancel
            </button>
            <button
              type="submit"
              class={`rounded-md ${
                formSuccess.value ? "bg-green-600" : "bg-[#D98E73]"
              } px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors ${
                formSuccess.value ? "hover:bg-green-700" : "hover:bg-[#C27B62]"
              } focus:outline-none focus:ring-2 focus:ring-[#D98E73] focus:ring-offset-2`}
              disabled={isSubmitting.value}
            >
              {form.submitting ? (
                "Saving..."
              ) : form.response.status === "success" ? (
                <>
                  <Check class="mr-1 inline-block h-4 w-4" />
                  Saved!
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
          {form.response.message && (
            <div
              class={`mt-4 rounded-md p-3 ${
                form.response.status === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {form.response.message}
            </div>
          )}
        </Form>
      </div>
    );
  },
);

interface TabsSectionProps {
  profile: UserProfileType;
  upcomingEvents: DetailedEventType[];
  hostedEvents: DetailedEventType[];
  pastEvents: DetailedEventType[];
  savedPlaces: PlaceType[];
  likedPlaces: PlaceType[];
  requests?: ActiveRequestType[];
}

export const TabsSection = component$<TabsSectionProps>(
  ({
    upcomingEvents,
    profile,
    hostedEvents,
    pastEvents,
    likedPlaces,
    savedPlaces,
    requests = [],
  }) => {
    const loc = useLocation();

    const tab = loc.url.searchParams.get("tab") ?? "upcoming";
    const activeTab = useSignal(tab);
    const isEditing = useSignal(false);

    // Filter state variables
    const searchTerm = useSignal<string>("");
    const placeCategory = useSignal<string>("all");
    const eventDateRange = useSignal<string>("all");
    const pastEventDateRange = useSignal<string>("all");
    const eventSort = useSignal<string>("date-asc");
    const placeSort = useSignal<string>("recommended");

    // Quick filter states
    const activeQuickFilters = useSignal<string[]>([]);

    // Filter functions
    const filterPlaces = (places: PlaceType[]) => {
      return places.filter((place) => {
        const matchesSearch =
          searchTerm.value === "" ||
          place.name?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          place.description
            ?.toLowerCase()
            .includes(searchTerm.value.toLowerCase()) ||
          place.location
            ?.toLowerCase()
            .includes(searchTerm.value.toLowerCase());

        const matchesCategory =
          placeCategory.value === "all" ||
          (placeCategory.value === "popular" && place.badge === "Popular") ||
          (placeCategory.value === "coffee" &&
            place.tags?.includes("Coffee")) ||
          (placeCategory.value === "quiet" && place.tags?.includes("Quiet")) ||
          (placeCategory.value === "wifi" && place.tags?.includes("WiFi")) ||
          (placeCategory.value === "power" && place.tags?.includes("Power"));

        const matchesQuickFilters =
          activeQuickFilters.value.length === 0 ||
          activeQuickFilters.value.every((filter) =>
            place.tags?.includes(filter),
          );

        return matchesSearch && matchesCategory && matchesQuickFilters;
      });
    };

    const filterPastEvents = (events: DetailedEventType[]) => {
      return events.filter((event) => {
        const matchesSearch =
          searchTerm.value === "" ||
          event.name?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          event.description
            ?.toLowerCase()
            .includes(searchTerm.value.toLowerCase()) ||
          event.location
            ?.toLowerCase()
            .includes(searchTerm.value.toLowerCase());

        const now = new Date();
        const eventDate = new Date(event.date);
        let matchesDateRange = true;

        if (pastEventDateRange.value === "last_week") {
          const lastWeekStart = new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000,
          );
          const lastWeekEnd = new Date(now);
          matchesDateRange =
            eventDate >= lastWeekStart && eventDate < lastWeekEnd;
        } else if (pastEventDateRange.value === "last_month") {
          const lastMonthStart = new Date(
            now.getTime() - 30 * 24 * 60 * 60 * 1000,
          );
          const lastMonthEnd = new Date(now);
          matchesDateRange =
            eventDate >= lastMonthStart && eventDate < lastMonthEnd;
        }

        return matchesSearch && matchesDateRange;
      });
    };

    const filterEvents = (events: DetailedEventType[]) => {
      return events.filter((event) => {
        const matchesSearch =
          searchTerm.value === "" ||
          event.name?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          event.description
            ?.toLowerCase()
            .includes(searchTerm.value.toLowerCase()) ||
          event.location
            ?.toLowerCase()
            .includes(searchTerm.value.toLowerCase());

        const now = new Date();
        const eventDate = new Date(event.date);
        let matchesDateRange = true;

        if (eventDateRange.value === "today") {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          matchesDateRange = eventDate >= today && eventDate < tomorrow;
        } else if (eventDateRange.value === "this_week") {
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          matchesDateRange = eventDate >= now && eventDate <= weekFromNow;
        } else if (eventDateRange.value === "next_week") {
          const nextWeekStart = new Date(
            now.getTime() + 7 * 24 * 60 * 60 * 1000,
          );
          const nextWeekEnd = new Date(
            now.getTime() + 14 * 24 * 60 * 60 * 1000,
          );
          matchesDateRange =
            eventDate >= nextWeekStart && eventDate <= nextWeekEnd;
        }

        return matchesSearch && matchesDateRange;
      });
    };

    const sortPlaces = (places: PlaceType[]) => {
      const sorted = [...places];
      if (placeSort.value === "rating") {
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (placeSort.value === "newest") {
        // Sort by visitCount as a proxy for popularity/recency
        // Higher visit count suggests more recently visited or popular places
        sorted.sort((a, b) => (b.visitCount || 0) - (a.visitCount || 0));
      }
      return sorted;
    };

    const sortEvents = (events: DetailedEventType[]) => {
      const sorted = [...events];
      if (eventSort.value === "date-asc") {
        sorted.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
      } else if (eventSort.value === "date-desc") {
        sorted.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
      } else if (eventSort.value === "popular") {
        sorted.sort(
          (a, b) => (b.attendees?.length || 0) - (a.attendees?.length || 0),
        );
      }
      return sorted;
    };

    const clearAllFilters = $(() => {
      searchTerm.value = "";
      placeCategory.value = "all";
      eventDateRange.value = "all";
      pastEventDateRange.value = "all";
      eventSort.value = "date-asc";
      placeSort.value = "recommended";
      activeQuickFilters.value = [];
    });

    const toggleQuickFilter = $((filter: string) => {
      const current = activeQuickFilters.value;
      if (current.includes(filter)) {
        activeQuickFilters.value = current.filter((f) => f !== filter);
      } else {
        activeQuickFilters.value = [...current, filter];
      }
    });

    // Add resource to fetch user places

    // Self-contained functions for profile editing
    // Ensure icons match IconComponent type
    const tabs: {
      id: string;
      label: string;
      icon: any;
      count: number;
    }[] = [
      {
        id: "profile",
        label: "Profile",
        icon: User,
        count: 0,
      },
      {
        id: "upcoming",
        label: "Upcoming",
        icon: Calendar,
        count: upcomingEvents.length,
      },
      {
        id: "hosted",
        label: "Hosted",
        icon: UserPlus,
        count: hostedEvents.length,
      },
      {
        id: "myplaces",
        label: "My Places",
        icon: Compass,
        count: savedPlaces.length,
      },
      {
        id: "liked",
        label: "Liked Places",
        icon: Bookmark,
        count: likedPlaces.length,
      },
      {
        id: "requests",
        label: "Requests",
        icon: Bell,
        count: requests.length,
      },
      {
        id: "past",
        label: "Past Events",
        icon: Clock,
        count: pastEvents.length,
      },
    ];

    return (
      <div class="w-full">
        <div class="mb-8 mt-10 border-b border-[#F8EDE3] shadow-sm">
          <nav
            class="justify-left -mb-px flex space-x-8 overflow-x-auto px-4 pb-1"
            aria-label="Tabs"
          >
            {tabs.map((tab) => {
              // Capture serializable values and component reference outside the JSX scope
              // to avoid potential serialization issues with the entire 'tab' object in onClick$.
              const tabId = tab.id;
              const TabIcon = tab.icon;
              const tabLabel = tab.label;
              const tabCount = tab.count;

              return (
                <Link
                  scroll={false}
                  href={"/profile?tab=" + tabId}
                  key={tabId}
                  onClick$={() => (activeTab.value = tabId)} // Use captured primitive value
                  class={`group inline-flex shrink-0 items-center whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium transition-colors duration-150 ease-in-out focus:outline-none ${
                    activeTab.value === tabId // Use captured primitive value
                      ? "border-[#D98E73] text-[#C27B62]"
                      : "border-transparent text-[#6D5D4E] hover:border-gray-300 hover:text-[#5B3E29]"
                  }`}
                  aria-current={activeTab.value === tabId ? "page" : undefined} // Use captured primitive value
                >
                  <TabIcon // Render the component directly
                    class={`mr-2 h-5 w-5 ${
                      activeTab.value === tabId // Use captured primitive value
                        ? "text-[#D98E73]"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                    aria-hidden="true"
                  />
                  <span>{tabLabel}</span>
                  {tabCount > 0 && (
                    <span
                      class={`ml-2.5 hidden rounded-full px-2.5 py-1 text-xs font-semibold md:inline-block ${
                        activeTab.value === tabId // Use captured primitive value
                          ? "bg-[#FFF1E6] text-[#C27B62]"
                          : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                      }`}
                    >
                      {tabCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div class=" px-4">
          {activeTab.value === "profile" && !isEditing.value && (
            <ProfileView isEditing={isEditing} profileData={profile} />
          )}

          {activeTab.value === "profile" && isEditing.value && (
            <ProfileEdit profileData={profile} isEditing={isEditing} />
          )}

          {activeTab.value === "upcoming" && (
            <div>
              {/* Search and Filter Bar */}
              <div class="mb-6 space-y-4">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div class="relative max-w-md flex-1">
                    <input
                      type="text"
                      bind:value={searchTerm}
                      placeholder="Search upcoming events..."
                      class="w-full rounded-lg border border-[#E6D7C3] bg-white py-2 pl-10 pr-4 text-sm text-[#5B3E29] placeholder-[#A99D8F] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                    />
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        class="h-4 w-4 text-[#A99D8F]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <select
                      bind:value={eventDateRange}
                      class="rounded-lg border border-[#E6D7C3] bg-white px-3 py-2 text-sm text-[#6D5D4E] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                    >
                      <option value="all">
                        All Upcoming ({upcomingEvents.length})
                      </option>
                      {(() => {
                        const todayCount = upcomingEvents.filter((e) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const tomorrow = new Date(today);
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          const eventDate = new Date(e.date);
                          return eventDate >= today && eventDate < tomorrow;
                        }).length;
                        return (
                          <option value="today">
                            {`Today${todayCount > 0 ? ` (${todayCount})` : ""}`}
                          </option>
                        );
                      })()}
                      {(() => {
                        const thisWeekCount = upcomingEvents.filter((e) => {
                          const now = new Date();
                          const weekFromNow = new Date(
                            now.getTime() + 7 * 24 * 60 * 60 * 1000,
                          );
                          const eventDate = new Date(e.date);
                          return eventDate >= now && eventDate <= weekFromNow;
                        }).length;
                        return (
                          <option value="this_week">
                            {`This Week${thisWeekCount > 0 ? ` (${thisWeekCount})` : ""}`}
                          </option>
                        );
                      })()}
                      {(() => {
                        const nextWeekCount = upcomingEvents.filter((e) => {
                          const now = new Date();
                          const nextWeekStart = new Date(
                            now.getTime() + 7 * 24 * 60 * 60 * 1000,
                          );
                          const nextWeekEnd = new Date(
                            now.getTime() + 14 * 24 * 60 * 60 * 1000,
                          );
                          const eventDate = new Date(e.date);
                          return (
                            eventDate >= nextWeekStart &&
                            eventDate <= nextWeekEnd
                          );
                        }).length;
                        return (
                          <option value="next_week">
                            {`Next Week${nextWeekCount > 0 ? ` (${nextWeekCount})` : ""}`}
                          </option>
                        );
                      })()}
                    </select>
                    <select
                      bind:value={eventSort}
                      class="rounded-lg border border-[#E6D7C3] bg-white px-3 py-2 text-sm text-[#6D5D4E] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                    >
                      <option value="date-asc">Date: Soonest</option>
                      <option value="date-desc">Date: Latest</option>
                      <option value="popular">Most Popular</option>
                    </select>
                    {(searchTerm.value !== "" ||
                      eventDateRange.value !== "all" ||
                      eventSort.value !== "date-asc") && (
                      <button
                        onClick$={clearAllFilters}
                        class="rounded-lg border border-[#D98E73] bg-transparent px-3 py-2 text-sm text-[#D98E73] hover:bg-[#FFF1E6] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Events Grid */}
              {(() => {
                const filteredEvents = sortEvents(filterEvents(upcomingEvents));
                return filteredEvents.length > 0 ? (
                  <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredEvents.map((event) => (
                      <EventCard
                        key={event.eventID ?? event.id}
                        event={event}
                      />
                    ))}
                  </div>
                ) : (
                  <>
                    <EmptyState
                      context="CalendarIcon"
                      title={
                        searchTerm.value || eventDateRange.value !== "all"
                          ? "No Upcoming Events Found"
                          : "No Upcoming Events"
                      }
                      message={
                        searchTerm.value || eventDateRange.value !== "all"
                          ? "Try adjusting your filters or search terms."
                          : "You haven't joined or been invited to any events yet. Explore events to join!"
                      }
                      actionButton={
                        searchTerm.value || eventDateRange.value !== "all"
                          ? undefined
                          : { href: "/events", label: "Explore Events" }
                      }
                    />
                    {(searchTerm.value || eventDateRange.value !== "all") && (
                      <div class="mt-4 text-center">
                        <button
                          type="button"
                          onClick$={clearAllFilters}
                          class="inline-flex h-10 items-center justify-center rounded-md border border-[#D98E73] bg-transparent px-6 py-2 text-sm font-medium text-[#D98E73] ring-offset-background transition-colors hover:bg-[#FFF1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {activeTab.value === "hosted" && (
            <div>
              {/* Search and Filter Bar */}
              <div class="mb-6 space-y-4">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div class="relative max-w-md flex-1">
                    <input
                      type="text"
                      bind:value={searchTerm}
                      placeholder="Search your hosted events..."
                      class="w-full rounded-lg border border-[#E6D7C3] bg-white py-2 pl-10 pr-4 text-sm text-[#5B3E29] placeholder-[#A99D8F] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                    />
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        class="h-4 w-4 text-[#A99D8F]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <select
                      bind:value={eventDateRange}
                      class="rounded-lg border border-[#E6D7C3] bg-white px-3 py-2 text-sm text-[#6D5D4E] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                    >
                      <option value="all">
                        All Upcoming ({hostedEvents.length})
                      </option>
                      {(() => {
                        const todayCount = hostedEvents.filter((e) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const tomorrow = new Date(today);
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          const eventDate = new Date(e.date);
                          return eventDate >= today && eventDate < tomorrow;
                        }).length;
                        return (
                          <option value="today">
                            {`Today${todayCount > 0 ? ` (${todayCount})` : ""}`}
                          </option>
                        );
                      })()}
                      {(() => {
                        const thisWeekCount = hostedEvents.filter((e) => {
                          const now = new Date();
                          const weekFromNow = new Date(
                            now.getTime() + 7 * 24 * 60 * 60 * 1000,
                          );
                          const eventDate = new Date(e.date);
                          return eventDate >= now && eventDate <= weekFromNow;
                        }).length;
                        return (
                          <option value="this_week">
                            {`This Week${thisWeekCount > 0 ? ` (${thisWeekCount})` : ""}`}
                          </option>
                        );
                      })()}
                      {(() => {
                        const nextWeekCount = hostedEvents.filter((e) => {
                          const now = new Date();
                          const nextWeekStart = new Date(
                            now.getTime() + 7 * 24 * 60 * 60 * 1000,
                          );
                          const nextWeekEnd = new Date(
                            now.getTime() + 14 * 24 * 60 * 60 * 1000,
                          );
                          const eventDate = new Date(e.date);
                          return (
                            eventDate >= nextWeekStart &&
                            eventDate <= nextWeekEnd
                          );
                        }).length;
                        return (
                          <option value="next_week">
                            {`Next Week${nextWeekCount > 0 ? ` (${nextWeekCount})` : ""}`}
                          </option>
                        );
                      })()}
                    </select>
                    <select
                      bind:value={eventSort}
                      class="rounded-lg border border-[#E6D7C3] bg-white px-3 py-2 text-sm text-[#6D5D4E] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                    >
                      <option value="date-asc">Date: Soonest</option>
                      <option value="date-desc">Date: Latest</option>
                      <option value="popular">Most Popular</option>
                    </select>
                    {(searchTerm.value !== "" ||
                      eventDateRange.value !== "all" ||
                      eventSort.value !== "date-asc") && (
                      <button
                        onClick$={clearAllFilters}
                        class="rounded-lg border border-[#D98E73] bg-transparent px-3 py-2 text-sm text-[#D98E73] hover:bg-[#FFF1E6] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Events Grid */}
              {(() => {
                const filteredEvents = sortEvents(filterEvents(hostedEvents));
                return filteredEvents.length > 0 ? (
                  <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredEvents.map((event) => (
                      <EventCard
                        key={event.eventID ?? event.id}
                        event={event}
                        isHosted
                      />
                    ))}
                  </div>
                ) : (
                  <>
                    <EmptyState
                      context="UsersIcon"
                      title={
                        searchTerm.value || eventDateRange.value !== "all"
                          ? "No Hosted Events Found"
                          : "No Hosted Events Yet"
                      }
                      message={
                        searchTerm.value || eventDateRange.value !== "all"
                          ? "Try adjusting your filters or search terms."
                          : "Ready to gather some folks? Host your first event and bring people together."
                      }
                      actionButton={
                        searchTerm.value || eventDateRange.value !== "all"
                          ? undefined
                          : { label: "Host an Event", href: "/new" }
                      }
                    />
                    {(searchTerm.value || eventDateRange.value !== "all") && (
                      <div class="mt-4 text-center">
                        <button
                          type="button"
                          onClick$={clearAllFilters}
                          class="inline-flex h-10 items-center justify-center rounded-md border border-[#D98E73] bg-transparent px-6 py-2 text-sm font-medium text-[#D98E73] ring-offset-background transition-colors hover:bg-[#FFF1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {activeTab.value === "myplaces" && (
            <div>
              {/* Search and Filter Bar */}
              <div class="mb-6 space-y-4">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div class="relative max-w-md flex-1">
                    <input
                      type="text"
                      bind:value={searchTerm}
                      placeholder="Search your saved places..."
                      class="w-full rounded-lg border border-[#E6D7C3] bg-white py-2 pl-10 pr-4 text-sm text-[#5B3E29] placeholder-[#A99D8F] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                    />
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        class="h-4 w-4 text-[#A99D8F]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <select
                      bind:value={placeCategory}
                      class="rounded-lg border border-[#E6D7C3] bg-white px-3 py-2 text-sm text-[#6D5D4E] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                    >
                      <option value="all">
                        All Categories ({savedPlaces.length})
                      </option>
                      {(() => {
                        const popularCount = savedPlaces.filter(
                          (p) => p.badge === "Popular",
                        ).length;
                        return (
                          <option value="popular">
                            {`Popular${popularCount > 0 ? ` (${popularCount})` : ""}`}
                          </option>
                        );
                      })()}
                      {(() => {
                        const coffeeCount = savedPlaces.filter((p) =>
                          p.tags?.includes("Coffee"),
                        ).length;
                        return (
                          <option value="coffee">
                            {`Coffee Shops${coffeeCount > 0 ? ` (${coffeeCount})` : ""}`}
                          </option>
                        );
                      })()}
                      {(() => {
                        const quietCount = savedPlaces.filter((p) =>
                          p.tags?.includes("Quiet"),
                        ).length;
                        return (
                          <option value="quiet">
                            {`Quiet Spaces${quietCount > 0 ? ` (${quietCount})` : ""}`}
                          </option>
                        );
                      })()}
                      {(() => {
                        const wifiCount = savedPlaces.filter((p) =>
                          p.tags?.includes("WiFi"),
                        ).length;
                        return (
                          <option value="wifi">
                            {`WiFi Available${wifiCount > 0 ? ` (${wifiCount})` : ""}`}
                          </option>
                        );
                      })()}
                      {(() => {
                        const powerCount = savedPlaces.filter((p) =>
                          p.tags?.includes("Power"),
                        ).length;
                        return (
                          <option value="power">
                            {`Power Outlets${powerCount > 0 ? ` (${powerCount})` : ""}`}
                          </option>
                        );
                      })()}
                    </select>
                    <select
                      bind:value={placeSort}
                      class="rounded-lg border border-[#E6D7C3] bg-white px-3 py-2 text-sm text-[#6D5D4E] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                    >
                      <option value="recommended">Recommended</option>
                      <option value="rating">Highest Rated</option>
                      <option value="newest">Most Visited</option>
                    </select>
                    {(searchTerm.value !== "" ||
                      placeCategory.value !== "all" ||
                      placeSort.value !== "recommended" ||
                      activeQuickFilters.value.length > 0) && (
                      <button
                        onClick$={clearAllFilters}
                        class="rounded-lg border border-[#D98E73] bg-transparent px-3 py-2 text-sm text-[#D98E73] hover:bg-[#FFF1E6] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Filter Chips */}
                <div class="flex flex-wrap gap-2">
                  {["Coffee", "WiFi", "Quiet", "Power", "Music", "Study"].map(
                    (tag) => (
                      <button
                        key={tag}
                        onClick$={() => toggleQuickFilter(tag)}
                        class={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          activeQuickFilters.value.includes(tag)
                            ? "bg-[#D98E73] text-white"
                            : "bg-[#F8EDE3] text-[#6D5D4E] hover:bg-[#E6D7C3]"
                        }`}
                      >
                        {tag}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Places Grid */}
              {(() => {
                const filteredPlaces = sortPlaces(filterPlaces(savedPlaces));
                return filteredPlaces.length > 0 ? (
                  <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredPlaces.map((place) => (
                      <PlaceCard
                        key={place.placeId ?? place.id}
                        place={{
                          id: place.placeId ?? place.id,
                          name: place.name,
                          image: place.image ?? "",
                          badge: "",
                          location: place.location,
                          description: place.description,
                          tags: place.tags,
                          creator: profile.name,
                          rating:
                            typeof place.rating === "number" ? place.rating : 0,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <>
                    <EmptyState
                      context="MapPinIcon"
                      title={
                        searchTerm.value ||
                        placeCategory.value !== "all" ||
                        activeQuickFilters.value.length > 0
                          ? "No Saved Places Found"
                          : "No Places Added Yet"
                      }
                      message={
                        searchTerm.value ||
                        placeCategory.value !== "all" ||
                        activeQuickFilters.value.length > 0
                          ? "Try adjusting your filters or search terms."
                          : "You haven't added any places to the community. Share your favorite study spots!"
                      }
                      actionButton={
                        searchTerm.value ||
                        placeCategory.value !== "all" ||
                        activeQuickFilters.value.length > 0
                          ? undefined
                          : { label: "Add a Place", href: "/places/new" }
                      }
                    />
                    {(searchTerm.value ||
                      placeCategory.value !== "all" ||
                      activeQuickFilters.value.length > 0) && (
                      <div class="mt-4 text-center">
                        <button
                          type="button"
                          onClick$={clearAllFilters}
                          class="inline-flex h-10 items-center justify-center rounded-md border border-[#D98E73] bg-transparent px-6 py-2 text-sm font-medium text-[#D98E73] ring-offset-background transition-colors hover:bg-[#FFF1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {activeTab.value === "liked" && (
            <div>
              {/* Search and Filter Bar */}
              <div class="mb-6 space-y-4">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div class="relative max-w-md flex-1">
                    <input
                      type="text"
                      bind:value={searchTerm}
                      placeholder="Search liked places..."
                      class="w-full rounded-lg border border-[#E6D7C3] bg-white py-2 pl-10 pr-4 text-sm text-[#5B3E29] placeholder-[#A99D8F] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                    />
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        class="h-4 w-4 text-[#A99D8F]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <select
                      bind:value={placeCategory}
                      class="rounded-lg border border-[#E6D7C3] bg-white px-3 py-2 text-sm text-[#6D5D4E] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                    >
                      <option value="all">
                        All Categories ({likedPlaces.length})
                      </option>
                      {(() => {
                        const popularCount = likedPlaces.filter(
                          (p) => p.badge === "Popular",
                        ).length;
                        return (
                          <option value="popular">
                            {`Popular${popularCount > 0 ? ` (${popularCount})` : ""}`}
                          </option>
                        );
                      })()}
                      {(() => {
                        const coffeeCount = likedPlaces.filter((p) =>
                          p.tags?.includes("Coffee"),
                        ).length;
                        return (
                          <option value="coffee">
                            {`Coffee Shops${coffeeCount > 0 ? ` (${coffeeCount})` : ""}`}
                          </option>
                        );
                      })()}
                      {(() => {
                        const quietCount = likedPlaces.filter((p) =>
                          p.tags?.includes("Quiet"),
                        ).length;
                        return (
                          <option value="quiet">
                            {`Quiet Spaces${quietCount > 0 ? ` (${quietCount})` : ""}`}
                          </option>
                        );
                      })()}
                      {(() => {
                        const wifiCount = likedPlaces.filter((p) =>
                          p.tags?.includes("WiFi"),
                        ).length;
                        return (
                          <option value="wifi">
                            {`WiFi Available${wifiCount > 0 ? ` (${wifiCount})` : ""}`}
                          </option>
                        );
                      })()}
                      {(() => {
                        const powerCount = likedPlaces.filter((p) =>
                          p.tags?.includes("Power"),
                        ).length;
                        return (
                          <option value="power">
                            {`Power Outlets${powerCount > 0 ? ` (${powerCount})` : ""}`}
                          </option>
                        );
                      })()}
                    </select>
                    <select
                      bind:value={placeSort}
                      class="rounded-lg border border-[#E6D7C3] bg-white px-3 py-2 text-sm text-[#6D5D4E] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                    >
                      <option value="recommended">Recommended</option>
                      <option value="rating">Highest Rated</option>
                      <option value="newest">Most Visited</option>
                    </select>
                    {(searchTerm.value !== "" ||
                      placeCategory.value !== "all" ||
                      placeSort.value !== "recommended" ||
                      activeQuickFilters.value.length > 0) && (
                      <button
                        onClick$={clearAllFilters}
                        class="rounded-lg border border-[#D98E73] bg-transparent px-3 py-2 text-sm text-[#D98E73] hover:bg-[#FFF1E6] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Filter Chips */}
                <div class="flex flex-wrap gap-2">
                  {["Coffee", "WiFi", "Quiet", "Power", "Music", "Study"].map(
                    (tag) => (
                      <button
                        key={tag}
                        onClick$={() => toggleQuickFilter(tag)}
                        class={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          activeQuickFilters.value.includes(tag)
                            ? "bg-[#D98E73] text-white"
                            : "bg-[#F8EDE3] text-[#6D5D4E] hover:bg-[#E6D7C3]"
                        }`}
                      >
                        {tag}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Places Grid */}
              {(() => {
                const filteredPlaces = sortPlaces(filterPlaces(likedPlaces));
                return filteredPlaces.length > 0 ? (
                  <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredPlaces.map((place) => (
                      <PlaceCard
                        key={place.placeId ?? place.id}
                        place={{
                          id: place.placeId ?? place.id,
                          name: place.name,
                          image: place.image ?? "",
                          badge: "",
                          location: place.location,
                          description: place.description,
                          tags: place.tags,
                          creator: profile.name,
                          rating:
                            typeof place.rating === "number" ? place.rating : 0,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <>
                    <EmptyState
                      context="MapPinIcon"
                      title={
                        searchTerm.value ||
                        placeCategory.value !== "all" ||
                        activeQuickFilters.value.length > 0
                          ? "No Liked Places Found"
                          : "No Liked Places"
                      }
                      message={
                        searchTerm.value ||
                        placeCategory.value !== "all" ||
                        activeQuickFilters.value.length > 0
                          ? "Try adjusting your filters or search terms."
                          : "You haven't liked any places yet. Browse places and click the heart icon to add them here."
                      }
                      actionButton={
                        searchTerm.value ||
                        placeCategory.value !== "all" ||
                        activeQuickFilters.value.length > 0
                          ? undefined
                          : { label: "Discover Places", href: "/places" }
                      }
                    />
                    {(searchTerm.value ||
                      placeCategory.value !== "all" ||
                      activeQuickFilters.value.length > 0) && (
                      <div class="mt-4 text-center">
                        <button
                          type="button"
                          onClick$={clearAllFilters}
                          class="inline-flex h-10 items-center justify-center rounded-md border border-[#D98E73] bg-transparent px-6 py-2 text-sm font-medium text-[#D98E73] ring-offset-background transition-colors hover:bg-[#FFF1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {activeTab.value === "requests" && (
            <div>
              {/* Search Bar */}
              <div class="mb-6">
                <div class="relative max-w-md">
                  <input
                    type="text"
                    bind:value={searchTerm}
                    placeholder="Search requests..."
                    class="w-full rounded-lg border border-[#E6D7C3] bg-white py-2 pl-10 pr-4 text-sm text-[#5B3E29] placeholder-[#A99D8F] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                  />
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      class="h-4 w-4 text-[#A99D8F]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Requests Grid */}
              {(() => {
                const filteredRequests = requests.filter((request) => {
                  if (searchTerm.value === "") return true;
                  const searchLower = searchTerm.value.toLowerCase();
                  return (
                    request.type?.toLowerCase().includes(searchLower) ||
                    request.status?.toLowerCase().includes(searchLower)
                  );
                });

                return filteredRequests.length > 0 ? (
                  <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredRequests.map((request) => (
                      <div
                        key={request.id}
                        class="rounded-lg border border-[#E6D7C3] bg-white p-4"
                      >
                        <div class="mb-2 flex items-center justify-between">
                          <span class="text-sm font-medium text-[#5B3E29]">
                            {request.type}
                          </span>
                          <span class="text-xs text-[#6D5D4E]">
                            {request.status}
                          </span>
                        </div>
                        <p class="text-sm text-[#6D5D4E]">{request.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <EmptyState
                      context="BellIcon"
                      title={
                        searchTerm.value
                          ? "No Requests Found"
                          : "No Pending Requests"
                      }
                      message={
                        searchTerm.value
                          ? "Try adjusting your search terms."
                          : "You don't have any pending requests at the moment."
                      }
                      actionButton={undefined}
                    />
                    {searchTerm.value && (
                      <div class="mt-4 text-center">
                        <button
                          type="button"
                          onClick$={$(() => {
                            searchTerm.value = "";
                          })}
                          class="inline-flex h-10 items-center justify-center rounded-md border border-[#D98E73] bg-transparent px-6 py-2 text-sm font-medium text-[#D98E73] ring-offset-background transition-colors hover:bg-[#FFF1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                          Clear Search
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {activeTab.value === "past" && (
            <div>
              {/* Search and Filter Bar */}
              <div class="mb-6 space-y-4">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div class="relative max-w-md flex-1">
                    <input
                      type="text"
                      bind:value={searchTerm}
                      placeholder="Search past events..."
                      class="w-full rounded-lg border border-[#E6D7C3] bg-white py-2 pl-10 pr-4 text-sm text-[#5B3E29] placeholder-[#A99D8F] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                    />
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        class="h-4 w-4 text-[#A99D8F]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <select
                      bind:value={pastEventDateRange}
                      class="rounded-lg border border-[#E6D7C3] bg-white px-3 py-2 text-sm text-[#6D5D4E] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                    >
                      <option value="all">
                        All Past Events ({pastEvents.length})
                      </option>
                      {(() => {
                        const lastWeekCount = pastEvents.filter((e) => {
                          const now = new Date();
                          const lastWeekStart = new Date(
                            now.getTime() - 7 * 24 * 60 * 60 * 1000,
                          );
                          const lastWeekEnd = new Date(now);
                          const eventDate = new Date(e.date);
                          return (
                            eventDate >= lastWeekStart &&
                            eventDate < lastWeekEnd
                          );
                        }).length;
                        return (
                          <option value="last_week">
                            {`Last Week${lastWeekCount > 0 ? ` (${lastWeekCount})` : ""}`}
                          </option>
                        );
                      })()}
                      {(() => {
                        const lastMonthCount = pastEvents.filter((e) => {
                          const now = new Date();
                          const lastMonthStart = new Date(
                            now.getTime() - 30 * 24 * 60 * 60 * 1000,
                          );
                          const lastMonthEnd = new Date(now);
                          const eventDate = new Date(e.date);
                          return (
                            eventDate >= lastMonthStart &&
                            eventDate < lastMonthEnd
                          );
                        }).length;
                        return (
                          <option value="last_month">
                            {`Last Month${lastMonthCount > 0 ? ` (${lastMonthCount})` : ""}`}
                          </option>
                        );
                      })()}
                    </select>
                    <select
                      bind:value={eventSort}
                      class="rounded-lg border border-[#E6D7C3] bg-white px-3 py-2 text-sm text-[#6D5D4E] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                    >
                      <option value="date-desc">Most Recent</option>
                      <option value="date-asc">Oldest First</option>
                      <option value="popular">Most Popular</option>
                    </select>
                    {(searchTerm.value !== "" ||
                      pastEventDateRange.value !== "all" ||
                      eventSort.value !== "date-desc") && (
                      <button
                        onClick$={clearAllFilters}
                        class="rounded-lg border border-[#D98E73] bg-transparent px-3 py-2 text-sm text-[#D98E73] hover:bg-[#FFF1E6] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Events Grid */}
              {(() => {
                const filteredEvents = sortEvents(filterPastEvents(pastEvents));
                return filteredEvents.length > 0 ? (
                  <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredEvents.map((event) => (
                      <EventCard
                        key={event.eventID ?? event.id}
                        event={event}
                      />
                    ))}
                  </div>
                ) : (
                  <>
                    <EmptyState
                      context="CalendarIcon"
                      title={
                        searchTerm.value || pastEventDateRange.value !== "all"
                          ? "No Past Events Found"
                          : "No Past Events"
                      }
                      message={
                        searchTerm.value || pastEventDateRange.value !== "all"
                          ? "Try adjusting your filters or search terms."
                          : "You haven't attended any events yet. Join some events to build your history!"
                      }
                      actionButton={
                        searchTerm.value || pastEventDateRange.value !== "all"
                          ? undefined
                          : { label: "Find Events", href: "/events" }
                      }
                    />
                    {(searchTerm.value ||
                      pastEventDateRange.value !== "all") && (
                      <div class="mt-4 text-center">
                        <button
                          type="button"
                          onClick$={clearAllFilters}
                          class="inline-flex h-10 items-center justify-center rounded-md border border-[#D98E73] bg-transparent px-6 py-2 text-sm font-medium text-[#D98E73] ring-offset-background transition-colors hover:bg-[#FFF1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    );
  },
);
